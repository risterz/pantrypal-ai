import { useState, useEffect } from 'react';

export interface EnhancementStats {
  totalEnhancements: number;
  totalRecipesEnhanced: number;
  recentEnhancements: number;
  averageEnhancementsPerRecipe: number;
  categoryBreakdown: {
    healthier: number;
    faster: number;
    tastier: number;
    other: number;
  };
  lastUpdated: string;
}

export function useEnhancementStats() {
  const [stats, setStats] = useState<EnhancementStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/stats/enhancements');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching enhancement stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: () => fetchStats() };
}
