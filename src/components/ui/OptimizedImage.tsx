'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  style,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate a simple blur placeholder
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-center text-gray-400">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: `transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`,
    onLoad: handleLoad,
    onError: handleError,
    priority,
    style,
    placeholder: placeholder as 'blur' | 'empty',
    ...(placeholder === 'blur' && {
      blurDataURL: blurDataURL || generateBlurDataURL(width || 10, height || 10)
    }),
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes })
  };

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
          style={style}
        >
          <div className="text-gray-400">
            <ImageIcon className="h-6 w-6 animate-pulse" />
          </div>
        </div>
      )}
      <Image {...imageProps} />
    </div>
  );
}

// Recipe-specific optimized image component
interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  size?: 'small' | 'medium' | 'large' | 'hero';
}

export function RecipeImage({ 
  src, 
  alt, 
  className = '', 
  priority = false, 
  size = 'medium' 
}: RecipeImageProps) {
  const sizeConfig = {
    small: { width: 150, height: 150, sizes: '150px' },
    medium: { width: 300, height: 200, sizes: '(max-width: 768px) 100vw, 300px' },
    large: { width: 600, height: 400, sizes: '(max-width: 768px) 100vw, 600px' },
    hero: { fill: true, sizes: '100vw' }
  };

  const config = sizeConfig[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      {...config}
      className={`object-cover rounded-lg ${className}`}
      priority={priority}
      placeholder="blur"
    />
  );
}

// Avatar component for user images
interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}: AvatarImageProps) {
  const sizeConfig = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 }
  };

  const config = sizeConfig[size];

  if (!src) {
    return (
      <div 
        className={`bg-gray-200 rounded-full flex items-center justify-center ${className}`}
        style={{ width: config.width, height: config.height }}
      >
        <span className="text-gray-500 font-medium">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={config.width}
      height={config.height}
      className={`rounded-full object-cover ${className}`}
      placeholder="blur"
    />
  );
}

export default OptimizedImage;
