# Cooking Level System Documentation

## Overview
The Cooking Level System is a gamification feature in PantryPal AI that tracks user engagement and assigns cooking skill levels based on recipe search activity. This system encourages user exploration and provides a visual representation of their cooking journey.

## System Architecture

### 1. Data Flow
```
User Recipe Search → Database Storage → Statistics Calculation → Level Determination → UI Display
```

### 2. Components Involved
- **Dashboard Page** (`src/app/dashboard/page.tsx`) - Main display and calculation logic
- **Search Page** (`src/app/recipes/search/page.tsx`) - Search tracking and data storage
- **Supabase Database** - `recent_searches` table for persistent storage

## Technical Implementation

### 1. State Management
**File**: `src/app/dashboard/page.tsx` (Lines 16-21)
```typescript
const [stats, setStats] = useState({
  totalSearches: 0,
  totalSavedRecipes: 0,
  thisWeekSearches: 0,
  favoriteIngredients: [] as string[]
});
```

### 2. Data Initialization Process
**File**: `src/app/dashboard/page.tsx` (Lines 39-58)
The system initializes through a multi-step process:

```typescript
// Step 1: Initial data fetch trigger
fetchData();

// Step 2: Authentication check and user data loading
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
```

### 3. Statistics Calculation
**File**: `src/app/dashboard/page.tsx` (Lines 85-88, 118-123)
```typescript
// Calculate statistics from database
const { data: allSearches } = await supabase
  .from('recent_searches')
  .select('*')
  .eq('user_id', user.id);

// Set total searches count
setStats({
  totalSearches: (allSearches || []).length,  // ← KEY LINE: Line 119
  totalSavedRecipes: (allRecipes || []).length,
  thisWeekSearches,
  favoriteIngredients
});
```

### 4. Level Determination Logic
**File**: `src/app/dashboard/page.tsx` (Lines 239-241)
```typescript
{stats.totalSearches > 20 ? 'Expert' : stats.totalSearches > 10 ? 'Intermediate' : 'Beginner'}
```

**Level Thresholds:**
- **Beginner**: 0-10 searches
- **Intermediate**: 11-20 searches
- **Expert**: 21+ searches

### 5. Search Tracking Implementation
**File**: `src/app/recipes/search/page.tsx` (Lines 106-114 & 136-144)
Every recipe search is automatically tracked:

```typescript
// For ingredient-based searches (Lines 106-114)
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

// For name-based searches (Lines 136-144)
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
```

## Database Schema

### recent_searches Table
```sql
CREATE TABLE recent_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - Unique identifier for each search
- `user_id` - Reference to authenticated user
- `search_query` - JSON object containing search parameters
- `created_at` - Timestamp for search tracking

## UI Components

### 1. Cooking Level Card Display
**File**: `src/app/dashboard/page.tsx` (Lines 234-249)
```typescript
<Card className="border-l-4 border-l-amber-500">
  <CardContent className="p-3 sm:p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-600">Cooking Level</p>
        <p className="text-sm sm:text-2xl font-bold text-gray-900">
          {stats.totalSearches > 20 ? 'Expert' : stats.totalSearches > 10 ? 'Intermediate' : 'Beginner'}
        </p>
      </div>
      <div className="bg-amber-500 bg-opacity-10 p-2 sm:p-3 rounded-full">
        <ChefHat className="h-4 w-4 sm:h-6 sm:w-6 text-amber-500" />
      </div>
    </div>
  </CardContent>
</Card>
```

### 2. Visual Design Elements
- **Color Scheme**: Amber (#F59E0B) for cooking/chef theme
- **Icon**: ChefHat from Lucide React
- **Responsive Design**: Adapts to mobile and desktop screens
- **Border Accent**: Left border highlighting the card

## Features and Benefits

### 1. Gamification Elements
- **Progress Tracking**: Visual representation of user engagement
- **Achievement System**: Clear milestones (Beginner → Intermediate → Expert)
- **Motivation**: Encourages users to explore more recipes

### 2. User Experience
- **Real-time Updates**: Level updates immediately after searches
- **Visual Feedback**: Clear, prominent display on dashboard
- **Responsive Design**: Works across all device sizes

### 3. Data Analytics
- **User Engagement Metrics**: Track how actively users search for recipes
- **Progression Analysis**: Understand user journey and retention
- **Feature Usage**: Measure effectiveness of search functionality

## Technical Considerations

### 1. Performance
- **Efficient Queries**: Single database query to count all user searches
- **Caching**: Stats calculated once per dashboard load
- **Minimal Overhead**: Simple counting logic with no complex calculations

### 2. Scalability
- **Database Indexing**: `user_id` indexed for fast queries
- **Query Optimization**: Uses Supabase's optimized PostgreSQL queries
- **Memory Efficient**: Minimal state storage for statistics

### 3. Security
- **Row Level Security**: Only users can access their own search data
- **Authentication Required**: Level tracking only for logged-in users
- **Data Privacy**: Search queries stored securely with user consent

## Future Enhancements

### 1. Advanced Level System
- More granular levels (Novice, Apprentice, Chef, Master Chef, etc.)
- Skill-based categories (Baking, Grilling, International Cuisine)
- Time-based achievements (Daily streaks, weekly goals)

### 2. Social Features
- Level sharing and comparison with friends
- Cooking challenges and competitions
- Community leaderboards

### 3. Personalization
- Level-appropriate recipe recommendations
- Difficulty-based recipe filtering
- Skill-building recipe suggestions

## Troubleshooting

### Common Issues
1. **Level not updating**: Check user authentication and database connectivity
2. **Incorrect count**: Verify `recent_searches` table data integrity
3. **Performance issues**: Monitor database query performance

### Debug Steps
1. Check browser console for authentication errors
2. Verify Supabase connection and RLS policies
3. Test search functionality and database insertions
4. Validate statistics calculation logic

## Code Location Summary

### 📍 **Key File Locations & Line Numbers:**

#### **Main Dashboard Logic**
- **File**: `src/app/dashboard/page.tsx`
  - **Lines 16-21**: Stats state initialization
  - **Lines 85-88**: Database query for all searches
  - **Lines 118-123**: Statistics calculation (KEY: Line 119 counts searches)
  - **Lines 234-249**: UI display of cooking level card
  - **Lines 239-241**: Level determination logic (Beginner/Intermediate/Expert)

#### **Search Tracking Logic**
- **File**: `src/app/recipes/search/page.tsx`
  - **Lines 106-114**: Ingredient search tracking
  - **Lines 136-144**: Recipe name search tracking

#### **Database Schema**
- **Table**: `recent_searches` in Supabase
  - Stores all user search activities
  - Referenced by dashboard for counting total searches

### 🔄 **Complete Data Flow:**
1. **Search Action** → `src/app/recipes/search/page.tsx` (Lines 106-114, 136-144)
2. **Database Storage** → `recent_searches` table
3. **Count Calculation** → `src/app/dashboard/page.tsx` (Line 119)
4. **Level Logic** → `src/app/dashboard/page.tsx` (Lines 239-241)
5. **UI Display** → `src/app/dashboard/page.tsx` (Lines 234-249)

## Conclusion
The Cooking Level System provides an engaging way to track user progress while encouraging recipe exploration. Its simple yet effective design makes it a valuable addition to the PantryPal AI user experience, combining gamification with practical functionality.
