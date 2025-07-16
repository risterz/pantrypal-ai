import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, ChefHat, Clock, Heart, Zap } from 'lucide-react';
import { CategorizedEnhancements } from '@/lib/api/recipeEnhancementDbApi';

interface EnhancementStatsProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
  categorizedEnhancements?: CategorizedEnhancements | null;
  basicEnhancements?: string[];
  recipeTitle?: string;
}

export function EnhancementStats({
  className = '',
  showTitle = true,
  compact = false,
  categorizedEnhancements,
  basicEnhancements = [],
  recipeTitle = "this recipe"
}: EnhancementStatsProps) {

  // Calculate enhancement percentages for this specific recipe
  const calculateRecipeBoost = () => {
    let healthierCount = 0;
    let fasterCount = 0;
    let tastierCount = 0;
    let otherCount = 0;

    if (categorizedEnhancements) {
      healthierCount = categorizedEnhancements.healthier?.length || 0;
      fasterCount = categorizedEnhancements.faster?.length || 0;
      tastierCount = categorizedEnhancements.tastier?.length || 0;
      otherCount = categorizedEnhancements.other?.length || 0;
    } else if (basicEnhancements.length > 0) {
      // If we only have basic enhancements, distribute them evenly
      const total = basicEnhancements.length;
      healthierCount = Math.ceil(total / 3);
      fasterCount = Math.ceil(total / 3);
      tastierCount = total - healthierCount - fasterCount;
    }

    const healthierPercentage = healthierCount * 10;
    const fasterPercentage = fasterCount * 10;
    const tastierPercentage = tastierCount * 10;
    const otherPercentage = otherCount * 10;
    const totalBoost = healthierPercentage + fasterPercentage + tastierPercentage + otherPercentage;

    return {
      healthier: { count: healthierCount, percentage: healthierPercentage },
      faster: { count: fasterCount, percentage: fasterPercentage },
      tastier: { count: tastierCount, percentage: tastierPercentage },
      other: { count: otherCount, percentage: otherPercentage },
      totalBoost,
      hasEnhancements: totalBoost > 0
    };
  };

  const boostData = calculateRecipeBoost();

  if (!boostData.hasEnhancements) {
    return null; // Don't show if no enhancements
  }

  if (compact) {
    return (
      <Card className={`bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-md ${className}`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium">Total AI Boost for This Recipe</p>
                <p className="text-lg font-bold text-green-800">
                  {boostData.totalBoost}%
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {boostData.healthier.percentage > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  ❤️ {boostData.healthier.percentage}%
                </Badge>
              )}
              {boostData.faster.percentage > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  ⚡ {boostData.faster.percentage}%
                </Badge>
              )}
              {boostData.tastier.percentage > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  ✨ {boostData.tastier.percentage}%
                </Badge>
              )}
              {boostData.other.percentage > 0 && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  🔧 {boostData.other.percentage}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 border-green-200 shadow-lg ${className}`}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            AI Recipe Enhancement Boost
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {/* Total Boost Display */}
        <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
          <div className="flex justify-center mb-2">
            <Sparkles className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800 mb-1">
            {boostData.totalBoost}%
          </p>
          <p className="text-sm text-green-700 font-medium">Total AI Boost Applied</p>
          <p className="text-xs text-gray-600 mt-1">
            AI has enhanced {recipeTitle} with {boostData.totalBoost}% improvement
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Enhancement Breakdown</h4>
          <div className="grid grid-cols-2 gap-3">
            {boostData.healthier.percentage > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Healthier</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{boostData.healthier.percentage}%</p>
                  <p className="text-xs text-red-500">{boostData.healthier.count} tips</p>
                </div>
              </div>
            )}

            {boostData.faster.percentage > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Faster</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{boostData.faster.percentage}%</p>
                  <p className="text-xs text-blue-500">{boostData.faster.count} tips</p>
                </div>
              </div>
            )}

            {boostData.tastier.percentage > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Tastier</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">{boostData.tastier.percentage}%</p>
                  <p className="text-xs text-yellow-500">{boostData.tastier.count} tips</p>
                </div>
              </div>
            )}

            {boostData.other.percentage > 0 && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Other Tips</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">{boostData.other.percentage}%</p>
                  <p className="text-xs text-purple-500">{boostData.other.count} tips</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="text-center pt-3 border-t border-green-100">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold text-green-700">
              {boostData.healthier.count + boostData.faster.count + boostData.tastier.count + boostData.other.count}
            </span> AI enhancements applied
          </p>
          <p className="text-xs text-gray-500">
            Each enhancement = 10% improvement • Powered by DeepSeek AI
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
