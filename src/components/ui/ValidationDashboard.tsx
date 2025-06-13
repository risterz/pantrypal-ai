import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  BarChart3, 
  Target, 
  TrendingUp,
  Eye,
  RefreshCw,
  Award,
  Lightbulb,
  Users,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  EnhancementValidation, 
  ValidationResult, 
  CategoryAccuracy,
  enhancementValidationApi 
} from '@/lib/api/enhancementValidationApi';

interface ValidationDashboardProps {
  recipeId: string;
  aiEnhancements: string[];
  humanEnhancements: string[];
  userId?: string;
  onValidationComplete?: (validation: EnhancementValidation) => void;
}

export function ValidationDashboard({
  recipeId,
  aiEnhancements,
  humanEnhancements,
  userId,
  onValidationComplete
}: ValidationDashboardProps) {
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
      toast.info('Running comprehensive AI validation analysis...');
      
      const validationResult = await enhancementValidationApi.validateRecipe(
        recipeId,
        aiEnhancements,
        humanEnhancements,
        userId
      );
      
      setValidation(validationResult);
      toast.success('AI validation analysis completed successfully!');
      
      if (onValidationComplete) {
        onValidationComplete(validationResult);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to run validation analysis. Please try again.');
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

  const getValidationInsights = () => {
    if (!validation) return [];
    
    const insights = [];
    const overallScore = validation.overall_score;
    
    // Overall performance insights
    if (overallScore >= 0.8) {
      insights.push({
        type: 'success',
        icon: '🎉',
        title: 'Excellent AI Performance',
        description: 'The AI enhancements closely match human expertise and provide high-quality suggestions.'
      });
    } else if (overallScore >= 0.6) {
      insights.push({
        type: 'warning',
        icon: '👍',
        title: 'Good AI Performance',
        description: 'The AI shows solid performance with room for improvement in some areas.'
      });
    } else {
      insights.push({
        type: 'error',
        icon: '⚠️',
        title: 'AI Performance Needs Improvement',
        description: 'Consider refining the AI enhancement algorithms for better accuracy.'
      });
    }
    
    return insights;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Loading validation data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              AI Enhancement Validation System
            </CardTitle>
            <CardDescription className="mt-2">
              Comprehensive analysis comparing AI-generated recipe enhancements with manually gathered human-scraped data
            </CardDescription>
          </div>
          <Button 
            onClick={runValidation} 
            disabled={isRunning || aiEnhancements.length === 0 || humanEnhancements.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Analyzing...' : validation ? 'Re-analyze' : 'Start Analysis'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80">
            <CardContent className="p-4 text-center">
              <Bot className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{aiEnhancements.length}</div>
              <div className="text-sm text-muted-foreground">AI Enhancements</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{humanEnhancements.length}</div>
              <div className="text-sm text-muted-foreground">Human Data Points</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {validation ? formatScore(validation.overall_score) : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Validation Score</div>
            </CardContent>
          </Card>
        </div>

        {!validation ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready for AI Validation Analysis</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Run a comprehensive analysis to validate AI enhancement quality against human-curated data. 
              This will help assess the accuracy and effectiveness of AI-generated recipe suggestions.
            </p>
            <Button 
              onClick={runValidation} 
              disabled={isRunning || aiEnhancements.length === 0 || humanEnhancements.length === 0}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Start Validation Analysis
                </>
              )}
            </Button>
            {(aiEnhancements.length === 0 || humanEnhancements.length === 0) && (
              <p className="text-sm text-red-500 mt-2">
                Both AI and human enhancement data are required for validation
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Validation Insights */}
            <div className="space-y-3">
              {getValidationInsights().map((insight, index) => (
                <Card key={index} className={`border-l-4 ${
                  insight.type === 'success' ? 'border-l-green-500 bg-green-50/50' :
                  insight.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50/50' :
                  'border-l-red-500 bg-red-50/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div>
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Overall Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(validation.overall_score)} mb-1`}>
                          {formatScore(validation.overall_score)}
                        </div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                        <Progress value={validation.overall_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(validation.similarity_score)} mb-1`}>
                          {formatScore(validation.similarity_score)}
                        </div>
                        <div className="text-sm text-muted-foreground">Similarity</div>
                        <Progress value={validation.similarity_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(validation.relevance_score)} mb-1`}>
                          {formatScore(validation.relevance_score)}
                        </div>
                        <div className="text-sm text-muted-foreground">Relevance</div>
                        <Progress value={validation.relevance_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(validation.quality_score)} mb-1`}>
                          {formatScore(validation.quality_score)}
                        </div>
                        <div className="text-sm text-muted-foreground">Quality</div>
                        <Progress value={validation.quality_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="detailed" className="mt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Detailed analysis view would be implemented here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">AI insights view would be implemented here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}