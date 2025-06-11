# PantryPal AI Deployment Guide

## 🚀 Vercel Deployment

Vercel is the optimal hosting platform for PantryPal AI, offering seamless Next.js integration and excellent performance.

### Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project**: Set up your Supabase database
4. **API Keys**: Obtain necessary API keys (Spoonacular, etc.)

### Step-by-Step Deployment

#### 1. Prepare Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_RECIPE_API_KEY=your_spoonacular_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### 2. Deploy to Vercel

**Option A: Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add environment variables in the dashboard
6. Click "Deploy"

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: pantrypal-ai
# - Directory: ./
# - Override settings? No
```

#### 3. Configure Environment Variables in Vercel

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from your `.env.example`
3. Set appropriate environments (Production, Preview, Development)

**Important Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_RECIPE_API_KEY`
- `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

#### 4. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Deployment Configuration

#### Vercel Configuration File (Optional)

Create `vercel.json` for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### Build Optimization

Your project is already optimized with:
- ✅ Next.js 15.2.3 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with purging
- ✅ Image optimization configured
- ✅ Security headers in next.config.ts

### Performance Optimizations

#### 1. Image Optimization
```typescript
// Already configured in next.config.ts
images: {
  domains: ['spoonacular.com', 'images.spoonacular.com'],
  remotePatterns: [{ protocol: 'https', hostname: '**' }]
}
```

#### 2. Bundle Analysis
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Add to package.json scripts
"analyze": "ANALYZE=true next build"
```

#### 3. Caching Strategy
```typescript
// API routes with caching
export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

### Monitoring and Analytics

#### 1. Vercel Analytics
```bash
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 2. Error Monitoring
```bash
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

### Continuous Deployment

#### Automatic Deployments
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Development**: Manual deployments

#### Branch Protection
```bash
# Configure in GitHub
# Settings → Branches → Add rule
# - Require pull request reviews
# - Require status checks (Vercel)
# - Require up-to-date branches
```

### Troubleshooting

#### Common Issues

**Build Failures:**
```bash
# Check build locally
npm run build

# Check TypeScript errors
npm run type-check
```

**Environment Variables:**
- Ensure all `NEXT_PUBLIC_` variables are set
- Check variable names match exactly
- Verify Supabase URL format

**Performance Issues:**
- Enable Vercel Analytics
- Check bundle size with analyzer
- Optimize images and fonts

#### Debugging

**Vercel Logs:**
```bash
# View deployment logs
vercel logs [deployment-url]

# View function logs
vercel logs --follow
```

**Local Testing:**
```bash
# Test production build locally
npm run build
npm run start
```

### Security Considerations

#### Environment Variables
- Never commit `.env.local` to git
- Use Vercel's environment variable encryption
- Rotate API keys regularly

#### Headers and CORS
- Security headers configured in `next.config.ts`
- CORS handled by Next.js API routes
- Supabase handles database security

### Cost Optimization

#### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for commercial use
- **Enterprise**: Custom pricing

#### Usage Monitoring
- Monitor function execution time
- Track bandwidth usage
- Optimize API calls and caching

### Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics tracking working
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Backup strategy in place
- [ ] Documentation updated with live URLs

---

Your PantryPal AI project is perfectly suited for Vercel deployment with excellent performance and scalability potential!
