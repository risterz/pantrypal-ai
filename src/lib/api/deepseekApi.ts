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
  enhanceRecipe: async (recipe: RecipeDetail, userDietaryPreferences?: string[] | null): Promise<RecipeEnhancement> => {
    try {
      console.log('🚀 Starting DeepSeek API call for recipe:', recipe.id);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ DeepSeek API call timed out after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout

      // Make API call to our secure server-side route
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe,
          userDietaryPreferences
        }),
        signal: controller.signal
      });

      // Clear timeout if request completes
      clearTimeout(timeoutId);

      console.log('📡 DeepSeek API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ DeepSeek API error:', errorData);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const enhancement = await response.json();
      console.log('✅ DeepSeek API success, enhancements count:', enhancement.enhancements?.length || 0);
      return enhancement;
    } catch (error) {
      console.error('💥 Error generating DeepSeek recipe enhancements:', error);

      // Check if it's an abort error (timeout)
      if (error.name === 'AbortError') {
        console.log('🔄 Falling back to rule-based enhancements due to timeout');
      } else {
        console.log('🔄 Falling back to rule-based enhancements due to error:', error.message);
      }

      // Fall back to rule-based enhancements
      return fallbackEnhancements(recipe);
    }
  }
};

// Fallback to rule-based enhancements if the API call fails
function fallbackEnhancements(recipe: RecipeDetail): RecipeEnhancement {
  const { id, instructions, extendedIngredients } = recipe;
  const enhancements: string[] = [];

  // HEALTHIER ENHANCEMENTS (at least 3)
  enhancements.push("Healthier: Replace heavy cream with Greek yogurt to reduce calories by 60%");
  enhancements.push("Healthier: Use whole grain alternatives for pasta, rice, or bread for added fiber");
  enhancements.push("Healthier: Reduce sodium by using herbs and spices instead of salt for seasoning");

  // Check for frying methods and add specific healthier alternatives
  if (instructions.toLowerCase().includes('fry') ||
      instructions.toLowerCase().includes('sauté')) {
    enhancements.push("Healthier: Use an air fryer instead of pan-frying to reduce oil while maintaining texture");
  }

  // TIME-SAVING ENHANCEMENTS (at least 3)
  enhancements.push("Time-saving: Prepare ingredients in advance and use a pressure cooker to reduce cooking time by up to 70%");
  enhancements.push("Time-saving: Pre-chop vegetables and store them in the refrigerator for quick assembly");
  enhancements.push("Time-saving: Use pre-cooked proteins like rotisserie chicken to cut preparation time in half");

  // Check for slow-cooking methods and add time-saving alternatives
  if (instructions.toLowerCase().includes('simmer for') ||
      instructions.toLowerCase().includes('bake for') ||
      recipe.readyInMinutes > 30) {
    enhancements.push("Time-saving: Use an Instant Pot to achieve the same flavors in 1/3 of the time");
  }

  // FLAVOR ENHANCEMENTS (at least 3)
  enhancements.push("Flavor: Add fresh herbs in the last 2 minutes of cooking for maximum aroma and taste");
  enhancements.push("Flavor: Try adding a small amount of acid (lemon juice or vinegar) at the end to brighten flavors");
  enhancements.push("Flavor: Toast spices in a dry pan for 30 seconds before adding to enhance their flavor profile");

  // Check for specific ingredients and add targeted flavor enhancements
  if (extendedIngredients.some(i =>
      i.name.toLowerCase().includes('garlic'))) {
    enhancements.push("Flavor: Roast garlic beforehand for a sweeter, more complex flavor");
  }

  return {
    enhancementId: `fallback_${Date.now()}`,
    recipeId: id,
    enhancements,
    generatedAt: new Date()
  };
}