### 1. Project Breakdown

**App Name:** *PantryPal AI*  
**Platform:** Web  
**Summary:**  
PantryPal AI is a web application designed to help users discover recipes based on the ingredients they already have at home. The app integrates with a food recipe API to provide tailored recipe suggestions. Users can input their available ingredients, filter results based on dietary preferences, and receive AI-enhanced cooking tips to improve their meals. The app also allows users to save their favorite recipes to their profile, creating a personalized cooking experience. The goal is to reduce food waste, inspire creativity in the kitchen, and promote healthier cooking methods.  

**Primary Use Case:**  
A user has a limited set of ingredients at home and wants to find recipes that utilize those ingredients. They input their available ingredients, filter results based on dietary preferences, and receive a list of recipes. Upon selecting a recipe, they can view detailed instructions and AI-generated suggestions for enhancing the dish.  

**Authentication Requirements:**  
- Users can sign up and log in using email/password or third-party providers (Google, GitHub) via Supabase Auth.  
- Authenticated users can save favorite recipes to their profile, which are stored in a Supabase database.  

---

### 2. Tech Stack Overview  
- **Frontend Framework:** React + Next.js  
- **UI Library:** Tailwind CSS + ShadCN  
- **Backend (BaaS):** Supabase (data storage, real-time features, authentication)  
- **Deployment:** Vercel  

---

### 3. Core Features  

1. **Ingredient Input and Recipe Search:**  
   - Users can input available ingredients via a search bar or dropdown.  
   - Integration with a food recipe API (e.g., Spoonacular) to fetch recipes based on ingredients.  

2. **AI-Enhanced Recipe Suggestions:**  
   - A trained AI model provides suggestions for enhancing recipes (e.g., using an air fryer for healthier cooking).  

3. **Dietary Preference Filters:**  
   - Users can filter recipes based on dietary preferences (e.g., low sugar, vegan, gluten-free).  

4. **Recipe Details Page:**  
   - Displays detailed instructions, ingredients, and AI suggestions.  

5. **User Authentication and Profile Management:**  
   - Users can sign up, log in, and save favorite recipes to their profile.  

6. **Dynamic Ingredient Management:**  
   - Users can add or remove ingredients from their list and re-search for recipes.  

---

### 4. User Flow  

1. **Homepage:**  
   - User lands on the homepage with a search bar for ingredients and a "Search Recipes" button.  

2. **Ingredient Input:**  
   - User inputs available ingredients and selects dietary preferences.  

3. **Recipe Search Results:**  
   - The app fetches recipes from the API and displays them in a grid layout.  

4. **Recipe Details:**  
   - User clicks on a recipe to view details, including instructions, ingredients, and AI suggestions.  

5. **Profile Management:**  
   - Authenticated users can save recipes to their profile for future reference.  

6. **Dynamic Ingredient Update:**  
   - User can add/remove ingredients and re-search for recipes.  

---

### 5. Design and UI/UX Guidelines  

- **Color Palette:**  
   - Primary: #FF6B6B (coral) for buttons and highlights.  
   - Secondary: #4ECDC4 (teal) for accents.  
   - Background: #F7FFF7 (light green) for a clean, fresh look.  

- **Typography:**  
   - Headings: Inter (bold, 24px).  
   - Body: Inter (regular, 16px).  

- **Layout:**  
   - Navbar at the top with a logo, ingredient input, and search button.  
   - Recipe cards displayed in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile).  
   - Recipe details page with a sticky AI suggestion section on the right.  

- **Accessibility:**  
   - Ensure all buttons and inputs are keyboard-navigable.  
   - Use ARIA labels for screen readers.  

---

### 6. Technical Implementation  

1. **Frontend (React + Next.js):**  
   - Use Next.js for server-side rendering and routing.  
   - Create reusable components (e.g., RecipeCard, IngredientInput) with Tailwind CSS for styling.  
   - Use ShadCN for pre-built UI components like buttons, modals, and dropdowns.  

2. **Backend (Supabase):**  
   - Set up a Supabase project for authentication and database storage.  
   - Create a `recipes` table to store user-favorited recipes.  
   - Use Supabase Auth for user authentication.  

3. **API Integration:**  
   - Use Axios or Fetch API to connect with the food recipe API.  
   - Cache API responses using Next.js's built-in caching mechanisms.  

4. **AI Suggestions:**  
   - Train a lightweight AI model (e.g., TensorFlow.js) to provide cooking suggestions.  
   - Integrate the model into the recipe details page.  

5. **Deployment (Vercel):**  
   - Deploy the app using Vercel with automatic CI/CD from the GitHub repository.  

---

### 7. Development Tools and Setup Instructions  

1. **Tools:**  
   - Node.js (v23.9).  
   - npm or Yarn for package management.  
   - Git for version control.  

2. **Setup Instructions:**  
   - Clone the repository: `git clone <repo-url>`.  
   - Install dependencies: `npm install` or `yarn install`.  
   - Set up environment variables:  
     - `NEXT_PUBLIC_SUPABASE_URL`  
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     - `NEXT_PUBLIC_RECIPE_API_KEY`  
   - Run the development server: `npm run dev` or `yarn dev`.  
   - Deploy to Vercel: Push to the `main` branch and follow Vercel's deployment prompts.  

---

### 8. Database Schema

1. **`users` Table (Managed by Supabase Auth):**
   - `id` (UUID, Primary Key): Auto-generated by Supabase Auth
   - `email` (String): User's email address
   - `created_at` (Timestamp): Account creation timestamp
   - `updated_at` (Timestamp): Last update timestamp

2. **`profiles` Table:**
   - `id` (UUID, Primary Key, References users.id)
   - `username` (String, Unique): User's display name
   - `avatar_url` (String): URL to user's profile image
   - `dietary_preferences` (JSON): User's saved dietary preferences
   - `created_at` (Timestamp): Profile creation timestamp
   - `updated_at` (Timestamp): Last update timestamp

3. **`saved_ingredients` Table:**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, References profiles.id)
   - `ingredient_name` (String): Name of the ingredient
   - `quantity` (Float, Optional): Amount of ingredient available
   - `unit` (String, Optional): Unit of measurement
   - `created_at` (Timestamp): Entry creation timestamp
   - `updated_at` (Timestamp): Last update timestamp

4. **`saved_recipes` Table:**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, References profiles.id)
   - `recipe_id` (String): ID from the external API
   - `recipe_data` (JSON): Cached recipe data
   - `notes` (Text, Optional): User's personal notes
   - `created_at` (Timestamp): Entry creation timestamp
   - `updated_at` (Timestamp): Last update timestamp

5. **`dietary_preferences` Table:**
   - `id` (UUID, Primary Key)
   - `name` (String, Unique): Name of the preference (e.g., vegan, gluten-free)
   - `description` (String): Description of the dietary preference
   - `created_at` (Timestamp): Entry creation timestamp

6. **`recent_searches` Table:**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, References profiles.id)
   - `search_query` (JSON): Ingredients and filters used
   - `created_at` (Timestamp): Search timestamp

---

### 9. Folder Structure

```
pantrypal-ai/
├── .github/                   # GitHub workflows for CI/CD
├── public/                    # Static assets
│   ├── images/                # App images
│   │   └── favicon.ico            # Favicon
├── src/                       # Application source code
│   ├── app/                   # Next.js App Router structure
│   │   ├── (auth)/            # Authentication routes (grouped)
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   ├── api/               # API routes
│   │   │   └── [...]/         # API route handlers
│   │   ├── dashboard/         # Dashboard page
│   │   ├── favorites/         # Favorite recipes page
│   │   ├── recipes/           # Recipe routes
│   │   │   ├── [id]/          # Recipe details page by ID
│   │   │   └── search/        # Recipe search page
│   │   ├── profile/           # User profile page
│   │   ├── favicon.ico        # Favicon
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components from shadcn/ui
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   ├── pantry/            # Pantry-related components
│   │   └── recipes/           # Recipe-related components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and libraries
│   │   ├── supabase/          # Supabase client and utilities
│   │   ├── ai/                # AI suggestion utilities
│   │   └── api/               # API client for recipe service
│   ├── types/                 # TypeScript type definitions
│   │   ├── supabase.ts        # Supabase-related types
│   │   └── recipes.ts         # Recipe-related types
│   └── providers/             # React context providers
├── .env.example               # Example environment variables
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore file
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies
├── README.md                  # Project documentation
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

This folder structure follows Next.js App Router conventions with clear separation of concerns, making the project maintainable and scalable. It organizes code by feature while keeping reusable components separate.

This blueprint provides a comprehensive roadmap for building PantryPal AI using the specified tech stack. The focus is on practicality, scalability, and user-centric design.