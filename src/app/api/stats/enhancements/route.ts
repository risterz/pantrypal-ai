import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get total count of AI enhancements generated
    const { data: enhancementData, error: enhancementError } = await supabase
      .from('recipe_enhancements')
      .select('enhancements, categorized_enhancements');

    if (enhancementError) {
      console.error('Error fetching enhancement statistics:', enhancementError);
      return NextResponse.json(
        { error: 'Failed to fetch enhancement statistics' },
        { status: 500 }
      );
    }

    // Calculate total enhancements across all recipes
    let totalEnhancements = 0;
    let totalRecipesEnhanced = enhancementData?.length || 0;
    let categoryBreakdown = {
      healthier: 0,
      faster: 0,
      tastier: 0,
      other: 0
    };

    enhancementData?.forEach((record) => {
      // Count basic enhancements
      if (record.enhancements && Array.isArray(record.enhancements)) {
        totalEnhancements += record.enhancements.length;
      }

      // Count categorized enhancements if available
      if (record.categorized_enhancements) {
        const categorized = record.categorized_enhancements as any;
        if (categorized.healthier && Array.isArray(categorized.healthier)) {
          categoryBreakdown.healthier += categorized.healthier.length;
        }
        if (categorized.faster && Array.isArray(categorized.faster)) {
          categoryBreakdown.faster += categorized.faster.length;
        }
        if (categorized.tastier && Array.isArray(categorized.tastier)) {
          categoryBreakdown.tastier += categorized.tastier.length;
        }
        if (categorized.other && Array.isArray(categorized.other)) {
          categoryBreakdown.other += categorized.other.length;
        }
      }
    });

    // If we have categorized data, use that total instead
    const categorizedTotal = categoryBreakdown.healthier + categoryBreakdown.faster + 
                            categoryBreakdown.tastier + categoryBreakdown.other;
    if (categorizedTotal > 0) {
      totalEnhancements = categorizedTotal;
    }

    // Get recent enhancement activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentData, error: recentError } = await supabase
      .from('recipe_enhancements')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());

    const recentEnhancements = recentData?.length || 0;

    // Calculate average enhancements per recipe
    const averageEnhancementsPerRecipe = totalRecipesEnhanced > 0 
      ? Math.round((totalEnhancements / totalRecipesEnhanced) * 10) / 10 
      : 0;

    const stats = {
      totalEnhancements,
      totalRecipesEnhanced,
      recentEnhancements,
      averageEnhancementsPerRecipe,
      categoryBreakdown,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error in enhancement stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
