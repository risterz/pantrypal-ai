flowchart TD
    Start([Start]) --> A{isLoadingEnhancements?}
    
    A -->|Yes| B[Show Loading Skeleton]
    B --> End1([End])
    
    A -->|No| C[Display RecipeEnhancementCard]
    C --> D{Categorized Enhancements Available?}
    
    D -->|Yes| E[Use Provided Categories]
    D -->|No| F[Run Client-Side Categorization]
    
    E --> G[Render Enhancement Categories]
    F --> G
    
    G --> H[💚 Healthier Options]
    H --> I[⚡ Time-Saving Tips]
    I --> J[✨ Flavor Boosters]
    J --> K[🔧 Other Tips]
    
    K --> L[Enable Interactive Features]
    L --> End2([End])
    

