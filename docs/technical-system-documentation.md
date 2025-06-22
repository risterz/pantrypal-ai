# PantryPal AI - Technical System Documentation

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication System](#authentication-system)
6. [AI Enhancement Engine](#ai-enhancement-engine)
7. [Code Structure](#code-structure)
8. [Key Implementation Details](#key-implementation-details)

---

## 🏗️ Architecture Overview

PantryPal AI follows a modern full-stack architecture with the following layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  React 19 + Next.js 15 + TypeScript + Tailwind CSS        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   API Layer                                 │
│  Next.js API Routes + Server Actions                       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 External Services                           │
│  Supabase │ DeepSeek AI │ Spoonacular API                  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Data Layer                                  │
│  PostgreSQL (Supabase) + Real-time Subscriptions          │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Frontend**: React 19, Next.js 15.2.3, TypeScript 5
- **Styling**: Tailwind CSS 4, ShadCN/UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: DeepSeek API for recipe enhancement
- **External APIs**: Spoonacular for recipe data
- **Deployment**: Vercel with automatic CI/CD
- **State Management**: React hooks and context

---

## 🧩 Core Components

### 1. Frontend Components

#### Layout Components
```typescript
// src/components/layout/Navbar.tsx
- Navigation with authentication state
- Mobile-responsive hamburger menu
- User profile dropdown

// src/components/layout/Footer.tsx
- Social media links (Facebook, GitHub)
- Legal pages navigation
- Copyright information
```

#### UI Components (ShadCN/UI)
```typescript
// src/components/ui/
- button.tsx: Customizable button component
- card.tsx: Recipe and enhancement cards
- badge.tsx: Status and category badges
- star-rating.tsx: Recipe rating display
- LoadingSkeleton.tsx: Loading state components
```

#### Feature Components
```typescript
// src/components/ui/RecipeEnhancement.tsx
- AI enhancement suggestions display
- Categorized enhancements (Healthier, Faster, Tastier)
- Interactive enhancement marking
- Mobile-responsive design

// src/components/ui/EnhancementComparison.tsx
- AI vs Human enhancement comparison
- Validation metrics display
- Academic-quality analysis
```

### 2. API Layer

#### Next.js API Routes
```typescript
// src/app/api/deepseek/enhance/route.ts
export async function POST(request: Request) {
  // DeepSeek AI integration for recipe enhancement
  // Secure server-side API calls
  // Response processing and cleaning
}

// src/app/auth/callback/route.ts
export async function GET(request: Request) {
  // OAuth callback handling
  // Session establishment
  // Error handling and redirects
}
```

#### Client-Side API Services
```typescript
// src/lib/api/recipeApi.ts
export const recipeApi = {
  searchByIngredients: async (params: RecipeSearchParams): Promise<Recipe[]>
  complexSearch: async (params: ComplexSearchParams)
  getRecipeDetails: async (id: number): Promise<RecipeDetail>
}

// src/lib/api/deepseekApi.ts
export const deepseekApi = {
  enhanceRecipe: async (recipe: RecipeDetail): Promise<RecipeEnhancement>
}
```

### 3. Database Layer

#### Supabase Client Configuration
```typescript
// src/lib/supabase/client.ts (Browser)
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// src/lib/supabase/server.ts (Server)
export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(/* ... */);
};
```

---

## 🗄️ Database Schema

### Core Tables

#### 1. User Management
```sql
-- Managed by Supabase Auth
auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Custom profile table
public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  dietary_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### 2. Recipe Enhancement System
```sql
-- Recipe enhancements storage
recipe_enhancements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id TEXT NOT NULL UNIQUE,
  enhancements JSONB NOT NULL,
  categorized_enhancements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- AI validation system
enhancement_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id TEXT NOT NULL,
  ai_enhancements JSONB NOT NULL,
  human_enhancements JSONB NOT NULL,
  validation_results JSONB NOT NULL,
  overall_score DECIMAL(3,2) NOT NULL,
  similarity_score DECIMAL(3,2) NOT NULL,
  relevance_score DECIMAL(3,2) NOT NULL,
  quality_score DECIMAL(3,2) NOT NULL,
  category_accuracy JSONB NOT NULL,
  validated_by UUID REFERENCES auth.users(id),
  validation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### 3. User Activity Tracking
```sql
-- Search history
recent_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  search_query JSONB NOT NULL,
  search_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Saved recipes
saved_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  recipe_id TEXT NOT NULL,
  recipe_data JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
)
```

### Row Level Security (RLS) Policies
```sql
-- Profiles are viewable by everyone but only editable by owner
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Saved recipes are private to each user
CREATE POLICY "Users can view own saved recipes" 
ON saved_recipes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved recipes" 
ON saved_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🔌 API Endpoints

### Internal API Routes

#### Authentication
```typescript
// POST /api/auth/signup
// POST /api/auth/signin
// GET /auth/callback (OAuth callback)
```

#### Recipe Enhancement
```typescript
// POST /api/deepseek/enhance
Request: {
  id: number,
  title: string,
  instructions: string,
  extendedIngredients: Ingredient[]
}

Response: {
  recipeId: number,
  enhancements: string[],
  generatedAt: Date
}
```

### External API Integrations

#### Spoonacular API
```typescript
// Recipe search by ingredients
GET https://api.spoonacular.com/recipes/findByIngredients
Parameters: {
  ingredients: string, // comma-separated
  number: number,
  ranking: number
}

// Complex recipe search
GET https://api.spoonacular.com/recipes/complexSearch
Parameters: {
  query?: string,
  diet?: string,
  intolerances?: string,
  includeIngredients?: string,
  number?: number
}

// Recipe details
GET https://api.spoonacular.com/recipes/{id}/information
Parameters: {
  includeNutrition?: boolean
}
```

#### DeepSeek AI API
```typescript
// Recipe enhancement generation
POST https://api.deepseek.com/v1/chat/completions
Headers: {
  'Authorization': 'Bearer ${API_KEY}',
  'Content-Type': 'application/json'
}

Body: {
  model: 'deepseek-chat',
  messages: [
    {
      role: 'system',
      content: 'Professional chef and nutritionist prompt...'
    },
    {
      role: 'user', 
      content: 'Recipe data and enhancement request...'
    }
  ],
  max_tokens: 1000,
  temperature: 0.7
}
```

---

## 🔐 Authentication System

### Supabase Auth Implementation

#### Sign-Up Flow
```typescript
// src/app/(auth)/signup/page.tsx
const handleEmailSignup = async (e: React.FormEvent) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success('Check your email for verification link');
};
```

#### OAuth Integration
```typescript
const handleGithubLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};
```

#### Protected Routes
```typescript
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Dashboard content for authenticated users
}
```

---

## 🤖 AI Enhancement Engine

### DeepSeek Integration Architecture

#### System Prompt Engineering
```typescript
const systemPrompt = `You are a professional chef and nutritionist. Your task is to analyze recipes and suggest ways to enhance them to be:
1. Healthier - suggest ingredient substitutions and cooking methods that reduce calories, fat, or sodium while maintaining flavor
2. Faster - suggest time-saving techniques, preparation shortcuts, and efficient cooking methods
3. Tastier - suggest professional flavor enhancement techniques and tips to elevate the recipe

IMPORTANT: Provide ONLY the enhancement suggestions as a bulleted list. Do NOT include any introductory sentences like "Here are the enhancements" or "Below are suggestions". Start directly with the enhancement points.

Format each suggestion as:
- [Enhancement description]

Provide 3-5 specific, practical suggestions that a home cook could implement.`;
```

#### Enhancement Processing Pipeline
```typescript
// src/app/api/deepseek/enhance/route.ts
export async function POST(request: Request) {
  // 1. Extract recipe data
  const { title, instructions, extendedIngredients } = await request.json();

  // 2. Format ingredients and instructions
  const ingredientsList = extendedIngredients
    .map(ing => `- ${ing.amount} ${ing.unit} ${ing.name}`)
    .join('\n');

  // 3. Create AI prompt
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Recipe: ${title}\n\nIngredients:\n${ingredientsList}\n\nInstructions:\n${instructions}` }
  ];

  // 4. Call DeepSeek API
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

  // 5. Process and clean response
  const aiResponse = await response.json();
  const rawEnhancements = aiResponse.choices[0].message.content;

  // 6. Clean and filter enhancements
  const cleanedEnhancements = rawEnhancements
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(enhancement => enhancement.length > 10)
    .filter(enhancement => !enhancement.toLowerCase().includes('here are'))
    .filter(enhancement => !enhancement.toLowerCase().includes('suggestions for'));

  // 7. Return structured response
  return NextResponse.json({
    recipeId: parseInt(recipeId),
    enhancements: cleanedEnhancements,
    generatedAt: new Date()
  });
}
```

#### Enhancement Categorization
```typescript
// src/lib/api/recipeEnhancementDbApi.ts
const categorizeEnhancements = (enhancements: string[]): CategorizedEnhancements => {
  const categorized = {
    healthier: [] as string[],
    faster: [] as string[],
    tastier: [] as string[],
    other: [] as string[]
  };

  enhancements.forEach(enhancement => {
    const lowerEnhancement = enhancement.toLowerCase();

    // Healthier keywords
    if (lowerEnhancement.includes('healthy') ||
        lowerEnhancement.includes('substitute') ||
        lowerEnhancement.includes('reduce') ||
        lowerEnhancement.includes('air fry')) {
      categorized.healthier.push(enhancement);
    }
    // Faster keywords
    else if (lowerEnhancement.includes('quick') ||
             lowerEnhancement.includes('save time') ||
             lowerEnhancement.includes('prep ahead')) {
      categorized.faster.push(enhancement);
    }
    // Tastier keywords
    else if (lowerEnhancement.includes('flavor') ||
             lowerEnhancement.includes('season') ||
             lowerEnhancement.includes('taste')) {
      categorized.tastier.push(enhancement);
    }
    else {
      categorized.other.push(enhancement);
    }
  });

  return categorized;
};
```

---

## 🔍 Key Implementation Details

### 1. Recipe Search Implementation

#### Ingredient-Based Search Logic
```typescript
// src/lib/api/recipeApi.ts
export const searchByIngredients = async (params: RecipeSearchParams): Promise<Recipe[]> => {
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

    // If diet filter is specified, get detailed recipe information
    const recipeIds = ingredientResponse.data.map((recipe: any) => recipe.id);
    const detailedRecipes = await Promise.all(
      recipeIds.map(async (id: number) => {
        try {
          const detailResponse = await recipeApiClient.get(`/${id}/information`);
          return detailResponse.data;
        } catch (error) {
          console.error(`Error fetching details for recipe ${id}:`, error);
          return null;
        }
      })
    );

    // Filter by diet and return valid recipes
    return detailedRecipes
      .filter(recipe => recipe !== null)
      .filter(recipe => !params.diet || recipe.diets?.includes(params.diet));

  } catch (error) {
    console.error('Error searching recipes by ingredients:', error);
    throw new Error('Failed to search recipes. Please try again.');
  }
};
```

#### Search Page Component Structure
```typescript
// src/app/recipes/search/page.tsx
export default function RecipeSearchPage() {
  const [searchType, setSearchType] = useState<'ingredients' | 'name'>('ingredients');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipeName, setRecipeName] = useState('');
  const [diet, setDiet] = useState<string>('none');
  const [results, setResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (searchType === 'ingredients') {
      if (ingredients.length === 0) {
        toast.error('Please add at least one ingredient');
        return;
      }

      setIsLoading(true);
      try {
        const searchParams = {
          ingredients,
          diet: diet === "none" ? undefined : diet,
          number: 12
        };

        const results = await recipeApi.searchByIngredients(searchParams);
        setResults(results);

        // Save search for authenticated users
        if (user) {
          await supabase.from('recent_searches').insert({
            user_id: user.id,
            search_query: { type: 'ingredients', ingredients, diet }
          });
        }
      } catch (error) {
        toast.error('Failed to search recipes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
}
```

### 2. Enhancement Validation System

#### Academic Validation Implementation
```typescript
// src/lib/api/enhancementValidationApi.ts
export class EnhancementValidationApi {
  static validateEnhancements(
    recipeId: string,
    aiEnhancements: string[],
    humanEnhancements: string[]
  ): EnhancementValidation {
    const validationResults: ValidationResult[] = [];
    let totalSimilarity = 0;
    let totalRelevance = 0;
    let totalQuality = 0;
    let totalTechnicalAccuracy = 0;

    // Validate each AI enhancement
    aiEnhancements.forEach((aiEnhancement, index) => {
      const aiCategory = this.categorizeEnhancement(aiEnhancement);

      // Find best matches in human enhancements
      const similarities = humanEnhancements.map(humanEnhancement => ({
        enhancement: humanEnhancement,
        similarity: this.calculateSimilarity(aiEnhancement, humanEnhancement),
        category: this.categorizeEnhancement(humanEnhancement)
      }));

      // Get top matches (similarity > 0.2)
      const matches = similarities
        .filter(s => s.similarity > 0.2)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

      const bestSimilarity = matches.length > 0 ? matches[0].similarity : 0;
      const qualityScore = this.assessQuality(aiEnhancement);

      // Analyze parameters (ingredients, time, temperature)
      const parameterAnalysis = this.analyzeParameters(
        aiEnhancement,
        matches.map(m => m.enhancement)
      );

      // Calculate technical accuracy score
      const technicalAccuracy = (
        parameterAnalysis.ingredients.ingredient_match_score * 0.4 +
        parameterAnalysis.time.time_accuracy * 0.3 +
        parameterAnalysis.temperature.temperature_accuracy * 0.3
      );

      validationResults.push({
        ai_enhancement: aiEnhancement,
        best_human_matches: matches,
        similarity_score: bestSimilarity,
        relevance_score: this.assessRelevance(aiEnhancement),
        quality_score: qualityScore,
        technical_accuracy: technicalAccuracy,
        category: aiCategory,
        parameter_analysis: parameterAnalysis
      });

      totalSimilarity += bestSimilarity;
      totalRelevance += this.assessRelevance(aiEnhancement);
      totalQuality += qualityScore;
      totalTechnicalAccuracy += technicalAccuracy;
    });

    // Calculate overall scores
    const count = aiEnhancements.length;
    const overallScore = count > 0 ? (
      (totalSimilarity / count) * 0.3 +
      (totalRelevance / count) * 0.25 +
      (totalQuality / count) * 0.25 +
      (totalTechnicalAccuracy / count) * 0.2
    ) : 0;

    return {
      recipe_id: recipeId,
      ai_enhancements: aiEnhancements,
      human_enhancements: humanEnhancements,
      validation_results: validationResults,
      overall_score: Math.round(overallScore * 100) / 100,
      similarity_score: Math.round((totalSimilarity / count) * 100) / 100,
      relevance_score: Math.round((totalRelevance / count) * 100) / 100,
      quality_score: Math.round((totalQuality / count) * 100) / 100,
      category_accuracy: this.calculateCategoryAccuracy(validationResults),
      created_at: new Date().toISOString()
    };
  }
}
```

### 3. Mobile Responsiveness Implementation

#### Responsive Design Patterns
```typescript
// src/components/ui/RecipeEnhancement.tsx
export function RecipeEnhancement({ recipeTitle, aiEnhancements }: Props) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-xl text-blue-700 truncate">
                AI Enhancement Suggestions
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-blue-600">
                Smart ways to improve this recipe • {totalEnhancements} suggestions
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Mobile-optimized enhancement categories */}
          {renderCategory("💚 Healthier Options", healthierEnhancements)}
          {renderCategory("⚡ Time-Saving Tips", fasterEnhancements)}
          {renderCategory("✨ Flavor Boosters", tastierEnhancements)}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Mobile-First CSS Classes
```css
/* Tailwind CSS responsive patterns used throughout */
.enhancement-card {
  @apply px-3 sm:px-6;           /* Smaller padding on mobile */
  @apply py-3 sm:py-4;           /* Smaller vertical padding on mobile */
  @apply text-sm sm:text-base;   /* Smaller text on mobile */
  @apply gap-2 sm:gap-4;         /* Smaller gaps on mobile */
}

.mobile-button {
  @apply h-8 sm:h-10;            /* Smaller height on mobile */
  @apply px-3 sm:px-4;           /* Smaller horizontal padding */
  @apply text-xs sm:text-sm;     /* Smaller text size */
}

.responsive-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
  @apply gap-3 sm:gap-4 lg:gap-6;
}
```

### 4. Error Handling and Fallbacks

#### API Error Handling
```typescript
// src/lib/api/deepseekApi.ts
export const deepseekApi = {
  enhanceRecipe: async (recipe: RecipeDetail): Promise<RecipeEnhancement> => {
    try {
      const response = await fetch('/api/deepseek/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('DeepSeek API error:', errorData);
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating DeepSeek recipe enhancements:', error);
      // Fall back to rule-based enhancements
      return fallbackEnhancements(recipe);
    }
  }
};

// Fallback enhancement system
function fallbackEnhancements(recipe: RecipeDetail): RecipeEnhancement {
  const enhancements: string[] = [];
  const instructions = recipe.instructions.toLowerCase();

  // Rule-based enhancement generation
  if (instructions.includes('fry') || instructions.includes('sauté')) {
    enhancements.push(
      "For a healthier version: Use an air fryer instead of pan-frying to reduce oil while maintaining texture."
    );
  }

  if (instructions.includes('bake') || instructions.includes('oven')) {
    enhancements.push(
      "Time-saving tip: Preheat your oven while prepping ingredients to reduce total cooking time."
    );
  }

  if (recipe.extendedIngredients.some(ing => ing.name.includes('salt'))) {
    enhancements.push(
      "Flavor enhancement: Try using herb salt or flavored salts to add complexity without extra sodium."
    );
  }

  return {
    recipeId: recipe.id,
    enhancements,
    generatedAt: new Date()
  };
}
```

### 5. Performance Optimizations

#### Image Optimization Component
```typescript
// src/components/ui/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = "",
  priority = false
}: OptimizedImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}
```

#### Loading States and Skeletons
```typescript
// src/components/ui/LoadingSkeleton.tsx
export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function EnhancementSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );
}
```

This technical documentation provides comprehensive coverage of the PantryPal AI system implementation, from architecture to specific code examples that demonstrate how each component works together to create a cohesive, production-ready application.
