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
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="proteins">Proteins</TabsTrigger>
          <TabsTrigger value="vegetables">Veggies</TabsTrigger>
          <TabsTrigger value="fruits">Fruits</TabsTrigger>
          <TabsTrigger value="dairy">Dairy</TabsTrigger>
          <TabsTrigger value="grains">Grains</TabsTrigger>
          <TabsTrigger value="condiments">Condiments</TabsTrigger>
          <TabsTrigger value="herbs">Herbs/Spices</TabsTrigger>
        </TabsList>
        
        {Object.entries(ingredientsByCategory).map(([category, ingredients]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge 
                  key={ingredient}
                  variant="outline" 
                  className="px-3 py-1 cursor-pointer bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => onAddIngredient(ingredient)}
                >
                  <Plus className="h-3 w-3" />
                  {ingredient}
                </Badge>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 