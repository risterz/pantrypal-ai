import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingSkeletonProps {
  type?: 'recipe-card' | 'recipe-detail' | 'dashboard' | 'search-results' | 'enhancement';
  count?: number;
}

export function LoadingSkeleton({ type = 'recipe-card', count = 1 }: LoadingSkeletonProps) {
  const renderRecipeCard = () => (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </CardContent>
    </Card>
  );

  const renderRecipeDetail = () => (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
      
      {/* Ingredients */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex gap-3">
                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            {renderRecipeCard()}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnhancement = () => (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 animate-pulse">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  switch (type) {
    case 'recipe-detail':
      return renderRecipeDetail();
    case 'dashboard':
      return renderDashboard();
    case 'search-results':
      return renderSearchResults();
    case 'enhancement':
      return renderEnhancement();
    case 'recipe-card':
    default:
      return (
        <div className="space-y-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>
              {renderRecipeCard()}
            </div>
          ))}
        </div>
      );
  }
}

<<<<<<< HEAD
export default LoadingSkeleton;
=======
export default LoadingSkeleton;
>>>>>>> 77c68cbca9b5d4b61a9ac5d0a23ac3677328964a
