import { createClient } from '@/lib/supabase/client';

// Validation interfaces
export interface ValidationMetrics {
  similarity_score: number;
  relevance_score: number;
  quality_score: number;
  overall_score: number;
}

export interface CategoryAccuracy {
  healthier: {
    ai_count: number;
    human_count: number;
    matches: number;
    accuracy: number;
  };
  faster: {
    ai_count: number;
    human_count: number;
    matches: number;
    accuracy: number;
  };
  tastier: {
    ai_count: number;
    human_count: number;
    matches: number;
    accuracy: number;
  };
  other: {
    ai_count: number;
    human_count: number;
    matches: number;
    accuracy: number;
  };
}

export interface ValidationResult {
  enhancement_id: string;
  ai_enhancement: string;
  matched_human_enhancements: string[];
  similarity_score: number;
  relevance_score: number;
  quality_assessment: 'excellent' | 'good' | 'fair' | 'poor';
  category_match: boolean;
  notes?: string;
}

export interface EnhancementValidation {
  id?: string;
  recipe_id: string;
  ai_enhancements: string[];
  human_enhancements: string[];
  validation_results: ValidationResult[];
  overall_score: number;
  similarity_score: number;
  relevance_score: number;
  quality_score: number;
  category_accuracy: CategoryAccuracy;
  validated_by?: string;
  validation_notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Validation algorithms
export class EnhancementValidator {
  
  /**
   * Calculate similarity between two text strings using simple word overlap
   */
  private static calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Assess the quality of an enhancement based on length, specificity, and actionability
   */
  private static assessQuality(enhancement: string): number {
    let score = 0;
    
    // Length check (not too short, not too long)
    const wordCount = enhancement.split(/\s+/).length;
    if (wordCount >= 5 && wordCount <= 50) score += 0.3;
    
    // Specificity indicators
    const specificityKeywords = ['reduce', 'increase', 'substitute', 'add', 'remove', 'cook', 'bake', 'minutes', 'degrees', 'tablespoon', 'cup'];
    const hasSpecificity = specificityKeywords.some(keyword => enhancement.toLowerCase().includes(keyword));
    if (hasSpecificity) score += 0.4;
    
    // Actionability indicators
    const actionKeywords = ['try', 'use', 'replace', 'consider', 'opt for', 'instead of'];
    const hasAction = actionKeywords.some(keyword => enhancement.toLowerCase().includes(keyword));
    if (hasAction) score += 0.3;
    
    return Math.min(score, 1.0);
  }

  /**
   * Determine the category of an enhancement
   */
  private static categorizeEnhancement(enhancement: string): 'healthier' | 'faster' | 'tastier' | 'other' {
    const text = enhancement.toLowerCase();
    
    // Healthier keywords
    if (text.includes('healthy') || text.includes('nutrition') || text.includes('low fat') || 
        text.includes('whole grain') || text.includes('reduce oil') || text.includes('less salt')) {
      return 'healthier';
    }
    
    // Faster keywords
    if (text.includes('quick') || text.includes('fast') || text.includes('save time') || 
        text.includes('simultaneously') || text.includes('prep ahead')) {
      return 'faster';
    }
    
    // Tastier keywords
    if (text.includes('flavor') || text.includes('taste') || text.includes('seasoning') || 
        text.includes('spice') || text.includes('herb') || text.includes('delicious')) {
      return 'tastier';
    }
    
    return 'other';
  }

  /**
   * Validate AI enhancements against human scraped data
   */
  static validateEnhancements(
    recipeId: string,
    aiEnhancements: string[],
    humanEnhancements: string[]
  ): EnhancementValidation {
    const validationResults: ValidationResult[] = [];
    let totalSimilarity = 0;
    let totalRelevance = 0;
    let totalQuality = 0;

    // Initialize category tracking
    const categoryAccuracy: CategoryAccuracy = {
      healthier: { ai_count: 0, human_count: 0, matches: 0, accuracy: 0 },
      faster: { ai_count: 0, human_count: 0, matches: 0, accuracy: 0 },
      tastier: { ai_count: 0, human_count: 0, matches: 0, accuracy: 0 },
      other: { ai_count: 0, human_count: 0, matches: 0, accuracy: 0 }
    };

    // Count human enhancement categories
    humanEnhancements.forEach(enhancement => {
      const category = this.categorizeEnhancement(enhancement);
      categoryAccuracy[category].human_count++;
    });

    // Validate each AI enhancement
    aiEnhancements.forEach((aiEnhancement, index) => {
      const aiCategory = this.categorizeEnhancement(aiEnhancement);
      categoryAccuracy[aiCategory].ai_count++;

      // Find best matches in human enhancements
      const similarities = humanEnhancements.map(humanEnhancement => ({
        enhancement: humanEnhancement,
        similarity: this.calculateSimilarity(aiEnhancement, humanEnhancement),
        category: this.categorizeEnhancement(humanEnhancement)
      }));

      // Get top matches (similarity > 0.2)
      const matches = similarities
        .filter(s => s.similarity > 0.2)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

      const bestSimilarity = matches.length > 0 ? matches[0].similarity : 0;
      const qualityScore = this.assessQuality(aiEnhancement);
      
      // Check category match
      const categoryMatch = matches.some(m => m.category === aiCategory);
      if (categoryMatch) {
        categoryAccuracy[aiCategory].matches++;
      }

      // Relevance score based on having matches and category alignment
      const relevanceScore = (matches.length > 0 ? 0.6 : 0) + (categoryMatch ? 0.4 : 0);

      const result: ValidationResult = {
        enhancement_id: `ai-${index}`,
        ai_enhancement: aiEnhancement,
        matched_human_enhancements: matches.map(m => m.enhancement),
        similarity_score: bestSimilarity,
        relevance_score: relevanceScore,
        quality_assessment: qualityScore > 0.8 ? 'excellent' : 
                           qualityScore > 0.6 ? 'good' : 
                           qualityScore > 0.4 ? 'fair' : 'poor',
        category_match: categoryMatch
      };

      validationResults.push(result);
      totalSimilarity += bestSimilarity;
      totalRelevance += relevanceScore;
      totalQuality += qualityScore;
    });

    // Calculate category accuracies
    Object.keys(categoryAccuracy).forEach(category => {
      const cat = categoryAccuracy[category as keyof CategoryAccuracy];
      cat.accuracy = cat.ai_count > 0 ? cat.matches / cat.ai_count : 0;
    });

    // Calculate overall scores
    const count = aiEnhancements.length;
    const avgSimilarity = count > 0 ? totalSimilarity / count : 0;
    const avgRelevance = count > 0 ? totalRelevance / count : 0;
    const avgQuality = count > 0 ? totalQuality / count : 0;
    const overallScore = (avgSimilarity * 0.3 + avgRelevance * 0.4 + avgQuality * 0.3);

    return {
      recipe_id: recipeId,
      ai_enhancements: aiEnhancements,
      human_enhancements: humanEnhancements,
      validation_results: validationResults,
      overall_score: overallScore,
      similarity_score: avgSimilarity,
      relevance_score: avgRelevance,
      quality_score: avgQuality,
      category_accuracy: categoryAccuracy
    };
  }
}

// API functions
export const enhancementValidationApi = {
  /**
   * Run validation for a recipe and store results
   */
  async validateRecipe(
    recipeId: string,
    aiEnhancements: string[],
    humanEnhancements: string[],
    userId?: string
  ): Promise<EnhancementValidation> {
    const validation = EnhancementValidator.validateEnhancements(
      recipeId,
      aiEnhancements,
      humanEnhancements
    );

    const supabase = createClient();
    
    try {
      // Store validation results in database
      const { data, error } = await supabase
        .from('enhancement_validations')
        .upsert({
          recipe_id: recipeId,
          ai_enhancements: aiEnhancements,
          human_enhancements: humanEnhancements,
          validation_results: validation.validation_results,
          overall_score: validation.overall_score,
          similarity_score: validation.similarity_score,
          relevance_score: validation.relevance_score,
          quality_score: validation.quality_score,
          category_accuracy: validation.category_accuracy,
          validated_by: userId || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing validation results:', error);
        throw error;
      }

      return {
        ...validation,
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Failed to store validation:', error);
      // Return validation results even if storage fails
      return validation;
    }
  },

  /**
   * Get existing validation results for a recipe
   */
  async getValidationByRecipeId(recipeId: string): Promise<EnhancementValidation | null> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('enhancement_validations')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching validation:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        recipe_id: data.recipe_id,
        ai_enhancements: data.ai_enhancements as string[],
        human_enhancements: data.human_enhancements as string[],
        validation_results: data.validation_results as ValidationResult[],
        overall_score: data.overall_score,
        similarity_score: data.similarity_score,
        relevance_score: data.relevance_score,
        quality_score: data.quality_score,
        category_accuracy: data.category_accuracy as CategoryAccuracy,
        validated_by: data.validated_by,
        validation_notes: data.validation_notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Failed to fetch validation:', error);
      return null;
    }
  }
};
