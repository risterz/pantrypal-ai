flowchart TD
    Start([Start]) --> A[Check Database for Existing Enhancements]
    
    A --> B{Existing Enhancements Found?}
    B -->|Yes| C[Load Stored Enhancements]
    B -->|No| D{DeepSeek AI Enabled?}
    
    C --> E[Set Enhancement State]
    E --> F{Categorized Enhancements Available?}
    F -->|Yes| G[Use Stored Categories]
    F -->|No| H[Set Categorized to null]
    
    G --> I[Show "Loaded stored enhancements" Toast]
    H --> I
    
    D -->|Yes| J[Show "Generating AI suggestions..." Toast]
    D -->|No| K[Generate Rule-Based Enhancements]
    
    J --> L[Call deepseekApi.enhanceRecipe]
    L --> M{DeepSeek API Success?}
    
    M -->|Yes| N[Store Enhancement in Database]
    M -->|No| O[Log DeepSeek Error]
    
    N --> P[Set Enhancement State]
    P --> Q[Set Categorized to null]
    Q --> R[Show "Generated new enhancements" Toast]
    R --> S[Set showComparison = true]
    
    O --> T[Fall Back to Rule-Based Enhancements]
    T --> U[Store Fallback Enhancements]
    
    K --> V[Store Fallback Enhancements]
    
    I --> W[Set isLoadingEnhancements = false]
    S --> W
    U --> W
    V --> W
    
    W --> End([End])
