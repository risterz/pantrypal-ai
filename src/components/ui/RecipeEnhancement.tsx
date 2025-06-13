import React, { useState } from 'react';
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
      
      // Check if enhancement contains keywords related to health
      if (lowerEnhancement.includes('health') || 
          lowerEnhancement.includes('calorie') || 
          lowerEnhancement.includes('nutrition') || 
          lowerEnhancement.includes('fat') || 
          lowerEnhancement.includes('sugar') || 
          lowerEnhancement.includes('salt') || 
          lowerEnhancement.includes('sodium') ||
          lowerEnhancement.includes('substitute') ||
          lowerEnhancement.includes('oil') ||
          lowerEnhancement.includes('leaner')) {
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
               lowerEnhancement.includes('microwave')) {
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
               lowerEnhancement.includes('texture')) {
        categorized.tastier.push(enhancement);
      }
      // If no category matches, put in other
      else {
        categorized.other.push(enhancement);
      }
    });
    
    return categorized;
  };
  
  // Generate or use provided enhancements
  const generateEnhancements = () => {
    // If aiEnhancements are provided, use those instead of generating new ones
    if (aiEnhancements && aiEnhancements.length > 0) {
      // Clean up enhancements by removing ** markers and introductory text
      return aiEnhancements.map(enhancement => {
        // Remove any "Here are..." introductory text
        let cleaned = enhancement.replace(/^Here are.+to make it.+:/, '').trim();
        
        // Remove asterisks
        cleaned = cleaned.replace(/\*\*/g, '');
        
        return cleaned;
      });
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
    
    // Check for salt usage
    const hasSalt = ingredients.some(ingredient => 
      ingredient.toLowerCase().includes('salt')
    );
    
    if (hasSalt) {
      enhancements.push("Try using herbs or a salt substitute to enhance flavor while reducing sodium content.");
    }
    
    // Check for long cooking times
    const hasLongCooking = instructions.some(instruction => 
      instruction.toLowerCase().includes('minute') ||
      instruction.toLowerCase().includes('hour')
    );
    
    if (hasLongCooking) {
      enhancements.push("To save time and energy, consider using a pressure cooker for ingredients that require long cooking times.");
    }
    
    // Check for sugar usage
    const hasSugar = ingredients.some(ingredient => 
      ingredient.toLowerCase().includes('sugar') || 
      ingredient.toLowerCase().includes('syrup')
    );
    
    if (hasSugar) {
      enhancements.push("Try natural sweeteners like honey, maple syrup, or stevia as healthier alternatives to refined sugar.");
    }
    
    // Default enhancement if none of the above apply
    if (enhancements.length === 0) {
      enhancements.push("Try preparing ingredients in advance to make the cooking process more efficient.");
      enhancements.push("Consider batch cooking and freezing portions for future meals to save time.");
    }
    
    return enhancements;
  };
  
  const enhancements = generateEnhancements();
  
  // Filter out any empty enhancements
  const filteredEnhancements = enhancements.filter(enhancement => 
    enhancement && enhancement.trim().length > 0
  );
  
  // Use provided categorized enhancements or generate them from the filtered enhancements
  const finalCategorizedEnhancements = categorizedEnhancements || categorizeEnhancements(filteredEnhancements);

  // Check if we have any enhancements at all
  const hasEnhancements = finalCategorizedEnhancements && Object.values(finalCategorizedEnhancements).some(category => category.length > 0);

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
      <Card className={`mb-4 ${categoryColor} border-2`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-lg font-semibold">{title}</h3>
              <Badge variant="secondary" className="ml-2">
                {enhancements.length} tip{enhancements.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCategory(categoryKey)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {enhancements.map((enhancement, index) => (
                <div
                  key={`${categoryKey}-${index}`}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    appliedEnhancements.has(enhancement)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEnhancement(enhancement)}
                        className={`p-1 h-6 w-6 rounded-full ${
                          appliedEnhancements.has(enhancement)
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <span className={`text-sm ${
                        appliedEnhancements.has(enhancement)
                          ? 'text-green-800 font-medium'
                          : 'text-gray-700'
                      }`}>
                        {enhancement}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEnhancement(enhancement)}
                      className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-3 w-3" />
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
  
  const totalEnhancements = Object.values(finalCategorizedEnhancements).flat().length;
  const appliedCount = appliedEnhancements.size;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-700">AI Enhancement Suggestions</CardTitle>
              <CardDescription className="text-blue-600">
                Smart ways to improve this recipe • {totalEnhancements} suggestions
              </CardDescription>
            </div>
          </div>
          {hasEnhancements && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                {appliedCount}/{totalEnhancements} applied
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={shareAllEnhancements}
                className="bg-white hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasEnhancements ? (
          <div className="space-y-4">
            {renderCategory("💚 Healthier Options", finalCategorizedEnhancements.healthier, <Heart className="h-5 w-5 text-red-500" />, "healthier")}
            {renderCategory("⚡ Time-Saving Tips", finalCategorizedEnhancements.faster, <Clock className="h-5 w-5 text-blue-500" />, "faster")}
            {renderCategory("✨ Flavor Boosters", finalCategorizedEnhancements.tastier, <Zap className="h-5 w-5 text-yellow-500" />, "tastier")}
            {finalCategorizedEnhancements.other.length > 0 && renderCategory("🔧 Other Tips", finalCategorizedEnhancements.other, <ChefHat className="h-5 w-5 text-purple-500" />, "other")}

            {appliedCount > 0 && (
              <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Applied Enhancements</h4>
                </div>
                <p className="text-green-700 text-sm">
                  Great job! You've applied {appliedCount} enhancement{appliedCount !== 1 ? 's' : ''} to improve this recipe.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No specific enhancements available</p>
            <p className="text-gray-400 mt-2">This recipe looks great as is, or try a different recipe for more suggestions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}