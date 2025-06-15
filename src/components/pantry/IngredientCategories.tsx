'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface IngredientCategoriesProps {
  onAddIngredient: (ingredient: string) => void;
}

const ingredientsByCategory = {
  proteins: [
    'chicken', 'beef', 'pork', 'salmon', 'tuna', 'shrimp', 'tofu', 
    'eggs', 'turkey', 'lamb', 'beans', 'lentils', 'chickpeas'
  ],
  vegetables: [
    'onion', 'garlic', 'tomato', 'potato', 'carrot', 'bell pepper', 
    'broccoli', 'spinach', 'lettuce', 'cucumber', 'zucchini', 'mushroom',
    'corn', 'cauliflower', 'kale', 'cabbage', 'asparagus', 'green beans'
  ],
  fruits: [
    'apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry', 
    'blueberry', 'raspberry', 'pineapple', 'mango', 'avocado', 
    'peach', 'watermelon', 'grapes'
  ],
  dairy: [
    'milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 
    'cream cheese', 'parmesan', 'cheddar', 'mozzarella', 'feta'
  ],
  grains: [
    'rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'couscous', 
    'barley', 'tortilla', 'cereal', 'breadcrumbs'
  ],
  condiments: [
    'salt', 'pepper', 'olive oil', 'vegetable oil', 'vinegar', 'soy sauce', 
    'hot sauce', 'ketchup', 'mayonnaise', 'mustard', 'honey', 'maple syrup',
    'bbq sauce', 'worcestershire sauce', 'tahini'
  ],
  herbs: [
    'basil', 'parsley', 'cilantro', 'mint', 'rosemary', 'thyme', 
    'oregano', 'dill', 'sage', 'chives', 'bay leaf', 'cumin', 'paprika',
    'cinnamon', 'nutmeg', 'ginger', 'turmeric'
  ]
};

export function IngredientCategories({ onAddIngredient }: IngredientCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>('proteins');

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  return (
    <div className="mt-6">
      <h3 className="text-md font-medium mb-2">Quick Add Ingredients</h3>
      <Tabs defaultValue="proteins" value={activeCategory} onValueChange={handleCategoryChange}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4 h-auto p-1">
          <TabsTrigger value="proteins" className="text-xs sm:text-sm py-2 px-2 sm:px-3">Proteins</TabsTrigger>
          <TabsTrigger value="vegetables" className="text-xs sm:text-sm py-2 px-2 sm:px-3">Veggies</TabsTrigger>
          <TabsTrigger value="fruits" className="text-xs sm:text-sm py-2 px-2 sm:px-3">Fruits</TabsTrigger>
          <TabsTrigger value="dairy" className="text-xs sm:text-sm py-2 px-2 sm:px-3">Dairy</TabsTrigger>
          <TabsTrigger value="grains" className="text-xs sm:text-sm py-2 px-2 sm:px-3">Grains</TabsTrigger>
          <TabsTrigger value="condiments" className="text-xs sm:text-sm py-2 px-2 sm:px-3">Condiments</TabsTrigger>
        </TabsList>
        
        {Object.entries(ingredientsByCategory).map(([category, ingredients]) => (
          <TabsContent key={category} value={category} className="mt-2">
            <div className="flex flex-wrap gap-2 relative z-10">
              {ingredients.map((ingredient) => (
                <button
                  key={ingredient}
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent transition-all duration-200 cursor-pointer"
                  onClick={() => onAddIngredient(ingredient)}
                >
                  <Plus className="h-3 w-3 text-gray-500" />
                  <span className="relative z-20">{ingredient}</span>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 