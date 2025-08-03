#!/usr/bin/env node

/**
 * Fix Missing Profiles Migration
 * 
 * This script fixes the issue where users exist in auth.users but don't have 
 * corresponding profiles in the public.profiles table. This happens when:
 * 1. Profiles are manually deleted from the database
 * 2. Users try to sign up again with the same email
 * 3. The trigger doesn't fire because the user already exists in auth.users
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🔧 Running missing profiles fix migration...');
  console.log('================================================\n');

  try {
    // Step 1: Check for missing profiles before fixing
    console.log('1. Checking for missing profiles...');
    
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
      throw checkError;
    }
    
    if (missingProfiles && missingProfiles.length > 0) {
      console.log(`📋 Found ${missingProfiles.length} users without profiles:`);
      missingProfiles.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
      });
    } else {
      console.log('✅ No missing profiles found');
      return;
    }

    // Step 2: Create the helper functions
    console.log('\n2. Creating helper functions...');
    
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
      throw functionError;
    }
    
    console.log('✅ Helper functions created successfully');

    // Step 3: Run the fix
    console.log('3. Creating missing profiles...');
    
    const { error: fixError } = await supabase.rpc('create_missing_profiles');

    if (fixError) {
      console.error('Error creating missing profiles:', fixError);
      throw fixError;
    }
    
    console.log('✅ Missing profiles created successfully');

    // Step 4: Verify the fix
    console.log('4. Verifying the fix...');
    
    const { data: remainingMissing, error: verifyError } = await supabase.rpc('check_missing_profiles');

    if (verifyError) {
      console.error('Error verifying fix:', verifyError);
      throw verifyError;
    }

    if (remainingMissing && remainingMissing.length === 0) {
      console.log('✅ All missing profiles have been created');
    } else {
      console.log(`⚠️  Still ${remainingMissing.length} missing profiles`);
      remainingMissing.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.user_id.substring(0, 8)}...)`);
      });
    }

    // Step 5: Show current profile stats
    console.log('\n5. Current profile statistics:');
    
    const { data: profileStats, error: statsError } = await supabase
      .from('profiles')
      .select('id, username, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (statsError) {
      console.error('Error fetching profile stats:', statsError);
    } else {
      console.log(`📊 Total profiles: ${profileStats.length} (showing latest 10)`);
      profileStats.forEach(profile => {
        console.log(`   - ${profile.username} (${new Date(profile.created_at).toLocaleDateString()})`);
      });
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Test the signup flow with the affected email addresses');
    console.log('2. Users should now see their profile data correctly');
    console.log('3. Future signups should work normally');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local');
    console.log('2. Verify database connection and permissions');
    console.log('3. Check if the auth.users and profiles tables exist');
    console.log('4. Ensure RLS policies allow the service role to read/write');
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
