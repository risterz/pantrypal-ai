import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;

// Create a configured axios instance
const recipeApiClient = axios.create({
  baseURL: API_URL,
  params: {
    apiKey: API_KEY,
  },
});

export interface RecipeSearchParams {
  ingredients: string[];
  diet?: string;
  intolerances?: string;
  number?: number;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Ingredient[];
  usedIngredients: Ingredient[];
  unusedIngredients: Ingredient[];
  likes: number;
}

export interface Ingredient {
  id: number;
  amount: number;
  unit: string;
  unitLong: string;
  unitShort: string;
  aisle: string;
  name: string;
  original: string;
  originalName: string;
  meta: string[];
  image: string;
}

export interface RecipeDetail extends Recipe {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number;
  cookingMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: ExtendedIngredient[];
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
}

export interface ExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  };
}

export interface AnalyzedInstruction {
  name: string;
  steps: {
    number: number;
    step: string;
    ingredients: {
      id: number;
      name: string;
      localizedName: string;
      image: string;
    }[];
    equipment: {
      id: number;
      name: string;
      localizedName: string;
      image: string;
    }[];
  }[];
}

// API functions
export const recipeApi = {
  // Search recipes by ingredients
  searchByIngredients: async (params: RecipeSearchParams): Promise<Recipe[]> => {
    try {
      // First, search by ingredients to get basic recipe IDs
      const ingredientResponse = await recipeApiClient.get('/findByIngredients', {
        params: {
          ingredients: params.ingredients.join(','),
          number: params.number || 10,
          ranking: 1, // maximize used ingredients
        },
      });
      
      // If no diet filter is specified, return the ingredient-based results
      if (!params.diet || params.diet === 'none') {
        return ingredientResponse.data;
      }

      // If diet filter is specified, we need to do a second pass with complex search
      // Extract recipe IDs from the ingredient search results
      const recipeIds = ingredientResponse.data.map((recipe: Recipe) => recipe.id);

      // Use complex search to filter by diet
      const complexResponse = await recipeApiClient.get('/complexSearch', {
        params: {
          includeIngredients: params.ingredients.join(','),
          diet: params.diet,
          number: params.number || 10,
          addRecipeInformation: true,
          fillIngredients: true,
          // Include only the recipes found by the ingredient search
          ids: recipeIds.join(',')
        },
      });
      
      // Return the filtered results
      return complexResponse.data.results;
    } catch (error) {
      console.error('Error searching recipes by ingredients and diet:', error);
      // Provide more detailed error information
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          throw new Error(`API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from recipe API. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Recipe API request failed: ${error.message}`);
        }
      }
      throw error;
    }
  },

  // Get recipe details by ID
  getRecipeById: async (id: number): Promise<RecipeDetail> => {
    try {
      const response = await recipeApiClient.get(`/${id}/information`, {
        params: {
          includeNutrition: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      // Provide more detailed error information
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          throw new Error(`API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from recipe API. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Recipe API request failed: ${error.message}`);
        }
      }
      throw error;
    }
  },

  // Search recipes with complex parameters
  complexSearch: async (params: {
    query?: string;
    cuisine?: string;
    diet?: string;
    intolerances?: string;
    includeIngredients?: string;
    excludeIngredients?: string;
    type?: string;
    instructionsRequired?: boolean;
    fillIngredients?: boolean;
    addRecipeInformation?: boolean;
    number?: number;
  }) => {
    try {
      const response = await recipeApiClient.get('/complexSearch', { params });
      return response.data;
    } catch (error) {
      console.error('Error performing complex recipe search:', error);
      // Provide more detailed error information
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          throw new Error(`API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from recipe API. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Recipe API request failed: ${error.message}`);
        }
      }
      throw error;
    }
  },
}; 