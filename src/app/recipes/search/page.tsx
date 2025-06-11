'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Info, Heart, X, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { recipeApi, Recipe } from '@/lib/api/recipeApi';
import { IngredientCategories } from '@/components/pantry/IngredientCategories';

export default function RecipeSearchPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [searchMode, setSearchMode] = useState<'ingredients' | 'name'>('ingredients');
  const [diet, setDiet] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    getUser();
  }, []);

  const addIngredient = () => {
    if (!newIngredient.trim()) {
      return;
    }
    
    // Normalize ingredient input to lowercase and remove duplicates
    const normalizedInput = newIngredient.trim().toLowerCase();
    
    if (ingredients.map(i => i.toLowerCase()).includes(normalizedInput)) {
      toast.error('This ingredient is already in your list');
      return;
    }
    
    setIngredients([...ingredients, newIngredient.trim()]);
    setNewIngredient('');
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchMode === 'ingredients') {
        addIngredient();
      } else {
        searchRecipes();
      }
    }
  };

  const searchRecipes = async () => {
    // Validate search input based on search mode
    if (searchMode === 'ingredients' && ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    } else if (searchMode === 'name' && !recipeName.trim()) {
      toast.error('Please enter a recipe name to search');
      return;
    }
    
    try {
      setIsLoading(true);
      setRecipes([]);
      let results: Recipe[] = [];
      
      if (searchMode === 'ingredients') {
        // Search by ingredients
        const searchParams = {
          ingredients,
          diet: diet === "none" ? undefined : diet,
          number: 12
        };
        
        results = await recipeApi.searchByIngredients(searchParams);
        
        if (diet !== "none" && results.length === 0) {
          toast.info(`No recipes found with your ingredients that match the ${diet} diet. Try different ingredients or dietary preference.`);
        } else if (results.length === 0) {
          toast.info("No recipes found with these ingredients. Try adding different ingredients.");
        } else if (diet !== "none") {
          toast.success(`Found ${results.length} ${diet} recipes with your ingredients!`);
        } else {
          toast.success(`Found ${results.length} recipes with your ingredients!`);
        }
        
        // Save ingredient search query for authenticated users
        if (user) {
          await supabase.from('recent_searches').insert({
            user_id: user.id,
            search_query: {
              type: 'ingredients',
              ingredients,
              diet
            }
          });
        }
      } else {
        // Search by recipe name
        const searchParams = {
          query: recipeName,
          diet: diet === "none" ? undefined : diet,
          number: 12,
          addRecipeInformation: true,
          fillIngredients: true
        };
        
        const response = await recipeApi.complexSearch(searchParams);
        results = response.results;
        
        if (results.length === 0) {
          toast.info(`No recipes found with the name "${recipeName}". Try a different name or search by ingredients.`);
        } else {
          toast.success(`Found ${results.length} recipes matching "${recipeName}"!`);
        }
        
        // Save name search query for authenticated users
        if (user) {
          await supabase.from('recent_searches').insert({
            user_id: user.id,
            search_query: {
              type: 'name',
              query: recipeName,
              diet
            }
          });
        }
      }
      
      setRecipes(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast.error('Failed to search recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (!user) {
      toast.error('You need to be logged in to save recipes');
      router.push('/login');
      return;
    }
    
    try {
      // Check if recipe already exists in our database
      const { data: existingRecipes, error: recipeCheckError } = await supabase
        .from('recipes')
        .select('id')
        .eq('id', recipe.id.toString())
        .limit(1);
        
      if (recipeCheckError) {
        throw recipeCheckError;
      }
      
      // If recipe doesn't exist, add it to our database
      if (!existingRecipes || existingRecipes.length === 0) {
        const { error: insertError } = await supabase
          .from('recipes')
          .insert({
            id: recipe.id.toString(),
            title: recipe.title,
            image: recipe.image,
            data: recipe
          });
          
        if (insertError) {
          throw insertError;
        }
      }
      
      // Check if recipe is already saved by user
      const { data: savedRecipes, error: savedCheckError } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id.toString())
        .limit(1);
        
      if (savedCheckError) {
        throw savedCheckError;
      }
      
      // If not already saved, save it
      if (!savedRecipes || savedRecipes.length === 0) {
        const { error: saveError } = await supabase
          .from('saved_recipes')
          .insert({
            user_id: user.id,
            recipe_id: recipe.id.toString()
          });
          
        if (saveError) {
          throw saveError;
        }
        
        toast.success(`Saved ${recipe.title} to your favorites!`);
      } else {
        toast.info(`${recipe.title} is already in your favorites`);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe. Please try again.');
    }
  };

  const viewRecipeDetails = (recipeId: number) => {
    router.push(`/recipes/${recipeId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Recipes to Enhance</h1>
        <p className="text-gray-600 mb-8">
          Search for recipes to get personalized AI enhancement suggestions for cooking smarter, healthier, and tastier meals.
        </p>
        
        <div className="flex mb-6 rounded-md overflow-hidden">
          <button
            onClick={() => setSearchMode('ingredients')}
            className={`flex-1 py-2 px-4 text-center font-medium ${
              searchMode === 'ingredients' 
                ? 'bg-[#4ECDC4] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Search by Ingredients
          </button>
          <button
            onClick={() => setSearchMode('name')}
            className={`flex-1 py-2 px-4 text-center font-medium ${
              searchMode === 'name' 
                ? 'bg-[#4ECDC4] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Search by Recipe Name
          </button>
        </div>
        
        {searchMode === 'ingredients' ? (
          // Ingredients Search Form
          <div className="mb-6">
            <Label htmlFor="ingredients" className="text-lg font-medium mb-2 block">
              What ingredients do you have?
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="ingredients"
                placeholder="Enter an ingredient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow"
              />
              <Button onClick={addIngredient} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {ingredients.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1"
                  >
                    <span>{ingredient}</span>
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <IngredientCategories onAddIngredient={(ingredient: string) => {
                const normalizedInput = ingredient.trim().toLowerCase();
                if (!ingredients.map(i => i.toLowerCase()).includes(normalizedInput)) {
                  setIngredients([...ingredients, ingredient]);
                }
              }} />
            </div>
          </div>
        ) : (
          // Recipe Name Search Form
          <div className="mb-6">
            <Label htmlFor="recipeName" className="text-lg font-medium mb-2 block">
              Enter a recipe name to search
            </Label>
            <Input
              id="recipeName"
              placeholder="E.g. Pasta Carbonara, Chicken Curry, etc."
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
        )}
        
        <div className="mb-6">
          <Label htmlFor="diet" className="text-lg font-medium mb-2 block">
            Dietary Preferences (Optional)
          </Label>
          <Select value={diet} onValueChange={setDiet}>
            <SelectTrigger id="diet" className="w-full">
              <SelectValue placeholder="Select dietary preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Preference</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
              <SelectItem value="ketogenic">Ketogenic</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={searchRecipes} 
            className="bg-[#4ECDC4] hover:bg-[#3dbdb5] text-white px-8 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Find Recipes
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 mb-10 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-blue-700">How PantryPal AI Enhances Your Cooking</h2>
        </div>
        <p className="text-gray-700 mb-4">
          Our AI doesn't just find recipes - it provides personalized enhancement suggestions for each recipe to make them:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <li className="bg-white p-3 rounded-lg border border-green-100 flex items-start gap-2">
            <span className="text-green-500 font-bold">•</span>
            <span><strong>Healthier</strong> - Smarter ingredient substitutions and cooking methods</span>
          </li>
          <li className="bg-white p-3 rounded-lg border border-green-100 flex items-start gap-2">
            <span className="text-green-500 font-bold">•</span>
            <span><strong>Faster</strong> - Time-saving techniques and prep strategies</span>
          </li>
          <li className="bg-white p-3 rounded-lg border border-green-100 flex items-start gap-2">
            <span className="text-green-500 font-bold">•</span>
            <span><strong>Tastier</strong> - Professional flavor enhancement tips</span>
          </li>
        </ul>
        <p className="text-gray-700 italic">
          Find a recipe you like, then let our AI help you make it even better!
        </p>
      </div>
      
      {recipes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Found {recipes.length} recipes to enhance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white text-[#FF6B6B] hover:bg-white hover:text-pink-600 rounded-full h-8 w-8"
                      onClick={() => saveRecipe(recipe)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 truncate">{recipe.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {searchMode === 'ingredients' ? 
                        `${recipe.usedIngredientCount} of your ingredients` :
                        `Click to view details`
                      }
                    </div>
                    <Button 
                      variant="link" 
                      onClick={() => viewRecipeDetails(recipe.id)}
                      className="text-[#4ECDC4] p-0 h-auto font-medium"
                    >
                      View & Enhance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
