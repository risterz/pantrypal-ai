# Recipe Enhancement System Flow Documentation

## Overview

This document outlines the complete flow of how recipe enhancements are generated and managed in the PantryPal AI application using the DeepSeek API. The system is designed to provide users with AI-generated suggestions to make recipes healthier, faster to prepare, and tastier.

## Enhancement Flow Diagram

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│                 │     │                   │     │                 │
│  User visits    │────▶│  System checks    │────▶│ If enhancements │
│  recipe page    │     │  for existing     │     │ exist, display  │
│                 │     │  enhancements     │     │ from database   │
└─────────────────┘     └───────────────────┘     └─────────────────┘
                                 │                          ▲
                                 │ No existing              │
                                 │ enhancements             │
                                 ▼                          │
                        ┌───────────────────┐               │
                        │                   │               │
                        │  Generate new     │               │
                        │  enhancements     │               │
                        │  with DeepSeek    │               │
                        │                   │               │
                        └───────────────────┘               │
                                 │                          │
                                 │                          │
                                 ▼                          │
                        ┌───────────────────┐               │
                        │                   │               │
                        │  Store in         │───────────────┘
                        │  database         │
                        │                   │
                        └───────────────────┘
```

## Detailed Flow Description

### 1. Initial Request
When a user visits a recipe detail page, the application initiates the enhancement process:

```javascript
// In src/app/recipes/[id]/page.tsx
useEffect(() => {
  async function fetchData() {
    // ...
    const recipeData = await recipeApi.getRecipeById(recipeId);
    setRecipe(recipeData);

    // Load enhancements once the recipe is loaded
    if (recipeData) {
      fetchEnhancements(recipeData);
    }
    // ...
  }
  // ...
}, [recipeId, authChecked, router]);
```

### 2. Check for Existing Enhancements
The system first checks if enhancements already exist for this recipe in the database:

```javascript
// In fetchEnhancements function
const existingEnhancements = await recipeEnhancementDbApi.getEnhancementByRecipeId(recipeData.id);
    
if (existingEnhancements) {
  // Use the stored enhancements from the database
  setEnhancements(existingEnhancements.enhancements);
  
  // If we have categorized enhancements, use those too
  if (existingEnhancements.categorizedEnhancements) {
    setCategorizedEnhancements(existingEnhancements.categorizedEnhancements);
  }
  
  return; // Exit early if enhancements already exist
}
```

### 3. Generate New Enhancements with DeepSeek API
If no existing enhancements are found, the system generates new ones using the DeepSeek API:

```javascript
// Generate enhancements using DeepSeek API
const deepseekEnhancements = await deepseekApi.enhanceRecipe(recipeData);
```

The DeepSeek API integration works as follows:

```javascript
// In src/lib/api/deepseekApi.ts
enhanceRecipe: async (recipe: RecipeDetail): Promise<RecipeEnhancement> => {
  // Extract recipe details
  const { id, title, instructions, extendedIngredients } = recipe;
  
  // Format ingredients list
  const ingredientsList = extendedIngredients
    .map(ingredient => ingredient.original)
    .join('\n');
  
  // Create prompt for DeepSeek
  const messages = [
    {
      role: 'system',
      content: 'You are a professional chef and nutritionist...'
    },
    {
      role: 'user',
      content: `Please enhance this recipe: 
      Title: ${title}
      Ingredients: ${ingredientsList}
      Instructions: ${instructions}`
    }
  ];
  
  // Make API call to DeepSeek
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: 1000,
      temperature: 0.7
    })
  });
  
  // Process response and extract enhancements
  // ...
}
```

### 4. Store Enhancements in Database
After generating the enhancements, they are stored in the Supabase database for future use:

```javascript
// Store the generated enhancements in the database
await recipeEnhancementDbApi.storeEnhancement(deepseekEnhancements);
```

The storage function works as follows:

```javascript
// In src/lib/api/recipeEnhancementDbApi.ts
storeEnhancement: async (enhancement: RecipeEnhancement | EnhancementWithCategories): Promise<EnhancementWithCategories> => {
  const supabase = createClient();
  
  // Check if an enhancement already exists for this recipe
  const { data: existingData } = await supabase
    .from('recipe_enhancements')
    .select('id')
    .eq('recipe_id', enhancement.recipeId.toString())
    .maybeSingle();
  
  // Either update existing enhancement or insert new one
  if (existingData) {
    // Update existing enhancement
    // ...
  } else {
    // Insert new enhancement
    // ...
  }
  
  // Return the stored enhancement
}
```

### 5. Display Enhancements to User
Finally, the enhancements are displayed to the user through the RecipeEnhancement component:

```jsx
<RecipeEnhancementCard
  recipeTitle={recipe.title}
  instructions={recipe.analyzedInstructions[0]?.steps.map(step => step.step) || []}
  ingredients={recipe.extendedIngredients.map(ing => ing.original)}
  aiEnhancements={enhancements}
  categorizedEnhancements={categorizedEnhancements}
/>
```

The component categorizes the enhancements into:
- Healthier options
- Faster preparation methods
- Tastier variations
- Other suggestions

## Enhancement Categories

Enhancements are categorized based on keyword analysis:

1. **Healthier**: Enhancements containing keywords like "health", "calorie", "nutrition", "fat", "sugar", "salt", etc.

2. **Faster**: Enhancements containing keywords like "time", "quick", "fast", "efficient", "prep", "pressure cooker", etc.

3. **Tastier**: Enhancements containing keywords like "flavor", "taste", "delicious", "seasoning", "herb", "spice", etc.

4. **Other**: Any enhancements that don't fit into the above categories.

## Fallback Mechanisms

The system includes fallback mechanisms in case the DeepSeek API fails:

1. **Fixed Enhancements**: Pre-defined enhancements for common recipes.
2. **Generic Fallbacks**: General cooking tips that can apply to most recipes.

## Database Schema

Enhancements are stored in the `recipe_enhancements` table with the following structure:

```sql
CREATE TABLE recipe_enhancements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id TEXT NOT NULL,
  enhancements JSONB NOT NULL,
  categorized_enhancements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate entries for the same recipe
  CONSTRAINT unique_recipe_enhancement UNIQUE (recipe_id)
);
```

## Conclusion

This enhancement flow provides a seamless user experience by automatically generating and categorizing recipe enhancements using the DeepSeek AI API. The system is designed to be efficient, with database caching to prevent redundant API calls, and includes robust fallback mechanisms to ensure users always receive enhancement suggestions.
