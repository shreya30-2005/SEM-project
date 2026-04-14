import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ itemId, itemName, username, onReviewAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('ReviewForm rendered with username:', username, 'itemId:', itemId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ReviewForm handleSubmit called with:', { itemId, itemName, username, rating, comment });
    if (!comment.trim() && rating < 3) {
      setError('Please provide a comment for low ratings or improve your rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting review:', { menuId: itemId, username, rating: parseInt(rating), comment: comment.trim() });
      const response = await fetch('http://localhost:5000/add-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuId: itemId,
          username,
          rating: parseInt(rating),
          comment: comment.trim()
        })
      });
      console.log('Review response:', response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Review added successfully:', data);
        setComment('');
        setRating(5);
        setShowForm(false);
        if (onReviewAdded) onReviewAdded();
      } else {
        const errorText = await response.text();
        console.error('Review submission failed:', errorText);
        setError('Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-wrapper">
      <button 
        className="btn-review"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Write Review'}
      </button>

      {showForm && (
        <div className="review-form-container">
          <h4>Review: {itemName}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Rating</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-value">{rating} / 5</span>
            </div>

            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this item (optional)..."
                maxLength={200}
              />
              <small>{comment.length} / 200</small>
            </div>

            {error && <div className="error-text">{error}</div>}

            <button 
              type="submit" 
              className="btn-submit-review"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
