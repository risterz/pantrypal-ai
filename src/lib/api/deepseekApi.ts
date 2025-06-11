import { RecipeDetail } from './recipeApi';
import { RecipeEnhancement } from './recipeEnhancementApi';

// Note: DeepSeek API calls should be moved to server-side API routes for security
// This client-side implementation is for development only
const DEEPSEEK_API_URL = '/api/deepseek/enhance'; // Use internal API route instead

interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const deepseekApi = {
  enhanceRecipe: async (recipe: RecipeDetail): Promise<RecipeEnhancement> => {
    try {
      // Make API call to our secure server-side route
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('DeepSeek API error:', errorData);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const enhancement = await response.json();
      return enhancement;
    } catch (error) {
      console.error('Error generating DeepSeek recipe enhancements:', error);
      // Fall back to rule-based enhancements
      return fallbackEnhancements(recipe);
    }
  }
};

// Fallback to rule-based enhancements if the API call fails
function fallbackEnhancements(recipe: RecipeDetail): RecipeEnhancement {
  const { id, instructions, extendedIngredients } = recipe;
  const enhancements: string[] = [];
  
  // Check for frying methods
  if (instructions.toLowerCase().includes('fry') || 
      instructions.toLowerCase().includes('sauté')) {
    enhancements.push(
      "For a healthier version: Use an air fryer instead of pan-frying to reduce oil while maintaining texture."
    );
  }
  
  // Check for cream or high-fat dairy
  if (extendedIngredients.some(i => 
    i.name.toLowerCase().includes('cream') || 
    i.name.toLowerCase().includes('butter'))) {
    enhancements.push(
      "Substitute heavy cream with Greek yogurt or coconut milk for a lighter version with less saturated fat."
    );
  }
  
  // Check for long cooking times
  if (instructions.toLowerCase().includes('simmer for') || 
      instructions.toLowerCase().includes('bake for') ||
      recipe.readyInMinutes > 30) {
    enhancements.push(
      "Speed up cooking: Prepare ingredients in advance and use a pressure cooker to reduce cooking time by up to 70%."
    );
  }
  
  // General flavor enhancement suggestions
  enhancements.push(
    "Enhance flavor: Try adding a small amount of acid (lemon juice or vinegar) at the end to brighten flavors."
  );
  
  return {
    enhancementId: `fallback_${Date.now()}`,
    recipeId: id,
    enhancements,
    generatedAt: new Date()
  };
} 