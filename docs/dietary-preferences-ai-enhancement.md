# Dietary Preferences AI Enhancement Feature

## Overview

The PantryPal AI system now includes personalized recipe enhancement based on user dietary preferences. When users have dietary preferences set in their profile, the DeepSeek AI will tailor its recipe enhancement suggestions to align with those preferences.

## How It Works

### 1. User Profile Setup
- Users can set their dietary preferences in their profile page
- Available options: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Ketogenic, Paleo
- Single-select preference system (users choose one primary dietary preference)

### 2. AI Enhancement Process
When generating recipe enhancements:
1. **User Authentication Check**: System checks if user is logged in
2. **Dietary Preferences Fetch**: Retrieves user's dietary preferences from the database
3. **AI Prompt Customization**: Modifies the DeepSeek AI prompt to include dietary-specific instructions
4. **Enhanced Suggestions**: AI generates suggestions that prioritize the user's dietary requirements

### 3. Dietary-Specific AI Instructions

The system provides specific instructions to the AI for each dietary preference:

- **Vegetarian**: Avoid meat, poultry, and fish. Focus on plant-based proteins
- **Vegan**: Avoid all animal products including meat, dairy, eggs, and honey
- **Gluten-Free**: Avoid wheat, barley, rye, and suggest gluten-free alternatives
- **Dairy-Free**: Avoid milk, cheese, butter, and suggest dairy-free alternatives
- **Ketogenic**: Focus on high-fat, low-carb ingredients, minimize carbohydrates
- **Paleo**: Focus on whole foods, avoid processed foods, grains, legumes, and dairy

## Technical Implementation

### Backend Changes

#### 1. API Route Enhancement (`src/app/api/deepseek/enhance/route.ts`)
```typescript
interface EnhanceRecipeRequest {
  recipe: RecipeDetail;
  userDietaryPreferences?: string[] | null;
}

function getDietaryContext(preferences: string[] | null | undefined): string {
  // Maps dietary preferences to AI instructions
  // Returns formatted dietary context for AI prompt
}
```

#### 2. Client API Update (`src/lib/api/deepseekApi.ts`)
```typescript
enhanceRecipe: async (recipe: RecipeDetail, userDietaryPreferences?: string[] | null)
```

### Frontend Changes

#### 1. Recipe Detail Page (`src/app/recipes/[id]/page.tsx`)
- Added `userDietaryPreferences` state
- Added `fetchUserDietaryPreferences()` function
- Updated DeepSeek API call to pass dietary preferences
- Added visual indicator when dietary preferences are active

#### 2. User Experience Improvements
- Toast messages indicate when dietary preferences are being considered
- Visual indicator shows which dietary preferences are active
- Enhanced logging for debugging dietary preference integration

## User Experience

### For Users Without Dietary Preferences
- System works exactly as before
- No changes to the enhancement generation process
- Standard AI enhancement suggestions are provided

### For Users With Dietary Preferences
- Enhanced toast message: "Generating AI-enhanced recipe suggestions based on your dietary preferences..."
- Green indicator badge showing active dietary preferences
- AI suggestions prioritize dietary-compliant alternatives
- Ingredient substitutions align with dietary restrictions

## Example Enhancement Differences

### Standard Enhancement (No Dietary Preferences)
- "Substitute heavy cream with Greek yogurt for a lighter version"
- "Use butter for richer flavor"

### Vegan Enhancement
- "Substitute heavy cream with coconut milk or cashew cream for a plant-based version"
- "Use vegan butter or coconut oil instead of dairy butter"

### Gluten-Free Enhancement
- "Replace regular flour with almond flour or gluten-free flour blend"
- "Use gluten-free breadcrumbs or crushed nuts for coating"

## Benefits

1. **Personalization**: Tailored suggestions based on individual dietary needs
2. **Accessibility**: Makes recipes more accessible to users with dietary restrictions
3. **Educational**: Helps users learn about dietary-compliant alternatives
4. **Seamless Integration**: Works automatically without additional user input
5. **Fallback Support**: Gracefully handles users without dietary preferences

## Future Enhancements

1. **Multiple Dietary Preferences**: Support for multiple simultaneous preferences
2. **Allergy Considerations**: Integration with food allergy information
3. **Nutritional Analysis**: Enhanced nutritional information based on dietary preferences
4. **Learning System**: AI learns from user feedback on dietary-specific suggestions
5. **Recipe Filtering**: Pre-filter recipes based on dietary compatibility

## Testing

To test the feature:
1. Create a user account and set dietary preferences in the profile
2. Search for a recipe and view its details
3. Observe the enhanced AI suggestions that align with dietary preferences
4. Compare suggestions with and without dietary preferences set

## Difficulty Assessment

**Implementation Difficulty: Easy to Medium**

The feature was straightforward to implement because:
- Existing user profile system already stored dietary preferences
- DeepSeek AI API was already integrated
- Required minimal changes to existing codebase
- Leveraged existing authentication and database systems

The main complexity was in:
- Mapping dietary preferences to appropriate AI instructions
- Ensuring graceful handling of edge cases (no preferences, invalid preferences)
- Maintaining backward compatibility for users without preferences
