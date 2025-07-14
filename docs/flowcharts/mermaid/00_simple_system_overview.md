flowchart TD
    Start([Start]) --> LoadApp[Load PantryPal AI]

    LoadApp --> AuthCheck{User Authenticated?}

    AuthCheck -->|No| GuestFlow[Guest User Flow]
    AuthCheck -->|Yes| UserFlow[Authenticated User Flow]

    GuestFlow --> GuestDash[Guest Dashboard<br/>Limited Features]
    UserFlow --> UserDash[User Dashboard<br/>Full Features<br/>Saved Recipes<br/>Statistics]

    GuestDash --> RecipeSearch[Recipe Search System]
    UserDash --> RecipeSearch

    RecipeSearch --> SearchMethod{Search Method?}

    SearchMethod -->|By Ingredients| IngredientInput[Enter Available Ingredients<br/>Apply Dietary Filters]
    SearchMethod -->|By Name| NameInput[Enter Recipe Name<br/>Search Database]

    IngredientInput --> SpoonacularAPI[Spoonacular API Call<br/>Find Recipes by Ingredients]
    NameInput --> SpoonacularAPI

    SpoonacularAPI --> APIResult{Results Found?}

    APIResult -->|Yes| DisplayResults[Display Recipe Cards<br/>Show Ingredient Matches]
    APIResult -->|No| NoResults[No Results Found<br/>Suggest Alternatives]

    NoResults --> RecipeSearch

    DisplayResults --> SelectRecipe[User Selects Recipe]

    SelectRecipe --> RecipeDetails[Show Recipe Details<br/>Ingredients & Instructions]

    RecipeDetails --> AIEnhancement[Generate AI Enhancements<br/>DeepSeek API Call]

    AIEnhancement --> ShowEnhancements[Display Enhancement Cards<br/>Healthier, Faster, Tastier]

    ShowEnhancements --> UserActions{User Action?}

    UserActions -->|Save Recipe| SaveCheck{Authenticated?}
    UserActions -->|Validate AI| ValidateCheck{Authenticated?}
    UserActions -->|Search More| RecipeSearch
    UserActions -->|View Details| RecipeDetails

    SaveCheck -->|Yes| SaveToDB[Save Recipe to Database<br/>Update User Statistics]
    SaveCheck -->|No| LoginToSave[Show Login Required<br/>Continue as Guest]

    ValidateCheck -->|Yes| FullValidation[Full Validation System<br/>AI vs Human Comparison<br/>Academic Metrics]
    ValidateCheck -->|No| SampleValidation[Limited Validation Preview<br/>Sample Results Only]

    SaveToDB --> SaveSuccess[Recipe Saved Successfully]
    LoginToSave --> RecipeSearch

    SaveSuccess --> RecipeSearch
