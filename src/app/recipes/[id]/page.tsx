'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { recipeApi, RecipeDetail } from '@/lib/api/recipeApi';
import { recipeEnhancementApi, RecipeEnhancement } from '@/lib/api/recipeEnhancementApi';
import { deepseekApi } from '@/lib/api/deepseekApi';
import { recipeEnhancementDbApi, CategorizedEnhancements } from '@/lib/api/recipeEnhancementDbApi';
import { scrapedEnhancementApi, ScrapedEnhancement } from '@/lib/api/scrapedEnhancementApi';

import getFixedEnhancements from '@/lib/data/fixedEnhancements';
import { RecipeEnhancement as RecipeEnhancementCard } from '@/components/ui/RecipeEnhancement';
import { EnhancementComparison, EvaluationData } from '@/components/ui/EnhancementComparison';
import { EnhancementStats } from '@/components/ui/EnhancementStats';




export default function RecipeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userDietaryPreferences, setUserDietaryPreferences] = useState<string[] | null>(null);
  const [enhancements, setEnhancements] = useState<string[]>([]);
  const [categorizedEnhancements, setCategorizedEnhancements] = useState<CategorizedEnhancements | null>(null);
  const [scrapedEnhancements, setScrapedEnhancements] = useState<string[]>([]);
  const [isLoadingEnhancements, setIsLoadingEnhancements] = useState(false);
  const [isLoadingScrapedEnhancements, setIsLoadingScrapedEnhancements] = useState(false);


  // DeepSeek AI is always enabled now
  const useDeepseekAI = true;
  const [hasShownToast, setHasShownToast] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [evaluationSubmitted, setEvaluationSubmitted] = useState(false);

  const [recipeId, setRecipeId] = useState<number>(0);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to fetch user dietary preferences
  const fetchUserDietaryPreferences = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('dietary_preferences')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user dietary preferences:', error);
        return;
      }

      if (profileData && profileData.dietary_preferences) {
        setUserDietaryPreferences(profileData.dietary_preferences);
        console.log('User dietary preferences loaded:', profileData.dietary_preferences);
      } else {
        setUserDietaryPreferences(null);
      }
    } catch (error) {
      console.error('Failed to fetch user dietary preferences:', error);
      setUserDietaryPreferences(null);
    }
  };

  // Function to get effective dietary preferences (URL params take priority over profile)
  const getEffectiveDietaryPreferences = (): string[] | null => {
    // Check URL parameters first (from search context)
    const urlDiet = searchParams.get('diet');
    if (urlDiet && urlDiet !== 'none') {
      // Map search page diet values to profile format
      const dietMap: { [key: string]: string } = {
        'vegetarian': 'vegetarian',
        'vegan': 'vegan',
        'gluten-free': 'glutenFree',
        'dairy-free': 'dairyFree',
        'ketogenic': 'keto',
        'paleo': 'paleo'
      };

      const mappedDiet = dietMap[urlDiet];
      if (mappedDiet) {
        console.log('Using dietary preference from search context:', urlDiet, '→', mappedDiet);
        return [mappedDiet];
      }
    }

    // Fall back to user profile preferences
    console.log('Using dietary preferences from user profile:', userDietaryPreferences);
    return userDietaryPreferences;
  };

  const fetchScrapedEnhancements = async (recipeId: number) => {
    try {
      setIsLoadingScrapedEnhancements(true);
      
      // Ensure recipeId is a valid number
      const numericRecipeId = typeof recipeId === 'string' ? parseInt(String(recipeId), 10) : recipeId;
      
      if (isNaN(numericRecipeId)) {
        console.error('Invalid recipe ID format:', recipeId);
        throw new Error(`Invalid recipe ID: ${recipeId}`);
      }
      
      const scrapedData = await scrapedEnhancementApi.getByRecipeId(numericRecipeId);
      
      if (scrapedData && scrapedData.enhancements && Array.isArray(scrapedData.enhancements) && scrapedData.enhancements.length > 0) {
        setScrapedEnhancements(scrapedData.enhancements);
        console.log('Loaded scraped enhancements:', scrapedData.enhancements);
      } else {
        // If no scraped enhancements found, set default placeholder
        setScrapedEnhancements([
          'Use fresh ingredients instead of canned or frozen when possible.',
          'Adjust seasoning to taste as you cook.',
          'Let meat rest for a few minutes after cooking before cutting.',
          'Prep all ingredients before starting to cook for a smoother process.',
          'Use a meat thermometer to ensure proper cooking temperature.'
        ]);
        console.log('No scraped enhancements found, using placeholders');
      }
    } catch (error) {
      console.error('Error fetching scraped enhancements:', error);
      // Set default placeholder enhancements
      setScrapedEnhancements([
        'Use fresh ingredients instead of canned or frozen when possible.',
          'Adjust seasoning to taste as you cook.',
          'Let meat rest for a few minutes after cooking before cutting.',
          'Prep all ingredients before starting to cook for a smoother process.',
          'Use a meat thermometer to ensure proper cooking temperature.'
      ]);
    } finally {
      setIsLoadingScrapedEnhancements(false);
    }
  };

  const handleSubmitEvaluation = async (evaluation: EvaluationData) => {
    try {
      // Convert recipeId to number if it's a string
      const numericRecipeId = typeof evaluation.recipeId === 'string' ? parseInt(evaluation.recipeId, 10) : evaluation.recipeId;

      // Since we removed the rating form, we just log that the comparison was viewed
      console.log('User viewed enhancement comparison for recipe ID:', numericRecipeId);

      // No actual submission needed since rating form was removed
      toast.success('Enhancement comparison viewed!');
      setEvaluationSubmitted(true);
    } catch (error) {
      console.error('Error in handleSubmitEvaluation:', error);
    }
  };


  
  // Extract recipe ID from params
  useEffect(() => {
    async function extractParams() {
      try {
        const resolvedParams = await params;
        const id = resolvedParams?.id ? parseInt(resolvedParams.id) : 0;
        setRecipeId(id);
      } catch (error) {
        console.error('Error extracting params:', error);
        setRecipeId(0);
      }
    }

    extractParams();
  }, [params]);


  // First useEffect to check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        // Fetch dietary preferences if user is authenticated
        if (data.user) {
          await fetchUserDietaryPreferences(data.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthChecked(true);
      }
    }

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      setAuthChecked(true);

      // Fetch dietary preferences when user changes
      if (session?.user) {
        await fetchUserDietaryPreferences(session.user.id);
      } else {
        setUserDietaryPreferences(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Second useEffect to fetch recipe data after auth is checked
  useEffect(() => {
    async function fetchData() {
      if (!recipeId) {
        console.error('No recipe ID provided');
        toast.error('Invalid recipe ID');
        router.push('/');
        return;
      }
      
      try {
        setIsLoading(true);
        const recipeData = await recipeApi.getRecipeById(recipeId);
        setRecipe(recipeData);

        // Load enhancements once the recipe is loaded
        if (recipeData) {
          fetchEnhancements(recipeData);
          fetchScrapedEnhancements(recipeData.id);
          

        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error('Failed to load recipe details');
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch recipe data after auth check is complete
    if (authChecked && recipeId) {
      console.log('Fetching recipe data for ID:', recipeId);
      fetchData();
    }
  }, [recipeId, authChecked, router]);

  const fetchEnhancements = async (recipeData: RecipeDetail) => {
    try {
      setIsLoadingEnhancements(true);
      
      // Get effective dietary preferences for this enhancement
      const effectiveDietaryPreferences = getEffectiveDietaryPreferences();

      // First check if we already have enhancements stored in the database with matching dietary preferences
      const existingEnhancements = await recipeEnhancementDbApi.getEnhancementByRecipeId(
        recipeData.id,
        effectiveDietaryPreferences
      );
      
      if (existingEnhancements) {
        // Use the stored enhancements from the database
        console.log('Using stored enhancements from database for recipe ID:', recipeData.id);
        setEnhancements(existingEnhancements.enhancements);
        
        // If we have categorized enhancements, use those too
        if (existingEnhancements.categorizedEnhancements) {
          setCategorizedEnhancements(existingEnhancements.categorizedEnhancements);
        } else {
          // If we don't have categorized enhancements, set to null
          setCategorizedEnhancements(null);
        }
        
        // Also fetch scraped enhancements for comparison
        fetchScrapedEnhancements(recipeData.id);
        
        toast.success('Loaded stored recipe enhancements');
        return;
      }
      
      // If we don't have stored enhancements and DeepSeek is enabled, generate them on-demand
      if (useDeepseekAI) {
        try {
          console.log('Generating new enhancements with DeepSeek API for recipe ID:', recipeData.id);
          console.log('Effective dietary preferences for AI enhancement:', effectiveDietaryPreferences);

          const toastMessage = effectiveDietaryPreferences && effectiveDietaryPreferences.length > 0
            ? 'Generating AI-enhanced recipe suggestions based on your dietary preferences...'
            : 'Generating AI-enhanced recipe suggestions...';
          toast.info(toastMessage);
          
          // Generate enhancements using DeepSeek API with effective dietary preferences
          const deepseekEnhancements = await deepseekApi.enhanceRecipe(recipeData, effectiveDietaryPreferences);

          // Store the generated enhancements in the database with dietary preferences
          await recipeEnhancementDbApi.storeEnhancement(deepseekEnhancements, effectiveDietaryPreferences);
          
          // Set the enhancements
          setEnhancements(deepseekEnhancements.enhancements);
          
          // Set categorized enhancements to null since we don't have them yet
          setCategorizedEnhancements(null);
          
          // Also fetch scraped enhancements for comparison
          fetchScrapedEnhancements(recipeData.id);
          
          // Show success toast
          toast.success('Generated and stored new recipe enhancements');
          
          // Log for debugging
          console.log('DeepSeek enhancements generated and stored:', deepseekEnhancements.enhancements);
          
          // Integrate EnhancementComparison component
          setShowComparison(true);
          return;
        } catch (deepseekError) {
          console.error('Error generating DeepSeek enhancements:', deepseekError);
          // Fall back to fixed enhancements if DeepSeek fails
        }
      }
      
      // If DeepSeek is disabled or failed, use the fixed enhancements as a fallback
      console.log('Using fixed enhancements for recipe ID:', recipeData.id);
      
      // Get the fixed enhancements for this recipe ID
      const fixedEnhancementsList = getFixedEnhancements(recipeData.id);
      
      // Create a RecipeEnhancement object with the fixed enhancements
      const enhancementObj: RecipeEnhancement = {
        enhancementId: `fixed_${Date.now()}`,
        recipeId: recipeData.id,
        enhancements: fixedEnhancementsList,
        generatedAt: new Date()
      };
      
      // Store the enhancements in the database
      await recipeEnhancementDbApi.storeEnhancement(enhancementObj);
      
      // Set the enhancements
      setEnhancements(fixedEnhancementsList);
      
      // Set categorized enhancements to null since we don't have them yet
      setCategorizedEnhancements(null);
      
      // Also fetch scraped enhancements for comparison
      fetchScrapedEnhancements(recipeData.id);
      
      // Show success toast
      toast.success('Loaded recipe enhancements');
      
      // Log for debugging
      console.log('Fixed enhancements stored:', fixedEnhancementsList);
      
    } catch (error) {
      console.error('Error loading enhancements:', error);
      toast.error('Failed to load enhancements');
      
      // Provide fallback enhancements if something goes wrong
      const fallbackEnhancements = [
        'Use whole wheat pasta for added fiber and nutrients.',
        'Add more vegetables like spinach or cherry tomatoes for extra nutrients.',
        'Reduce salt and use herbs and spices for flavor instead.',
        'Use lean protein sources to reduce calories and fat.',
        'Cook with less oil by using non-stick cookware or cooking spray.'
      ];
      
      setEnhancements(fallbackEnhancements);
      
      // Also fetch scraped enhancements for comparison
      fetchScrapedEnhancements(recipeData.id);
      
      // Try to store even the fallback enhancements
      try {
        const fallbackObj: RecipeEnhancement = {
          enhancementId: `fallback_${Date.now()}`,
          recipeId: recipeData.id,
          enhancements: fallbackEnhancements,
          generatedAt: new Date()
        };
        
        await recipeEnhancementDbApi.storeEnhancement(fallbackObj);
      } catch (storeError) {
        console.error('Failed to store fallback enhancements:', storeError);
      }
    } finally {
      setIsLoadingEnhancements(false);
    }
  };



  const saveRecipe = async () => {
    if (!user) {
      toast.error('You need to be logged in to save recipes');
      router.push('/login');
      return;
    }

    if (!recipe) return;
    
    try {
      // First check if this recipe is already saved
      const { data: existingRecipe, error: checkError } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id.toString())
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is what we want
        console.error('Error checking for existing recipe:', checkError);
        throw checkError;
      }
      
      if (existingRecipe) {
        toast.info('This recipe is already in your favorites');
        return;
      }
      
      // Recipe doesn't exist yet, so insert it
      const { error } = await supabase.from('saved_recipes').insert({
        user_id: user.id,
        recipe_id: recipe.id.toString(),
        recipe_data: recipe
      });
      
      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        
        // Check for specific error types
        if (error.code === '23505') {
          toast.info('Recipe is already saved to favorites');
          return;
        } else if (error.code === '22P02') {
          toast.error('Invalid recipe ID format. Please try a different recipe.');
          return;
        } else if (error.code === '42501') {
          toast.error('Permission denied. RLS policy may be preventing this operation.');
        } else {
          toast.error(`Failed to save recipe: ${error.message}`);
        }
        return;
      }
      
      toast.success('Recipe saved to favorites');
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });

      // More specific error messages
      if (error.code === '23505') {
        toast.info('Recipe is already saved to favorites');
      } else if (error.code === '42501') {
        toast.error('Permission denied. Please check if you are logged in.');
      } else if (error.message?.includes('recipe_data')) {
        toast.error('Error with recipe data format. Please try again.');
      } else {
        toast.error(`Failed to save recipe: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
          
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={`loading-skeleton-1-${i}`} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={`loading-skeleton-2-${i}`} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
        <p className="mt-2 text-gray-600">The recipe you're looking for doesn't exist or couldn't be loaded.</p>
        <Button 
          onClick={() => router.push('/recipes/search')}
          className="mt-4 bg-[#4ECDC4] hover:bg-[#44b8b1]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </div>
    );
  }

  // Format recipe instructions into an array for the enhancement component
  const getInstructionsList = () => {
    if (recipe?.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      return recipe.analyzedInstructions[0].steps.map(step => step.step);
    } else if (recipe?.instructions) {
      // Split by periods and filter out empty strings
      return recipe.instructions
        .split('.')
        .map(instruction => instruction.trim())
        .filter(instruction => instruction.length > 0);
    }
    return [];
  };

  // Format ingredients into an array of strings
  const getIngredientsList = () => {
    return recipe?.extendedIngredients?.map(ing => ing.original) || [];
  };

  // Create a flattened array of AI enhancements for the comparison component
  const getAIEnhancementsForComparison = () => {
    if (categorizedEnhancements) {
      // If we have categorized enhancements, flatten them into a single array
      const allEnhancements = [
        ...categorizedEnhancements.healthier,
        ...categorizedEnhancements.faster,
        ...categorizedEnhancements.tastier,
        ...categorizedEnhancements.other
      ];
      return allEnhancements;
    }

    // Fallback to the basic enhancements array if categorized ones aren't available
    return enhancements;
  };



  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="mb-4 sm:mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between items-start gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight flex-1">{recipe.title}</h1>
          <Button
            variant="outline"
            size="icon"
            className="text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white flex-shrink-0"
            onClick={saveRecipe}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden mb-6 sm:mb-8">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 sm:h-64 md:h-auto object-cover"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Prep Time Card */}
        <Card className="overflow-hidden border border-[#F2F4F8] hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-300">
          <CardContent className="p-3 sm:p-4 flex items-start gap-3">
            <div className="bg-[#F2F8F8] p-2 sm:p-2.5 rounded-full flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 mt-0.5">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#4ECDC4]" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Prep time</p>
              <p className="text-sm sm:text-base font-semibold text-gray-800">{recipe.readyInMinutes} minutes</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Serves Card */}
        <Card className="overflow-hidden border border-[#F2F4F8] hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-300">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-[#F2F8F8] p-2.5 rounded-full flex items-center justify-center w-9 h-9 flex-shrink-0 mt-0.5">
              <Users className="h-5 w-5 text-[#4ECDC4]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Serves</p>
              <p className="text-base font-semibold text-gray-800">{recipe.servings} {recipe.servings > 1 ? 'people' : 'person'}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Diet Card */}
        <Card className="overflow-hidden border border-[#F2F4F8] hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-300">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-[#F2F8F8] p-2.5 rounded-full flex items-center justify-center w-9 h-9 flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4ECDC4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                <line x1="12" y1="22" x2="12" y2="13"></line>
                <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Diet</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {recipe.diets && recipe.diets.length > 0 ? (
                  recipe.diets.map((diet, index) => (
                    <span key={index} className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {diet}
                    </span>
                  ))
                ) : (
                  <p className="text-base font-semibold text-gray-800">No specific diet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Ingredients Card */}
      <div className="mb-8">
        <Card className="overflow-hidden border border-[#F2F4F8] hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-300">
          <CardHeader className="bg-[#F8FBFB] border-b border-[#F2F4F8]">
            <CardTitle className="text-xl font-bold text-gray-800">Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <ul className="space-y-3">
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={`ingredient-${recipe.id}-${index}`} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                  <span className="mr-3 bg-[#4ECDC4] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">•</span>
                  <span className="text-gray-700">{ingredient.original}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Instructions Card */}
      <div className="mb-8">
        <Card className="overflow-hidden border border-[#F2F4F8] hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-300">
          <CardHeader className="bg-[#F8FBFB] border-b border-[#F2F4F8]">
            <CardTitle className="text-xl font-bold text-gray-800">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
              <ol className="space-y-4">
                {recipe.analyzedInstructions[0].steps.map((step) => (
                  <li key={`recipe-${recipe.id}-step-${step.number}`} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                    <span className="mr-3 bg-[#4ECDC4] text-white rounded-full min-w-8 h-8 flex items-center justify-center flex-shrink-0 font-medium">{step.number}</span>
                    <div className="text-gray-700 pt-1">{step.step}</div>
                  </li>
                ))}
              </ol>
            ) : (
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions available.' }} 
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {recipe.summary && (
        <div className="mb-6 sm:mb-8">
          <Card className="overflow-hidden border border-[#F2F4F8] hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-300">
            <CardHeader className="bg-[#F8FBFB] border-b border-[#F2F4F8]">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Recipe Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div
                className="recipe-summary prose prose-sm sm:prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* AI Enhancement Card */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">AI Recipe Enhancements</h2>
            {!isLoadingEnhancements && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Powered by DeepSeek</span>
            )}
          </div>
        </div>
        
        {isLoadingEnhancements ? (
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-blue-100 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-blue-100 rounded w-5/6 mb-6"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={`deepseek-loading-${recipe.id}-${item}`} className="h-4 bg-blue-100 rounded"></div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <div>
            <RecipeEnhancementCard
              recipeTitle={recipe.title}
              instructions={getInstructionsList()}
              ingredients={getIngredientsList()}
              aiEnhancements={enhancements}
              categorizedEnhancements={categorizedEnhancements}
            />

            {/* Dietary Preferences Indicator */}
            {(() => {
              const effectivePrefs = getEffectiveDietaryPreferences();
              const urlDiet = searchParams.get('diet');

              if (effectivePrefs && effectivePrefs.length > 0) {
                return (
                  <div className="mt-3 px-4 sm:px-0">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">
                          AI enhancements personalized for your dietary preferences: {' '}
                          {effectivePrefs.map(pref => {
                            const displayMap: { [key: string]: string } = {
                              'vegetarian': 'Vegetarian',
                              'vegan': 'Vegan',
                              'glutenFree': 'Gluten-Free',
                              'dairyFree': 'Dairy-Free',
                              'keto': 'Ketogenic',
                              'paleo': 'Paleo'
                            };
                            return displayMap[pref] || pref;
                          }).join(', ')}
                          {urlDiet && urlDiet !== 'none' && (
                            <span className="text-xs text-green-600 ml-1">(from search)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 px-4 sm:px-0">
              <Button
                variant="outline"
                onClick={() => setShowComparison(!showComparison)}
                className="mt-2 text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto"
                size="sm"
              >
                <span className="hidden sm:inline">
                  {showComparison ? 'Hide Enhancement Comparison' : 'Compare with Human Enhancements'}
                </span>
                <span className="sm:hidden">
                  {showComparison ? 'Hide Comparison' : 'Compare with Human'}
                </span>
              </Button>

            </div>
          </div>
        )}
      </div>
      
      {/* Enhancement Comparison Section */}
      {showComparison && !isLoadingEnhancements && !isLoadingScrapedEnhancements && (
        <div className="mb-8">
          {evaluationSubmitted ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-green-800">Enhancement Comparison Viewed</h3>
              <p className="text-green-700">You can compare AI-generated and human-curated enhancements above.</p>
            </div>
          ) : (
            <EnhancementComparison
              recipeId={String(recipe.id)}
              aiEnhancements={getAIEnhancementsForComparison()}
              humanEnhancements={scrapedEnhancements.map((enhancement, index) => ({
                id: `scraped-${index}`,
                content: enhancement,
                enhancement_type: 'general',
                source_url: '',
                metadata: {
                  source_name: 'Web Scraping',
                  position: index,
                  selector_used: ''
                }
              }))}
              onSubmitEvaluation={handleSubmitEvaluation}
              isAuthenticated={!!user}
            />
          )}
        </div>
      )}

      {/* AI Enhancement Statistics */}
      {!isLoadingEnhancements && (enhancements.length > 0 || categorizedEnhancements) && (
        <div className="mb-8">
          <EnhancementStats
            compact={true}
            showTitle={false}
            categorizedEnhancements={categorizedEnhancements}
            basicEnhancements={enhancements}
            recipeTitle={recipe.title}
          />
        </div>
      )}

      <div className="text-center mt-8 sm:mt-12 px-4 sm:px-0">
        <Button
          onClick={saveRecipe}
          className="bg-[#FF6B6B] hover:bg-[#ff5252] w-full sm:w-auto"
          size="lg"
        >
          <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Save to Favorites</span>
        </Button>
      </div>
    </div>
  );
} 