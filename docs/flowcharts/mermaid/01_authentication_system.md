flowchart TD
    Start([Start]) --> A[User Accesses PantryPal AI]
    A --> B[Load Application]
    B --> C{User Authenticated?}

    C -->|Yes| D[Load User Session]
    C -->|No| E[Load as Guest User]

    D --> F[Display Personalized Dashboard]
    F --> G[Show User Statistics]
    G --> H[Display Saved Recipes]
    H --> I[Load User Preferences]
    I --> J{User Action}

    E --> K[Display Guest Dashboard]
    K --> L[Show Limited Features]
    L --> M[Display Login/Signup Prompt]
    M --> N{User Action}

    J -->|Manage Profile| O[Edit Profile Information]
    J -->|Logout| P[Clear User Session]
    J -->|Continue to App| Q[Access Full App Features]
    J -->|Search Recipes| R[Go to Recipe Search]
    J -->|View Validation| S[Access Validation System]

    N -->|Login/Signup| T[Show Authentication Options]
    N -->|Continue as Guest| U[Access Limited App Features]
    N -->|Search Recipes| V[Go to Recipe Search]
    N -->|View Sample Validation| W[Show Limited Validation Preview]

    O --> X[Update Dietary Preferences]
    X --> Y[Update Avatar/Username]
    Y --> Z[Save Changes to Database]
    Z --> AA[Confirm Update Success]
    AA --> End1([End])

    P --> BB[Redirect to Landing Page]
    BB --> End2([End])

    Q --> End3([End])
    R --> End4([End])
    S --> End5([End])
    U --> End6([End])
    V --> End7([End])
    W --> End8([End])

    CC -->|Google OAuth| DD[Redirect to Google OAuth]
    CC -->|Email Login| EE[Enter Email/Password]
    CC -->|Email Signup| FF[Enter Registration Details]

    DD --> GG[Google Authentication]
    GG --> HH[Receive OAuth Token]
    HH --> II[Validate with Supabase]
    II --> JJ{New User?}

    JJ -->|Yes| KK[Create User Profile]
    JJ -->|No| LL[Load Existing Profile]

    KK --> MM[Set Default Preferences]
    MM --> NN[Authentication Successful]
    LL --> NN

    NN --> OO[Create User Session]
    OO --> PP[Redirect to Dashboard]
    PP --> End9([End])

    EE --> QQ[Validate Credentials]
    QQ --> RR{Valid?}

    RR -->|Yes| SS[Create User Session]
    RR -->|No| TT[Show Error Message]

    SS --> UU[Load User Profile]
    UU --> VV[Authentication Successful]
    VV --> WW[Redirect to Dashboard]
    WW --> End10([End])

    TT --> XX[Return to Login Form]
    XX --> End11([End])

    FF --> YY[Validate Email Format]
    YY --> ZZ[Check Password Strength]
    ZZ --> AAA[Create Account in Supabase]
    AAA --> BBB[Send Verification Email]
    BBB --> CCC[Create User Profile]
    CCC --> DDD[Set Default Preferences]
    DDD --> EEE[Authentication Successful]
    EEE --> FFF[Create User Session]
    FFF --> GGG[Redirect to Dashboard]
    GGG --> End12([End])
    

