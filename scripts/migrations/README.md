# Database Migrations

This directory contains database migration scripts for PantryPal AI.

## Available Migrations

### 1. `run-migration.js` - Dietary Preferences Enhancement
Adds dietary preferences support to the recipe enhancement system.

**Usage:**
```bash
npm run migrate
```

### 2. `fix-missing-profiles.js` - Missing Profiles Fix
Fixes the issue where users exist in `auth.users` but don't have corresponding profiles in `public.profiles`.

**Problem:** When profiles are manually deleted from the database, users can still authenticate but won't have profile data. The signup trigger only fires for new users, not existing ones.

**Solution:** Creates missing profiles for all users who exist in `auth.users` but are missing from `public.profiles`.

**Usage:**
```bash
npm run fix-missing-profiles
```

**What it does:**
1. Identifies users without profiles
2. Creates helper functions for profile management
3. Generates missing profiles with default values
4. Verifies the fix was successful
5. Provides diagnostic information

### 3. `migrate-existing-enhancements.js` - Enhancement Migration
Handles migration of existing recipe enhancements for dietary preferences compatibility.

## SQL Files

### `fix-missing-profiles.sql`
Contains the raw SQL for the missing profiles fix. Can be run directly in Supabase SQL editor if needed.

### `add-dietary-preferences-to-enhancements.sql`
Adds dietary preferences column to recipe enhancements table.

## Running Migrations

### Prerequisites
1. Ensure `.env.local` contains:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Install dependencies:
   ```bash
   npm install
   ```

### Execution
```bash
# Run specific migrations
npm run migrate                    # Dietary preferences
npm run fix-missing-profiles      # Missing profiles fix

# Or run directly
node scripts/migrations/fix-missing-profiles.js
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set
   - Verify the service role has necessary permissions

2. **Connection Failed**
   - Check `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Verify network connectivity to Supabase

3. **Function Already Exists**
   - Migrations are idempotent and can be run multiple times safely
   - Functions use `CREATE OR REPLACE` to handle re-runs

### Manual SQL Execution

If the Node.js scripts fail, you can run the SQL files directly in Supabase:

1. Open Supabase Dashboard → SQL Editor
2. Copy content from the `.sql` file
3. Execute the SQL commands

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in development environment first
3. **Review logs** carefully for any errors or warnings
4. **Verify results** using the diagnostic functions provided

## Migration History

- **2025-08-03**: Added missing profiles fix migration
- **2025-07-XX**: Added dietary preferences enhancement migration
- **2025-06-XX**: Initial migration system setup