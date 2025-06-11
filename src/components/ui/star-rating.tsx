import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5,
  onRatingChange 
}: StarRatingProps) {
  const handleClick = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={`${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } cursor-pointer`}
          />
        </button>
      ))}
    </div>
  );
}
