flowchart TD
    Start([Start]) --> A[User Accesses Recipe Search Page]
    A --> B{User Authenticated?}
    
    B -->|Yes| C[Load User Profile]
    B -->|No| D[Set Default Diet Filter to "None"]
    
    C --> E[Get Saved Dietary Preferences]
    E --> F[Pre-populate Diet Filter]
    F --> G[Display Search Interface]
    D --> G
    
    G --> H[Show Search Mode Toggle]
    H --> I{Search Mode = Ingredients?}
    
    I -->|Yes| J[Display Ingredient Input Interface]
    I -->|No| K[Display Recipe Name Input]
    
    J --> L[Show Ingredient Categories]
    L --> M[User Adds/Removes Ingredients]
    M --> N{Ingredients List Empty?}
    
    N -->|Yes| O[Show Validation Error]
    N -->|No| P[Validate Ingredients Input]
    
    O --> Q[Request At Least One Ingredient]
    Q --> End1([End])
    
    P --> R[Prepare Spoonacular API Parameters]
    R --> S[Call /findByIngredients Endpoint]
    S --> T{Diet Filter Applied?}
    
    T -->|Yes| U[Extract Recipe IDs from Results]
    T -->|No| V[Use Direct Ingredient Results]
    
    U --> W[Call /complexSearch with Diet Filter]
    W --> X[Filter Results by Dietary Preference]
    X --> Y{API Response Successful?}
    V --> Y
    
    Y -->|Yes| Z[Parse Recipe Data]
    Y -->|No| AA[Display API Error Message]
    
    Z --> BB[Display Recipe Results Grid]
    BB --> CC[Show Used Ingredient Count]
    CC --> DD{Results Found?}
    
    DD -->|Yes| EE[Display Recipe Cards]
    DD -->|No| FF[Display "No Recipes Found"]
    
    EE --> GG[Show "X of your ingredients" Info]
    GG --> HH[Show Save Recipe Button]
    HH --> II{User Authenticated?}
    
    II -->|Yes| JJ[Save Search to recent_searches Table]
    II -->|No| KK[User Clicks "View & Enhance"]
    
    JJ --> KK
    KK --> LL[Navigate to Recipe Detail Page]
    LL --> End2([End])
    
    FF --> MM[Show Dietary Filter Suggestion]
    MM --> NN[Suggest Different Ingredients]
    NN --> End3([End])
    
    AA --> OO[Show "Failed to search recipes" Toast]
    OO --> PP[Offer Retry Option]
    PP --> End4([End])
    
    K --> QQ[User Enters Recipe Name]
    QQ --> RR{Recipe Name Empty?}
    
    RR -->|Yes| SS[Show Validation Error]
    RR -->|No| TT[Validate Recipe Name Input]
    
    SS --> UU[Request Recipe Name Input]
    UU --> End5([End])
    
    TT --> VV[Prepare Spoonacular API Parameters]
    VV --> WW[Call /complexSearch Endpoint]
    WW --> XX{API Response Successful?}
    
    XX -->|Yes| YY[Parse Recipe Results]
    XX -->|No| ZZ[Display API Error Message]
    
    YY --> AAA[Display Recipe Results Grid]
    AAA --> BBB{Results Found?}
    
    BBB -->|Yes| CCC[Display Recipe Cards]
    BBB -->|No| DDD[Display "No Recipes Found"]
    
    CCC --> EEE[Show "Click to view details" Info]
    EEE --> FFF[Show Save Recipe Button]
    FFF --> GGG{User Authenticated?}
    
    GGG -->|Yes| HHH[Save Search to recent_searches Table]
    GGG -->|No| III[User Clicks "View & Enhance"]
    
    HHH --> III
    III --> JJJ[Navigate to Recipe Detail Page]
    JJJ --> End6([End])
    
    DDD --> KKK[Suggest Alternative Recipe Names]
    KKK --> LLL[Suggest Ingredient-based Search]
    LLL --> End7([End])
    
    ZZ --> MMM[Show "Failed to search recipes" Toast]
    MMM --> NNN[Offer Retry Option]
    NNN --> End8([End])
    

