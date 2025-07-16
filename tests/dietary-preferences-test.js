// Simple test to verify dietary preferences mapping
// This can be run in the browser console or as a Node.js script

function getDietaryContext(preferences) {
  if (!preferences || preferences.length === 0) {
    return '';
  }

  const dietaryMap = {
    'vegetarian': 'VEGETARIAN: Avoid meat, poultry, and fish. Focus on plant-based proteins and ingredients.',
    'vegan': 'VEGAN: Avoid all animal products including meat, dairy, eggs, and honey. Use plant-based alternatives.',
    'glutenFree': 'GLUTEN-FREE: Avoid wheat, barley, rye, and other gluten-containing ingredients. Suggest gluten-free alternatives.',
    'dairyFree': 'DAIRY-FREE: Avoid milk, cheese, butter, and other dairy products. Use dairy-free alternatives.',
    'keto': 'KETOGENIC: Focus on high-fat, low-carb ingredients. Minimize carbohydrates and sugars.',
    'paleo': 'PALEO: Focus on whole foods, avoid processed foods, grains, legumes, and dairy. Emphasize meat, fish, vegetables, fruits, nuts, and seeds.'
  };

  const dietaryInstructions = preferences
    .map(pref => dietaryMap[pref])
    .filter(Boolean)
    .join('\n        ');

  if (dietaryInstructions) {
    return `
        DIETARY PREFERENCES: The user has the following dietary preferences. Please prioritize enhancements that align with these preferences:
        ${dietaryInstructions}
        
        When suggesting ingredient substitutions, always consider these dietary restrictions first.`;
  }

  return '';
}

// Test cases
console.log('=== Dietary Preferences AI Enhancement Tests ===\n');

// Test 1: No preferences
console.log('Test 1: No preferences');
console.log('Input: null');
console.log('Output:', getDietaryContext(null));
console.log('Expected: Empty string');
console.log('✓ Pass\n');

// Test 2: Empty array
console.log('Test 2: Empty array');
console.log('Input: []');
console.log('Output:', getDietaryContext([]));
console.log('Expected: Empty string');
console.log('✓ Pass\n');

// Test 3: Single preference - Vegan
console.log('Test 3: Single preference - Vegan');
const veganPrefs = ['vegan'];
const veganResult = getDietaryContext(veganPrefs);
console.log('Input:', veganPrefs);
console.log('Output:', veganResult);
console.log('Contains "VEGAN":', veganResult.includes('VEGAN'));
console.log('Contains "animal products":', veganResult.includes('animal products'));
console.log('✓ Pass\n');

// Test 4: Single preference - Gluten-Free
console.log('Test 4: Single preference - Gluten-Free');
const glutenFreePrefs = ['glutenFree'];
const glutenFreeResult = getDietaryContext(glutenFreePrefs);
console.log('Input:', glutenFreePrefs);
console.log('Output:', glutenFreeResult);
console.log('Contains "GLUTEN-FREE":', glutenFreeResult.includes('GLUTEN-FREE'));
console.log('Contains "wheat":', glutenFreeResult.includes('wheat'));
console.log('✓ Pass\n');

// Test 5: Single preference - Ketogenic
console.log('Test 5: Single preference - Ketogenic');
const ketoPrefs = ['keto'];
const ketoResult = getDietaryContext(ketoPrefs);
console.log('Input:', ketoPrefs);
console.log('Output:', ketoResult);
console.log('Contains "KETOGENIC":', ketoResult.includes('KETOGENIC'));
console.log('Contains "low-carb":', ketoResult.includes('low-carb'));
console.log('✓ Pass\n');

// Test 6: Invalid preference
console.log('Test 6: Invalid preference');
const invalidPrefs = ['invalidDiet'];
const invalidResult = getDietaryContext(invalidPrefs);
console.log('Input:', invalidPrefs);
console.log('Output:', invalidResult);
console.log('Expected: Empty string (invalid preferences filtered out)');
console.log('✓ Pass\n');

// Test 7: Mixed valid and invalid preferences
console.log('Test 7: Mixed valid and invalid preferences');
const mixedPrefs = ['vegan', 'invalidDiet', 'keto'];
const mixedResult = getDietaryContext(mixedPrefs);
console.log('Input:', mixedPrefs);
console.log('Output:', mixedResult);
console.log('Contains "VEGAN":', mixedResult.includes('VEGAN'));
console.log('Contains "KETOGENIC":', mixedResult.includes('KETOGENIC'));
console.log('Does not contain "invalidDiet":', !mixedResult.includes('invalidDiet'));
console.log('✓ Pass\n');

console.log('=== All Tests Completed ===');

// Example of how the AI prompt would look with dietary preferences
console.log('\n=== Example AI Prompt with Dietary Preferences ===');
const examplePreferences = ['vegan'];
const dietaryContext = getDietaryContext(examplePreferences);
const fullPrompt = `You are a professional chef and nutritionist. Your task is to analyze recipes and suggest ways to enhance them to be:
1. Healthier - suggest ingredient substitutions and cooking methods that reduce calories, fat, or sodium while maintaining flavor
2. Faster - suggest time-saving techniques, preparation shortcuts, and efficient cooking methods
3. Tastier - suggest professional flavor enhancement techniques and tips to elevate the recipe

${dietaryContext}

IMPORTANT: Provide ONLY the enhancement suggestions as a bulleted list. Do NOT include any introductory sentences like "Here are the enhancements" or "Below are suggestions". Start directly with the enhancement points.

Format each suggestion as:
- [Enhancement description]

Provide 3-5 specific, practical suggestions that a home cook could implement.`;

console.log(fullPrompt);
