# PantryPal AI 🍳

An intelligent recipe discovery platform that helps users find recipes based on available ingredients, enhanced with AI-powered cooking suggestions and tips.

## 🌟 Features

- **Smart Recipe Search**: Find recipes based on ingredients you already have
- **AI-Enhanced Suggestions**: Get intelligent cooking tips and recipe improvements
- **Dietary Preferences**: Filter recipes by dietary restrictions and preferences
- **User Profiles**: Save favorite recipes and manage personal cooking preferences
- **Ingredient Management**: Track your pantry and get recipe suggestions
- **Recipe Enhancement**: AI-powered suggestions for healthier, faster, and tastier cooking

## 🚀 Tech Stack

- **Frontend**: React 19 + Next.js 15.2.3
- **UI Framework**: Tailwind CSS + ShadCN/UI
- **Backend**: Supabase (Database, Auth, Real-time)
- **AI Integration**: Custom recipe enhancement system
- **Deployment**: Vercel
- **Language**: TypeScript

## 📁 Project Structure

```
pantrypal-ai/
├── .augment/                  # Augment Memory Bank system
├── docs/                      # Project documentation
│   ├── business/             # Business documentation
│   ├── diagrams/             # System diagrams
│   └── technical/            # Technical documentation
├── data/                      # Sample data and assets
├── public/                    # Static assets
├── scripts/                   # Utility scripts
│   ├── docs/                 # Script documentation
│   ├── enhancement/          # Recipe enhancement scripts
│   └── scrapper/             # Web scraping utilities
├── src/                       # Application source code
│   ├── app/                  # Next.js App Router
│   ├── components/           # Reusable components
│   ├── lib/                  # Utilities and libraries
│   └── types/                # TypeScript definitions
└── [config files]            # Various configuration files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/risterz/pantrypal-ai.git
   cd pantrypal-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RECIPE_API_KEY=your_recipe_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run scrape` - Run recipe scraping script
- `npm run populate-enhancements` - Populate recipe enhancements
- `npm run populate-enhancements-mcp` - Populate enhancements via MCP

## 📚 Documentation

- [Project Context](./docs/project-context.md) - Comprehensive project overview
- [Use Cases](./docs/use-cases.md) - User scenarios and use cases
- [Development Rules](./docs/development-rules.md) - Development guidelines
- [System Flow](./docs/technical/system-flow.md) - Technical system flow
- [Business Canvas](./docs/business/lean-canvas.md) - Business model canvas

## 🏗️ Architecture

PantryPal AI follows a modern web application architecture:

- **Frontend**: React with Next.js App Router for optimal performance
- **State Management**: React hooks and context for local state
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth with multiple providers
- **API Integration**: RESTful APIs for recipe data
- **AI Enhancement**: Custom AI system for recipe improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- ShadCN for the beautiful UI components
- The open-source community for inspiration and tools

---

Built with ❤️ for better cooking experiences