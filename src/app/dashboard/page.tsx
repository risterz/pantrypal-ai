'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, BookOpen, Search, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserData(session.user);
        } else {
          setIsLoading(false);
        }
      }
    );
    
    // Initial data fetch
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        setUser(user);
        fetchUserData(user);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setIsLoading(false);
      }
    }
    
    async function fetchUserData(user: any) {
      try {
        // Get recent searches
        const { data: searches, error: searchesError } = await supabase
          .from('recent_searches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (searchesError) throw searchesError;
        setRecentSearches(searches || []);
        
        // Get saved recipes - modified to use recipe_data instead of foreign key
        const { data: recipes, error: recipesError } = await supabase
          .from('saved_recipes')
          .select('id, user_id, recipe_id, created_at, recipe_data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recipesError) throw recipesError;
        setSavedRecipes(recipes || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };
  
  const navigateToSearch = () => {
    router.push('/recipes/search');
  };
  
  const navigateToFavorites = () => {
    router.push('/favorites');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
        <p className="text-gray-600 mb-6">Please sign in to view your dashboard.</p>
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
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Recent Searches Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#4ECDC4]" />
              Recent Searches
            </CardTitle>
            <CardDescription>Your latest ingredient searches</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSearches.length > 0 ? (
              <div className="space-y-4">
                {recentSearches.map((search) => (
                  <div key={search.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {search.search_query && search.search_query.ingredients && 
                        Array.isArray(search.search_query.ingredients) &&
                        search.search_query.ingredients.map((ingredient: string, index: number) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                      {(!search.search_query || !search.search_query.ingredients || 
                        !Array.isArray(search.search_query.ingredients)) && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                            Search
                          </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(search.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={navigateToSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search More Recipes
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <History className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">No recent searches found</p>
                <Button 
                  onClick={navigateToSearch}
                  className="bg-[#4ECDC4] hover:bg-[#44b8b1]"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Recipes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Saved Recipes Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#FF6B6B]" />
              Saved Recipes
            </CardTitle>
            <CardDescription>Your favorite recipes</CardDescription>
          </CardHeader>
          <CardContent>
            {savedRecipes.length > 0 ? (
              <div className="space-y-4">
                {savedRecipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => navigateToRecipe(recipe.recipe_id)}
                  >
                    {recipe.recipe_data && recipe.recipe_data.image_url && (
                      <img 
                        src={recipe.recipe_data.image_url} 
                        alt={recipe.recipe_data.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{recipe.recipe_data?.title || 'Untitled Recipe'}</h4>
                      <p className="text-xs text-gray-500">
                        Saved on {new Date(recipe.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={navigateToFavorites}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Favorites
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <BookOpen className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">No saved recipes found</p>
                <Button 
                  onClick={navigateToSearch}
                  className="bg-[#FF6B6B] hover:bg-[#ff5252]"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find Recipes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 