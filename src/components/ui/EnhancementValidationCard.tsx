import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BarChart3, 
  Target, 
  Zap, 
  Heart,
  Clock,
  ChefHat,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  EnhancementValidation, 
  ValidationResult, 
  CategoryAccuracy,
  enhancementValidationApi 
} from '@/lib/api/enhancementValidationApi';

interface EnhancementValidationCardProps {
  recipeId: string;
  aiEnhancements: string[];
  humanEnhancements: string[];
  userId?: string;
  onValidationComplete?: (validation: EnhancementValidation) => void;
}

export function EnhancementValidationCard({
  recipeId,
  aiEnhancements,
  humanEnhancements,
  userId,
  onValidationComplete
}: EnhancementValidationCardProps) {
  const [validation, setValidation] = useState<EnhancementValidation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Load existing validation on component mount
  useEffect(() => {
    loadExistingValidation();
  }, [recipeId]);

  const loadExistingValidation = async () => {
    try {
      setIsLoading(true);
      const existingValidation = await enhancementValidationApi.getValidationByRecipeId(recipeId);
      if (existingValidation) {
        setValidation(existingValidation);
      }
    } catch (error) {
      console.error('Error loading validation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runValidation = async () => {
    if (aiEnhancements.length === 0 || humanEnhancements.length === 0) {
      toast.error('Both AI and human enhancements are required for validation');
      return;
    }

    try {
      setIsRunning(true);
      toast.info('Running enhancement validation...');
      
      const validationResult = await enhancementValidationApi.validateRecipe(
        recipeId,
        aiEnhancements,
        humanEnhancements,
        userId
      );
      
      setValidation(validationResult);
      toast.success('Validation completed successfully!');
      
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

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    return 'destructive';
  };

  const formatScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'healthier': return <Heart className="h-4 w-4" />;
      case 'faster': return <Clock className="h-4 w-4" />;
      case 'tastier': return <ChefHat className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(validation!.overall_score)}`}>
              {formatScore(validation!.overall_score)}
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <Progress value={validation!.overall_score * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(validation!.similarity_score)}`}>
              {formatScore(validation!.similarity_score)}
            </div>
            <div className="text-sm text-muted-foreground">Similarity</div>
            <Progress value={validation!.similarity_score * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(validation!.relevance_score)}`}>
              {formatScore(validation!.relevance_score)}
            </div>
            <div className="text-sm text-muted-foreground">Relevance</div>
            <Progress value={validation!.relevance_score * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(validation!.quality_score)}`}>
              {formatScore(validation!.quality_score)}
            </div>
            <div className="text-sm text-muted-foreground">Quality</div>
            <Progress value={validation!.quality_score * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Category Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Category Accuracy
          </CardTitle>
          <CardDescription>
            How well AI enhancements match human enhancement categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(validation!.category_accuracy).map(([category, data]) => (
              <div key={category} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <span className="font-medium capitalize">{category}</span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(data.accuracy)}`}>
                  {formatScore(data.accuracy)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data.matches}/{data.ai_count} matches
                </div>
                <Progress value={data.accuracy * 100} className="mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-semibold">AI Enhancements</div>
                <div className="text-2xl font-bold">{validation!.ai_enhancements.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-semibold">Human Enhancements</div>
                <div className="text-2xl font-bold">{validation!.human_enhancements.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-semibold">Matches Found</div>
                <div className="text-2xl font-bold">
                  {validation!.validation_results.filter(r => r.matched_human_enhancements.length > 0).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDetailedResults = () => (
    <div className="space-y-4">
      {validation!.validation_results.map((result, index) => (
        <Card key={result.enhancement_id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm font-medium">
                AI Enhancement #{index + 1}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getScoreBadgeVariant(result.similarity_score)}>
                  {formatScore(result.similarity_score)} similarity
                </Badge>
                <Badge variant={result.category_match ? 'default' : 'secondary'}>
                  {result.category_match ? 'Category Match' : 'No Category Match'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium text-sm mb-1">AI Enhancement:</div>
              <div className="text-sm bg-blue-50 p-2 rounded border-l-2 border-l-blue-200">
                {result.ai_enhancement}
              </div>
            </div>
            
            {result.matched_human_enhancements.length > 0 && (
              <div>
                <div className="font-medium text-sm mb-1">Matched Human Enhancements:</div>
                <div className="space-y-1">
                  {result.matched_human_enhancements.map((match, matchIndex) => (
                    <div key={matchIndex} className="text-sm bg-green-50 p-2 rounded border-l-2 border-l-green-200">
                      {match}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">Quality:</span>
                <Badge variant={
                  result.quality_assessment === 'excellent' ? 'default' :
                  result.quality_assessment === 'good' ? 'secondary' : 'destructive'
                }>
                  {result.quality_assessment}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Relevance:</span>
                <span className={getScoreColor(result.relevance_score)}>
                  {formatScore(result.relevance_score)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enhancement Validation
            </CardTitle>
            <CardDescription>
              AI enhancement validation against human-curated data
            </CardDescription>
          </div>
          <Button 
            onClick={runValidation} 
            disabled={isRunning || aiEnhancements.length === 0 || humanEnhancements.length === 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Validating...' : validation ? 'Re-validate' : 'Run Validation'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {!validation ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No validation results yet</h3>
            <p className="text-muted-foreground mb-4">
              Run validation to compare AI enhancements with human-curated data
            </p>
            <Button onClick={runValidation} disabled={isRunning}>
              {isRunning ? 'Running Validation...' : 'Start Validation'}
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              {renderOverview()}
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-6">
              {renderDetailedResults()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
