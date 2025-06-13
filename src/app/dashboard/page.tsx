'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, BookOpen, Search, ShieldAlert, TrendingUp, Clock, Heart, ChefHat, Sparkles, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSearches: 0,
    totalSavedRecipes: 0,
    thisWeekSearches: 0,
    favoriteIngredients: [] as string[]
  });
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

        // Calculate statistics
        const { data: allSearches } = await supabase
          .from('recent_searches')
          .select('*')
          .eq('user_id', user.id);

        const { data: allRecipes } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id);

        // Calculate this week's searches
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const thisWeekSearches = (allSearches || []).filter(search =>
          new Date(search.created_at) > oneWeekAgo
        ).length;

        // Extract favorite ingredients from searches
        const ingredientCounts: { [key: string]: number } = {};
        (allSearches || []).forEach(search => {
          if (search.search_query?.ingredients) {
            search.search_query.ingredients.forEach((ingredient: string) => {
              ingredientCounts[ingredient] = (ingredientCounts[ingredient] || 0) + 1;
            });
          }
        });

        const favoriteIngredients = Object.entries(ingredientCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([ingredient]) => ingredient);

        setStats({
          totalSearches: (allSearches || []).length,
          totalSavedRecipes: (allRecipes || []).length,
          thisWeekSearches,
          favoriteIngredients
        });

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Chef'}! 👋</h1>
        <p className="text-gray-600">Here's what's cooking in your kitchen</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-[#4ECDC4]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSearches}</p>
              </div>
              <div className="bg-[#4ECDC4] bg-opacity-10 p-3 rounded-full">
                <Search className="h-6 w-6 text-[#4ECDC4]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FF6B6B]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Recipes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSavedRecipes}</p>
              </div>
              <div className="bg-[#FF6B6B] bg-opacity-10 p-3 rounded-full">
                <Heart className="h-6 w-6 text-[#FF6B6B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#556270]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeekSearches}</p>
              </div>
              <div className="bg-[#556270] bg-opacity-10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-[#556270]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cooking Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSearches > 20 ? 'Expert' : stats.totalSearches > 10 ? 'Intermediate' : 'Beginner'}
                </p>
              </div>
              <div className="bg-amber-500 bg-opacity-10 p-3 rounded-full">
                <ChefHat className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Recent Searches Card */}
        <Card className="lg:col-span-2">
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

        {/* Favorite Ingredients Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Favorite Ingredients
            </CardTitle>
            <CardDescription>Your most searched ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.favoriteIngredients.length > 0 ? (
              <div className="space-y-3">
                {stats.favoriteIngredients.map((ingredient, index) => (
                  <div key={ingredient} className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 capitalize">{ingredient}</span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={navigateToSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search with Favorites
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">No favorite ingredients yet</p>
                <Button
                  onClick={navigateToSearch}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Start Searching
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#556270] rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            className="bg-white text-[#4ECDC4] hover:bg-gray-100"
            onClick={navigateToSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Find New Recipes
          </Button>
          <Button
            variant="secondary"
            className="bg-white text-[#4ECDC4] hover:bg-gray-100"
            onClick={navigateToFavorites}
          >
            <Heart className="h-4 w-4 mr-2" />
            View Favorites
          </Button>
          <Button
            variant="secondary"
            className="bg-white text-[#4ECDC4] hover:bg-gray-100"
            onClick={() => router.push('/profile')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}