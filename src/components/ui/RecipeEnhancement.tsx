'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Heart, Zap, Copy, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategorizedEnhancements {
  healthier: string[];
  faster: string[];
  tastier: string[];
  other: string[];
}

interface RecipeEnhancementProps {
  aiEnhancements?: string[];
  scrapedEnhancements?: string[];
  showComparison?: boolean;
  onToggleComparison?: () => void;
}

export default function RecipeEnhancement({ 
  aiEnhancements = [], 
  scrapedEnhancements = [], 
  showComparison = false,
  onToggleComparison 
}: RecipeEnhancementProps) {
  const [categorizedEnhancements, setCategorizedEnhancements] = useState<CategorizedEnhancements | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    healthier: true,
    faster: true,
    tastier: true
  });

  // Copy enhancement to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    toast.success('Enhancement copied to clipboard!');
  };


  // This function categorizes enhancements into healthier, faster, tastier, and other
  const categorizeEnhancements = (enhancements: string[]): CategorizedEnhancements => {
    const categorized: CategorizedEnhancements = {
      healthier: [],
      faster: [],
      tastier: [],
      other: []
    };
    
    enhancements.forEach(enhancement => {
      const lowerEnhancement = enhancement.toLowerCase();
      
      // First check for explicit prefixes from the new AI format
      if (lowerEnhancement.startsWith('healthier:') || lowerEnhancement.includes('healthier:')) {
        categorized.healthier.push(enhancement.replace(/^healthier:\s*/i, ''));
      }
      else if (lowerEnhancement.startsWith('time-saving:') || lowerEnhancement.includes('time-saving:')) {
        categorized.faster.push(enhancement.replace(/^time-saving:\s*/i, ''));
      }
      else if (lowerEnhancement.startsWith('flavor:') || lowerEnhancement.includes('flavor:')) {
        categorized.tastier.push(enhancement.replace(/^flavor:\s*/i, ''));
      }
      // Fallback to keyword-based categorization for backward compatibility
      else if (lowerEnhancement.includes('health') || 
          lowerEnhancement.includes('calorie') || 
          lowerEnhancement.includes('nutrition') || 
          lowerEnhancement.includes('fat') || 
          lowerEnhancement.includes('sugar') || 
          lowerEnhancement.includes('salt') || 
          lowerEnhancement.includes('sodium') ||
          lowerEnhancement.includes('substitute') ||
          lowerEnhancement.includes('oil') ||
          lowerEnhancement.includes('leaner') ||
          lowerEnhancement.includes('greek yogurt') ||
          lowerEnhancement.includes('whole grain') ||
          lowerEnhancement.includes('reduce') ||
          lowerEnhancement.includes('air fry')) {
        categorized.healthier.push(enhancement);
      }
      // Check if enhancement contains keywords related to time-saving
      else if (lowerEnhancement.includes('time') || 
               lowerEnhancement.includes('quick') || 
               lowerEnhancement.includes('fast') || 
               lowerEnhancement.includes('efficient') || 
               lowerEnhancement.includes('prep') || 
               lowerEnhancement.includes('prepare') ||
               lowerEnhancement.includes('pressure cooker') ||
               lowerEnhancement.includes('instant pot') ||
               lowerEnhancement.includes('microwave') ||
               lowerEnhancement.includes('ahead') ||
               lowerEnhancement.includes('batch') ||
               lowerEnhancement.includes('shortcut')) {
        categorized.faster.push(enhancement);
      }
      // Check if enhancement contains keywords related to flavor
      else if (lowerEnhancement.includes('flavor') || 
               lowerEnhancement.includes('taste') || 
               lowerEnhancement.includes('delicious') || 
               lowerEnhancement.includes('seasoning') || 
               lowerEnhancement.includes('herb') || 
               lowerEnhancement.includes('spice') ||
               lowerEnhancement.includes('aroma') ||
               lowerEnhancement.includes('texture') ||
               lowerEnhancement.includes('garlic') ||
               lowerEnhancement.includes('lemon') ||
               lowerEnhancement.includes('fresh') ||
               lowerEnhancement.includes('season')) {
        categorized.tastier.push(enhancement);
      }
      // If no category matches, put in other
      else {
        categorized.other.push(enhancement);
      }
    });

    // Ensure minimum enhancements per category by redistributing from 'other'
    const ensureMinimumEnhancements = () => {
      const minPerCategory = 2; // Minimum 2 per category
      
      // If any category has fewer than minimum, try to redistribute from 'other'
      if (categorized.healthier.length < minPerCategory && categorized.other.length > 0) {
        const needed = minPerCategory - categorized.healthier.length;
        const moved = categorized.other.splice(0, Math.min(needed, categorized.other.length));
        categorized.healthier.push(...moved);
      }
      
      if (categorized.faster.length < minPerCategory && categorized.other.length > 0) {
        const needed = minPerCategory - categorized.faster.length;
        const moved = categorized.other.splice(0, Math.min(needed, categorized.other.length));
        categorized.faster.push(...moved);
      }
      
      if (categorized.tastier.length < minPerCategory && categorized.other.length > 0) {
        const needed = minPerCategory - categorized.tastier.length;
        const moved = categorized.other.splice(0, Math.min(needed, categorized.other.length));
        categorized.tastier.push(...moved);
      }
    };

    ensureMinimumEnhancements();
    
    return categorized;
  };
  
  // Generate or use provided enhancements
  const generateEnhancements = () => {
    // If aiEnhancements are provided, use those instead of generating new ones
    if (aiEnhancements && aiEnhancements.length > 0) {
      // Clean up enhancements by removing ** markers and introductory text
      return aiEnhancements.map(enhancement => {
        // Remove any introductory sentences
        let cleaned = enhancement
          .replace(/^\*\*.*?\*\*:?\s*/i, '') // Remove **text**: at the beginning
          .replace(/^(here are|below are|i suggest|you can).*?:/i, '') // Remove common intro phrases
          .replace(/\*\*/g, '') // Remove all ** markers
          .trim();
        
        // If the cleaned text is too short, return the original
        return cleaned.length > 10 ? cleaned : enhancement.replace(/\*\*/g, '').trim();
      });
    }
    
    // Fallback enhancements if no AI enhancements provided
    return [
      "For a healthier version: Use Greek yogurt instead of sour cream to reduce calories while adding protein.",
      "Speed up cooking: Prepare ingredients in advance and use a pressure cooker to reduce cooking time by up to 70%.",
      "Enhance flavor: Try adding a small amount of acid (lemon juice or vinegar) at the end to brighten flavors.",
      "Reduce sodium: Use herbs and spices instead of salt for seasoning to create more complex flavors.",
      "Save time: Pre-chop vegetables and store them in the refrigerator for quick meal assembly."
    ];
  };

  // Calculate enhancement percentages
  const calculateEnhancementPercentages = (categorized: CategorizedEnhancements) => {
    const totalEnhancements = categorized.healthier.length + categorized.faster.length + categorized.tastier.length;
    
    return {
      healthier: Math.round((categorized.healthier.length / totalEnhancements) * 100) || 0,
      faster: Math.round((categorized.faster.length / totalEnhancements) * 100) || 0,
      tastier: Math.round((categorized.tastier.length / totalEnhancements) * 100) || 0,
      total: Math.min(100, (categorized.healthier.length + categorized.faster.length + categorized.tastier.length) * 10)
    };
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Share enhancements
  const shareEnhancements = async () => {
    if (!categorizedEnhancements) return;
    
    const allEnhancements = [
      ...categorizedEnhancements.healthier,
      ...categorizedEnhancements.faster,
      ...categorizedEnhancements.tastier
    ];
    
    const shareText = `AI Recipe Enhancements:\n\n${allEnhancements.map((enhancement, index) => `${index + 1}. ${enhancement}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Recipe Enhancements',
          text: shareText
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  // Initialize categorized enhancements
  useEffect(() => {
    const enhancements = generateEnhancements();
    const categorized = categorizeEnhancements(enhancements);
    setCategorizedEnhancements(categorized);
  }, [aiEnhancements]);

  if (!categorizedEnhancements) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentages = calculateEnhancementPercentages(categorizedEnhancements);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg font-semibold text-blue-700">
                AI Enhancement Suggestions
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Powered by DeepSeek
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Smart ways to improve this recipe • {percentages.total}% enhancement score
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareEnhancements}
                className="text-gray-600 hover:text-gray-800"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            0/{categorizedEnhancements.healthier.length + categorizedEnhancements.faster.length + categorizedEnhancements.tastier.length} applied
          </p>
        </CardHeader>
      </Card>

      {/* Enhancement Categories */}
      <div className="space-y-4">
        {/* Time-Saving Enhancements */}
        {categorizedEnhancements.faster.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-base font-medium text-blue-700">
                    ⚡ Time-Saving {percentages.faster}%
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {percentages.faster}%
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory('faster')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.faster ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">
                    {expandedCategories.faster ? 'Collapse' : 'Expand'}
                  </span>
                </Button>
              </div>
            </CardHeader>
            {expandedCategories.faster && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {categorizedEnhancements.faster.map((enhancement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {enhancement}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(enhancement)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Flavor Boosters */}
        {categorizedEnhancements.tastier.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <CardTitle className="text-base font-medium text-yellow-700">
                    ✨ Flavor Boosters {percentages.tastier}%
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {percentages.tastier}%
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory('tastier')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.tastier ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">
                    {expandedCategories.tastier ? 'Collapse' : 'Expand'}
                  </span>
                </Button>
              </div>
            </CardHeader>
            {expandedCategories.tastier && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {categorizedEnhancements.tastier.map((enhancement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-yellow-100">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {enhancement}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(enhancement)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Healthier Options */}
        {categorizedEnhancements.healthier.length > 0 && (
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  <CardTitle className="text-base font-medium text-green-700">
                    🥗 Healthier Options {percentages.healthier}%
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {percentages.healthier}%
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory('healthier')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.healthier ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">
                    {expandedCategories.healthier ? 'Collapse' : 'Expand'}
                  </span>
                </Button>
              </div>
            </CardHeader>
            {expandedCategories.healthier && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {categorizedEnhancements.healthier.map((enhancement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-green-100">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {enhancement}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(enhancement)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>

      {/* Comparison Toggle */}
      {scrapedEnhancements && scrapedEnhancements.length > 0 && onToggleComparison && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onToggleComparison}
            className="text-sm"
          >
            {showComparison ? 'Hide' : 'Show'} Expert Comparison
          </Button>
        </div>
      )}
    </div>
  );
}