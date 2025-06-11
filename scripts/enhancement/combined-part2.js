// COMBINED RECIPE ENHANCEMENT SYSTEM - PART 2
// This file contains the enhanced recipe functionality with retry mechanisms and additional recipes

// Import the core functionality from part 1
const { processRecipes, generateEnhancements, storeEnhancements, categorizeEnhancements, allRecipes } = require('./combined-part1');

// Third batch of recipes with more diverse cuisines
const additionalRecipes = [
  { id: 715769, title: "Broccolini Quinoa Pilaf", instructions: "Toast quinoa in a dry pan. Add vegetable broth and bring to a boil. Reduce heat and simmer until quinoa is cooked. Blanch broccolini and add to quinoa with lemon zest and toasted almonds." },
  { id: 639851, title: "Cod with Tomato-Olive-Chorizo Sauce and Polenta", instructions: "Make polenta according to package directions. In a separate pan, sauté chorizo, add tomatoes and olives to make a sauce. Pan-sear cod fillets and serve over polenta with the sauce." },
  { id: 633942, title: "Balsamic Roasted Vegetables", instructions: "Toss mixed vegetables with olive oil, balsamic vinegar, and herbs. Roast at 425°F until caramelized and tender. Season with salt and pepper before serving." },
  { id: 661925, title: "Strawberry Cheesecake Overnight Oats", instructions: "Mix oats, milk, yogurt, chia seeds, and vanilla. Stir in cream cheese and strawberries. Refrigerate overnight. Top with graham cracker crumbs before serving." },
  { id: 636228, title: "Broccoli Tartar", instructions: "Blanch broccoli until tender-crisp. Finely chop and mix with capers, pickles, shallots, and herbs. Dress with mustard, mayonnaise, and lemon juice. Chill before serving." },
  { id: 641057, title: "Curried Butternut Squash and Apple Soup", instructions: "Sauté onions and curry powder. Add butternut squash, apples, and vegetable broth. Simmer until vegetables are tender. Blend until smooth. Finish with coconut milk." },
  { id: 652078, title: "Mocha Overnight Oats with Almond Butter", instructions: "Mix oats, coffee, cocoa powder, milk, and chia seeds. Stir in almond butter and maple syrup. Refrigerate overnight. Top with chocolate chips before serving." },
  { id: 638235, title: "Chicken Satay", instructions: "Marinate chicken strips in coconut milk, curry paste, and spices. Thread onto skewers. Grill until cooked through. Serve with peanut dipping sauce." },
  { id: 664429, title: "Vegetable Dumplings", instructions: "Mix finely chopped vegetables with seasonings. Place a spoonful on wonton wrappers. Fold and seal edges. Steam until cooked through. Serve with dipping sauce." },
  { id: 715573, title: "Simple Skillet Lasagna", instructions: "Brown ground beef with onions and garlic. Add tomato sauce and Italian seasonings. Stir in broken lasagna noodles and water. Cover and simmer until noodles are tender. Top with ricotta and mozzarella cheese." }
];

// Final batch of recipes with even more diversity
const finalBatchRecipes = [
  { 
    id: 716627, 
    title: "Easy Homemade Rice and Beans", 
    instructions: "Heat oil in a large pot. Sauté onions and garlic until fragrant. Add rice and toast for 2 minutes. Add beans, broth, and seasonings. Bring to a boil, then reduce heat and simmer until rice is cooked. Garnish with cilantro."
  },
  { 
    id: 640062, 
    title: "Corn Avocado Salsa", 
    instructions: "Combine corn, diced avocado, red onion, jalapeño, and cilantro in a bowl. Add lime juice, olive oil, salt, and pepper. Toss gently to combine. Chill for at least 30 minutes before serving."
  },
  { 
    id: 715495, 
    title: "Turkey Tomato Cheese Pizza", 
    instructions: "Preheat oven to 450°F. Spread pizza dough on a baking sheet. Top with tomato sauce, cooked ground turkey, sliced tomatoes, and shredded cheese. Bake for 12-15 minutes until crust is golden and cheese is bubbly."
  },
  { 
    id: 642605, 
    title: "Farro With Mushrooms and Asparagus", 
    instructions: "Cook farro according to package directions. In a separate pan, sauté mushrooms and asparagus until tender. Combine with cooked farro, add herbs, lemon juice, and olive oil. Season with salt and pepper."
  },
  { 
    id: 636589, 
    title: "Butternut Squash Frittata", 
    instructions: "Preheat oven to 375°F. Sauté diced butternut squash until tender. Beat eggs with milk and seasonings. Pour over squash in an oven-safe skillet. Cook until edges set, then transfer to oven and bake until center is set."
  },
  { 
    id: 646738, 
    title: "Mango Salsa Chicken", 
    instructions: "Season chicken breasts with salt, pepper, and cumin. Grill until cooked through. Top with a salsa made from diced mango, red onion, jalapeño, cilantro, and lime juice. Serve with rice."
  },
  { 
    id: 715521, 
    title: "Turkey Avocado BLT Salad", 
    instructions: "Cook bacon until crisp. Combine lettuce, diced turkey, halved cherry tomatoes, and diced avocado in a bowl. Crumble bacon over top. Drizzle with ranch dressing and toss gently."
  },
  { 
    id: 632269, 
    title: "Amaranth and Roast Veggie Salad", 
    instructions: "Cook amaranth according to package directions. Roast mixed vegetables with olive oil, salt, and pepper. Combine amaranth and vegetables. Dress with a lemon-tahini dressing. Serve warm or cold."
  },
  { 
    id: 659143, 
    title: "Salmon, Watercress, Fennel and Baby Beetroot Salad", 
    instructions: "Roast salmon fillets until just cooked. Arrange watercress, thinly sliced fennel, and cooked baby beetroot on plates. Top with salmon. Drizzle with a dressing made from olive oil, lemon juice, and dill."
  },
  { 
    id: 715385, 
    title: "Slow Cooker Baked Potato Soup", 
    instructions: "Place diced potatoes, onion, garlic, and broth in a slow cooker. Cook on low for 6-8 hours. Mash some of the potatoes for texture. Stir in cream, cheese, and cooked bacon. Season with salt and pepper."
  }
];

// Enhanced generateEnhancements function with retry mechanism
async function generateEnhancementsWithRetry(recipe) {
  try {
    console.log(`Generating enhancements for ${recipe.title} (ID: ${recipe.id})...`);
    
    // Add retry mechanism for API calls
    const maxRetries = 3;
    let attempt = 0;
    let enhancementText = null;
    
    // Create prompt for DeepSeek (same as in part 1)
    const messages = [
      {
        role: 'system',
        content: `You are a professional chef and nutritionist. Your task is to analyze recipes and suggest ways to enhance them in three specific categories:

        1. HEALTHIER - Suggest ingredient substitutions and cooking methods that reduce calories, fat, or sodium while maintaining flavor
        2. FASTER - Suggest time-saving techniques, preparation shortcuts, and efficient cooking methods
        3. TASTIER - Suggest professional flavor enhancement techniques and tips to elevate the recipe
        
        Provide specific, practical suggestions that a home cook could implement.
        
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
    
    // Make API call to DeepSeek with retry mechanism
    while (attempt < maxRetries && enhancementText === null) {
      attempt++;
      try {
        console.log(`API call attempt ${attempt} of ${maxRetries}...`);
        
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
          if (attempt >= maxRetries) {
            throw new Error(`DeepSeek API error: ${response.status}`);
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }
        
        const data = await response.json();
        enhancementText = data.choices[0].message.content;
      } catch (error) {
        console.error(`API call attempt ${attempt} failed:`, error);
        if (attempt >= maxRetries) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
    
    if (!enhancementText) {
      throw new Error('Failed to get response from DeepSeek API after multiple attempts');
    }
    
    // Parse the enhancements from the AI response (same as in part 1)
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
    return null;
  }
}

// Enhanced processRecipes function with better error handling
async function processRecipesWithRetry(recipesToProcess) {
  console.log(`Starting to process ${recipesToProcess.length} recipes with enhanced retry mechanism...`);
  
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
        skipCount++;
        continue;
      }
      
      // Generate enhancements using DeepSeek API with retry
      const enhancements = await generateEnhancementsWithRetry(recipe);
      
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
      
      // Add a longer delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error processing recipe ${recipe.title}:`, error);
      failCount++;
      
      // Add an even longer delay after an error
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\nProcessing completed with enhanced retry mechanism!');
  console.log(`Successfully enhanced: ${successCount} recipes`);
  console.log(`Skipped (already enhanced): ${skipCount} recipes`);
  console.log(`Failed: ${failCount} recipes`);
}

// Function to generate a report of all enhanced recipes
async function generateEnhancementReport() {
  try {
    console.log('Generating report of all enhanced recipes...');
    
    // Fetch all enhanced recipes from the database
    const { data, error } = await supabase
      .from('recipe_enhancements')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    console.log(`Found ${data.length} enhanced recipes.`);
    
    // Group recipes by creation date
    const groupedByDate = data.reduce((groups, recipe) => {
      const createdAt = new Date(recipe.created_at);
      const dateKey = createdAt.toLocaleDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(recipe);
      return groups;
    }, {});
    
    // Generate report
    console.log('\nEnhanced Recipes Report:');
    console.log('======================\n');
    
    Object.keys(groupedByDate).forEach(date => {
      const recipes = groupedByDate[date];
      console.log(`Batch Date: ${date} (${recipes.length} recipes)`);
      
      recipes.forEach(recipe => {
        const enhancementCount = recipe.enhancements ? recipe.enhancements.length : 0;
        const healthierCount = recipe.categorized_enhancements?.healthier?.length || 0;
        const fasterCount = recipe.categorized_enhancements?.faster?.length || 0;
        const tastierCount = recipe.categorized_enhancements?.tastier?.length || 0;
        
        console.log(`  - Recipe ID: ${recipe.recipe_id}`);
        console.log(`    Total Enhancements: ${enhancementCount} (Healthier: ${healthierCount}, Faster: ${fasterCount}, Tastier: ${tastierCount})`);
      });
      
      console.log('');
    });
    
    console.log('Report generation complete!');
    return data.length;
  } catch (error) {
    console.error('Error generating report:', error);
    return 0;
  }
}

// Export functions for use in the main combined file
module.exports = {
  additionalRecipes,
  finalBatchRecipes,
  generateEnhancementsWithRetry,
  processRecipesWithRetry,
  generateEnhancementReport
};
