import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient();

type Enhancement = {
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

type HumanEnhancementDisplayProps = {
  recipeId: string;
  className?: string;
};

export default function HumanEnhancementDisplay({ recipeId, className = '' }: HumanEnhancementDisplayProps) {
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnhancements = async () => {
      try {
        setLoading(true);
        console.log('DEBUG: Fetching human enhancements for recipe ID:', recipeId);
        
        // Try to fetch from unique_scraped_enhancements table first
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('unique_scraped_enhancements')
          .select('*')
          .eq('recipe_id', recipeId);
        
        if (uniqueError) {
          console.error('Error fetching from unique_scraped_enhancements:', uniqueError.message);
          // Fall back to human_enhancements table
          const { data, error } = await supabase
            .from('human_enhancements')
            .select('*')
            .eq('recipe_id', recipeId);

          if (error) throw error;
          console.log('DEBUG: Fetched from human_enhancements:', data?.length || 0, 'enhancements');
          setEnhancements(data || []);
        } else if (uniqueData && uniqueData.length > 0) {
          console.log('DEBUG: Fetched from unique_scraped_enhancements:', uniqueData.length, 'enhancements');
          
          // Map the data from unique_scraped_enhancements to match the Enhancement type
          const mappedData = uniqueData.map(item => ({
            id: item.id,
            recipe_id: item.recipe_id,
            content: item.enhancement,
            enhancement_type: item.enhancement_type || 'general',
            source_url: item.source,
            metadata: {
              source_name: new URL(item.source || '').hostname.replace('www.', ''),
              position: 0,
              selector_used: 'unique_table'
            },
            created_at: item.created_at,
            updated_at: item.updated_at
          }));
          
          setEnhancements(mappedData);
        } else {
          // Fall back to human_enhancements table
          const { data, error } = await supabase
            .from('human_enhancements')
            .select('*')
            .eq('recipe_id', recipeId);

          if (error) throw error;
          console.log('DEBUG: Fetched from human_enhancements (fallback):', data?.length || 0, 'enhancements');
          setEnhancements(data || []);
        }
      } catch (err: any) {
        console.error('Error fetching human enhancements:', err.message);
        setError('Failed to load human-curated enhancements');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchEnhancements();
    }
  }, [recipeId]);

  // Group enhancements by type
  const healthierEnhancements = enhancements.filter(e => e.enhancement_type === 'healthier');
  const fasterEnhancements = enhancements.filter(e => e.enhancement_type === 'faster');
  const tastierEnhancements = enhancements.filter(e => e.enhancement_type === 'tastier');
  const tipEnhancements = enhancements.filter(e => e.enhancement_type === 'tip');
  const variationEnhancements = enhancements.filter(e => e.enhancement_type === 'variation');
  const generalEnhancements = enhancements.filter(e => e.enhancement_type === 'general');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'healthier': return 'bg-green-100 text-green-800';
      case 'faster': return 'bg-blue-100 text-blue-800';
      case 'tastier': return 'bg-orange-100 text-orange-800';
      case 'tip': return 'bg-purple-100 text-purple-800';
      case 'variation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-4 text-center">Loading human-curated enhancements...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (enhancements.length === 0) return null;

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader>
        <CardTitle>Human-Curated Recipe Enhancements</CardTitle>
        <CardDescription>
          Enhancements collected from professional cooking websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enhancements.map((enhancement) => (
            <EnhancementItem key={enhancement.id} enhancement={enhancement} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancementItem({ enhancement }: { enhancement: Enhancement }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <Badge className={getTypeColor(enhancement.enhancement_type)}>
          {enhancement.enhancement_type.charAt(0).toUpperCase() + enhancement.enhancement_type.slice(1)}
        </Badge>
        {enhancement.source_url && (
          <a 
            href={enhancement.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {enhancement.metadata?.source_name || 'Source'} <ExternalLink className="ml-1" size={14} />
          </a>
        )}
      </div>
      <p className="text-gray-800">{enhancement.content}</p>
    </div>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'healthier': return 'bg-green-100 text-green-800';
    case 'faster': return 'bg-blue-100 text-blue-800';
    case 'tastier': return 'bg-orange-100 text-orange-800';
    case 'tip': return 'bg-purple-100 text-purple-800';
    case 'variation': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
