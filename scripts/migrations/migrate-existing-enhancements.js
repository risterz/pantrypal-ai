#!/usr/bin/env node

/**
 * Migration Script: Update Existing Recipe Enhancements for Dietary Preferences
 * 
 * This script helps fix existing recipe enhancements that were generated before
 * the dietary preferences feature was implemented. It provides options to:
 * 
 * 1. Clear all existing enhancements (forcing regeneration with dietary preferences)
 * 2. Mark existing enhancements as "generic" (no dietary preferences)
 * 3. Regenerate enhancements for specific recipes with dietary preferences
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getAllEnhancements() {
  const { data, error } = await supabase
    .from('recipe_enhancements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enhancements:', error);
    throw error;
  }

  return data;
}

async function clearAllEnhancements() {
  console.log('🗑️  Clearing all existing enhancements...');
  
  const { error } = await supabase
    .from('recipe_enhancements')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

  if (error) {
    console.error('Error clearing enhancements:', error);
    throw error;
  }

  console.log('✅ All enhancements cleared. They will be regenerated with dietary preferences when users visit recipe pages.');
}

async function markExistingAsGeneric() {
  console.log('🏷️  Marking existing enhancements as generic (no dietary preferences)...');
  
  const { data, error } = await supabase
    .from('recipe_enhancements')
    .update({ dietary_preferences: null })
    .is('dietary_preferences', null)
    .select('id');

  if (error) {
    console.error('Error updating enhancements:', error);
    throw error;
  }

  console.log(`✅ Marked ${data.length} enhancements as generic.`);
}

async function showEnhancementStats() {
  console.log('📊 Enhancement Statistics:');
  console.log('========================');

  const enhancements = await getAllEnhancements();
  
  const total = enhancements.length;
  const withDietaryPrefs = enhancements.filter(e => e.dietary_preferences && e.dietary_preferences.length > 0).length;
  const generic = total - withDietaryPrefs;

  console.log(`Total enhancements: ${total}`);
  console.log(`With dietary preferences: ${withDietaryPrefs}`);
  console.log(`Generic (no dietary preferences): ${generic}`);
  
  if (withDietaryPrefs > 0) {
    console.log('\nDietary preference breakdown:');
    const prefCounts = {};
    enhancements.forEach(e => {
      if (e.dietary_preferences && e.dietary_preferences.length > 0) {
        e.dietary_preferences.forEach(pref => {
          prefCounts[pref] = (prefCounts[pref] || 0) + 1;
        });
      }
    });
    
    Object.entries(prefCounts).forEach(([pref, count]) => {
      console.log(`  ${pref}: ${count}`);
    });
  }
}

async function main() {
  console.log('🔧 Recipe Enhancement Migration Tool');
  console.log('====================================\n');

  try {
    // Show current stats
    await showEnhancementStats();
    
    console.log('\nAvailable options:');
    console.log('1. Clear all existing enhancements (recommended)');
    console.log('2. Mark existing enhancements as generic');
    console.log('3. Show statistics only');
    console.log('4. Exit');

    // In a real implementation, you'd use readline for user input
    // For now, we'll default to showing stats
    const choice = process.argv[2] || '3';

    switch (choice) {
      case '1':
        await clearAllEnhancements();
        break;
      case '2':
        await markExistingAsGeneric();
        break;
      case '3':
        console.log('\n✅ Statistics displayed above.');
        break;
      case '4':
        console.log('👋 Exiting...');
        break;
      default:
        console.log('❌ Invalid option. Use: node migrate-existing-enhancements.js [1|2|3|4]');
        process.exit(1);
    }

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  getAllEnhancements,
  clearAllEnhancements,
  markExistingAsGeneric,
  showEnhancementStats
};
