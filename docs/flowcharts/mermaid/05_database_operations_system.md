flowchart TD
    Start([Start]) --> A{Operation Type}
    
    A -->|User Management| B{User Operations}
    A -->|Recipe Management| C{Recipe Operations}
    A -->|Enhancement Data| D{Enhancement Operations}
    A -->|Validation Results| E{Validation Operations}
    A -->|Search & Analytics| F{Analytics Operations}
    
    B -->|Create Profile| G[Validate User Data]
    B -->|Update Profile| H[Validate user permissions]
    B -->|Delete Profile| I[Validate user permissions]
    B -->|Load Profile| J[Query profiles by user_id]
    
    G --> K[Insert into profiles table]
    K --> L[Set default dietary preferences]
    L --> M[Initialize user settings]
    M --> N[Create user statistics record]
    N --> O[Return profile ID]
    O --> End1([End])
    
    H --> P[Check data integrity]
    P --> Q[Update profiles table]
    Q --> R[Update dietary preferences]
    R --> S[Log profile changes]
    S --> T[Return success status]
    T --> End2([End])
    
    I --> U[Backup user data]
    U --> V[Soft delete user data]
    V --> W[Maintain referential integrity]
    W --> X[Update related records]
    X --> Y[Return confirmation]
    Y --> End3([End])
    
    J --> Z[Load dietary preferences]
    Z --> AA[Load user statistics]
    AA --> BB[Return complete profile]
    BB --> End4([End])
    
    C -->|Save Recipe| CC{User Authenticated?}
    C -->|Load Saved Recipes| DD[Query saved_recipes by user_id]
    C -->|Remove Saved Recipe| EE[Validate user ownership]
    C -->|Search Recipes| FF[Parse search criteria]
    
    CC -->|Yes| GG[Validate recipe data]
    CC -->|No| HH[Return authentication error]
    HH --> End5([End])
    
    GG --> II[Check for duplicates]
    II --> JJ[Insert into saved_recipes table]
    JJ --> KK[Link to user profile]
    KK --> LL[Update user statistics]
    LL --> MM[Return save confirmation]
    MM --> End6([End])
    
    DD --> NN[Join with recipe metadata]
    NN --> OO[Load enhancement data]
    OO --> PP[Sort by save date]
    PP --> QQ[Return user's recipe collection]
    QQ --> End7([End])
    
    EE --> RR[Delete from saved_recipes table]
    RR --> SS[Update user statistics]
    SS --> TT[Return deletion confirmation]
    TT --> End8([End])
    
    FF --> UU[Apply filters]
    UU --> VV[Query recipe database]
    VV --> WW[Rank results]
    WW --> XX[Return matching recipes]
    XX --> End9([End])
    
    D -->|Store AI Enhancements| YY[Validate enhancement data]
    D -->|Store Human Enhancements| ZZ[Validate expert source]
    D -->|Query Enhancement Data| AAA[Search by recipe ID]
    D -->|Update Enhancement| BBB[Validate permissions]
    
    YY --> CCC[Insert into ai_enhancements table]
    CCC --> DDD[Link to recipe and user]
    DDD --> EEE[Store enhancement metadata]
    EEE --> FFF[Update enhancement statistics]
    FFF --> GGG[Return storage confirmation]
    GGG --> End10([End])
    
    ZZ --> HHH[Insert into human_enhancements table]
    HHH --> III[Store enhancement data]
    III --> JJJ[Link to recipe]
    JJJ --> KKK[Update validation dataset]
    KKK --> LLL[Return storage confirmation]
    LLL --> End11([End])
    
    AAA --> MMM[Filter by enhancement type]
    MMM --> NNN[Apply user preferences]
    NNN --> OOO[Sort by relevance]
    OOO --> PPP[Return matching enhancements]
    PPP --> End12([End])
    
    BBB --> QQQ[Update enhancement record]
    QQQ --> RRR[Maintain version history]
    RRR --> SSS[Return update status]
    SSS --> End13([End])
    
    E -->|Store Validation Results| TTT[Validate metrics data]
    E -->|Query Validation History| UUU[Search by user/recipe]
    E -->|Update Validation Metrics| VVV[Validate permissions]
    E -->|Export Validation Data| WWW[Query validation records]

    TTT --> XXX[Insert into enhancement_validations table]
    XXX --> YYY[Store similarity metrics]
    YYY --> ZZZ[Store quality scores]
    ZZZ --> AAAA[Store category accuracy]
    AAAA --> BBBB[Link to user and recipe]
    BBBB --> CCCC[Update validation statistics]
    CCCC --> DDDD[Return validation ID]
    DDDD --> End14([End])

    UUU --> EEEE[Filter by date range]
    EEEE --> FFFF[Apply sorting criteria]
    FFFF --> GGGG[Load related data]
    GGGG --> HHHH[Return validation records]
    HHHH --> End15([End])

    VVV --> IIII[Update existing record]
    IIII --> JJJJ[Maintain audit trail]
    JJJJ --> KKKK[Recalculate statistics]
    KKKK --> LLLL[Return update confirmation]
    LLLL --> End16([End])

    WWW --> MMMM[Format for academic use]
    MMMM --> NNNN[Apply privacy filters]
    NNNN --> OOOO[Generate export file]
    OOOO --> PPPP[Return download link]
    PPPP --> End17([End])

    F -->|User Activity Tracking| QQQQ[Log search queries]
    F -->|Performance Metrics| RRRR[Calculate AI accuracy trends]
    F -->|Data Export| SSSS[Query requested data]
    F -->|System Statistics| TTTT[Calculate total users]

    QQQQ --> UUUU[Track recipe interactions]
    UUUU --> VVVV[Store user preferences]
    VVVV --> WWWW[Update usage statistics]
    WWWW --> XXXX[Analyze user behavior]
    XXXX --> End18([End])

    RRRR --> YYYY[Generate usage reports]
    YYYY --> ZZZZ[Track system performance]
    ZZZZ --> AAAAA[Analyze validation results]
    AAAAA --> BBBBB[Return analytics data]
    BBBBB --> End19([End])

    SSSS --> CCCCC[Format for export]
    CCCCC --> DDDDD[Apply privacy filters]
    DDDDD --> EEEEE[Generate report]
    EEEEE --> FFFFF[Return formatted data]
    FFFFF --> End20([End])

    TTTT --> GGGGG[Count recipes processed]
    GGGGG --> HHHHH[Measure AI performance]
    HHHHH --> IIIII[Track validation accuracy]
    IIIII --> JJJJJ[Return system metrics]
    JJJJJ --> End21([End])


