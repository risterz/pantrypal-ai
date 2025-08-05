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

  const dietaryInstructions = preferences.map(pref => {
    switch (pref.toLowerCase()) {
      case 'vegetarian':
        return 'Focus on plant-based alternatives and avoid suggesting meat-based enhancements.';
      case 'vegan':
        return 'Ensure all suggestions are completely plant-based, avoiding dairy, eggs, and all animal products.';
      case 'gluten-free':
        return 'Suggest gluten-free alternatives for wheat, barley, rye, and other gluten-containing ingredients.';
      case 'keto':
        return 'Prioritize low-carb, high-fat alternatives and avoid suggesting high-carb ingredients.';
      case 'paleo':
        return 'Focus on whole foods and avoid processed ingredients, grains, legumes, and dairy.';
      case 'dairy-free':
        return 'Suggest dairy-free alternatives for milk, cheese, butter, and other dairy products.';
      case 'low-sodium':
        return 'Emphasize herbs, spices, and other flavor enhancers instead of salt-based seasonings.';
      case 'low-sugar':
        return 'Avoid suggesting added sugars and focus on natural sweeteners or sugar reduction techniques.';
      default:
        return `Consider ${pref} dietary preferences in your suggestions.`;
    }
  }).join(' ');

  return `
DIETARY PREFERENCES: The user follows these dietary preferences: ${preferences.join(', ')}.
${dietaryInstructions}
Please ensure all enhancement suggestions align with these dietary requirements.`;
}

export async function POST(request: NextRequest) {
  try {
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { recipe, userDietaryPreferences } = body;

    if (!recipe || !recipe.id) {
      return NextResponse.json(
        { error: 'Recipe data is required' },
        { status: 400 }
      );
    }

    const { id, title, instructions, extendedIngredients } = recipe as RecipeDetail;

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
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid DeepSeek API response structure:', data);
      return NextResponse.json(
        { error: 'Invalid API response structure' },
        { status: 500 }
      );
    }
    
    const enhancementText = data.choices[0].message.content;
    
    if (!enhancementText || enhancementText.trim().length === 0) {
      console.error('Empty enhancement text from DeepSeek API');
      return NextResponse.json(
        { error: 'Empty response from AI' },
        { status: 500 }
      );
    }
    
    // Process the enhancement text to extract individual enhancements
    const enhancementLines = enhancementText
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .filter((line: string) => {
        // Filter out common introductory phrases
        const lowerLine = line.toLowerCase();
        return !lowerLine.startsWith('here are') &&
               !lowerLine.startsWith('below are') &&
               !lowerLine.startsWith('i suggest') &&
               !lowerLine.startsWith('you can') &&
               !lowerLine.includes('enhancement') && 
               !lowerLine.includes('suggestion') &&
               line.length > 20; // Filter out very short lines
      })
      .map((line: string) => {
        // Clean up the line by removing bullet points and extra formatting
        return line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
      })
      .filter((line: string) => line.length > 10); // Final filter for meaningful content
    
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