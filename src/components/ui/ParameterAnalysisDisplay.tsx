'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChefHat, 
  Clock, 
  Thermometer, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';
import { ParameterAnalysis } from '@/lib/api/enhancementValidationApi';

interface ParameterAnalysisDisplayProps {
  parameterAnalysis: ParameterAnalysis;
  className?: string;
}

export function ParameterAnalysisDisplay({ 
  parameterAnalysis, 
  className = "" 
}: ParameterAnalysisDisplayProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.8) return "bg-green-100 text-green-800";
    if (score >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatScore = (score: number) => `${Math.round(score * 100)}%`;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Ingredients Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ChefHat className="h-4 w-4 text-orange-500" />
              Ingredient Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Match Score</span>
              <Badge className={getScoreBadge(parameterAnalysis.ingredients.ingredient_match_score)}>
                {formatScore(parameterAnalysis.ingredients.ingredient_match_score)}
              </Badge>
            </div>
            <Progress 
              value={parameterAnalysis.ingredients.ingredient_match_score * 100} 
              className="h-2"
            />
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">AI Suggestions:</div>
              {parameterAnalysis.ingredients.ai_suggestions.length > 0 ? (
                <ul className="text-xs space-y-1">
                  {parameterAnalysis.ingredients.ai_suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground italic">No ingredient suggestions detected</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              Time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Accuracy</span>
              <Badge className={getScoreBadge(parameterAnalysis.time.time_accuracy)}>
                {formatScore(parameterAnalysis.time.time_accuracy)}
              </Badge>
            </div>
            <Progress 
              value={parameterAnalysis.time.time_accuracy * 100} 
              className="h-2"
            />
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">AI Time Changes:</div>
              {parameterAnalysis.time.ai_time_changes.length > 0 ? (
                <ul className="text-xs space-y-1">
                  {parameterAnalysis.time.ai_time_changes.slice(0, 3).map((change, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="truncate">{change}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground italic">No time optimizations detected</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Temperature Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Thermometer className="h-4 w-4 text-red-500" />
              Temperature Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Accuracy</span>
              <Badge className={getScoreBadge(parameterAnalysis.temperature.temperature_accuracy)}>
                {formatScore(parameterAnalysis.temperature.temperature_accuracy)}
              </Badge>
            </div>
            <Progress 
              value={parameterAnalysis.temperature.temperature_accuracy * 100} 
              className="h-2"
            />
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">AI Temperature Changes:</div>
              {parameterAnalysis.temperature.ai_temp_changes.length > 0 ? (
                <ul className="text-xs space-y-1">
                  {parameterAnalysis.temperature.ai_temp_changes.slice(0, 3).map((change, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <Thermometer className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="truncate">{change}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground italic">No temperature adjustments detected</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            Parameter Analysis Summary
          </CardTitle>
          <CardDescription>
            Technical accuracy assessment comparing AI suggestions with human-curated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatScore(parameterAnalysis.ingredients.ingredient_match_score)}
              </div>
              <div className="text-xs text-muted-foreground">Ingredient Match</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatScore(parameterAnalysis.time.time_accuracy)}
              </div>
              <div className="text-xs text-muted-foreground">Time Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatScore(parameterAnalysis.temperature.temperature_accuracy)}
              </div>
              <div className="text-xs text-muted-foreground">Temperature Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatScore((
                  parameterAnalysis.ingredients.ingredient_match_score +
                  parameterAnalysis.time.time_accuracy +
                  parameterAnalysis.temperature.temperature_accuracy
                ) / 3)}
              </div>
              <div className="text-xs text-muted-foreground">Overall Technical</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
