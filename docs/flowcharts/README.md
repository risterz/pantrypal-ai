# PantryPal AI System Flowcharts

This directory contains modular PlantUML flowcharts for the PantryPal AI system, designed for academic documentation and system architecture visualization.

## Flowchart Files

### 1. Authentication & User Management System
**File:** `01_authentication_system.puml`
- Handles user login/signup flows
- Google OAuth integration
- Profile management
- Session handling

### 2. Recipe Search System
**File:** `02_recipe_search_system.puml`
- Ingredient-based recipe search
- Spoonacular API integration
- Dietary filtering and preferences
- Recipe result display

### 3. AI Enhancement System
**File:** `03_ai_enhancement_system.puml`
- DeepSeek AI integration
- Recipe enhancement generation
- Categorized suggestions (Healthier, Faster, Tastier)
- Enhancement processing and display

### 4. Validation System
**File:** `04_validation_system.puml`
- AI vs Human enhancement comparison
- Academic validation metrics
- Similarity analysis using Jaccard coefficient
- Research data export functionality

### 5. Database Operations System
**File:** `05_database_operations_system.puml`
- Supabase PostgreSQL operations
- CRUD operations for all data types
- Row Level Security (RLS) implementation
- Real-time data synchronization

### 6. Main User Journey Overview
**File:** `06_main_user_journey.puml`
- High-level system integration
- Complete user workflow
- Subsystem connection points
- Authentication flow integration

## Usage Instructions

### Viewing Flowcharts
1. **Online PlantUML Editor:** Copy the content of any `.puml` file to [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. **VS Code Extension:** Install the PlantUML extension and preview files directly
3. **Local PlantUML:** Use PlantUML JAR file to generate images locally

### Academic Documentation
These flowcharts are designed for:
- Thesis documentation
- System architecture presentations
- Technical specification documents
- Academic research papers

### Integration Points
Each flowchart shows clear connection points to other subsystems:
- **Input:** What data/state is required from other systems
- **Output:** What data/state is provided to other systems
- **Connection Points:** Explicit integration with other subsystems

## Design Principles

### Modular Architecture
- Each subsystem is self-contained
- Clear interfaces between components
- Minimal coupling, high cohesion

### Authentication-Aware Design
- All subsystems check authentication status
- Graceful degradation for unauthenticated users
- Consistent security model across all components

### Error Handling
- Comprehensive error handling flows
- Fallback mechanisms for external API failures
- User-friendly error messages and recovery options

### Academic Validation Focus
- Emphasis on research validation capabilities
- Quantitative metrics and analysis
- Export functionality for academic use

## Technical Stack Integration

### Frontend
- React 19 + Next.js 15.2.3
- Tailwind CSS for styling
- TypeScript for type safety

### Backend
- Supabase for database and authentication
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates

### External APIs
- Spoonacular API for recipe data
- DeepSeek AI API for enhancement generation
- Google OAuth for authentication

### Database Schema
- Users and profiles management
- Recipe and enhancement storage
- Validation results and metrics
- User activity and analytics

## Maintenance Notes

### Updating Flowcharts
When updating system architecture:
1. Update the relevant `.puml` file
2. Ensure connection points remain consistent
3. Update this README if new subsystems are added
4. Regenerate documentation images

### Version Control
- All flowcharts are version controlled
- Changes should be documented in commit messages
- Major architectural changes should update all affected flowcharts

### Quality Assurance
- Test flowcharts render correctly in PlantUML
- Verify all connection points are accurate
- Ensure academic documentation standards are met
- Validate against actual system implementation
