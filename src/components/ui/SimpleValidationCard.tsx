import React, { useState } from 'react';
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
  RefreshCw,
  Award,
  Users,
  Bot,
  Eye,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import {
  EnhancementValidation,
  ValidationResult,
  CategoryAccuracy,
  EnhancementValidator
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
<<<<<<< HEAD
=======
  userId,
  onValidationComplete
}: SimpleValidationCardProps) {
  const [validation, setValidation] = useState<EnhancementValidation | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runValidation = async () => {
    if (aiEnhancements.length === 0 || humanEnhancements.length === 0) {
      toast.error('Both AI and human enhancements are required for validation');
      return;
    }

    try {
      setIsRunning(true);
      toast.info('Running validation analysis...');

      // Use the validation logic directly without database storage
      const validationResult = EnhancementValidator.validateEnhancements(
        recipeId,
        aiEnhancements,
        humanEnhancements
      );

      setValidation(validationResult);
      toast.success('Validation analysis completed successfully!');
      
      if (onValidationComplete) {
        onValidationComplete(validationResult);
      }
    } catch (error) {
      console.error('Validation error:', error);
<<<<<<< HEAD
      toast.error('Failed to run validation analysis. Please try again.');
=======
      toast.error('Failed to run validation. Please try again.');
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

<<<<<<< HEAD
  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    return 'destructive';
  };

=======
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
  const formatScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  return (
<<<<<<< HEAD
    <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
=======
    <Card className="w-full">
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
<<<<<<< HEAD
              <Target className="h-6 w-6 text-blue-600" />
              AI Enhancement Validation System
            </CardTitle>
            <CardDescription className="mt-2">
              Compare AI-generated recipe enhancements with manually gathered human-scraped data
=======
              <BarChart3 className="h-5 w-5" />
              Quick Validation
            </CardTitle>
            <CardDescription>
              Simple AI enhancement validation
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
            </CardDescription>
          </div>
          <Button 
            onClick={runValidation} 
            disabled={isRunning || aiEnhancements.length === 0 || humanEnhancements.length === 0}
<<<<<<< HEAD
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Analyzing...' : validation ? 'Re-analyze' : 'Start Analysis'}
=======
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Validating...' : 'Validate'}
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
<<<<<<< HEAD
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
            {/* Overall Score */}
            <Card className="bg-white/80">
              <CardContent className="p-6 text-center">
                <div className={`text-4xl font-bold ${getScoreColor(validation.overall_score)} mb-2`}>
                  {formatScore(validation.overall_score)}
                </div>
                <div className="text-sm text-muted-foreground mb-3">Overall AI Validation Score</div>
                <Badge variant={getScoreBadgeVariant(validation.overall_score)} className="text-sm px-3 py-1">
                  {validation.overall_score >= 0.8 ? 'Excellent Match' :
                   validation.overall_score >= 0.6 ? 'Good Match' : 'Needs Improvement'}
                </Badge>
              </CardContent>
            </Card>

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Comparison</TabsTrigger>
                <TabsTrigger value="insights">AI vs Human</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Metric Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-semibold ${getScoreColor(validation.similarity_score)} mb-1`}>
                          {formatScore(validation.similarity_score)}
                        </div>
                        <div className="text-xs text-muted-foreground">Content Similarity</div>
                        <Progress value={validation.similarity_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-semibold ${getScoreColor(validation.relevance_score)} mb-1`}>
                          {formatScore(validation.relevance_score)}
                        </div>
                        <div className="text-xs text-muted-foreground">Relevance Score</div>
                        <Progress value={validation.relevance_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/80">
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-semibold ${getScoreColor(validation.quality_score)} mb-1`}>
                          {formatScore(validation.quality_score)}
                        </div>
                        <div className="text-xs text-muted-foreground">Quality Score</div>
                        <Progress value={validation.quality_score * 100} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Accuracy */}
                  <Card className="bg-white/80">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Category Accuracy Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(validation.category_accuracy).map(([category, data]) => (
                          <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium capitalize mb-2">{category}</div>
                            <div className={`text-2xl font-bold ${getScoreColor(data.accuracy)} mb-2`}>
                              {formatScore(data.accuracy)}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {data.matches}/{data.ai_count} matches
                            </div>
                            <Progress value={data.accuracy * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/80">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                          <div>
                            <div className="font-semibold">Successful Matches</div>
                            <div className="text-2xl font-bold text-green-600">
                              {validation.validation_results.filter(r => r.matched_human_enhancements.length > 0).length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              out of {aiEnhancements.length} AI suggestions
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Award className="h-8 w-8 text-purple-500" />
                          <div>
                            <div className="font-semibold">High Quality</div>
                            <div className="text-2xl font-bold text-purple-600">
                              {validation.validation_results.filter(r => r.quality_assessment === 'excellent' || r.quality_assessment === 'good').length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              excellent or good quality
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-8 w-8 text-blue-500" />
                          <div>
                            <div className="font-semibold">Coverage Rate</div>
                            <div className="text-2xl font-bold text-blue-600">
                              {formatScore(validation.validation_results.filter(r => r.matched_human_enhancements.length > 0).length / aiEnhancements.length)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              AI suggestions with matches
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Individual Enhancement Analysis</h3>
                    <Badge variant="outline">
                      {validation.validation_results.length} AI Enhancements Analyzed
                    </Badge>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {validation.validation_results.map((result, index) => (
                      <Card key={result.enhancement_id} className="border-l-4 border-l-blue-500 bg-white/80">
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
                            <div className="font-medium text-sm mb-1 flex items-center gap-2">
                              <Bot className="h-4 w-4 text-blue-500" />
                              AI Enhancement:
                            </div>
                            <div className="text-sm bg-blue-50 p-3 rounded border-l-2 border-l-blue-200">
                              {result.ai_enhancement}
                            </div>
                          </div>

                          {result.matched_human_enhancements.length > 0 ? (
                            <div>
                              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-500" />
                                Matched Human Enhancements ({result.matched_human_enhancements.length}):
                              </div>
                              <div className="space-y-2">
                                {result.matched_human_enhancements.map((match, matchIndex) => (
                                  <div key={matchIndex} className="text-sm bg-green-50 p-3 rounded border-l-2 border-l-green-200">
                                    {match}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded border-l-2 border-l-gray-200">
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-gray-400" />
                                No matching human enhancements found
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm pt-2 border-t">
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
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Similarity:</span>
                              <span className={getScoreColor(result.similarity_score)}>
                                {formatScore(result.similarity_score)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">AI vs Human Enhancement Comparison</h3>
                    <p className="text-muted-foreground">
                      Side-by-side comparison of AI-generated and human-curated enhancement data
                    </p>
                  </div>

                  {/* Performance Grade */}
                  <Card className="bg-white/80">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-semibold mb-2">Performance Grade</div>
                      <div className={`text-6xl font-bold ${getScoreColor(validation.overall_score)} mb-2`}>
                        {validation.overall_score >= 0.9 ? 'A+' :
                         validation.overall_score >= 0.8 ? 'A' :
                         validation.overall_score >= 0.7 ? 'B+' :
                         validation.overall_score >= 0.6 ? 'B' :
                         validation.overall_score >= 0.5 ? 'C' : 'D'}
                      </div>
                      <div className="text-muted-foreground">
                        {validation.overall_score >= 0.8 ? 'Excellent AI Performance' :
                         validation.overall_score >= 0.6 ? 'Good AI Performance' :
                         validation.overall_score >= 0.4 ? 'Fair AI Performance' : 'AI Needs Improvement'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-blue-600" />
                          AI-Generated Enhancements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {aiEnhancements.map((enhancement, index) => (
                            <div key={index} className="text-sm bg-white p-2 rounded border">
                              {enhancement}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Badge variant="outline">{aiEnhancements.length} AI Suggestions</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          Human-Scraped Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {humanEnhancements.map((enhancement, index) => (
                            <div key={index} className="text-sm bg-white p-2 rounded border">
                              {enhancement}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Badge variant="outline">{humanEnhancements.length} Human Data Points</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Validation Summary */}
                  <Card className="bg-white/80">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Validation Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Validation Metrics</div>
                          <div className="space-y-1 text-sm">
                            <div>Total AI Enhancements: {aiEnhancements.length}</div>
                            <div>Human Data Points: {humanEnhancements.length}</div>
                            <div>Successful Matches: {validation.validation_results.filter(r => r.matched_human_enhancements.length > 0).length}</div>
                            <div>High Quality Suggestions: {validation.validation_results.filter(r => r.quality_assessment === 'excellent' || r.quality_assessment === 'good').length}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Key Insights</div>
                          <div className="space-y-1 text-sm">
                            <div>Coverage Rate: {formatScore(validation.validation_results.filter(r => r.matched_human_enhancements.length > 0).length / aiEnhancements.length)}</div>
                            <div>Average Similarity: {formatScore(validation.similarity_score)}</div>
                            <div>Average Quality: {formatScore(validation.quality_score)}</div>
                            <div>Overall Performance: {formatScore(validation.overall_score)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
=======
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
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
          </div>
        )}
      </CardContent>
    </Card>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
