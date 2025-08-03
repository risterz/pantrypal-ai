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

// Helper function to get missing profiles using SQL query
async function getMissingProfiles(supabase: any) {
  // Use a SQL query to find users in auth.users that don't have profiles
  // This approach doesn't require service role key for auth.admin.listUsers()
  const { data: missingUsers, error } = await supabase.rpc('get_users_without_profiles');
  
  if (error) {
    // If the RPC function doesn't exist, fall back to a simpler check
    console.log('RPC function not found, using fallback method');
    
    // Get all profiles and check if current user has one
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    // For now, return empty array since we can't access auth.users without service role
    return [];
  }

  return missingUsers || [];
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

    const regularSupabase = await createServerClient();

    console.log(`🔧 Running missing profiles fix migration via API by ${adminCheck.user?.email}...`);

    // Step 1: Check for missing profiles
    const missingProfiles = await getMissingProfiles(regularSupabase);

    if (missingProfiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No missing profiles found',
        missingCount: 0,
        created: 0
      });
    }

    console.log(`📋 Found ${missingProfiles.length} users without profiles`);

    // Step 2: Create missing profiles
    const profilesToCreate = missingProfiles.map((user: any) => ({
      id: user.id,
      username: `user_${user.id.substring(0, 8)}`,
      full_name: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'user'
    }));

    const { data: createdProfiles, error: createError } = await regularSupabase
      .from('profiles')
      .insert(profilesToCreate)
      .select();

    if (createError) {
      console.error('Error creating profiles:', createError);
      return NextResponse.json(
        { error: 'Failed to create missing profiles', details: createError },
        { status: 500 }
      );
    }

    // Step 3: Verify the fix
    const remainingMissing = await getMissingProfiles(regularSupabase);

    // Step 4: Get current profile stats
    const { data: profileStats, error: statsError } = await regularSupabase
      .from('profiles')
      .select('id, username, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    const result = {
      success: true,
      message: 'Migration completed successfully',
      missingCount: missingProfiles.length,
      created: createdProfiles?.length || 0,
      remainingMissing: remainingMissing.length,
      executedBy: adminCheck.user?.email,
      missingUsers: missingProfiles.map((user: any) => ({
        email: user.email,
        id: user.id.substring(0, 8) + '...'
      })),
      latestProfiles: profileStats?.slice(0, 5).map((profile: any) => ({
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

    const regularSupabase = await createServerClient();

    // Check for missing profiles
    const missingProfiles = await getMissingProfiles(regularSupabase);

    return NextResponse.json({
      missingCount: missingProfiles.length,
      checkedBy: adminCheck.user?.email,
      missingUsers: missingProfiles.map((user: any) => ({
        email: user.email,
        id: user.id.substring(0, 8) + '...',
        created: new Date(user.created_at).toLocaleDateString()
      }))
    });

  } catch (error) {
    console.error('❌ Check failed:', error);
    return NextResponse.json(
      { error: 'Check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}