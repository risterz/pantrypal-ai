import { NextRequest, NextResponse } from 'next/server';
import { RecipeDetail } from '@/lib/api/recipeApi';

// Server-side environment variables (secure)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Helper function to analyze nutritional gaps in a recipe
function analyzeNutritionalGaps(recipe: any): string {
  const gaps = [];
  const ingredients = recipe.extendedIngredients || [];

  // Check for common food groups
  const hasVegetables = ingredients.some((ing: any) =>
    ['vegetable', 'tomato', 'onion', 'pepper', 'spinach', 'broccoli', 'carrot', 'lettuce', 'cucumber'].some(veg =>
      ing.name?.toLowerCase().includes(veg) || ing.aisle?.toLowerCase().includes('produce')
    )
  );

  const hasWholegrains = ingredients.some((ing: any) =>
    ['whole wheat', 'brown rice', 'quinoa', 'oats', 'barley'].some(grain =>
      ing.name?.toLowerCase().includes(grain)
    )
  );

  const hasLeanProtein = ingredients.some((ing: any) =>
    ['chicken breast', 'fish', 'salmon', 'tofu', 'beans', 'lentils', 'egg'].some(protein =>
      ing.name?.toLowerCase().includes(protein)
    )
  );

  const hasFruits = ingredients.some((ing: any) =>
    ['apple', 'banana', 'berry', 'citrus', 'lemon', 'lime', 'orange'].some(fruit =>
      ing.name?.toLowerCase().includes(fruit) || ing.aisle?.toLowerCase().includes('produce')
    )
  );

  // Identify gaps
  if (!hasVegetables) gaps.push('vegetables (for vitamins, minerals, and fiber)');
  if (!hasWholegrains) gaps.push('whole grains (for fiber and B-vitamins)');
  if (!hasLeanProtein) gaps.push('lean protein (for essential amino acids)');
  if (!hasFruits) gaps.push('fruits (for vitamin C and antioxidants)');

  if (gaps.length > 0) {
    return `\n        NUTRITIONAL GAPS IDENTIFIED: This recipe could benefit from adding ${gaps.join(', ')} to improve nutritional balance and address common dietary deficiencies.`;
  }

  return '\n        NUTRITIONAL ANALYSIS: This recipe appears to have good nutritional balance. Focus on optimizing preparation methods and ingredient quality.';
}

// Helper function to create dietary context for AI prompt
function getDietaryContext(preferences: string[] | null | undefined): string {
  if (!preferences || preferences.length === 0) {
    return '';
  }

  const dietaryMap: { [key: string]: string } = {
    'vegetarian': 'VEGETARIAN: Avoid meat, poultry, and fish. Focus on plant-based proteins and ingredients.',
    'vegan': 'VEGAN: Avoid all animal products including meat, dairy, eggs, and honey. Use plant-based alternatives.',
    'glutenFree': 'GLUTEN-FREE: Avoid wheat, barley, rye, and other gluten-containing ingredients. Suggest gluten-free alternatives.',
    'dairyFree': 'DAIRY-FREE: Avoid milk, cheese, butter, and other dairy products. Use dairy-free alternatives.',
    'keto': 'KETOGENIC: Focus on high-fat, low-carb ingredients. Minimize carbohydrates and sugars.',
    'paleo': 'PALEO: Focus on whole foods, avoid processed foods, grains, legumes, and dairy. Emphasize meat, fish, vegetables, fruits, nuts, and seeds.'
  };

  const dietaryInstructions = preferences
    .map(pref => dietaryMap[pref])
    .filter(Boolean)
    .join('\n        ');

  if (dietaryInstructions) {
    return `
        DIETARY PREFERENCES: The user has the following dietary preferences. Please prioritize enhancements that align with these preferences:
        ${dietaryInstructions}

        When suggesting ingredient substitutions, always consider these dietary restrictions first.`;
  }

  return '';
}

interface EnhanceRecipeRequest {
  recipe: RecipeDetail;
  userDietaryPreferences?: string[] | null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    const requestData: EnhanceRecipeRequest = await request.json();
    const { recipe, userDietaryPreferences } = requestData;
    
    // Validate recipe data
    if (!recipe || !recipe.id || !recipe.title) {
      return NextResponse.json(
        { error: 'Invalid recipe data provided' },
        { status: 400 }
      );
    }

    // Extract recipe details
    const { id, title, instructions, extendedIngredients } = recipe;

    // Format ingredients list
    const ingredientsList = extendedIngredients
      ?.map(ingredient => ingredient.original)
      .join('\n') || 'No ingredients provided';

    // Process dietary preferences for AI prompt
    const dietaryContext = getDietaryContext(userDietaryPreferences);
    
    // Create prompt for DeepSeek
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: `You are a professional chef and nutritionist specializing in balanced, healthy meal planning. Your task is to analyze recipes and suggest ways to enhance them in three specific categories, with a strong focus on nutritional balance and addressing common dietary deficiencies:

        1. HEALTHIER ENHANCEMENTS (provide at least 3 suggestions):
        - Ingredient substitutions to reduce calories, fat, or sodium while boosting nutrients
        - Cooking methods that preserve and enhance nutritional value
        - Ways to add more vegetables, fiber, protein, or essential nutrients
        - Suggestions to balance macronutrients (protein, carbs, healthy fats)
        - Additions that address common nutritional gaps (iron, calcium, vitamins, omega-3s)

        2. TIME-SAVING ENHANCEMENTS (provide at least 3 suggestions):
        - Preparation shortcuts and time-saving techniques
        - Efficient cooking methods and equipment usage
        - Make-ahead tips and batch cooking strategies
        - Meal prep suggestions for balanced nutrition throughout the week

        3. FLAVOR ENHANCEMENT SUGGESTIONS (provide at least 3 suggestions):
        - Professional flavor enhancement techniques using nutritious ingredients
        - Seasoning, herb, and spice recommendations that add health benefits
        - Texture and aroma improvements using whole foods
        - Ways to make healthy ingredients more appealing and satisfying

        NUTRITIONAL BALANCE FOCUS:
        - Consider this recipe's role in a balanced daily/weekly meal plan
        - Identify missing food groups and suggest additions (vegetables, fruits, whole grains, lean proteins)
        - Recommend nutrient-dense ingredient swaps that improve overall nutritional profile
        - Suggest complementary foods that would complete the nutritional picture
        - Address common dietary deficiencies (fiber, vitamins D/B12, iron, calcium, omega-3s)

        ${dietaryContext}

        IMPORTANT:
        - Provide EXACTLY 3-4 suggestions for EACH category (9-12 total suggestions)
        - Format as a simple bulleted list without category headers
        - Do NOT include introductory sentences
        - Start each suggestion with a clear indicator: "Healthier:", "Time-saving:", or "Flavor:"
        - Make each suggestion specific, practical, and nutrition-focused for home cooks
        - Prioritize suggestions that improve nutritional balance and variety

        Example format:
        - Healthier: Add spinach and bell peppers to boost iron, vitamin C, and fiber content
        - Time-saving: Prep a week's worth of colorful vegetables on Sunday for balanced meals
        - Flavor: Use nutritional yeast for cheesy flavor plus B-vitamins and protein`
      },
      {
        role: 'user',
        content: `Please enhance this recipe with 3-4 suggestions for each category (healthier, time-saving, and flavor), focusing on nutritional balance:

        Title: ${title}

        NUTRITIONAL CONTEXT:
        - Health Score: ${recipe.healthScore || 'Not available'}/100
        - Vegetarian: ${recipe.vegetarian ? 'Yes' : 'No'}
        - Vegan: ${recipe.vegan ? 'Yes' : 'No'}
        - Gluten-Free: ${recipe.glutenFree ? 'Yes' : 'No'}
        - Dairy-Free: ${recipe.dairyFree ? 'Yes' : 'No'}
        - Very Healthy: ${recipe.veryHealthy ? 'Yes' : 'No'}
        - Servings: ${recipe.servings || 'Not specified'}
        - Ready in: ${recipe.readyInMinutes || 'Not specified'} minutes
        - Dish Types: ${recipe.dishTypes?.join(', ') || 'Not specified'}
        - Cuisines: ${recipe.cuisines?.join(', ') || 'Not specified'}

        Ingredients:
        ${ingredientsList}

        Instructions:
        ${instructions || 'No instructions provided'}
        ${analyzeNutritionalGaps(recipe)}

        FOCUS ON: Improving nutritional balance, adding missing food groups, and addressing common dietary deficiencies while maintaining the recipe's character.`
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
        max_tokens: 1500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Validate API response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid DeepSeek API response structure:', data);
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }
    
    const enhancementText = data.choices[0].message.content;
    
    // Parse the enhancements from the AI response
    console.log('Raw AI response:', enhancementText);

    const enhancementLines = enhancementText
      .split('\n')
      .filter((line: string) => {
        const trimmed = line.trim();
        // Skip empty lines
        if (trimmed.length === 0) return false;

        // Skip introductory sentences that start with common phrases
        if (trimmed.toLowerCase().startsWith('here are') ||
            trimmed.toLowerCase().startsWith('here is') ||
            trimmed.toLowerCase().startsWith('below are') ||
            trimmed.toLowerCase().startsWith('i suggest') ||
            trimmed.toLowerCase().startsWith('these are') ||
            trimmed.toLowerCase().includes('enhancements for') ||
            trimmed.toLowerCase().includes('suggestions for') ||
            trimmed.toLowerCase().includes('ways to enhance') ||
            trimmed.toLowerCase().includes('improvements for')) {
          return false;
        }

        // Include lines that look like actual enhancement items OR have our new prefixes
        return (line.includes('-') ||
                /^\d+\./.test(trimmed) ||
                line.includes('•') ||
                trimmed.toLowerCase().startsWith('healthier:') ||
                trimmed.toLowerCase().startsWith('time-saving:') ||
                trimmed.toLowerCase().startsWith('flavor:') ||
                (trimmed.length > 15 && !trimmed.toLowerCase().includes('suggestion') && !trimmed.toLowerCase().includes('enhancement')));
      })
      .map((line: string) => {
        // Remove numbered/bulleted list markers and clean up formatting
        let cleaned = line.replace(/^[•\-\d\.]+\s*/, '').trim();

        // Remove any asterisks that might be used for emphasis
        cleaned = cleaned.replace(/\*\*/g, '');

        // Remove any remaining introductory phrases that might be embedded
        cleaned = cleaned.replace(/^(Here are|Here is|Below are|I suggest|These are)\s+/i, '');

        return cleaned;
      })
      .filter((line: string) => line.length > 8); // More lenient length filter
    
    console.log('Processed enhancement lines:', enhancementLines);

    // Ensure we have at least some enhancements with better fallback
    let finalEnhancements = enhancementLines;

    if (finalEnhancements.length === 0) {
      console.log('No enhancements found, using fallback processing');
      // More aggressive fallback processing
      finalEnhancements = enhancementText
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 5)
        .map((line: string) => line.replace(/^[-•*\d\.]+\s*/, '').replace(/\*\*/g, '').trim())
        .filter((line: string) => line.length > 5)
        .slice(0, 10);
    }

    console.log('Final enhancements count:', finalEnhancements.length);
    console.log('Final enhancements:', finalEnhancements);

    // If we still have no enhancements, return an error
    if (finalEnhancements.length === 0) {
      console.error('No valid enhancements could be extracted from AI response');
      return NextResponse.json(
        { error: 'Failed to extract valid enhancements from AI response' },
        { status: 500 }
      );
    }

    const enhancement = {
      enhancementId: `deepseek_${Date.now()}`,
      recipeId: id,
      enhancements: finalEnhancements,
      generatedAt: new Date()
    };

    return NextResponse.json(enhancement);
    
  } catch (error) {
    console.error('Error in DeepSeek API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}