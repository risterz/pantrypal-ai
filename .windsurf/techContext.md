# PantryPal AI Technical Context

## Technologies Used

### Frontend

1. **Next.js**
   - Version: 14.x
   - Purpose: React framework for server-side rendering and static site generation
   - Benefits: Improved SEO, faster page loads, simplified routing

2. **React**
   - Version: 18.x
   - Purpose: UI component library
   - Benefits: Component-based architecture, virtual DOM, reactive updates

3. **Tailwind CSS**
   - Purpose: Utility-first CSS framework
   - Benefits: Rapid styling, consistent design system, responsive layouts

4. **TypeScript**
   - Purpose: Static typing for JavaScript
   - Benefits: Improved code quality, better IDE support, reduced runtime errors

### Backend

1. **Supabase**
   - Purpose: Backend-as-a-Service platform
   - Components:
     - PostgreSQL database
     - Authentication system
     - Storage for user data
     - Serverless functions

2. **API Services**
   - **Spoonacular API**
     - Purpose: Recipe data source
     - Features: Ingredient-based search, nutritional information, dietary filtering
   
   - **DeepSeek AI**
     - Purpose: AI-powered recipe enhancement
     - Features: Natural language processing, contextual understanding, personalization

### Development Tools

1. **Git & GitHub**
   - Purpose: Version control and collaboration

2. **ESLint & Prettier**
   - Purpose: Code quality and formatting

3. **Jest & React Testing Library**
   - Purpose: Unit and integration testing

4. **Vercel**
   - Purpose: Deployment and hosting

## Development Setup

### Local Environment

```bash
# Clone repository
git clone https://github.com/username/pantrypal-ai.git
cd pantrypal-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Spoonacular API
NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key

# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Technical Constraints

1. **API Rate Limits**
   - Spoonacular API has daily request limits
   - DeepSeek AI has usage quotas and rate limits
   - Solution: Implement caching and request batching

2. **Performance Considerations**
   - Recipe search must be responsive and fast
   - AI enhancements should not significantly delay page loads
   - Solution: Implement progressive loading and background processing

3. **Responsive Design Requirements**
   - Must work on mobile, tablet, and desktop devices
   - Solution: Mobile-first design with Tailwind CSS breakpoints

4. **Accessibility Standards**
   - Must meet WCAG 2.1 AA standards
   - Solution: Semantic HTML, proper contrast, keyboard navigation

5. **Browser Compatibility**
   - Support for modern browsers (Chrome, Firefox, Safari, Edge)
   - Solution: Use appropriate polyfills and feature detection

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.1",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.2.2",
    "zod": "^3.22.2"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.24",
    "@types/react-dom": "^18.2.8",
    "@typescript-eslint/eslint-plugin": "^6.7.3",
    "@typescript-eslint/parser": "^6.7.3",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.3",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

This technical context provides a comprehensive overview of the technologies, development setup, constraints, and dependencies for the PantryPal project. It serves as a reference for development decisions and onboarding new team members.
