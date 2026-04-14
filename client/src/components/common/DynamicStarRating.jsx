import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

const DynamicStarRating = ({ menuId, refreshTrigger }) => {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/average-rating/${menuId}`);
        if (response.ok) {
          const data = await response.json();
          setRating(parseFloat(data.averageRating));
          setReviewCount(data.totalReviews);
        }
      } catch (err) {
        console.error('Error fetching rating:', err);
        setRating(4.5); // Fallback rating
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [menuId, refreshTrigger]);

  if (loading) {
    return <span className="rating-loading">Loading...</span>;
  }

  return <StarRating rating={rating} count={reviewCount} />;
};

export default DynamicStarRating;
