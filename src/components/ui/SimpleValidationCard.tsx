import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BarChart3, 
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  EnhancementValidation, 
  enhancementValidationApi 
} from '@/lib/api/enhancementValidationApi';

interface SimpleValidationCardProps {
  recipeId: string;
  aiEnhancements: string[];
  humanEnhancements: string[];
  userId?: string;
  onValidationComplete?: (validation: EnhancementValidation) => void;
}

export function SimpleValidationCard({
  recipeId,
  aiEnhancements,
  humanEnhancements,
  userId,
  onValidationComplete
}: SimpleValidationCardProps) {
  const [validation, setValidation] = useState<EnhancementValidation | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runValidation = async () => {
    if (aiEnhancements.length === 0 || humanEnhancements.length === 0) {
      toast.error('Both AI and human enhancements are required for validation');
      return;
    }

    try {
      setIsRunning(true);
      toast.info('Running validation...');
      
      const validationResult = await enhancementValidationApi.validateRecipe(
        recipeId,
        aiEnhancements,
        humanEnhancements,
        userId
      );
      
      setValidation(validationResult);
      toast.success('Validation completed!');
      
      if (onValidationComplete) {
        onValidationComplete(validationResult);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to run validation. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Validation
            </CardTitle>
            <CardDescription>
              Simple AI enhancement validation
            </CardDescription>
          </div>
          <Button 
            onClick={runValidation} 
            disabled={isRunning || aiEnhancements.length === 0 || humanEnhancements.length === 0}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Validating...' : 'Validate'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {!validation ? (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Click validate to compare AI enhancements with human data
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(validation.overall_score)}`}>
                {formatScore(validation.overall_score)}
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
              <Progress value={validation.overall_score * 100} className="mt-2" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-lg font-semibold ${getScoreColor(validation.similarity_score)}`}>
                  {formatScore(validation.similarity_score)}
                </div>
                <div className="text-xs text-muted-foreground">Similarity</div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${getScoreColor(validation.relevance_score)}`}>
                  {formatScore(validation.relevance_score)}
                </div>
                <div className="text-xs text-muted-foreground">Relevance</div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${getScoreColor(validation.quality_score)}`}>
                  {formatScore(validation.quality_score)}
                </div>
                <div className="text-xs text-muted-foreground">Quality</div>
              </div>
            </div>

            {/* Summary */}
            <div className="text-center pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                {validation.validation_results.filter(r => r.matched_human_enhancements.length > 0).length} of {aiEnhancements.length} AI suggestions matched human data
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}