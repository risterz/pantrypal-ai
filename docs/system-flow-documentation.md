# PantryPal AI - System Flow Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Journey Flow](#user-journey-flow)
3. [Authentication Flow](#authentication-flow)
4. [Recipe Search Flow](#recipe-search-flow)
5. [AI Enhancement Flow](#ai-enhancement-flow)
6. [Data Flow Architecture](#data-flow-architecture)
7. [API Integration Flow](#api-integration-flow)
8. [Database Operations Flow](#database-operations-flow)

---

## 🏗️ System Overview

PantryPal AI is a modern web application built with Next.js 15 that helps users discover and enhance recipes using AI technology. The system follows a client-server architecture with external API integrations and a comprehensive database layer.

### Core Components
- **Frontend**: React 19 + Next.js 15 with App Router
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI Engine**: DeepSeek API for recipe enhancement
- **External APIs**: Spoonacular API for recipe data
- **Deployment**: Vercel with automatic CI/CD

---

## 👤 User Journey Flow

### 1. Initial Landing
```
User visits https://www.pantrypal-ai.space/
    ↓
Homepage loads with navigation and hero section
    ↓
User can choose:
    - Browse without authentication (Search Recipes)
    - Sign up for personalized features
    - Sign in to existing account
```

### 2. Recipe Discovery Journey
```
User clicks "Search Recipes"
    ↓
Redirected to /recipes/search
    ↓
User selects search method:
    - Search by Ingredients (default)
    - Search by Recipe Name
    ↓
User inputs search criteria:
    - Ingredients: chicken, tomatoes, etc.
    - Dietary preferences: vegan, gluten-free, etc.
    ↓
System processes search request
    ↓
Results displayed with recipe cards
    ↓
User clicks on recipe → Recipe detail page
    ↓
AI enhancement suggestions generated and displayed
```

### 3. Authenticated User Journey
```
User signs in
    ↓
Redirected to /dashboard
    ↓
Dashboard shows:
    - Saved recipes
    - Recent searches
    - Enhancement statistics
    - Quick actions
    ↓
User can:
    - Save favorite recipes
    - View enhancement history
    - Manage profile settings
```

---

## 🔐 Authentication Flow

### Sign-Up Process
```
User clicks "Sign Up"
    ↓
/signup page loads
    ↓
User chooses authentication method:
    - Email/Password
    - GitHub OAuth
    - Google OAuth
    ↓
Supabase Auth processes request
    ↓
If successful:
    - User profile created in profiles table
    - Session established
    - Redirected to /dashboard
    ↓
If error:
    - Error message displayed
    - User remains on signup page
```

### Sign-In Process
```
User clicks "Sign In"
    ↓
/login page loads
    ↓
User enters credentials or chooses OAuth
    ↓
Supabase Auth validates credentials
    ↓
If successful:
    - Session cookie set
    - User redirected to intended page or /dashboard
    ↓
If error:
    - Error toast displayed
    - User remains on login page
```

### OAuth Flow (GitHub/Google)
```
User clicks OAuth provider button
    ↓
Supabase initiates OAuth flow
    ↓
User redirected to provider (GitHub/Google)
    ↓
User authorizes application
    ↓
Provider redirects to /auth/callback
    ↓
Callback route exchanges code for session
    ↓
User redirected to /dashboard with active session
```

---

## 🔍 Recipe Search Flow

### Ingredient-Based Search
```
User enters ingredients: "chicken, tomatoes, onions"
    ↓
Frontend validates input (minimum 1 ingredient)
    ↓
Search parameters prepared:
    - ingredients: ["chicken", "tomatoes", "onions"]
    - diet: user selection (optional)
    - number: 12 (default)
    ↓
API call to recipeApi.searchByIngredients()
    ↓
Spoonacular API called via /findByIngredients endpoint
    ↓
Results processed and filtered
    ↓
Recipe cards rendered with:
    - Recipe image
    - Title and summary
    - Used/missed ingredients
    - Cooking time and servings
    ↓
User clicks recipe → Navigate to /recipes/[id]
```

### Recipe Name Search
```
User switches to "Search by Recipe Name" tab
    ↓
User enters recipe name: "chicken parmesan"
    ↓
Frontend validates input
    ↓
API call to recipeApi.complexSearch()
    ↓
Spoonacular API called via /complexSearch endpoint
    ↓
Results filtered by dietary preferences (if any)
    ↓
Recipe cards displayed
    ↓
User selects recipe for detailed view
```

---

## 🤖 AI Enhancement Flow

### Enhancement Generation Process
```
User views recipe detail page (/recipes/[id])
    ↓
System checks for existing enhancements:
    - Query recipe_enhancements table
    - Check by recipe_id
    ↓
If enhancements exist:
    - Load from database
    - Display categorized suggestions
    ↓
If no enhancements exist:
    - Check if DeepSeek AI is enabled
    - Generate new enhancements
```

### DeepSeek AI Enhancement Generation
```
Recipe data prepared for AI processing:
    - Title: "Chicken Parmesan"
    - Ingredients: ["chicken breast", "parmesan cheese", ...]
    - Instructions: ["Preheat oven to 375°F", ...]
    ↓
API call to /api/deepseek/enhance
    ↓
Server-side DeepSeek API integration:
    - System prompt with enhancement guidelines
    - Recipe data formatted for AI
    - API call to DeepSeek with authentication
    ↓
AI generates enhancement suggestions:
    - Healthier alternatives
    - Time-saving techniques
    - Flavor enhancement tips
    ↓
Response processed and cleaned:
    - Remove introductory phrases
    - Filter out short/invalid suggestions
    - Categorize enhancements
    ↓
Enhancements stored in database:
    - recipe_enhancements table
    - Categorized format for display
    ↓
Enhancements displayed to user:
    - 💚 Healthier Options
    - ⚡ Time-Saving Tips
    - ✨ Flavor Boosters
```

### Enhancement System (Simplified)
```
AI enhancements generated
    ↓
Enhancements categorized by type:
    - Healthier suggestions
    - Faster cooking methods
    - Tastier improvements
    - Other enhancements
    ↓
Enhancements displayed to user with clear categorization
    ↓
User can view and apply suggested improvements
```

---

## 🏛️ Data Flow Architecture

### Frontend → Backend Flow
```
React Components
    ↓
Custom Hooks (useAuth, useRecipes)
    ↓
API Client Functions (recipeApi, deepseekApi)
    ↓
Next.js API Routes (/api/*)
    ↓
External Services (Supabase, DeepSeek, Spoonacular)
```

### Database Operations Flow
```
User Action (save recipe, generate enhancement)
    ↓
Frontend API call
    ↓
Supabase Client (browser or server)
    ↓
Database Operation (INSERT, UPDATE, SELECT)
    ↓
Row Level Security (RLS) validation
    ↓
Response returned to frontend
    ↓
UI updated with new data
```

---

## 🔌 API Integration Flow

### Spoonacular API Integration
```
User search request
    ↓
recipeApi.searchByIngredients() or recipeApi.complexSearch()
    ↓
Axios HTTP client with API key authentication
    ↓
Spoonacular API endpoints:
    - /findByIngredients
    - /complexSearch
    - /{id}/information
    ↓
Response data processed and typed
    ↓
Recipe objects returned to frontend
```

### DeepSeek AI Integration
```
Recipe enhancement request
    ↓
deepseekApi.enhanceRecipe()
    ↓
Next.js API route: /api/deepseek/enhance
    ↓
Server-side API call to DeepSeek:
    - Authentication with Bearer token
    - Structured prompt with recipe data
    - Temperature and max_tokens configuration
    ↓
AI response processed:
    - Text cleaning and filtering
    - Enhancement categorization
    - Fallback to rule-based enhancements if API fails
    ↓
Enhanced recipe data returned
```

### Supabase Integration
```
Database operation needed
    ↓
Supabase client (createClient())
    ↓
Authentication check (if required)
    ↓
Database query with RLS policies applied
    ↓
Real-time subscriptions (for live updates)
    ↓
Response data typed with TypeScript
    ↓
Frontend state updated
```

---

## 💾 Database Operations Flow

### User Profile Management
```
User signs up
    ↓
Supabase Auth creates user in auth.users
    ↓
Trigger creates profile in public.profiles
    ↓
Profile data includes:
    - username
    - avatar_url
    - dietary_preferences
    - timestamps
```

### Recipe Enhancement Storage
```
AI enhancement generated
    ↓
Check existing enhancement:
    SELECT * FROM recipe_enhancements WHERE recipe_id = ?
    ↓
If exists: UPDATE with new data
If not exists: INSERT new record
    ↓
Data stored:
    - recipe_id (string)
    - enhancements (JSONB array)
    - categorized_enhancements (JSONB object)
    - timestamps
```

### Search History Tracking
```
Authenticated user performs search
    ↓
Search parameters saved to recent_searches:
    - user_id
    - search_query (JSONB)
    - search_type (ingredients/name)
    - timestamp
    ↓
Used for dashboard analytics and user insights
```

This system flow documentation provides a comprehensive overview of how PantryPal AI operates from user interaction to data storage, ensuring maintainability and scalability of the application.
