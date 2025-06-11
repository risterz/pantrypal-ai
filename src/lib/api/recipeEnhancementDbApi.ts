import { createClient } from '@/lib/supabase/client';
import { RecipeEnhancement } from './recipeEnhancementApi';

// Define the categorized enhancements interface
export interface CategorizedEnhancements {
  healthier: string[];
  faster: string[];
  tastier: string[];
  other: string[];
}

// Extend the RecipeEnhancement interface to include categorized enhancements
export interface EnhancementWithCategories extends RecipeEnhancement {
  categorizedEnhancements?: CategorizedEnhancements;
}

export const recipeEnhancementDbApi = {
  /**
   * Store recipe enhancements in the database
   * @param enhancement The enhancement data to store
   * @returns The stored enhancement data
   */
  storeEnhancement: async (enhancement: RecipeEnhancement | EnhancementWithCategories): Promise<EnhancementWithCategories> => {
    const supabase = createClient();
    
    try {
      // Check if an enhancement already exists for this recipe
      const { data: existingData } = await supabase
        .from('recipe_enhancements')
        .select('id')
        .eq('recipe_id', enhancement.recipeId.toString())
        .maybeSingle();
      
      let result;
      
      // Check if we have categorized enhancements
      const enhancementWithCategories = enhancement as EnhancementWithCategories;
      const categorizedEnhancements = enhancementWithCategories.categorizedEnhancements;
      
      if (existingData) {
        // Update existing enhancement
        const { data, error } = await supabase
          .from('recipe_enhancements')
          .update({
            enhancements: enhancement.enhancements,
            categorized_enhancements: categorizedEnhancements,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating recipe enhancement:', error);
          throw error;
        }
        
        result = data;
      } else {
        // Insert new enhancement
        const { data, error } = await supabase
          .from('recipe_enhancements')
          .insert({
            recipe_id: enhancement.recipeId.toString(),
            enhancements: enhancement.enhancements,
            categorized_enhancements: categorizedEnhancements,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error storing recipe enhancement:', error);
          throw error;
        }
        
        result = data;
      }
      
      return {
        enhancementId: result.id,
        recipeId: parseInt(result.recipe_id),
        enhancements: result.enhancements,
        categorizedEnhancements: result.categorized_enhancements,
        generatedAt: new Date(result.created_at)
      };
    } catch (error) {
      console.error('Failed to store enhancement in database:', error);
      throw error;
    }
  },
  
  /**
   * Check if enhancements already exist for a recipe
   * @param recipeId The recipe ID to check
   * @returns The existing enhancement data or null if none exists
   */
  getEnhancementByRecipeId: async (recipeId: number): Promise<EnhancementWithCategories | null> => {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('recipe_enhancements')
        .select('*')
        .eq('recipe_id', recipeId.toString())
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching recipe enhancement:', error);
        throw error;
      }
      
      if (!data) return null;
      
      // If we have categorized enhancements, include them in the result
      return {
        enhancementId: data.id,
        recipeId: parseInt(data.recipe_id),
        enhancements: data.enhancements,
        categorizedEnhancements: data.categorized_enhancements,
        generatedAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Failed to fetch enhancement from database:', error);
      throw error;
    }
  }
};
