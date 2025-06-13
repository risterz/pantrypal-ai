-- Create enhancement_validations table for storing AI validation results
-- This table stores the results of comparing AI-generated enhancements with human-scraped data

CREATE TABLE IF NOT EXISTS enhancement_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id TEXT NOT NULL,
    ai_enhancements JSONB NOT NULL,
    human_enhancements JSONB NOT NULL,
    validation_results JSONB NOT NULL,
    overall_score DECIMAL(3,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 1),
    similarity_score DECIMAL(3,2) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    relevance_score DECIMAL(3,2) NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 1),
    quality_score DECIMAL(3,2) NOT NULL CHECK (quality_score >= 0 AND quality_score <= 1),
    category_accuracy JSONB NOT NULL,
    validated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    validation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_enhancement_validations_recipe_id ON enhancement_validations(recipe_id);
CREATE INDEX IF NOT EXISTS idx_enhancement_validations_validated_by ON enhancement_validations(validated_by);
CREATE INDEX IF NOT EXISTS idx_enhancement_validations_created_at ON enhancement_validations(created_at);
CREATE INDEX IF NOT EXISTS idx_enhancement_validations_overall_score ON enhancement_validations(overall_score);

-- Enable Row Level Security (RLS)
ALTER TABLE enhancement_validations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to read all validation results (for research purposes)
CREATE POLICY "Allow read access to all validation results" ON enhancement_validations
    FOR SELECT USING (true);

-- Allow authenticated users to insert validation results
CREATE POLICY "Allow authenticated users to insert validations" ON enhancement_validations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own validation results
CREATE POLICY "Allow users to update their own validations" ON enhancement_validations
    FOR UPDATE USING (validated_by = auth.uid());

-- Allow users to delete their own validation results
CREATE POLICY "Allow users to delete their own validations" ON enhancement_validations
    FOR DELETE USING (validated_by = auth.uid());

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_enhancement_validations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_enhancement_validations_updated_at
    BEFORE UPDATE ON enhancement_validations
    FOR EACH ROW
    EXECUTE FUNCTION update_enhancement_validations_updated_at();

-- Add comments for documentation
COMMENT ON TABLE enhancement_validations IS 'Stores validation results comparing AI-generated recipe enhancements with human-scraped data';
COMMENT ON COLUMN enhancement_validations.recipe_id IS 'ID of the recipe being validated';
COMMENT ON COLUMN enhancement_validations.ai_enhancements IS 'Array of AI-generated enhancement suggestions';
COMMENT ON COLUMN enhancement_validations.human_enhancements IS 'Array of human-scraped enhancement data';
COMMENT ON COLUMN enhancement_validations.validation_results IS 'Detailed validation results for each AI enhancement';
COMMENT ON COLUMN enhancement_validations.overall_score IS 'Overall validation score (0-1)';
COMMENT ON COLUMN enhancement_validations.similarity_score IS 'Content similarity score (0-1)';
COMMENT ON COLUMN enhancement_validations.relevance_score IS 'Relevance score (0-1)';
COMMENT ON COLUMN enhancement_validations.quality_score IS 'Quality assessment score (0-1)';
COMMENT ON COLUMN enhancement_validations.category_accuracy IS 'Category-wise accuracy breakdown';
COMMENT ON COLUMN enhancement_validations.validated_by IS 'User who performed the validation';
COMMENT ON COLUMN enhancement_validations.validation_notes IS 'Optional notes about the validation';

-- Grant necessary permissions
GRANT SELECT ON enhancement_validations TO anon;
GRANT ALL ON enhancement_validations TO authenticated;
GRANT ALL ON enhancement_validations TO service_role;
