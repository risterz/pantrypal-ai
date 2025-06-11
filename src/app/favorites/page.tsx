'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Heart, Info, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        
        // Get all saved recipes
        const { data: recipes, error: recipesError } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (recipesError) throw recipesError;
        setSavedRecipes(recipes || []);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        toast.error('Failed to load saved recipes');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  const removeRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);
        
      if (error) throw error;
      
      setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
      toast.success('Recipe removed from favorites');
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast.error('Failed to remove recipe');
    }
  };
  
  const viewRecipeDetails = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };
  
  const navigateToSearch = () => {
    router.push('/recipes/search');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <ShieldAlert className="h-16 w-16 mx-auto text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your favorite recipes.</p>
        <Button 
          onClick={() => router.push('/login')}
          className="bg-[#FF6B6B] hover:bg-[#ff5252]"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Recipes</h1>
      
      {savedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={recipe.recipe_data.image}
                  alt={recipe.recipe_data.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white text-red-500 hover:bg-white hover:text-red-700 rounded-full h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecipe(recipe.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{recipe.recipe_data.title}</h3>
                <div className="text-sm text-gray-500 mb-3">
                  Saved on {new Date(recipe.created_at).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                  onClick={() => viewRecipeDetails(recipe.recipe_id)}
                >
                  <Info className="mr-2 h-4 w-4" />
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-3" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Favorites Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't saved any recipes to your favorites yet. Start searching for recipes and save the ones you love!
          </p>
          <Button 
            onClick={navigateToSearch}
            className="bg-[#FF6B6B] hover:bg-[#ff5252]"
          >
            <Search className="mr-2 h-4 w-4" />
            Find Recipes
          </Button>
        </div>
      )}
    </div>
  );
} 