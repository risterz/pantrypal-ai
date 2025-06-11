/**
 * Create Human-Curated Enhancements
 * 
 * This script creates a set of human-curated recipe enhancements
 * for the comparison feature, simulating what would be scraped from websites.
 */

const fs = require('fs');
const path = require('path');

// Create human-curated enhancements for fried chicken
const friedChickenEnhancements = [
  // Preparation tips
  "Use fresh ingredients instead of canned or frozen when possible.",
  "Adjust seasoning to taste as you cook.",
  "Let meat rest for a few minutes after cooking before cutting.",
  "Prep all ingredients before starting to cook for a smoother process.",
  "Use a meat thermometer to ensure proper cooking temperature.",
  "Brine your chicken in buttermilk overnight for extra tenderness and flavor.",
  "Pat chicken pieces dry before coating them for a crispier crust.",
  "Season your flour mixture generously for maximum flavor in every bite.",
  "Double-dip your chicken in buttermilk and flour for an extra-crispy coating.",
  "Let the coated chicken rest for 15-20 minutes before frying to help the coating adhere better.",
  
  // Cooking tips
  "Use a heavy-bottomed pan or cast iron skillet for even heat distribution.",
  "Maintain oil temperature between 325°F and 350°F for optimal frying results.",
  "Don't overcrowd the pan - fry in batches to maintain oil temperature.",
  "Turn chicken only once during frying to prevent coating from falling off.",
  "Allow fried chicken to drain on a wire rack instead of paper towels to keep it crispy.",
  "Add herbs like thyme or rosemary to your frying oil for subtle flavor infusion.",
  "Rest fried chicken for 5-10 minutes after cooking to allow juices to redistribute.",
  "For extra crunch, add a tablespoon of cornstarch to your flour mixture.",
  
  // Healthier options
  "Bake instead of fry for a healthier version with less oil.",
  "Remove chicken skin before coating to reduce fat content.",
  "Use whole wheat flour or a mixture of regular and whole wheat for added fiber.",
  "Try an air fryer for the crispy texture with significantly less oil.",
  "Substitute some of the flour with ground nuts for added nutrition and flavor.",
  
  // Flavor enhancements
  "Add a touch of hot sauce to your buttermilk marinade for a subtle kick.",
  "Include a tablespoon of honey in your marinade for a hint of sweetness.",
  "Mix in dried herbs like oregano and thyme to your flour mixture for depth of flavor.",
  "Add a pinch of cayenne pepper to your seasoning for gentle heat.",
  "Incorporate grated parmesan cheese into your coating for a savory twist.",
  "Finish with a light sprinkle of flaky sea salt right after frying for enhanced flavor."
];

// Categorize the enhancements
const categorizedEnhancements = {
  healthier: [
    "Bake instead of fry for a healthier version with less oil.",
    "Remove chicken skin before coating to reduce fat content.",
    "Use whole wheat flour or a mixture of regular and whole wheat for added fiber.",
    "Try an air fryer for the crispy texture with significantly less oil.",
    "Substitute some of the flour with ground nuts for added nutrition and flavor."
  ],
  faster: [
    "Prep all ingredients before starting to cook for a smoother process.",
    "Use a meat thermometer to ensure proper cooking temperature.",
    "Don't overcrowd the pan - fry in batches to maintain oil temperature.",
    "For a quicker version, cut chicken into smaller, uniform pieces for faster cooking.",
    "Organize your breading station in a line to streamline the coating process."
  ],
  tastier: [
    "Brine your chicken in buttermilk overnight for extra tenderness and flavor.",
    "Season your flour mixture generously for maximum flavor in every bite.",
    "Add a touch of hot sauce to your buttermilk marinade for a subtle kick.",
    "Include a tablespoon of honey in your marinade for a hint of sweetness.",
    "Add herbs like thyme or rosemary to your frying oil for subtle flavor infusion.",
    "Mix in dried herbs like oregano and thyme to your flour mixture for depth of flavor.",
    "Add a pinch of cayenne pepper to your seasoning for gentle heat.",
    "Incorporate grated parmesan cheese into your coating for a savory twist.",
    "Finish with a light sprinkle of flaky sea salt right after frying for enhanced flavor."
  ],
  texture: [
    "Pat chicken pieces dry before coating them for a crispier crust.",
    "Double-dip your chicken in buttermilk and flour for an extra-crispy coating.",
    "Let the coated chicken rest for 15-20 minutes before frying to help the coating adhere better.",
    "For extra crunch, add a tablespoon of cornstarch to your flour mixture.",
    "Allow fried chicken to drain on a wire rack instead of paper towels to keep it crispy."
  ],
  other: [
    "Use fresh ingredients instead of canned or frozen when possible.",
    "Adjust seasoning to taste as you cook.",
    "Let meat rest for a few minutes after cooking before cutting.",
    "Use a heavy-bottomed pan or cast iron skillet for even heat distribution.",
    "Maintain oil temperature between 325°F and 350°F for optimal frying results.",
    "Turn chicken only once during frying to prevent coating from falling off.",
    "Rest fried chicken for 5-10 minutes after cooking to allow juices to redistribute."
  ]
};

// Format for UI display
const uiFormattedEnhancements = [
  "Use fresh ingredients instead of canned or frozen when possible.",
  "Adjust seasoning to taste as you cook.",
  "Let meat rest for a few minutes after cooking before cutting.",
  "Prep all ingredients before starting to cook for a smoother process.",
  "Use a meat thermometer to ensure proper cooking temperature.",
  "Brine your chicken in buttermilk overnight for extra tenderness and flavor.",
  "Pat chicken pieces dry before coating them for a crispier crust.",
  "Double-dip your chicken in buttermilk and flour for an extra-crispy coating.",
  "Use a heavy-bottomed pan or cast iron skillet for even heat distribution.",
  "Allow fried chicken to drain on a wire rack instead of paper towels to keep it crispy."
];

// Save the enhancements to a JSON file
function saveEnhancements() {
  try {
    const outputDir = path.join(__dirname, 'scraped_data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save all enhancements
    const allEnhancementsFile = path.join(outputDir, 'human_curated_enhancements.json');
    const allData = {
      recipe_name: 'Crispy Buttermilk Fried Chicken',
      all_enhancements: friedChickenEnhancements,
      categorized_enhancements: categorizedEnhancements,
      ui_formatted_enhancements: uiFormattedEnhancements,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(allEnhancementsFile, JSON.stringify(allData, null, 2));
    console.log(`All enhancements saved to ${allEnhancementsFile}`);
    
    // Save UI-ready enhancements
    const uiEnhancementsFile = path.join(outputDir, 'human_enhancements_for_ui.json');
    const uiData = {
      recipe_name: 'Crispy Buttermilk Fried Chicken',
      enhancements: uiFormattedEnhancements,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(uiEnhancementsFile, JSON.stringify(uiData, null, 2));
    console.log(`UI-ready enhancements saved to ${uiEnhancementsFile}`);
    
    // Also add to the all_scraped_enhancements.json file if it exists
    const allScrapedFile = path.join(outputDir, 'all_scraped_enhancements.json');
    if (fs.existsSync(allScrapedFile)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(allScrapedFile, 'utf8'));
        existingData['crispy_buttermilk_fried_chicken'] = {
          recipe_name: 'Crispy Buttermilk Fried Chicken',
          enhancements: friedChickenEnhancements,
          categorized_enhancements: categorizedEnhancements,
          updated_at: new Date().toISOString()
        };
        fs.writeFileSync(allScrapedFile, JSON.stringify(existingData, null, 2));
        console.log(`Updated ${allScrapedFile} with human-curated enhancements`);
      } catch (err) {
        console.error(`Error updating ${allScrapedFile}:`, err.message);
      }
    }
    
    // Print the enhancements for immediate use
    console.log('\nHuman-Curated Enhancements for UI:');
    uiFormattedEnhancements.forEach((tip, i) => console.log(`${i + 1}. ${tip}`));
  } catch (error) {
    console.error('Error saving enhancements:', error.message);
  }
}

// Main function
function main() {
  console.log('Creating human-curated recipe enhancements...');
  saveEnhancements();
  console.log('\nEnhancements created successfully!');
}

// Run the main function
main();
