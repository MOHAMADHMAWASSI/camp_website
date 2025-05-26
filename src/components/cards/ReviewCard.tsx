import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render stars
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{review.userName}</h3>
          <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
        </div>
        <div className="flex">{renderStars(review.rating)}</div>
      </div>
      
      <p className="text-gray-600">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;