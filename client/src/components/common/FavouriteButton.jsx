import React, { useState, useEffect } from 'react';
import './FavouriteButton.css';

const FavouriteButton = ({ itemId, username }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('FavouriteButton rendered with username:', username, 'itemId:', itemId);

  useEffect(() => {
    // Check if item is in favourites on component mount
    const checkFavouriteStatus = async () => {
      if (!username) return;

      try {
        const response = await fetch(`http://localhost:5000/favourites/${username}`);
        if (response.ok) {
          const favourites = await response.json();
          const isFav = favourites.some(item => item._id === itemId || item._id.toString() === itemId);
          setIsFavourite(isFav);
        }
      } catch (err) {
        console.error('Error checking favourite status:', err);
      }
    };

    checkFavouriteStatus();
  }, [itemId, username]);

  const toggleFavourite = async () => {
    if (!username || loading) {
      console.log('Not toggling - username:', username, 'loading:', loading);
      return;
    }

    console.log('Toggling favourite for item:', itemId, 'current state:', isFavourite);
    setLoading(true);
    try {
      const endpoint = isFavourite ? '/remove-favourite' : '/add-favourite';
      console.log('Making request to:', endpoint, 'with data:', { username, menuId: itemId });
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, menuId: itemId })
      });
      console.log('Response status:', response.status, 'ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        setIsFavourite(!isFavourite);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    console.log('FavouriteButton not rendering - no username');
    return <div style={{ width: '36px', height: '36px', background: 'red', borderRadius: '50%' }}>No User</div>;
  }

  console.log('FavouriteButton rendering for user:', username, 'item:', itemId);

  return (
    <button
      className={`favourite-btn ${isFavourite ? 'active' : ''} ${loading ? 'loading' : ''}`}
      onClick={() => {
        console.log('FavouriteButton clicked!');
        toggleFavourite();
      }}
      disabled={loading}
      aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
    >
      {loading ? '⟳' : '♥'}
    </button>
  );
};

export default FavouriteButton;
