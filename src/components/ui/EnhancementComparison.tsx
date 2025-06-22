import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/star-rating';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Initialize Supabase client
const supabase = createClient();

interface EnhancementComparisonProps {
  recipeId: string;
  aiEnhancements: string[];
  humanEnhancements?: HumanEnhancement[];
  onSubmitEvaluation: (evaluation: EvaluationData) => void;
  isAuthenticated: boolean;
}

type HumanEnhancement = {
  id: string;
  content: string;
  enhancement_type: string;
  source_url?: string;
  metadata?: {
    source_name?: string;
    position?: number;
    selector_used?: string;
  };
};

export interface EvaluationData {
  recipeId: string;
  // Rating fields removed as per user request
}

export function EnhancementComparison({ 
  recipeId, 
  aiEnhancements, 
  humanEnhancements: propHumanEnhancements,
  onSubmitEvaluation,
  isAuthenticated
}: EnhancementComparisonProps) {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<EvaluationData>({
    recipeId
    // Rating fields removed as per user request
  });
  
  const [humanEnhancements, setHumanEnhancements] = useState<HumanEnhancement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // For debugging - log the current state
  useEffect(() => {
    console.log('EnhancementComparison state:', { 
      humanEnhancements, 
      loading, 
      error, 
      recipeId 
    });
  }, [humanEnhancements, loading, error, recipeId]);

  useEffect(() => {
    // If humanEnhancements are provided as props, use them directly
    if (propHumanEnhancements && propHumanEnhancements.length > 0) {
      console.log('EnhancementComparison: Using human enhancements from props:', propHumanEnhancements);
      setHumanEnhancements(propHumanEnhancements);
      setLoading(false);
      return;
    }
    
    const fetchHumanEnhancements = async () => {
      try {
        setLoading(true);
        console.log('EnhancementComparison: Fetching enhancements for recipe ID:', recipeId);
        
        // Ensure recipeId is a valid number
        const numericRecipeId = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId;
        
        if (isNaN(numericRecipeId)) {
          throw new Error(`Invalid recipe ID format: ${recipeId}`);
        }
        
        // Try to fetch from unique_scraped_enhancements table first
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('unique_scraped_enhancements')
          .select('*')
          .eq('recipe_id', numericRecipeId.toString());
        
        console.log('EnhancementComparison: Unique data query result:', { uniqueData, uniqueError });
        
        if (uniqueError) {
          console.error('Error fetching from unique_scraped_enhancements:', uniqueError.message);
          // Fall back to scraped_enhancements table
          const { data, error } = await supabase
            .from('scraped_enhancements')
            .select('*')
            .eq('recipe_id', numericRecipeId.toString());
          
          console.log('EnhancementComparison: Scraped enhancements query result:', { data, error });

          if (error) throw error;
          
          if (data && data.length > 0 && data[0].enhancements) {
            // Get all enhancements from the first result and deduplicate
            const allEnhancements = Array.isArray(data[0].enhancements) ? data[0].enhancements : [];
            const uniqueEnhancements = [...new Set(allEnhancements)];
            console.log('EnhancementComparison: Found', uniqueEnhancements.length, 'unique enhancements in scraped_enhancements');
            
            // Create one HumanEnhancement object per unique enhancement
            const transformedData = uniqueEnhancements.map((enhancement, index) => {
              if (typeof enhancement !== 'string') {
                console.error('Enhancement is not a string:', enhancement);
                return null;
              }
              
              return {
                id: `${data[0].id}-${index}` || '',
                content: enhancement,
                enhancement_type: 'general',
                source_url: data[0].source || '',
                metadata: {
                  source_name: data[0].source ? new URL(data[0].source).hostname.replace('www.', '') : 'Web Scraping',
                  position: index,
                  selector_used: ''
                }
              };
            }).filter(item => item !== null) as HumanEnhancement[];
            
            console.log('EnhancementComparison: Transformed data:', transformedData);
            setHumanEnhancements(transformedData);
          } else {
            console.log('EnhancementComparison: No enhancements found in scraped_enhancements');
            setHumanEnhancements([]);
          }
        } else if (uniqueData && uniqueData.length > 0) {
          console.log('EnhancementComparison: Found', uniqueData.length, 'enhancements in unique_scraped_enhancements');
          // Map the data from unique_scraped_enhancements to match the HumanEnhancement type
          const transformedData = uniqueData.map(item => {
            if (!item.enhancement) {
              console.error('Enhancement is missing in item:', item);
              return null;
            }
            
            return {
              id: item.id || '',
              content: item.enhancement,
              enhancement_type: item.enhancement_type || 'general',
              source_url: item.source || '',
              metadata: {
                source_name: item.source ? new URL(item.source).hostname.replace('www.', '') : 'Web Scraping',
                position: 0,
                selector_used: 'unique_table'
              }
            };
          }).filter(item => item !== null) as HumanEnhancement[];
          
          console.log('EnhancementComparison: Transformed data from unique table:', transformedData);
          setHumanEnhancements(transformedData);
        } else {
          console.log('EnhancementComparison: No enhancements found in either table');
          setHumanEnhancements([]);
        }
      } catch (err: any) {
        console.error('Error fetching human enhancements:', err.message);
        setError('Failed to load human-curated enhancements');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchHumanEnhancements();
    }
  }, [recipeId]);
  
  // Get human enhancement content for display
  const humanEnhancementTexts = humanEnhancements.map(e => e.content);
  console.log('EnhancementComparison: Human enhancement texts:', humanEnhancementTexts);

  // Clean AI enhancements to remove introductory text
  const cleanedAIEnhancements = aiEnhancements.map(enhancement => {
    // Remove any introductory sentences
    let cleaned = enhancement
      .replace(/^Here are.+?:/i, '')
      .replace(/^Here is.+?:/i, '')
      .replace(/^Below are.+?:/i, '')
      .replace(/^I suggest.+?:/i, '')
      .replace(/^These are.+?:/i, '')
      .replace(/^.+enhancements for.+?:/i, '')
      .replace(/^.+suggestions for.+?:/i, '')
      .replace(/^.+ways to enhance.+?:/i, '')
      .replace(/^.+improvements for.+?:/i, '')
      .trim();

    // Remove asterisks and other formatting
    cleaned = cleaned.replace(/\*\*/g, '');

    // Remove bullet points if they exist at the start
    cleaned = cleaned.replace(/^[•\-\*\d\.]+\s*/, '');

    return cleaned.trim();
  }).filter(enhancement => enhancement.length > 10); // Filter out very short enhancements


  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to submit your evaluation');
      router.push('/signin?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    onSubmitEvaluation(evaluation);
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Enhancement Comparison</h2>
      <p className="text-muted-foreground">
        Help us improve our recipe enhancement system by comparing AI-generated enhancements with human-curated ones.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Human Enhancements */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">Human</span>
              Human-Curated Enhancements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <p className="text-sm italic">Loading human enhancements...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : humanEnhancements.length === 0 ? (
              <p className="text-sm italic">No human enhancements available for this recipe.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {humanEnhancements.map((enhancement, index) => (
                  <li key={`human-${enhancement.id}`} className="text-sm">
                    {enhancement.content}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* AI Enhancements */}
        <Card>
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm mr-2">AI</span>
              AI-Generated Enhancements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2">
              {cleanedAIEnhancements.map((enhancement, index) => (
                <li key={`ai-${index}`} className="text-sm">{enhancement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Rating form removed as per user request */}
    </div>
  );
}
