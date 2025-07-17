#!/usr/bin/env node

/**
 * Run Database Migration for Dietary Preferences Enhancement Fix
 * 
 * This script applies the SQL migration to add dietary_preferences column
 * to the recipe_enhancements table.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🔧 Running dietary preferences enhancement migration...');
  console.log('=====================================================\n');

  try {
    // Step 1: Add the dietary_preferences column
    console.log('1. Adding dietary_preferences column...');
    
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE recipe_enhancements 
        ADD COLUMN IF NOT EXISTS dietary_preferences JSONB;
      `
    });

    if (alterError) {
      console.error('Error adding column:', alterError);
      throw alterError;
    }
    
    console.log('✅ Column added successfully');

    // Step 2: Create index for performance
    console.log('2. Creating index for dietary_preferences...');
    
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_recipe_enhancements_dietary_preferences 
        ON recipe_enhancements USING GIN (dietary_preferences);
      `
    });

    if (indexError) {
      console.error('Error creating index:', indexError);
      throw indexError;
    }
    
    console.log('✅ Index created successfully');

    // Step 3: Verify the migration
    console.log('3. Verifying migration...');
    
    const { data: columns, error: verifyError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'recipe_enhancements' 
        AND column_name = 'dietary_preferences';
      `
    });

    if (verifyError) {
      console.error('Error verifying migration:', verifyError);
      throw verifyError;
    }

    if (columns && columns.length > 0) {
      console.log('✅ Migration verified successfully');
      console.log('   Column details:', columns[0]);
    } else {
      throw new Error('Migration verification failed - column not found');
    }

    // Step 4: Show current enhancement stats
    console.log('\n4. Current enhancement statistics:');
    
    const { data: stats, error: statsError } = await supabase
      .from('recipe_enhancements')
      .select('id, dietary_preferences, created_at')
      .order('created_at', { ascending: false });

    if (statsError) {
      console.error('Error fetching stats:', statsError);
    } else {
      const total = stats.length;
      const withPrefs = stats.filter(s => s.dietary_preferences && s.dietary_preferences.length > 0).length;
      const generic = total - withPrefs;

      console.log(`   Total enhancements: ${total}`);
      console.log(`   With dietary preferences: ${withPrefs}`);
      console.log(`   Generic (no preferences): ${generic}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('- Run: node scripts/migrations/migrate-existing-enhancements.js 1');
    console.log('- This will clear existing enhancements to force regeneration with dietary preferences');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local');
    console.log('2. Verify database connection and permissions');
    console.log('3. Check if the table exists and is accessible');
    process.exit(1);
  }
}

// Alternative method using direct SQL if RPC doesn't work
async function runMigrationDirect() {
  console.log('🔧 Running migration using direct SQL approach...');
  
  try {
    // Check if column already exists
    const { data: existingColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'recipe_enhancements')
      .eq('column_name', 'dietary_preferences');

    if (existingColumns && existingColumns.length > 0) {
      console.log('✅ dietary_preferences column already exists');
    } else {
      console.log('ℹ️  Column does not exist yet - manual SQL execution required');
      console.log('\nPlease run this SQL manually in your Supabase SQL editor:');
      console.log('```sql');
      console.log('ALTER TABLE recipe_enhancements ADD COLUMN IF NOT EXISTS dietary_preferences JSONB;');
      console.log('CREATE INDEX IF NOT EXISTS idx_recipe_enhancements_dietary_preferences ON recipe_enhancements USING GIN (dietary_preferences);');
      console.log('```');
    }

  } catch (error) {
    console.error('❌ Direct migration check failed:', error);
  }
}

// Run the migration
if (require.main === module) {
  const method = process.argv[2] || 'rpc';
  
  if (method === 'direct') {
    runMigrationDirect();
  } else {
    runMigration();
  }
}

module.exports = { runMigration, runMigrationDirect };
