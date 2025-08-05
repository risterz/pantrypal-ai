import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Heart, Clock, Zap, ChefHat, Sparkles, CheckCircle, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { CategorizedEnhancements } from '@/lib/api/recipeEnhancementDbApi';

interface RecipeEnhancementProps {
  recipeTitle: string;
  instructions: string[];
  ingredients: string[];
  aiEnhancements?: string[]; // Added new prop for externally provided AI enhancements
  categorizedEnhancements?: CategorizedEnhancements | null; // Added new prop for categorized enhancements
}

export function RecipeEnhancement({
  recipeTitle,
  instructions,
  ingredients,
  aiEnhancements,
  categorizedEnhancements
}: RecipeEnhancementProps) {
  const [appliedEnhancements, setAppliedEnhancements] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['healthier', 'faster', 'tastier']));
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleEnhancement = (enhancement: string) => {
    const newApplied = new Set(appliedEnhancements);
    if (newApplied.has(enhancement)) {
      newApplied.delete(enhancement);
      toast.success('Enhancement unmarked');
    } else {
      newApplied.add(enhancement);
      toast.success('Enhancement marked as applied!');
    }
    setAppliedEnhancements(newApplied);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const copyEnhancement = (enhancement: string) => {
    navigator.clipboard.writeText(enhancement);
    toast.success('Enhancement copied to clipboard!');
  };


  // This function categorizes enhancements into healthier, faster, tastier, and other
  const categorizeEnhancements = (enhancements: string[]): CategorizedEnhancements => {
    const categorized: CategorizedEnhancements = {
      healthier: [],
      faster: [],
      tastier: [],
      other: []
    };
    
    enhancements.forEach(enhancement => {
      const lowerEnhancement = enhancement.toLowerCase();
      
      // First check for explicit prefixes from the new AI format
      if (lowerEnhancement.startsWith('healthier:') || lowerEnhancement.includes('healthier:')) {
        categorized.healthier.push(enhancement.replace(/^healthier:\s*/i, ''));
      }
      else if (lowerEnhancement.startsWith('time-saving:') || lowerEnhancement.includes('time-saving:')) {
        categorized.faster.push(enhancement.replace(/^time-saving:\s*/i, ''));
      }
      else if (lowerEnhancement.startsWith('flavor:') || lowerEnhancement.includes('flavor:')) {
        categorized.tastier.push(enhancement.replace(/^flavor:\s*/i, ''));
      }
      // Fallback to keyword-based categorization for backward compatibility
      else if (lowerEnhancement.includes('health') || 
          lowerEnhancement.includes('calorie') || 
          lowerEnhancement.includes('nutrition') || 
          lowerEnhancement.includes('fat') || 
          lowerEnhancement.includes('sugar') || 
          lowerEnhancement.includes('salt') || 
          lowerEnhancement.includes('sodium') ||
          lowerEnhancement.includes('substitute') ||
          lowerEnhancement.includes('oil') ||
          lowerEnhancement.includes('leaner') ||
          lowerEnhancement.includes('greek yogurt') ||
          lowerEnhancement.includes('whole grain') ||
          lowerEnhancement.includes('reduce') ||
          lowerEnhancement.includes('air fry')) {
        categorized.healthier.push(enhancement);
      }
      // Check if enhancement contains keywords related to time-saving
      else if (lowerEnhancement.includes('time') || 
               lowerEnhancement.includes('quick') || 
               lowerEnhancement.includes('fast') || 
               lowerEnhancement.includes('efficient') || 
               lowerEnhancement.includes('prep') || 
               lowerEnhancement.includes('prepare') ||
               lowerEnhancement.includes('pressure cooker') ||
               lowerEnhancement.includes('instant pot') ||
               lowerEnhancement.includes('microwave') ||
               lowerEnhancement.includes('ahead') ||
               lowerEnhancement.includes('batch') ||
               lowerEnhancement.includes('shortcut')) {
        categorized.faster.push(enhancement);
      }
      // Check if enhancement contains keywords related to flavor
      else if (lowerEnhancement.includes('flavor') || 
               lowerEnhancement.includes('taste') || 
               lowerEnhancement.includes('delicious') || 
               lowerEnhancement.includes('seasoning') || 
               lowerEnhancement.includes('herb') || 
               lowerEnhancement.includes('spice') ||
               lowerEnhancement.includes('aroma') ||
               lowerEnhancement.includes('texture') ||
               lowerEnhancement.includes('garlic') ||
               lowerEnhancement.includes('lemon') ||
               lowerEnhancement.includes('fresh') ||
               lowerEnhancement.includes('season')) {
        categorized.tastier.push(enhancement);
      }
      // If no category matches, put in other
      else {
        categorized.other.push(enhancement);
      }
    });

    // Ensure minimum enhancements per category by redistributing from 'other'
    const ensureMinimumEnhancements = () => {
      const minPerCategory = 2; // Minimum 2 per category
      
      // If any category has fewer than minimum, try to redistribute from 'other'
      if (categorized.healthier.length < minPerCategory && categorized.other.length > 0) {
        const needed = minPerCategory - categorized.healthier.length;
        const moved = categorized.other.splice(0, Math.min(needed, categorized.other.length));
        categorized.healthier.push(...moved);
      }
      
      if (categorized.faster.length < minPerCategory && categorized.other.length > 0) {
        const needed = minPerCategory - categorized.faster.length;
        const moved = categorized.other.splice(0, Math.min(needed, categorized.other.length));
        categorized.faster.push(...moved);
      }
      
      if (categorized.tastier.length < minPerCategory && categorized.other.length > 0) {
        const needed = minPerCategory - categorized.tastier.length;
        const moved = categorized.other.splice(0, Math.min(needed, categorized.other.length));
        categorized.tastier.push(...moved);
      }
    };

    ensureMinimumEnhancements();
    
    return categorized;
  };
  
  // Memoize enhancement generation to prevent hydration issues
  const processedEnhancements = useMemo(() => {
    // If aiEnhancements are provided, use those instead of generating new ones
    if (aiEnhancements && aiEnhancements.length > 0) {
      // Clean up enhancements by removing ** markers and introductory text
      return aiEnhancements.map(enhancement => {
        // Remove any introductory sentences
        let cleaned = enhancement
          .replace(/^Here are.+?:/i, '')
          .replace(/^Here is.+?:/i, '')
          .replace(/^Below are.+?:/i, '')
          .replace(/^I suggest.+?:/i, '')
          .replace(/^These are.+?:/i, '')
          .replace(/^.+enhancements for.+?:/i, '')
          .replace(/^.+suggestions for.+?:/i, '')
          .replace(/^.+ways to enhance.+?:/i, '')
          .replace(/^.+improvements for.+?:/i, '')
          .trim();

        // Remove asterisks and other formatting
        cleaned = cleaned.replace(/\*\*/g, '');

        // Remove bullet points if they exist at the start
        cleaned = cleaned.replace(/^[•\-\*\d\.]+\s*/, '');

        return cleaned.trim();
      }).filter(enhancement => enhancement.length > 10); // Filter out very short enhancements
    }
    
    const enhancements = [];
    
    // Check if frying is mentioned in any instruction
    const hasFrying = instructions.some(instruction => 
      instruction.toLowerCase().includes('fry') || 
      instruction.toLowerCase().includes('sauté') || 
      instruction.toLowerCase().includes('sautee')
    );
    
    if (hasFrying) {
      enhancements.push("Consider using an air fryer instead of traditional frying to reduce oil and make the dish healthier while maintaining similar texture.");
    }
    
    // Check for high-fat ingredients
    const hasHighFatIngredients = ingredients.some(ingredient => 
      ingredient.toLowerCase().includes('cream') || 
      ingredient.toLowerCase().includes('butter') ||
      ingredient.toLowerCase().includes('oil')
    );
    
    if (hasHighFatIngredients) {
      enhancements.push("For a healthier version: Replace heavy cream with Greek yogurt or substitute butter with olive oil to reduce saturated fat.");
    }
    
    // Check for long cooking times in instructions
    const hasLongCooking = instructions.some(instruction => 
      instruction.toLowerCase().includes('simmer for') || 
      instruction.toLowerCase().includes('bake for') ||
      instruction.toLowerCase().includes('cook for')
    );
    
    if (hasLongCooking) {
      enhancements.push("Speed up cooking: Use a pressure cooker or Instant Pot to reduce cooking time by up to 70% while maintaining flavor.");
    }
    
    // General flavor enhancement
    enhancements.push("Enhance flavor: Add fresh herbs like basil, parsley, or cilantro in the last few minutes of cooking for a burst of fresh flavor.");
    
    // Time-saving tip
    enhancements.push("Save time: Prep ingredients the night before and store them in the refrigerator for quick assembly the next day.");
    
    // Healthier cooking method
    enhancements.push("For better nutrition: Add extra vegetables like spinach, bell peppers, or zucchini to increase fiber and vitamins.");
    
    // Batch cooking suggestion
    if (instructions.length > 3) {
      enhancements.push("Consider batch cooking and freezing portions for future meals to save time.");
    }
    
    return enhancements;
  }, [aiEnhancements, instructions, ingredients]);

  // Memoize categorization to prevent hydration issues
  const finalCategorizedEnhancements = useMemo(() => {
    if (categorizedEnhancements) {
      return categorizedEnhancements;
    }
    
    // Filter out any empty enhancements
    const filteredEnhancements = processedEnhancements.filter(enhancement => 
      enhancement && enhancement.trim().length > 0
    );
    
    return categorizeEnhancements(filteredEnhancements);
  }, [categorizedEnhancements, processedEnhancements]);

  // Check if we have any enhancements at all
  const hasEnhancements = finalCategorizedEnhancements && Object.values(finalCategorizedEnhancements).some(category => category.length > 0);

  // Prevent hydration mismatch by showing loading state until client-side
  if (!isClient) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-blue-100 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-blue-100 rounded"></div>
            <div className="h-20 bg-blue-100 rounded"></div>
            <div className="h-20 bg-blue-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const shareAllEnhancements = () => {
    const allEnhancements = [
      ...finalCategorizedEnhancements.healthier,
      ...finalCategorizedEnhancements.faster,
      ...finalCategorizedEnhancements.tastier,
      ...finalCategorizedEnhancements.other
    ];
    const text = `AI Enhancement Suggestions for ${recipeTitle}:\n\n${allEnhancements.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('All enhancements copied to clipboard!');
  };
  
  // Function to render a category section with interactive features
  const renderCategory = (title: string, enhancements: string[], icon: React.ReactNode, categoryKey: string) => {
    if (enhancements.length === 0) return null;

    const isExpanded = expandedCategories.has(categoryKey);
    const categoryColor = {
      healthier: 'border-red-200 bg-red-50',
      faster: 'border-blue-200 bg-blue-50',
      tastier: 'border-yellow-200 bg-yellow-50',
      other: 'border-purple-200 bg-purple-50'
    }[categoryKey] || 'border-gray-200 bg-gray-50';

    return (
      <Card className={`mb-3 sm:mb-4 ${categoryColor} border-2`}>
        <CardHeader className="pb-2 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {icon}
              </div>
              <h3 className="text-sm sm:text-lg font-semibold truncate">{title}</h3>
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs flex-shrink-0">
                {enhancements.length * 10}%
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCategory(categoryKey)}
              className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="space-y-2 sm:space-y-3">
              {enhancements.map((enhancement, index) => (
                <div
                  key={`${categoryKey}-${index}`}
                  className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
                    appliedEnhancements.has(enhancement)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex items-start gap-1 sm:gap-2 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEnhancement(enhancement)}
                        className={`p-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex-shrink-0 ${
                          appliedEnhancements.has(enhancement)
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1 min-w-0">
                        {enhancement}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEnhancement(enhancement)}
                      className="text-gray-400 hover:text-gray-600 p-1 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const totalEnhancements = finalCategorizedEnhancements.healthier.length + 
                           finalCategorizedEnhancements.faster.length + 
                           finalCategorizedEnhancements.tastier.length + 
                           finalCategorizedEnhancements.other.length;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-xl text-blue-700 truncate">AI Enhancement Suggestions</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-blue-600">
                Smart ways to improve this recipe • {totalEnhancements * 10}% enhancement score
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Badge variant="outline" className="text-xs">
              {appliedEnhancements.size}/{totalEnhancements} applied
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareAllEnhancements}
              className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        {hasEnhancements ? (
          <div className="space-y-3 sm:space-y-4">
            {renderCategory(`💚 Healthier ${finalCategorizedEnhancements.healthier.length * 10}%`, finalCategorizedEnhancements.healthier, <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />, "healthier")}
            {renderCategory(`⚡ Time-Saving ${finalCategorizedEnhancements.faster.length * 10}%`, finalCategorizedEnhancements.faster, <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />, "faster")}
            {renderCategory(`✨ Flavor Boosters ${finalCategorizedEnhancements.tastier.length * 10}%`, finalCategorizedEnhancements.tastier, <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />, "tastier")}
            {finalCategorizedEnhancements.other.length > 0 && renderCategory(`🔧 Other Tips ${finalCategorizedEnhancements.other.length * 10}%`, finalCategorizedEnhancements.other, <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />, "other")}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 mb-2">No enhancements available for this recipe yet.</p>
            <p className="text-xs sm:text-sm text-gray-500">Try generating AI suggestions or check back later!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}