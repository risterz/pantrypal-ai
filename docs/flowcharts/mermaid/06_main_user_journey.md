flowchart TD
    Start([Start]) --> A[User Visits PantryPal AI]
    A --> B[Load Application]
    B --> C[Authentication System]

    C --> D{Authenticated?}
    D -->|Yes| E[Load Personalized Dashboard]
    D -->|No| F[Display Guest Dashboard]

    E --> G[Display User Statistics]
    G --> H[Show Saved Recipes]
    H --> I[Load User Preferences]
    I --> J[User Navigates to Recipe Search]

    F --> K[Show Guest Features]
    K --> L[Display Login/Signup Option]
    L --> J
    
    J --> M[Recipe Search System]
    M --> N{Search Method}
    
    N -->|By Ingredients| O[Enter Available Ingredients]
    N -->|By Recipe Name| P[Enter Recipe Name]
    N -->|Browse Categories| Q[Select Recipe Category]
    
    O --> R[Apply Dietary Filters]
    R --> S[Display Recipe Results]
    
    P --> T[Search Recipe Database]
    T --> S
    
    Q --> U[Apply User Preferences]
    U --> S
    
    S --> V{Results Found?}
    V -->|Yes| W[User Selects Recipe]
    V -->|No| X[Show "No Results" Message]
    
    X --> Y[Suggest Alternative Searches]
    Y --> End1([End])
    
    W --> Z[Load Recipe Details]
    Z --> AA[Display Ingredients & Instructions]
    AA --> BB[AI Enhancement System]
    
    BB --> CC[Generate AI Enhancements]
    CC --> DD[Display Enhancement Cards]
    DD --> EE[Show Healthier/Faster/Tastier Options]
    
    EE --> FF{User Action}
    
    FF -->|Save Recipe| GG{Authenticated?}
    FF -->|Validate AI Suggestions| HH{Authenticated?}
    FF -->|Browse More Recipes| II[Return to Recipe Search]
    FF -->|Manage Profile| JJ{Authenticated?}
    FF -->|View Dashboard| KK{Authenticated?}

    GG -->|Yes| LL[Database Operations]
    GG -->|No| MM[Show "Login to Save" Message]

    LL --> NN[Recipe Saved Successfully]
    NN --> OO[Update User Statistics]
    OO --> End2([End])

    MM --> PP[Continue Browsing as Guest]
    PP --> End3([End])

    HH -->|Yes| QQ[Validation System]
    HH -->|No| RR[Show Limited Validation Preview]
    
    QQ --> SS[Load Human Enhancement Data]
    SS --> TT[Calculate Validation Metrics]
    TT --> UU[Display Validation Results]
    UU --> VV[Show Academic Insights]
    VV --> WW[Database Operations]
    
    WW --> XX{Validation Action}
    
    XX -->|Export Results| YY[Generate Academic Report]
    XX -->|View Details| ZZ[Show Detailed Analysis]
    XX -->|Run Another Validation| AAA[Return to Recipe Search]
    
    YY --> BBB[Download Validation Data]
    BBB --> End4([End])
    
    ZZ --> CCC[Display Similarity Metrics]
    CCC --> End5([End])
    
    AAA --> End6([End])
    
    RR --> DDD[Display Sample Validation Results]
    DDD --> EEE[Show "Login for Full Validation" Message]
    EEE --> End7([End])
    
    II --> End8([End])
    
    JJ -->|Yes| FFF[Authentication System]
    JJ -->|No| GGG[Redirect to Login]
    
    FFF --> HHH[Database Operations]
    HHH --> End9([End])
    
    GGG --> End10([End])
    
    KK -->|Yes| III[Load User Dashboard]
    KK -->|No| JJJ[Show Guest Dashboard]
    
    III --> KKK[Display Saved Recipes]
    KKK --> LLL[Show Usage Statistics]
    LLL --> MMM[Display Recent Validations]
    MMM --> End11([End])
    
    JJJ --> NNN[Display Public Statistics]
    NNN --> End12([End])
    

