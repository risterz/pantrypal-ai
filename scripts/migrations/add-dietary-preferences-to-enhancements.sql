-- Migration: Add dietary_preferences column to recipe_enhancements table
-- This allows tracking which dietary preferences were used to generate each enhancement

-- Add the dietary_preferences column to store the dietary preferences used for generation
ALTER TABLE recipe_enhancements 
ADD COLUMN IF NOT EXISTS dietary_preferences JSONB;

-- Add an index for better query performance when filtering by dietary preferences
CREATE INDEX IF NOT EXISTS idx_recipe_enhancements_dietary_preferences 
ON recipe_enhancements USING GIN (dietary_preferences);

-- Add a comment to document the column
COMMENT ON COLUMN recipe_enhancements.dietary_preferences IS 
'Array of dietary preferences used to generate these enhancements (e.g., ["vegetarian", "glutenFree"])';

-- Update existing records to have null dietary_preferences (indicating they were generated without dietary context)
-- This is already the default for new columns, but making it explicit
UPDATE recipe_enhancements 
SET dietary_preferences = NULL 
WHERE dietary_preferences IS NULL;
