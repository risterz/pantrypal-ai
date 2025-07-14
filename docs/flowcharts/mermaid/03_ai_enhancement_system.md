flowchart TD
    Start([Start]) --> A[User Navigates to Recipe Detail Page]
    A --> B[Extract Recipe ID from URL Parameters]
    B --> C[Check Authentication Status]
    
    C --> D{Auth Check Complete?}
    D -->|Yes| E[Fetch Recipe Data from Spoonacular API]
    D -->|No| F[Wait for Auth Check]
    F --> End1([End])
    
    E --> G[Load Recipe Details]
    G --> H[Set Recipe State]
    H --> I[Trigger fetchEnhancements]
    I --> J[Trigger fetchScrapedEnhancements]
    
    J --> K[Enhancement Loading Process]
    K --> L[Enhancement Display Process]
    
    L --> M{User Authenticated?}
    M -->|Yes| N[Validation System Process]
    M -->|No| O[Show Enhancement Cards Only]
    
    N --> End2([End])
    O --> End3([End])
