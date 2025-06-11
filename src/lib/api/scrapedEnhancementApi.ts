import { createClient } from '@/lib/supabase/client';

export interface ScrapedEnhancement {
  id?: string;
  recipeId: number;
  enhancements: string[];
  sourceUrl?: string;
  scrapedAt?: Date;
}

export const scrapedEnhancementApi = {
  async getByRecipeId(recipeId: number): Promise<ScrapedEnhancement | null> {
    try {
      const supabase = createClient();
      
      // Convert recipeId to string since it's stored as text in the database
      const recipeIdStr = recipeId.toString();
      console.log('API DEBUG: Fetching enhancements for recipe ID:', recipeIdStr);
      
      // DIRECT QUERY: Get all unique enhancements for this recipe
      const { data: uniqueData, error: uniqueError } = await supabase
        .from('unique_scraped_enhancements')
        .select('enhancement, source, created_at')
        .eq('recipe_id', recipeIdStr)
        .order('created_at', { ascending: false });
      
      if (uniqueError) {
        console.error('Error fetching unique scraped enhancements:', uniqueError);
        // Fall back to the old table if there's an error with the new one
      } else if (uniqueData && uniqueData.length > 0) {
        console.log('API DEBUG: Found', uniqueData.length, 'unique enhancements');
        // Get source from the first entry (they should all have the same source)
        const sourceUrl = uniqueData[0].source;
        // Map the enhancements to an array of strings
        const enhancements = uniqueData.map(item => item.enhancement);
        
        // Additional deduplication just to be safe
        const uniqueEnhancements = [...new Set(enhancements)];
        console.log('API DEBUG: After additional deduplication:', uniqueEnhancements.length, 'enhancements');
        
        return {
          recipeId: parseInt(recipeIdStr),
          enhancements: uniqueEnhancements,
          sourceUrl,
          scrapedAt: uniqueData[0].created_at ? new Date(uniqueData[0].created_at) : undefined
        };
      } else {
        console.log('API DEBUG: No data in unique_scraped_enhancements, checking old table');
      }
      
      // If we reach here, we need to check the old table and manually deduplicate
      const { data, error } = await supabase
        .from('scraped_enhancements')
        .select('*')
        .eq('recipe_id', recipeIdStr)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching scraped enhancement:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log('API DEBUG: No data found in either table');
        return null;
      }
      
      console.log('API DEBUG: Found data in old table, deduplicating');
      // Ensure we deduplicate the enhancements from the old table
      const originalEnhancements = Array.isArray(data[0].enhancements) ? data[0].enhancements as string[] : [];
      const uniqueEnhancements = [...new Set(originalEnhancements)];
      console.log('API DEBUG: Old table had', originalEnhancements.length, 'enhancements, deduplicated to', uniqueEnhancements.length);
      
      return {
        id: data[0].id,
        recipeId: parseInt(data[0].recipe_id),
        enhancements: uniqueEnhancements,
        sourceUrl: data[0].source,
        scrapedAt: data[0].scraped_at ? new Date(data[0].scraped_at) : undefined
      };
    } catch (error) {
      console.error('Error fetching scraped enhancement:', error);
      return null;
    }
  },
  
  async storeEnhancement(enhancement: ScrapedEnhancement): Promise<boolean> {
    const supabase = createClient();
    const recipeIdStr = enhancement.recipeId.toString();
    
    try {
      // Store in the old table for backward compatibility
      const { error } = await supabase
        .from('scraped_enhancements')
        .upsert({
          recipe_id: recipeIdStr,
          enhancements: enhancement.enhancements,
          source: enhancement.sourceUrl || null
        });
      
      if (error) {
        console.error('Error storing scraped enhancement in old table:', error);
        // Continue anyway to try the new table
      }
      
      // Also store in the new unique_scraped_enhancements table
      // Use a transaction to ensure all or nothing
      const { error: batchError } = await supabase.rpc('batch_insert_unique_enhancements', {
        p_recipe_id: recipeIdStr,
        p_enhancements: enhancement.enhancements,
        p_source: enhancement.sourceUrl || null
      });
      
      if (batchError) {
        console.error('Error storing in unique_scraped_enhancements:', batchError);
        
        // Fall back to manual insertion if RPC fails
        let hasError = false;
        for (const enhancementText of enhancement.enhancements) {
          const { error: insertError } = await supabase
            .from('unique_scraped_enhancements')
            .upsert({
              recipe_id: recipeIdStr,
              enhancement: enhancementText,
              source: enhancement.sourceUrl || null
            });
          
          if (insertError) {
            console.error(`Error inserting enhancement "${enhancementText}":`, insertError);
            hasError = true;
          }
        }
        
        if (hasError) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in storeEnhancement:', error);
      return false;
    }
  }
};
