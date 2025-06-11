import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { scrapedEnhancementApi } from '@/lib/api/scrapedEnhancementApi';

type ScrapedEnhancementDisplayProps = {
  recipeId: string | number;
  className?: string;
};

export default function ScrapedEnhancementDisplay({ recipeId, className = '' }: ScrapedEnhancementDisplayProps) {
  const [enhancements, setEnhancements] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnhancements = async () => {
      try {
        setLoading(true);
        const numericRecipeId = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId;
        
        console.log('UPDATED CODE: Fetching enhancements for recipe ID:', numericRecipeId);
        const scrapedData = await scrapedEnhancementApi.getByRecipeId(numericRecipeId);
        
        if (scrapedData) {
          console.log('BEFORE DEDUPLICATION:', scrapedData.enhancements);
          // Remove duplicate enhancements by converting to a Set and back to an array
          const uniqueEnhancements = [...new Set(scrapedData.enhancements || [])];
          console.log('AFTER DEDUPLICATION:', uniqueEnhancements);
          setEnhancements(uniqueEnhancements);
          setSourceUrl(scrapedData.sourceUrl || null);
        } else {
          setEnhancements([]);
        }
      } catch (err: any) {
        console.error('Error fetching scraped enhancements:', err.message);
        setError('Failed to load scraped enhancements');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchEnhancements();
    }
  }, [recipeId]);

  // Categorize enhancements based on content
  const categorizeEnhancements = (enhancementList: string[]) => {
    const categorized = {
      general: [] as string[],
      tastier: [] as string[],
      healthier: [] as string[],
    };

    enhancementList.forEach(enhancement => {
      const lowerEnhancement = enhancement.toLowerCase();
      
      // Check for tastier-related keywords
      if (
        lowerEnhancement.includes('flavor') ||
        lowerEnhancement.includes('taste') ||
        lowerEnhancement.includes('delicious') ||
        lowerEnhancement.includes('seasoning') ||
        lowerEnhancement.includes('spice') ||
        lowerEnhancement.includes('crispy') ||
        lowerEnhancement.includes('tender')
      ) {
        categorized.tastier.push(enhancement);
      }
      // Check for healthier-related keywords
      else if (
        lowerEnhancement.includes('health') ||
        lowerEnhancement.includes('calorie') ||
        lowerEnhancement.includes('fat') ||
        lowerEnhancement.includes('oil') ||
        lowerEnhancement.includes('sugar') ||
        lowerEnhancement.includes('salt')
      ) {
        categorized.healthier.push(enhancement);
      }
      // Default to general
      else {
        categorized.general.push(enhancement);
      }
    });

    return categorized;
  };

  const categorizedEnhancements = categorizeEnhancements(enhancements);

  if (loading) return <div className="p-4 text-center">Loading scraped enhancements...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (enhancements.length === 0) return null;

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader>
        <CardTitle>Human-Curated Enhancements</CardTitle>
        <CardDescription>
          Enhancements collected from cooking websites
          {sourceUrl && (
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Source <ExternalLink className="ml-1" size={14} />
            </a>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tastier">Tastier</TabsTrigger>
            <TabsTrigger value="healthier">Healthier</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {enhancements.map((enhancement, index) => (
              <EnhancementItem 
                key={index} 
                content={enhancement} 
                type={getEnhancementType(enhancement)}
              />
            ))}
          </TabsContent>

          <TabsContent value="tastier" className="space-y-4">
            {categorizedEnhancements.tastier.map((enhancement, index) => (
              <EnhancementItem 
                key={index} 
                content={enhancement} 
                type="tastier"
              />
            ))}
          </TabsContent>

          <TabsContent value="healthier" className="space-y-4">
            {categorizedEnhancements.healthier.map((enhancement, index) => (
              <EnhancementItem 
                key={index} 
                content={enhancement} 
                type="healthier"
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function EnhancementItem({ content, type }: { content: string; type: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <Badge className={getTypeColor(type)}>
          {type}
        </Badge>
      </div>
      <p className="text-gray-800">{content}</p>
    </div>
  );
}

function getEnhancementType(enhancement: string): string {
  const lowerEnhancement = enhancement.toLowerCase();
  
  if (
    lowerEnhancement.includes('flavor') ||
    lowerEnhancement.includes('taste') ||
    lowerEnhancement.includes('delicious') ||
    lowerEnhancement.includes('seasoning') ||
    lowerEnhancement.includes('spice') ||
    lowerEnhancement.includes('crispy') ||
    lowerEnhancement.includes('tender')
  ) {
    return 'tastier';
  }
  else if (
    lowerEnhancement.includes('health') ||
    lowerEnhancement.includes('calorie') ||
    lowerEnhancement.includes('fat') ||
    lowerEnhancement.includes('oil') ||
    lowerEnhancement.includes('sugar') ||
    lowerEnhancement.includes('salt')
  ) {
    return 'healthier';
  }
  
  return 'general';
}

function getTypeColor(type: string) {
  switch (type) {
    case 'healthier': return 'bg-green-100 text-green-800';
    case 'tastier': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
