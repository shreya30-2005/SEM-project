import React from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, count = null }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating-container">
      <div className="stars">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star star-full">★</span>
        ))}
        
        {/* Half star */}
        {hasHalfStar && <span className="star star-half">★</span>}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star star-empty">★</span>
        ))}
      </div>
      <span className="rating-text">{rating.toFixed(1)}</span>
      {count && <span className="rating-count">({count})</span>}
    </div>
  );
};

export default StarRating;
