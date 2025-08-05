# PantryPal Enhancement Cleaner Tool

A Python GUI tool for managing and deleting DeepSeek AI enhancements from your PantryPal database.

## Features

- 🔍 **View Enhancement**: Display detailed enhancement information for any recipe ID
- 🗑️ **Delete Enhancement**: Remove enhancement for a specific recipe
- ⚠️ **Clear All Enhancements**: Remove all enhancements from the database (dangerous operation)
- 📊 **Real-time Database Connection**: Live connection status indicator
- 📝 **Activity Log**: Track all operations with timestamps

## Prerequisites

- Python 3.7 or higher
- Access to your PantryPal Supabase database
- Environment variables configured (`.env` file in project root)

## Required Environment Variables

Make sure your `.env` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

### Option 1: Automatic Installation (Windows)

1. **Run the installer:**
   ```bash
   # For Command Prompt
   install_dependencies.bat
   
   # For PowerShell
   .\install_dependencies.ps1
   ```

2. **Run the tool:**
   ```bash
   run_cleaner.bat
   ```

### Option 2: Manual Installation

1. **Install Python dependencies:**
   ```bash
   pip install supabase python-dotenv
   ```

2. **Run the tool:**
   ```bash
   python enhancement_cleaner_gui.py
   ```

## Usage

### 1. View Enhancement
- Enter a Recipe ID in the input field
- Click "View Enhancement" or press Enter
- The tool will display all enhancement details including:
  - Creation and update timestamps
  - Dietary preferences used
  - All enhancement suggestions
  - Categorized enhancements (if available)

### 2. Delete Single Enhancement
- Enter the Recipe ID you want to delete
- Click "Delete Enhancement"
- Confirm the deletion in the dialog
- The enhancement will be permanently removed

### 3. Clear All Enhancements (⚠️ DANGEROUS)
- Click "Clear All Enhancements"
- Go through multiple confirmation dialogs
- Type "DELETE ALL" exactly to confirm
- All enhancements in the database will be removed

## Safety Features

- **Multiple Confirmations**: Dangerous operations require multiple confirmations
- **Connection Status**: Real-time database connection indicator
- **Activity Log**: All operations are logged with timestamps
- **Error Handling**: Comprehensive error messages and logging

## Database Schema

The tool works with the `recipe_enhancements` table:
```sql
recipe_enhancements (
  id UUID PRIMARY KEY,
  recipe_id TEXT NOT NULL,
  enhancements JSONB NOT NULL,
  categorized_enhancements JSONB,
  dietary_preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

## Troubleshooting

### "Database connection not available"
- Check your `.env` file has the correct Supabase credentials
- Ensure you're running from the project root directory
- Verify your Supabase URL and key are valid

### "No enhancement found"
- Verify the Recipe ID exists in your database
- Check if the recipe has any enhancements generated
- Recipe IDs are case-sensitive

### Python/Package Issues
- Ensure Python 3.7+ is installed
- Run the dependency installer again
- Try manual installation: `pip install supabase python-dotenv`

## File Structure

```
scripts/enhancement/
├── enhancement_cleaner_gui.py    # Main GUI application
├── install_dependencies.bat      # Windows installer (CMD)
├── install_dependencies.ps1      # Windows installer (PowerShell)
├── run_cleaner.bat              # Quick runner script
└── README.md                    # This file
```

## Security Notes

- The tool uses your Supabase anonymous key for database access
- All operations respect your database's Row Level Security (RLS) policies
- No sensitive data is stored locally
- All database operations are logged for audit purposes

## Support

If you encounter issues:
1. Check the Activity Log in the tool for error details
2. Verify your environment variables are correct
3. Ensure your Supabase database is accessible
4. Check that the `recipe_enhancements` table exists

---

**⚠️ Warning**: The "Clear All Enhancements" feature will permanently delete all enhancement data. Use with extreme caution!
