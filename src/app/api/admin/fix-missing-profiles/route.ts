import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Admin emails that can access this endpoint
const ADMIN_EMAILS = [
  'harishariza02@gmail.com',
  'firstpantrypal@gmail.com',
  // Add more admin emails here
];

// Helper function to check admin access
async function checkAdminAccess() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { isAdmin: false, error: 'Unauthorized - Please sign in', status: 401 };
  }

  // Check if user has admin role in database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin' || ADMIN_EMAILS.includes(user.email || '');
  
  if (!isAdmin) {
    return { isAdmin: false, error: 'Forbidden - Admin privileges required', status: 403 };
  }

  return { isAdmin: true, user };
}

// This API route allows running the missing profiles fix migration from Vercel
export async function POST(request: NextRequest) {
  try {
    // Authentication and authorization check
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`🔧 Running missing profiles fix migration via API by ${adminCheck.user?.email}...`);

    // Step 1: Check for missing profiles
    const { data: missingProfiles, error: checkError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT u.id, u.email, u.created_at
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
        ORDER BY u.created_at DESC;
      `
    });

    if (checkError) {
      console.error('Error checking for missing profiles:', checkError);
      return NextResponse.json(
        { error: 'Failed to check for missing profiles', details: checkError },
        { status: 500 }
      );
    }

    if (!missingProfiles || missingProfiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No missing profiles found',
        missingCount: 0,
        created: 0
      });
    }

    console.log(`📋 Found ${missingProfiles.length} users without profiles`);

    // Step 2: Create the helper functions
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Function to create missing profiles for existing users
        CREATE OR REPLACE FUNCTION create_missing_profiles()
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Insert profiles for users who don't have one
          INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at, role)
          SELECT 
            u.id,
            COALESCE(u.raw_user_meta_data->>'username', 'user_' || SUBSTR(u.id::text, 1, 8)),
            COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
            u.raw_user_meta_data->>'avatar_url',
            NOW(),
            NOW(),
            'user'
          FROM auth.users u
          LEFT JOIN public.profiles p ON u.id = p.id
          WHERE p.id IS NULL;
        END;
        $$;

        -- Function to check for missing profiles (diagnostic)
        CREATE OR REPLACE FUNCTION check_missing_profiles()
        RETURNS TABLE(user_id UUID, email TEXT, created_at TIMESTAMPTZ)
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY
          SELECT u.id, u.email, u.created_at
          FROM auth.users u
          LEFT JOIN public.profiles p ON u.id = p.id
          WHERE p.id IS NULL
          ORDER BY u.created_at DESC;
        END;
        $$;
      `
    });

    if (functionError) {
      console.error('Error creating functions:', functionError);
      return NextResponse.json(
        { error: 'Failed to create helper functions', details: functionError },
        { status: 500 }
      );
    }

    // Step 3: Run the fix
    const { error: fixError } = await supabase.rpc('create_missing_profiles');

    if (fixError) {
      console.error('Error creating missing profiles:', fixError);
      return NextResponse.json(
        { error: 'Failed to create missing profiles', details: fixError },
        { status: 500 }
      );
    }

    // Step 4: Verify the fix
    const { data: remainingMissing, error: verifyError } = await supabase.rpc('check_missing_profiles');

    if (verifyError) {
      console.error('Error verifying fix:', verifyError);
      return NextResponse.json(
        { error: 'Failed to verify fix', details: verifyError },
        { status: 500 }
      );
    }

    // Step 5: Get current profile stats
    const { data: profileStats, error: statsError } = await supabase
      .from('profiles')
      .select('id, username, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    const result = {
      success: true,
      message: 'Migration completed successfully',
      missingCount: missingProfiles.length,
      created: missingProfiles.length - (remainingMissing?.length || 0),
      remainingMissing: remainingMissing?.length || 0,
      executedBy: adminCheck.user?.email,
      missingUsers: missingProfiles.map(user => ({
        email: user.email,
        id: user.id.substring(0, 8) + '...'
      })),
      latestProfiles: profileStats?.slice(0, 5).map(profile => ({
        username: profile.username,
        created: new Date(profile.created_at).toLocaleDateString()
      })) || []
    };

    console.log(`🎉 Migration completed successfully via API by ${adminCheck.user?.email}`);
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET method for checking status without running migration
export async function GET(request: NextRequest) {
  try {
    // Authentication and authorization check
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check for missing profiles
    const { data: missingProfiles, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT u.id, u.email, u.created_at
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
        ORDER BY u.created_at DESC;
      `
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to check profiles', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      missingCount: missingProfiles?.length || 0,
      checkedBy: adminCheck.user?.email,
      missingUsers: missingProfiles?.map(user => ({
        email: user.email,
        id: user.id.substring(0, 8) + '...',
        created: new Date(user.created_at).toLocaleDateString()
      })) || []
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}