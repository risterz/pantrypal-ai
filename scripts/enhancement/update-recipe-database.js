// Script to update the recipe_enhancements table in Supabase with fixed enhancements
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Import fixed enhancements
const fixedEnhancements = {
  // Spaghetti with Smoked Salmon and Prawns
  "654959": [
    "Reduce Oil & Boost Flavor – Cut the olive oil from ¼ cup to 2 tbsp and add a splash of low-sodium vegetable or seafood broth to keep moisture while reducing fat.",
    "Whole-Grain or Legume Pasta – Swap regular spaghetti for whole-wheat or chickpea pasta for extra fiber and protein, keeping you fuller longer.",
    "Lighten the Sodium – Since smoked salmon is already salty, skip seasoning the prawns with extra salt and rely on herbs (like extra dill or lemon zest) for flavor.",
    "Cook Pasta & Protein Simultaneously – While the pasta boils, sauté the garlic and prawns in a separate pan to save time.",
    "Pre-Chopped Garlic & Herbs – Use pre-minced garlic (or a garlic press) and pre-washed dill to speed up prep.",
    "Frozen Pre-Cooked Prawns – If short on time, use pre-cooked frozen prawns—just thaw, pat dry, and quickly warm in the pan.",
    "Brighten with Lemon – Add a squeeze of fresh lemon juice and zest at the end to cut through the richness of the salmon and enhance the seafood flavors.",
    "Toasted Breadcrumbs for Crunch – Toss in a sprinkle of toasted panko or almond breadcrumbs for texture contrast.",
    "Infuse the Oil – Warm the olive oil with garlic and a pinch of red pepper flakes before adding prawns for a deeper, spicier flavor base.",
    "Reserve Pasta Water – Before draining, save ½ cup starchy pasta water to mix into the sauce—it helps bind everything silkily to the spaghetti."
  ],
  
  // Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs
  "716429": [
    "Roast the Cauliflower – Instead of boiling, roast cauliflower at 425°F for 20 minutes for deeper flavor and better texture.",
    "Whole Grain Upgrade – Use whole wheat pasta for more fiber, nutrients, and a nuttier flavor that complements the breadcrumbs.",
    "Add Protein – Include white beans or chickpeas for a protein boost that makes this a more complete meal.",
    "Lemon Zest Finish – Add fresh lemon zest at the end to brighten all the flavors and cut through the richness.",
    "Toast Breadcrumbs with Herbs – Mix dried herbs like oregano or thyme into the breadcrumbs while toasting for more flavor complexity.",
    "Reduce Oil – Cut the oil by 25% and add a splash of vegetable broth to maintain moisture with fewer calories.",
    "Caramelize the Scallions – Cook the white parts of the scallions longer to caramelize them for a sweeter, more complex flavor.",
    "Add Nutritional Yeast – Sprinkle nutritional yeast into the breadcrumb mixture for a cheesy flavor without dairy.",
    "Spice it Up – Add red pepper flakes for a gentle heat that enhances the garlic and scallion flavors.",
    "Save Pasta Water – Reserve 1/2 cup of starchy pasta water to help the sauce cling better to the pasta."
  ],
  
  // Bacon Wrapped Filet Mignon
  "633338": [
    "Leaner Bacon Option – Use center-cut or turkey bacon which has 30% less fat than regular bacon while still providing flavor.",
    "Herb Crust Enhancement – Create a crust with fresh herbs (rosemary, thyme) and cracked pepper instead of salt-heavy seasonings.",
    "Portion Control – Serve a 4-5oz filet instead of 8oz, paired with more vegetables for a balanced plate.",
    "Cooking Method Refinement – Use a cast-iron skillet to achieve a perfect sear with less butter or oil.",
    "Compound Butter Alternative – Replace butter with a small amount of olive oil infused with garlic and herbs.",
    "Quick Marinade – Brush steaks with balsamic vinegar 15 minutes before cooking for enhanced flavor and tenderness.",
    "Mushroom Enhancement – Serve with sautéed mushrooms which complement the beef flavor while adding nutrients.",
    "Rest Properly – Let the steak rest for 5-7 minutes after cooking for optimal juiciness and texture.",
    "Temperature Precision – Use a meat thermometer to cook to exactly 130-135°F for medium-rare, preventing overcooking.",
    "Sauce Modification – Make a red wine reduction with less butter and more herbs for a lighter finishing sauce."
  ],
  
  // Bruschetta Style Pork & Pasta
  "715538": [
    "Lean Protein Swap – Use pork tenderloin instead of fattier cuts to reduce calories while maintaining tenderness.",
    "Whole Grain Pasta – Replace regular pasta with whole wheat for added fiber and nutrients.",
    "Amp Up the Vegetables – Double the tomatoes and add diced bell peppers for more vitamins and flavor.",
    "Fresh Herbs Boost – Add fresh basil and oregano just before serving for brighter flavor.",
    "Balsamic Reduction – Reduce balsamic vinegar into a thicker glaze for more concentrated flavor with less liquid.",
    "Garlic Infusion – Let minced garlic sit in olive oil for 10 minutes before cooking to develop more flavor.",
    "Portion Control – Use a 3:1 ratio of vegetables to pasta for a lighter, more nutritious meal.",
    "Lemon Zest Finish – Add lemon zest at the end for brightness that cuts through the richness.",
    "Toast the Pasta – Briefly toast dry pasta in the pan before boiling for a nuttier flavor.",
    "Reserve Pasta Water – Save some starchy pasta water to help the sauce cling better to the pasta."
  ],
  
  // Salmon Caesar Salad
  "646512": [
    "Grilling Technique – Grill salmon on cedar plank for smoky flavor without added fat.",
    "Lighter Dressing – Make a yogurt-based Caesar dressing with less oil and more lemon juice.",
    "Homemade Croutons – Make whole grain croutons with minimal oil in the oven instead of store-bought.",
    "Herb Enhancement – Add fresh dill or chives to complement the salmon flavor.",
    "Portion Strategy – Increase the lettuce-to-salmon ratio for a lighter meal with more fiber.",
    "Quick Marinade – Marinate salmon in lemon juice and herbs for 10 minutes before grilling for extra flavor.",
    "Vegetable Boost – Add cherry tomatoes, cucumber, and red onion for more nutrients and color.",
    "Cheese Modification – Use less parmesan but grate it finely so it distributes more evenly.",
    "Protein Addition – Add a soft-boiled egg for extra protein and creaminess without much dressing.",
    "Meal Prep Approach – Grill extra salmon to use in salads throughout the week."
  ],
  
  // Easy To Make Spring Rolls
  "642129": [
    "Rice Paper Technique – Dip rice paper for just 3-5 seconds in warm water—it will continue to soften as you work.",
    "Prep Station Setup – Arrange all ingredients in assembly-line fashion before starting to roll.",
    "Protein Boost – Add pre-cooked shrimp or tofu that's been pressed and marinated overnight.",
    "Vegetable Prep – Julienne all vegetables thinly and uniformly for easier rolling and better texture.",
    "Herb Combination – Mix multiple herbs like mint, cilantro, and Thai basil for complex flavor.",
    "Dipping Sauce Upgrade – Make a lighter dipping sauce using rice vinegar, lime juice, and a small amount of honey instead of sugar.",
    "Advance Prep – Prepare all fillings the day before and store separately in the refrigerator.",
    "Rolling Technique – Keep rolls tight by tucking in sides firmly before completing the roll.",
    "Lettuce Barrier – Use a piece of lettuce as the first layer to prevent tearing from harder vegetables.",
    "Storage Solution – Separate finished rolls with damp paper towels to prevent sticking."
  ],
  
  // Easy Ginger Beef Broccoli
  "641803": [
    "Meat Tenderizing – Slice beef against the grain and marinate with a tablespoon of baking soda for 15 minutes, then rinse for ultra-tender results.",
    "Blanch Broccoli – Quickly blanch broccoli for 30 seconds before stir-frying to ensure even cooking.",
    "Sauce Reduction – Cut sugar by half and use a touch of orange juice for natural sweetness.",
    "Ginger Preparation – Freeze ginger root, then grate it directly into the dish for more potent flavor.",
    "Cooking Sequence – Cook meat and vegetables separately, then combine to prevent overcooking.",
    "Cornstarch Alternative – Use arrowroot powder instead of cornstarch for a lighter sauce with the same thickening power.",
    "Vegetable Addition – Add water chestnuts or bell peppers for extra nutrients and crunch.",
    "Oil Reduction – Use a non-stick wok and half the oil, adding a splash of broth if needed.",
    "Sodium Control – Use low-sodium soy sauce and add a splash of rice vinegar for brightness without extra salt.",
    "Meal Prep Strategy – Double the recipe and portion with brown rice for quick weekday lunches."
  ],
  
  // Moroccan chickpea and lentil stew
  "652417": [
    "Spice Blooming – Toast spices in the dry pan for 30 seconds before adding oil to intensify their flavors.",
    "Lentil Selection – Use red lentils for a quicker cooking time (20 minutes instead of 40).",
    "Pressure Cooker Option – Use a pressure cooker to reduce cooking time by 70%.",
    "Vegetable Prep – Chop all vegetables to uniform size for even cooking.",
    "Sodium Reduction – Use low-sodium broth and increase spices for flavor without extra salt.",
    "Batch Cooking – Double the recipe and freeze in portion-sized containers for quick meals.",
    "Texture Enhancement – Add a handful of chopped spinach or kale in the last 5 minutes for extra nutrients.",
    "Acid Balance – Add a splash of lemon juice at the end to brighten all the flavors.",
    "Garnish Upgrade – Top with a dollop of Greek yogurt instead of higher-fat options.",
    "Grain Pairing – Serve with quinoa instead of couscous for a complete protein."
  ],
  
  // Slow Cooker: Pork and Garlic Mashed Potatoes
  "660306": [
    "Meat Selection – Choose pork loin instead of shoulder for leaner protein with less fat.",
    "Potato Alternative – Use half cauliflower and half potatoes for lower-carb, nutrient-dense mashed potatoes.",
    "Dairy Reduction – Replace half the butter with olive oil and use Greek yogurt instead of sour cream.",
    "Flavor Infusion – Add herbs like rosemary and thyme to the slow cooker liquid for deeper flavor.",
    "Garlic Roasting – Roast the garlic before adding to potatoes for sweeter, more complex flavor.",
    "Liquid Choice – Use low-sodium broth instead of water in the slow cooker for more flavor.",
    "Quick Prep – Peel and chop potatoes the night before and store in cold water in the refrigerator.",
    "Vegetable Addition – Add carrots and onions to the slow cooker for a complete one-pot meal.",
    "Texture Technique – For fluffier potatoes, heat the milk before adding it to the potatoes.",
    "Leftover Strategy – Shred leftover pork for quick tacos or sandwiches later in the week."
  ],
  
  // Chorizo and Beef Quinoa Stuffed Pepper
  "715523": [
    "Meat Ratio – Use 1 part chorizo to 3 parts lean ground beef to reduce fat while maintaining flavor.",
    "Quinoa Cooking – Toast quinoa in a dry pan before cooking for nuttier flavor.",
    "Pepper Preparation – Microwave peppers for 2-3 minutes before stuffing to reduce baking time by 15 minutes.",
    "Vegetable Boost – Add finely diced zucchini and carrots to the filling for extra nutrients.",
    "Spice Adjustment – Use smoked paprika instead of extra chorizo for flavor with less fat.",
    "Liquid Selection – Cook quinoa in low-sodium broth instead of water for more flavor.",
    "Cheese Strategy – Use sharp cheese on top so you can use less while maintaining flavor impact.",
    "Make-Ahead Option – Prepare the filling and stuff peppers the day before, refrigerate, and bake when needed.",
    "Portion Control – Use smaller peppers and serve with a large side salad for a lighter meal.",
    "Sauce Addition – Top with fresh salsa instead of heavy sauces for brightness and fewer calories."
  ]
};

// Sample recipes to update in the database
const recipesToUpdate = [
  { id: "654959", title: "Spaghetti with Smoked Salmon and Prawns" },
  { id: "716429", title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs" },
  { id: "715538", title: "Bruschetta Style Pork & Pasta" },
  { id: "633338", title: "Bacon Wrapped Filet Mignon" },
  { id: "646512", title: "Salmon Caesar Salad" },
  { id: "642129", title: "Easy To Make Spring Rolls" },
  { id: "641803", title: "Easy Ginger Beef Broccoli" },
  { id: "652417", title: "Moroccan chickpea and lentil stew" },
  { id: "660306", title: "Slow Cooker: Pork and Garlic Mashed Potatoes" },
  { id: "715523", title: "Chorizo and Beef Quinoa Stuffed Pepper" }
];

// Function to store enhancements in Supabase
async function storeEnhancements(recipe) {
  try {
    const recipeId = recipe.id;
    const enhancements = fixedEnhancements[recipeId];
    
    if (!enhancements) {
      console.log(`No enhancements found for recipe ${recipeId} (${recipe.title})`);
      return false;
    }
    
    console.log(`Updating enhancements for recipe ${recipeId} (${recipe.title})`);
    
    // Check if enhancements already exist for this recipe
    const { data: existingData } = await supabase
      .from('recipe_enhancements')
      .select('id')
      .eq('recipe_id', recipeId)
      .maybeSingle();
    
    let result;
    
    if (existingData) {
      // Update existing enhancements
      console.log(`Updating existing enhancements for recipe ${recipeId}`);
      const { data, error } = await supabase
        .from('recipe_enhancements')
        .update({
          enhancements: enhancements,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
      
      if (error) {
        console.error(`Error updating enhancements for recipe ${recipeId}:`, error);
        return false;
      }
      
      result = data;
    } else {
      // Insert new enhancements
      console.log(`Inserting new enhancements for recipe ${recipeId}`);
      const { data, error } = await supabase
        .from('recipe_enhancements')
        .insert({
          recipe_id: recipeId,
          enhancements: enhancements,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`Error storing enhancements for recipe ${recipeId}:`, error);
        return false;
      }
      
      result = data;
    }
    
    console.log(`Successfully updated enhancements for recipe ${recipeId}`);
    return true;
  } catch (error) {
    console.error(`Error in database operation for recipe ${recipe.id}:`, error);
    return false;
  }
}

// Main function to update all recipes
async function updateRecipes() {
  console.log(`Starting to update ${recipesToUpdate.length} recipes...`);
  
  for (const recipe of recipesToUpdate) {
    const success = await storeEnhancements(recipe);
    
    if (success) {
      console.log(`Successfully updated recipe: ${recipe.title}`);
    } else {
      console.error(`Failed to update recipe: ${recipe.title}`);
    }
    
    // Add a small delay between operations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('Finished updating all recipes.');
}

// Run the script
updateRecipes().catch(error => {
  console.error('Script execution failed:', error);
});
