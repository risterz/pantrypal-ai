import { NextRequest, NextResponse } from 'next/server';
import { RecipeDetail } from '@/lib/api/recipeApi';

// Server-side environment variables (secure)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
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
        content: `You are a professional chef and nutritionist. Your task is to analyze recipes and suggest ways to enhance them in three specific categories:

        1. HEALTHIER ENHANCEMENTS (provide at least 3 suggestions):
        - Ingredient substitutions to reduce calories, fat, or sodium
        - Cooking methods that make the dish more nutritious
        - Ways to add more vegetables, fiber, or nutrients

        2. TIME-SAVING ENHANCEMENTS (provide at least 3 suggestions):
        - Preparation shortcuts and time-saving techniques
        - Efficient cooking methods and equipment usage
        - Make-ahead tips and batch cooking strategies

        3. FLAVOR ENHANCEMENT SUGGESTIONS (provide at least 3 suggestions):
        - Professional flavor enhancement techniques
        - Seasoning, herb, and spice recommendations
        - Texture and aroma improvements

        ${dietaryContext}

        IMPORTANT:
        - Provide EXACTLY 3-4 suggestions for EACH category (9-12 total suggestions)
        - Format as a simple bulleted list without category headers
        - Do NOT include introductory sentences
        - Start each suggestion with a clear indicator: "Healthier:", "Time-saving:", or "Flavor:"
        - Make each suggestion specific and practical for home cooks

        Example format:
        - Healthier: Replace heavy cream with Greek yogurt to reduce calories by 60%
        - Time-saving: Prep vegetables the night before to cut cooking time in half
        - Flavor: Add fresh herbs in the last 2 minutes for maximum aroma`
      },
      {
        role: 'user',
        content: `Please enhance this recipe with 3-4 suggestions for each category (healthier, time-saving, and flavor):

        Title: ${title}

        Ingredients:
        ${ingredientsList}

        Instructions:
        ${instructions || 'No instructions provided'}`
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