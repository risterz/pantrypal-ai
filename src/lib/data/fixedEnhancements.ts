/**
 * Fixed recipe enhancements for specific recipes
 * This ensures consistent data for comparison with scraped enhancements
 */

// Map of recipe ID to fixed enhancement suggestions
export const fixedEnhancements: Record<string, string[]> = {
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
  
  // Default enhancements for any other recipe
  "default": [
    "Reduce Oil & Boost Flavor – Cut the oil in half and add herbs, spices, or a splash of broth to maintain flavor.",
    "Whole Grain Substitution – Replace refined grains with whole grains for more fiber and nutrients.",
    "Increase Vegetables – Double the vegetables for more nutrients and fiber with fewer calories.",
    "Herb Flavor Boost – Add fresh herbs at the end of cooking for brighter flavor without added salt or fat.",
    "Protein Optimization – Choose leaner proteins or add plant proteins for better nutrition.",
    "Cooking Technique Upgrade – Try roasting instead of boiling, or grilling instead of frying for better flavor.",
    "Spice Enhancement – Experiment with spice blends to add flavor without calories.",
    "Portion Control – Serve on smaller plates and increase the vegetable-to-starch ratio.",
    "Mindful Seasoning – Taste before adding salt, and try acid (lemon, vinegar) to brighten flavors instead.",
    "Meal Prep Strategy – Prepare components ahead of time for faster weeknight assembly."
  ]
};

/**
 * Get fixed enhancements for a specific recipe ID
 * @param recipeId The recipe ID to get enhancements for
 * @returns Array of enhancement strings
 */
export function getFixedEnhancements(recipeId: string | number): string[] {
  const id = recipeId.toString();
  return fixedEnhancements[id] || fixedEnhancements.default;
}

export default getFixedEnhancements;
