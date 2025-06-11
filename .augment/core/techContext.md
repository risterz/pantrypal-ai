# Technology Context: PantryPal AI

## Context
Technical stack, dependencies, and infrastructure decisions for PantryPal AI development and deployment.

## Decision
Modern web stack optimized for developer experience, performance, and scalability with focus on rapid development and deployment.

## Alternatives
- Traditional LAMP stack
- MEAN/MERN stack with custom backend
- Python Django with React frontend
- Ruby on Rails with React frontend

## Consequences
- **Accepted**: Next.js provides excellent DX and performance optimization
- **Accepted**: Supabase reduces backend complexity but creates vendor lock-in
- **Accepted**: TypeScript adds development time but improves code quality
- **Accepted**: Vercel deployment simplifies CI/CD but limits hosting options

## Status
**Implemented** - Core technology stack configured and operational

## Core Technology Stack

### Frontend Framework
**Next.js 15.2.3**
- React 19.0.0 framework with App Router
- Server-side rendering and static generation
- Built-in optimization for images, fonts, and scripts
- API routes for backend functionality
- Automatic code splitting and lazy loading

### UI and Styling
**Tailwind CSS 4.0**
- Utility-first CSS framework
- Custom design system integration
- Responsive design utilities
- Dark mode support
- JIT compilation for optimal bundle size

**ShadCN UI Components**
- Pre-built accessible components
- Radix UI primitives foundation
- Customizable with Tailwind CSS
- TypeScript support
- Consistent design patterns

### Backend Services
**Supabase 2.49.4**
- PostgreSQL database with real-time subscriptions
- Authentication with multiple providers
- Row Level Security (RLS) for data protection
- Auto-generated APIs and TypeScript types
- File storage and edge functions

### Language and Type Safety
**TypeScript 5.0**
- Static type checking
- Enhanced IDE support
- Better refactoring capabilities
- Runtime error reduction
- Improved developer experience

### Form Management
**React Hook Form 7.54.2**
- Performant form library with minimal re-renders
- Built-in validation support
- TypeScript integration
- Zod schema validation
- Excellent developer experience

### Schema Validation
**Zod 3.24.2**
- TypeScript-first schema validation
- Runtime type checking
- Form validation integration
- API response validation
- Type inference capabilities

## Development Tools

### Package Management
**npm (Node.js 23.9)**
- Standard Node.js package manager
- Lock file for dependency consistency
- Scripts for development workflow
- Security audit capabilities

### Code Quality
**ESLint 9.0**
- JavaScript/TypeScript linting
- Next.js specific rules
- Custom rule configuration
- Integration with IDE

### Development Environment
- **IDE**: VS Code with TypeScript support
- **Node.js**: Version 23.9
- **Git**: Version control
- **Terminal**: PowerShell (Windows)

## External Integrations

### Recipe API
**Spoonacular API**
- Comprehensive recipe database
- Ingredient-based search capabilities
- Nutritional information
- Dietary filter support
- Recipe instructions and images

### AI Enhancement Service
**Custom AI Integration**
- Recipe enhancement suggestions
- Cooking method improvements
- Ingredient substitution recommendations
- Health-focused modifications

## Deployment and Infrastructure

### Hosting Platform
**Vercel**
- Automatic deployments from Git
- Edge functions for API routes
- Global CDN for static assets
- Preview deployments for PRs
- Built-in analytics and monitoring

### Database Hosting
**Supabase Cloud**
- Managed PostgreSQL database
- Automatic backups and scaling
- Real-time subscriptions
- Built-in authentication
- Dashboard for database management

### Environment Configuration
```bash
# Required Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RECIPE_API_KEY=your_spoonacular_api_key
```

## Project Structure

### Directory Organization
```
pantrypal-ai2/
├── .augment/                 # Memory Bank system
├── public/                   # Static assets
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # Utilities and services
│   ├── types/                # TypeScript definitions
│   └── hooks/                # Custom React hooks
├── scripts/                  # Build and utility scripts
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── next.config.ts           # Next.js configuration
```

### Key Configuration Files

**package.json Scripts**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "scrape": "node scripts/scrapeEnhancements.js",
  "populate-enhancements": "node scripts/populateScrapedEnhancements.js",
  "populate-enhancements-mcp": "node scripts/populateScrapedEnhancementsMCP.js"
}
```

**TypeScript Configuration**
- Strict mode enabled
- Path mapping for clean imports
- Next.js specific settings
- Type checking for all files

## Dependencies Analysis

### Production Dependencies (Key)
- **@supabase/supabase-js**: Database and auth client
- **@radix-ui/react-***: Accessible UI primitives
- **axios**: HTTP client for API requests
- **cheerio**: Server-side HTML parsing
- **puppeteer**: Web scraping capabilities
- **react-hook-form**: Form management
- **zod**: Schema validation
- **lucide-react**: Icon library

### Development Dependencies (Key)
- **@types/node**: Node.js type definitions
- **@types/react**: React type definitions
- **eslint**: Code linting
- **tailwindcss**: CSS framework
- **typescript**: Type checking

## Performance Considerations

### Bundle Optimization
- Next.js automatic code splitting
- Dynamic imports for large components
- Image optimization with next/image
- Font optimization with next/font

### Runtime Performance
- React Server Components for reduced client bundle
- Streaming for faster page loads
- Optimistic updates for better UX
- Efficient re-rendering with React Hook Form

### Database Performance
- Supabase connection pooling
- Indexed queries for fast lookups
- Row Level Security for data protection
- Real-time subscriptions for live updates

## Security Measures

### Authentication Security
- Supabase Auth with JWT tokens
- Secure cookie configuration
- CSRF protection
- Rate limiting on auth endpoints

### Data Security
- Row Level Security policies
- Input validation with Zod
- SQL injection prevention
- XSS protection with React

### API Security
- Environment variable protection
- API key rotation capabilities
- Request rate limiting
- HTTPS enforcement

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Access at http://localhost:3000

### Testing Strategy
- Component testing with React Testing Library
- Integration testing for API routes
- E2E testing for critical user flows
- Type checking with TypeScript

### Deployment Process
1. Push to main branch
2. Automatic Vercel deployment
3. Preview deployment for PRs
4. Production deployment on merge

## Monitoring and Debugging

### Development Tools
- React Developer Tools
- Next.js built-in debugging
- Supabase dashboard for database inspection
- Browser DevTools for performance analysis

### Production Monitoring
- Vercel Analytics for performance metrics
- Supabase logs for database queries
- Error tracking for runtime issues
- User feedback collection

This technology context provides the foundation for understanding and working with the PantryPal AI codebase, ensuring consistent development practices and optimal performance.
