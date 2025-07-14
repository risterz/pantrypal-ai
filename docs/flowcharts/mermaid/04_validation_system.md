flowchart TD
    Start([Start]) --> A{User Authenticated?}
    
    A -->|Yes| B[User Initiates Validation]
    A -->|No| C[Show Limited Validation Preview]
    
    C --> D[Display Sample Validation Results]
    D --> E[Prompt for Authentication]
    E --> End1([End])
    
    B --> F[Load Recipe AI Enhancements]
    F --> G[Display Validation Interface]
    G --> H[Query Human-Scraped Data]
    H --> I[Load Expert Enhancement Database]
    I --> J[Search for Matching Recipe]
    J --> K{Human Data Available?}
    
    K -->|No| L[Display "No Human Data Available"]
    K -->|Yes| M[Initialize Validation Metrics]
    
    L --> N[Show Available Recipes List]
    N --> O[Suggest Alternative Recipes]
    O --> P[Log Missing Data Request]
    P --> Q[Offer to Contribute Data]
    Q --> End2([End])
    
    M --> R[Calculate Text Similarity]
    M --> S[Assess Content Relevance]
    M --> T[Evaluate Enhancement Quality]
    M --> U[Analyze Category Accuracy]
    M --> V[Compare Ingredient Suggestions]
    M --> W[Validate Time Estimates]
    M --> X[Check Temperature Accuracy]
    
    R --> Y[Combine Weighted Scores]
    S --> Y
    T --> Y
    U --> Y
    V --> Y
    W --> Y
    X --> Y
    
    Y --> Z[Generate Overall Performance Score]
    Z --> AA[Assign Letter Grade]
    AA --> BB[Calculate Confidence Intervals]
    BB --> CC[Create Validation Dashboard]
    
    CC --> DD{Dashboard View}
    
    DD -->|Overview Tab| EE[Display Overall Score]
    DD -->|Detailed Analysis Tab| FF[Show Individual Comparisons]
    DD -->|AI Insights Tab| GG[Generate Performance Insights]
    DD -->|Academic Export Tab| HH[Prepare Research Data]
    
    EE --> II[Show Performance Grade]
    II --> JJ[Display Category Breakdown]
    JJ --> KK[Show Key Metrics Summary]
    KK --> LL[Display Confidence Level]
    LL --> MM[Show Validation Timestamp]
    MM --> End3([End])
    
    FF --> NN[Display Match Visualizations]
    NN --> OO[Highlight Similarities/Differences]
    OO --> PP[Show Quality Assessments]
    PP --> QQ[Display Similarity Heatmaps]
    QQ --> RR[Show Statistical Analysis]
    RR --> End4([End])
    
    GG --> SS[Identify Strengths/Weaknesses]
    SS --> TT[Provide Improvement Recommendations]
    TT --> UU[Show Trend Analysis]
    UU --> VV[Display Learning Patterns]
    VV --> WW[Show Accuracy Trends]
    WW --> End5([End])
    
    HH --> XX[Format for Academic Use]
    XX --> YY[Generate Statistical Reports]
    YY --> ZZ[Create Thesis Documentation]
    ZZ --> AAA[Export Raw Data]
    AAA --> End6([End])
    

