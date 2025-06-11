import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Heart, Clock, Zap } from 'lucide-react';

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
  
  // Function to render a category section
  const renderCategory = (title: string, enhancements: string[], icon: React.ReactNode) => {
    if (enhancements.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="text-md font-semibold text-blue-700">{title}</h3>
        </div>
        <ul className="space-y-2 pl-7">
          {enhancements.map((enhancement, index) => (
            <li key={`${title.toLowerCase()}-${index}`} className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span>{enhancement}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg text-blue-700">AI Enhancement Suggestions</CardTitle>
        </div>
        <CardDescription>Smart ways to improve this recipe</CardDescription>
      </CardHeader>
      <CardContent>
        {hasEnhancements ? (
          <div className="space-y-4">
            {renderCategory("Healthier", finalCategorizedEnhancements.healthier, <Heart className="h-4 w-4 text-red-500" />)}
            {renderCategory("Faster", finalCategorizedEnhancements.faster, <Clock className="h-4 w-4 text-blue-500" />)}
            {renderCategory("Tastier", finalCategorizedEnhancements.tastier, <Zap className="h-4 w-4 text-yellow-500" />)}
            {finalCategorizedEnhancements.other.length > 0 && renderCategory("Other Tips", finalCategorizedEnhancements.other, <Lightbulb className="h-4 w-4 text-purple-500" />)}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No specific enhancements available for this recipe.</p>
            <p className="text-gray-500 mt-2">Try a different recipe or check back later.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}