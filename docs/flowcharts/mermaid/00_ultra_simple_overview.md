flowchart TD
    Start([User Opens PantryPal AI]) --> Dashboard{Login?}
    
    Dashboard -->|Yes| UserDash[User Dashboard<br/>Saved Recipes & Stats]
    Dashboard -->|No| GuestDash[Guest Dashboard<br/>Browse Only]
    
    UserDash --> Search[Recipe Search]
    GuestDash --> Search
    
    Search --> Method{How to Search?}
    Method -->|Ingredients| Ingredients[Enter Ingredients<br/>Add Dietary Filters]
    Method -->|Recipe Name| Name[Enter Recipe Name]
    
    Ingredients --> API[Get Recipes from Spoonacular]
    Name --> API
    
    API --> Found{Recipes Found?}
    Found -->|Yes| Results[Show Recipe List]
    Found -->|No| NoResults[No Results<br/>Try Again]
    
    NoResults --> Search
    Results --> Pick[Select Recipe]
    
    Pick --> Details[Recipe Details<br/>Ingredients & Instructions]
    Details --> AI[AI Enhancement<br/>Generate Suggestions]
    
    AI --> Cards[Show Enhancement Cards<br/>Healthier, Faster, Tastier]
    
    Cards --> Action{What Next?}
    Action -->|Save Recipe| SaveCheck{Logged In?}
    Action -->|Validate AI| ValidateCheck{Logged In?}
    Action -->|Search More| Search
    
    SaveCheck -->|Yes| Save[Save to Database]
    SaveCheck -->|No| LoginMsg[Login Required]
    
    ValidateCheck -->|Yes| Validate[Full Validation<br/>AI vs Human Data]
    ValidateCheck -->|No| Sample[Sample Validation Only]
    
    Save --> Saved[Recipe Saved!]
    LoginMsg --> Search
    
    Validate --> Report[Validation Results<br/>Academic Report]
    Sample --> Limited[Limited Preview<br/>Login for More]
    
    Saved --> Search
    Report --> Export{Export Data?}
    Limited --> Search
    
    Export -->|Yes| Download[Download Academic Report]
    Export -->|No| Done[Complete]
    
    Download --> End([End])
    Done --> Search
