/**
 * Check Recipes Table Structure
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or key not found in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecipesTable() {
  try {
    // Get a single recipe to check the structure
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching recipe:', error.message);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No recipes found in the database.');
      return;
    }
    
    // Print the column names
    console.log('Recipes table columns:');
    console.log(Object.keys(data[0]));
    
    // Print the first recipe data
    console.log('\nSample recipe data:');
    console.log(JSON.stringify(data[0], null, 2));
    
    // Get all recipe IDs
    const { data: allRecipes, error: allRecipesError } = await supabase
      .from('recipes')
      .select('id, title')
      .order('id');
    
    if (allRecipesError) {
      console.error('Error fetching all recipes:', allRecipesError.message);
      return;
    }
    
    console.log('\nAll recipe IDs and titles:');
    allRecipes.forEach(recipe => {
      console.log(`ID: ${recipe.id}, Title: ${recipe.title}`);
    });
  } catch (error) {
    console.error('Error checking recipes table:', error.message);
  }
}

// Run the function
checkRecipesTable();
