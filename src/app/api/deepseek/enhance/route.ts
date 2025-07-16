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
        content: `You are a professional chef and nutritionist. Your task is to analyze recipes and suggest ways to enhance them to be:
        1. Healthier - suggest ingredient substitutions and cooking methods that reduce calories, fat, or sodium while maintaining flavor
        2. Faster - suggest time-saving techniques, preparation shortcuts, and efficient cooking methods
        3. Tastier - suggest professional flavor enhancement techniques and tips to elevate the recipe

        ${dietaryContext}

        IMPORTANT: Provide ONLY the enhancement suggestions as a bulleted list. Do NOT include any introductory sentences like "Here are the enhancements" or "Below are suggestions". Start directly with the enhancement points.

        Format each suggestion as:
        - [Enhancement description]

        Provide 3-5 specific, practical suggestions that a home cook could implement.`
      },
      {
        role: 'user',
        content: `Please enhance this recipe:
        
        Title: ${title}
        
        Ingredients:
        ${ingredientsList}
        
        Instructions:
        ${instructions || 'No instructions provided'}
        
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

        // Only include lines that look like actual enhancement items
        return (line.includes('-') || /^\d+\./.test(trimmed) || line.includes('•'));
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
      .filter((line: string) => line.length > 10); // Filter out very short lines
    
    // Ensure we have at least some enhancements
    const finalEnhancements = enhancementLines.length > 0 
      ? enhancementLines 
      : enhancementText.split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.replace(/\*\*/g, ''))
          .slice(0, 5);
    
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