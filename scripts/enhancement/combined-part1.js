// COMBINED RECIPE ENHANCEMENT SYSTEM - PART 1
// This file combines functionality from generate-recipe-enhancements.js and enhance-more-recipes.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.NEXT_PUBLIC_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

// Log file to track enhanced recipes
const LOG_FILE = path.join(__dirname, 'enhanced-recipes-log.json');

// Recipe categories to help generate more specific enhancements
const recipeCategories = {
  // Meat-based recipes
  meat: ['beef', 'steak', 'pork', 'chicken', 'turkey', 'lamb', 'veal', 'bacon', 'sausage', 'meatball'],
  // Seafood recipes
  seafood: ['fish', 'salmon', 'tuna', 'cod', 'shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'scallop'],
  // Pasta recipes
  pasta: ['pasta', 'spaghetti', 'linguine', 'fettuccine', 'penne', 'macaroni', 'lasagna', 'ravioli', 'noodle'],
  // Vegetarian/Vegan recipes
  vegetarian: ['vegetarian', 'vegan', 'tofu', 'tempeh', 'seitan', 'lentil', 'bean', 'chickpea', 'quinoa'],
  // Breakfast recipes
  breakfast: ['breakfast', 'egg', 'omelette', 'pancake', 'waffle', 'cereal', 'oatmeal', 'yogurt', 'granola'],
  // Dessert recipes
  dessert: ['dessert', 'cake', 'cookie', 'pie', 'brownie', 'ice cream', 'chocolate', 'pudding', 'mousse'],
  // Soup recipes
  soup: ['soup', 'stew', 'chowder', 'broth', 'bisque', 'chili'],
  // Salad recipes
  salad: ['salad', 'slaw', 'greens'],
  // Rice/Grain recipes
  rice: ['rice', 'risotto', 'pilaf', 'grain', 'quinoa', 'couscous', 'bulgur'],
  // Sandwich recipes
  sandwich: ['sandwich', 'burger', 'wrap', 'taco', 'burrito', 'quesadilla', 'toast']
};

// Combined recipes from all batches
const allRecipes = [
  // First batch of recipes
  { id: 654959, title: "Spaghetti with Smoked Salmon and Prawns", instructions: "Cook pasta according to package instructions. In a pan, heat olive oil and sauté garlic. Add prawns and cook until pink. Add smoked salmon and dill. Toss with pasta and serve." },
  { id: 716429, title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs", instructions: "Cook pasta. Sauté garlic and scallions. Add cauliflower and cook until tender. Toss with pasta and top with toasted breadcrumbs." },
  { id: 715538, title: "Bruschetta Style Pork & Pasta", instructions: "Cook pasta. Season pork and grill until cooked. Mix diced tomatoes, basil, and garlic. Toss pasta with olive oil and top with pork and tomato mixture." },
  { id: 633338, title: "Bacon Wrapped Filet Mignon", instructions: "Wrap filet mignon steaks with bacon. Season with salt and pepper. Sear in a hot pan and finish in the oven until desired doneness." },
  { id: 646512, title: "Salmon Caesar Salad", instructions: "Grill salmon until cooked. Toss romaine lettuce with Caesar dressing. Top with salmon, croutons, and parmesan cheese." },
  { id: 642129, title: "Easy To Make Spring Rolls", instructions: "Soak rice paper in warm water. Fill with vegetables, herbs, and protein of choice. Roll tightly and serve with dipping sauce." },
  { id: 641803, title: "Easy Ginger Beef Broccoli", instructions: "Stir-fry beef until browned. Add broccoli and ginger sauce. Cook until broccoli is tender-crisp. Serve over rice." },
  { id: 652417, title: "Moroccan chickpea and lentil stew", instructions: "Sauté onions and garlic. Add spices, chickpeas, lentils, and vegetable broth. Simmer until lentils are tender. Serve with couscous." },
  { id: 660306, title: "Slow Cooker: Pork and Garlic Mashed Potatoes", instructions: "Season pork and place in slow cooker. Cook on low for 8 hours. Prepare garlic mashed potatoes. Serve pork over mashed potatoes." },
  { id: 715523, title: "Chorizo and Beef Quinoa Stuffed Pepper", instructions: "Cook quinoa. Brown chorizo and beef. Mix with quinoa. Stuff peppers with mixture. Bake until peppers are tender." },
  
  // Second batch of recipes
  { id: 638420, title: "Chicken Piccata", instructions: "Pound chicken breasts thin. Dredge in flour. Sauté in olive oil until golden. Remove chicken. Add white wine, lemon juice, and capers to the pan. Return chicken to the pan and simmer until cooked through. Serve with pasta." },
  { id: 649931, title: "Lentil Soup", instructions: "Sauté onions, carrots, and celery. Add garlic and spices. Add lentils and vegetable broth. Simmer until lentils are tender. Season with salt and pepper." },
  { id: 716437, title: "Chilled Cucumber Avocado Soup", instructions: "Blend cucumbers, avocados, yogurt, lime juice, and herbs until smooth. Chill for at least 2 hours. Garnish with diced cucumber and herbs before serving." },
  { id: 647875, title: "Indian-Spiced Roasted Potatoes", instructions: "Toss potatoes with oil and Indian spices. Roast at 425°F until crispy and cooked through. Garnish with fresh cilantro." },
  { id: 716381, title: "Nigerian Snail Stew", instructions: "Clean and prepare snails. Make a sauce with tomatoes, peppers, onions, and spices. Add snails and simmer until tender. Serve with rice or fufu." },
  { id: 782622, title: "Chocolate Peanut Butter Cookies", instructions: "Cream butter, peanut butter, and sugars. Add eggs and vanilla. Mix in dry ingredients. Form into balls, flatten, and bake at 350°F for 10-12 minutes." },
  { id: 652359, title: "Mediterranean Tuna Salad", instructions: "Mix canned tuna with diced cucumber, tomatoes, olives, and red onion. Dress with olive oil, lemon juice, and herbs. Serve on a bed of greens or in a pita." },
  { id: 648742, title: "Lemon Pepper Salmon", instructions: "Season salmon fillets with lemon zest, black pepper, and salt. Bake at 375°F until fish flakes easily. Serve with a squeeze of fresh lemon juice." },
  { id: 660837, title: "Roast Pork Loin with Apples", instructions: "Season pork loin with herbs and garlic. Roast with apple slices and onions until pork reaches 145°F. Let rest before slicing. Serve with the roasted apples and pan juices." }
];

// Function to read existing log
function readExistingLog() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const logContent = fs.readFileSync(LOG_FILE, 'utf8');
      return JSON.parse(logContent);
    }
  } catch (error) {
    console.error('Error reading log file:', error);
  }
  return { enhancedRecipes: [] };
}

// Function to update log
function updateLog(recipeId, recipeTitle, status) {
  try {
    const log = readExistingLog();
    
    // Add new entry
    log.enhancedRecipes.push({
      id: recipeId,
      title: recipeTitle,
      timestamp: new Date().toISOString(),
      status
    });
    
    // Write updated log
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
    console.log(`Log updated for recipe ${recipeId}: ${recipeTitle}`);
  } catch (error) {
    console.error('Error updating log file:', error);
  }
}

// Function to determine recipe category based on title and instructions
function determineRecipeCategory(recipe) {
  const titleAndInstructions = (recipe.title + ' ' + recipe.instructions).toLowerCase();
  
  for (const [category, keywords] of Object.entries(recipeCategories)) {
    for (const keyword of keywords) {
      if (titleAndInstructions.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'general';
}

// Function to categorize enhancements
function categorizeEnhancements(enhancements) {
  const categorized = {
    healthier: [],
    faster: [],
    tastier: [],
    other: []
  };
  
  enhancements.forEach(enhancement => {
    // Skip introductory lines or empty strings
    if (!enhancement || 
        enhancement.startsWith('Here are') || 
        enhancement.length < 10) {
      return;
    }
    
    const lowerEnhancement = enhancement.toLowerCase();
    
    // Check if enhancement contains keywords related to health
    if (lowerEnhancement.includes('health') || 
        lowerEnhancement.includes('calorie') || 
        lowerEnhancement.includes('nutrition') || 
        lowerEnhancement.includes('fat') || 
        lowerEnhancement.includes('sugar') || 
        lowerEnhancement.includes('salt') || 
        lowerEnhancement.includes('sodium') ||
        lowerEnhancement.includes('substitute') ||
        lowerEnhancement.includes('oil') ||
        lowerEnhancement.includes('leaner') ||
        lowerEnhancement.includes('whole grain') ||
        lowerEnhancement.includes('fiber')) {
      categorized.healthier.push(enhancement);
    }
    // Check if enhancement contains keywords related to time-saving
    else if (lowerEnhancement.includes('time') || 
             lowerEnhancement.includes('quick') || 
             lowerEnhancement.includes('fast') || 
             lowerEnhancement.includes('efficient') || 
             lowerEnhancement.includes('prep') || 
             lowerEnhancement.includes('prepare') ||
             lowerEnhancement.includes('pressure cooker') ||
             lowerEnhancement.includes('instant pot') ||
             lowerEnhancement.includes('microwave') ||
             lowerEnhancement.includes('save') ||
             lowerEnhancement.includes('simpler')) {
      categorized.faster.push(enhancement);
    }
    // Check if enhancement contains keywords related to flavor
    else if (lowerEnhancement.includes('flavor') || 
             lowerEnhancement.includes('taste') || 
             lowerEnhancement.includes('delicious') || 
             lowerEnhancement.includes('seasoning') || 
             lowerEnhancement.includes('herb') || 
             lowerEnhancement.includes('spice') ||
             lowerEnhancement.includes('aroma') ||
             lowerEnhancement.includes('texture') ||
             lowerEnhancement.includes('boost') ||
             lowerEnhancement.includes('enhance')) {
      categorized.tastier.push(enhancement);
    }
    // If no category matches, put in other
    else {
      categorized.other.push(enhancement);
    }
  });
  
  return categorized;
}

// Function to generate recipe-specific enhancements using DeepSeek API
async function generateEnhancements(recipe) {
  try {
    const category = determineRecipeCategory(recipe);
    console.log(`Generating enhancements for ${recipe.title} (ID: ${recipe.id}, Category: ${category})...`);
    
    // Create prompt for DeepSeek
    const messages = [
      {
        role: 'system',
        content: `You are a professional chef and nutritionist. Your task is to analyze recipes and suggest ways to enhance them in three specific categories:

        1. HEALTHIER - Suggest ingredient substitutions and cooking methods that reduce calories, fat, or sodium while maintaining flavor
        2. FASTER - Suggest time-saving techniques, preparation shortcuts, and efficient cooking methods
        3. TASTIER - Suggest professional flavor enhancement techniques and tips to elevate the recipe
        
        The recipe is in the category: ${category}. Provide specific, practical suggestions that a home cook could implement.
        
        Format your response with clear category headers and bullet points:
        
        HEALTHIER:
        • Enhancement 1 – Detailed explanation
        • Enhancement 2 – Detailed explanation
        
        FASTER:
        • Enhancement 1 – Detailed explanation
        • Enhancement 2 – Detailed explanation
        
        TASTIER:
        • Enhancement 1 – Detailed explanation
        • Enhancement 2 – Detailed explanation
        
        Provide 3-4 suggestions for each category. Make your suggestions VERY specific to this exact recipe, not generic cooking advice.`
      },
      {
        role: 'user',
        content: `Please enhance this recipe:
        
        Title: ${recipe.title}
        
        Instructions:
        ${recipe.instructions}
        
        Provide specific enhancements to make this recipe healthier, faster to prepare, and tastier.`
      }
    ];
    
    // Make API call to DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error (${response.status}):`, errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const data = await response.json();
    const enhancementText = data.choices[0].message.content;
    
    // Parse the enhancements from the AI response
    const enhancementLines = enhancementText
      .split('\n')
      .filter(line => line.trim().length > 0 && (line.includes('–') || line.includes('-') || /^[•\*]/.test(line.trim())))
      .map(line => {
        // Remove bullet points, asterisks and clean up formatting
        let cleaned = line.replace(/^[•\*\-\d\.]+\s*/, '').trim();
        
        // Remove any markdown asterisks that might be used for emphasis
        cleaned = cleaned.replace(/\*\*/g, '');
        
        return cleaned;
      });
    
    // Ensure we have at least some enhancements
    const finalEnhancements = enhancementLines.length > 0 
      ? enhancementLines 
      : enhancementText.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/\*\*/g, ''))
          .slice(0, 10);
    
    // Categorize the enhancements
    const categorizedEnhancements = categorizeEnhancements(finalEnhancements);
    
    // Return both the flat list and categorized format
    return {
      flatList: finalEnhancements,
      categorized: categorizedEnhancements
    };
  } catch (error) {
    console.error(`Error generating enhancements for ${recipe.title}:`, error);
    updateLog(recipe.id, recipe.title, 'failed');
    return null;
  }
}

// Function to store enhancements in Supabase
async function storeEnhancements(recipe, enhancementData) {
  try {
    // If enhancementData is null, return false
    if (!enhancementData) {
      console.log(`No valid enhancement data for recipe ${recipe.id}`);
      return false;
    }
    
    // Extract the flat list and categorized enhancements
    const { flatList, categorized } = enhancementData;
    
    if (!flatList || flatList.length === 0) {
      console.log(`No valid enhancements to store for recipe ${recipe.id}`);
      return false;
    }
    
    // Check if enhancements already exist for this recipe
    const { data: existingData } = await supabase
      .from('recipe_enhancements')
      .select('id')
      .eq('recipe_id', recipe.id.toString())
      .maybeSingle();
    
    if (existingData) {
      // Update existing enhancements
      console.log(`Updating existing enhancements for recipe ${recipe.id}`);
      const { data, error } = await supabase
        .from('recipe_enhancements')
        .update({
          enhancements: flatList,
          categorized_enhancements: categorized,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
      
      if (error) {
        console.error(`Error updating enhancements for recipe ${recipe.id}:`, error);
        return false;
      }
    } else {
      // Insert new enhancements
      console.log(`Inserting new enhancements for recipe ${recipe.id}`);
      const { data, error } = await supabase
        .from('recipe_enhancements')
        .insert({
          recipe_id: recipe.id.toString(),
          enhancements: flatList,
          categorized_enhancements: categorized,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`Error storing enhancements for recipe ${recipe.id}:`, error);
        return false;
      }
    }
    
    console.log(`Successfully stored enhancements for recipe ${recipe.id}`);
    updateLog(recipe.id, recipe.title, 'success');
    return true;
  } catch (error) {
    console.error(`Error in database operation for recipe ${recipe.id}:`, error);
    return false;
  }
}

// Main function to process recipes
async function processRecipes(recipesToProcess) {
  console.log(`Starting to process ${recipesToProcess.length} recipes...`);
  
  // Create log directory if it doesn't exist
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Initialize log if it doesn't exist
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify({ enhancedRecipes: [] }, null, 2), 'utf8');
  }
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  // Process recipes one by one to manage API rate limits
  for (const recipe of recipesToProcess) {
    console.log(`\nProcessing recipe: ${recipe.title} (ID: ${recipe.id})`);
    
    try {
      // Check if enhancements already exist for this recipe
      const { data: existingData } = await supabase
        .from('recipe_enhancements')
        .select('id')
        .eq('recipe_id', recipe.id.toString())
        .maybeSingle();
      
      if (existingData) {
        console.log(`Enhancements already exist for recipe ${recipe.id}. Skipping...`);
        updateLog(recipe.id, recipe.title, 'skipped');
        skipCount++;
        continue;
      }
      
      // Generate enhancements using DeepSeek API
      const enhancements = await generateEnhancements(recipe);
      
      if (enhancements) {
        const success = await storeEnhancements(recipe, enhancements);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error processing recipe ${recipe.title}:`, error);
      updateLog(recipe.id, recipe.title, 'failed');
      failCount++;
    }
  }
  
  console.log('\nProcessing completed!');
  console.log(`Successfully enhanced: ${successCount} recipes`);
  console.log(`Skipped (already enhanced): ${skipCount} recipes`);
  console.log(`Failed: ${failCount} recipes`);
  console.log(`See detailed log at: ${LOG_FILE}`);
}

// Export functions for use in other parts
module.exports = {
  processRecipes,
  generateEnhancements,
  storeEnhancements,
  categorizeEnhancements,
  allRecipes
};
