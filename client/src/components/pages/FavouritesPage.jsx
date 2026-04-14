import React, { useState, useEffect } from 'react';
import MenuList from '../dashboard/MenuList';

const FavouritesPage = ({ username, cartItems, onAddToCart, onIncreaseQty, onDecreaseQty }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    if (!username) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/favourites/${username}`);
      if (response.ok) {
        const data = await response.json();
        setFavourites(data);
      }
    } catch (err) {
      console.error('Failed to fetch favourites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [username]);

  const handleFavouriteChange = () => {
    // Refresh favourites when an item is added/removed from favourites
    fetchFavourites();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">My Favourites</h1>
        <p className="page-subtitle">Your saved favourite items</p>
      </div>

      <div className="page-body">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-soft)' }}>
            <div className="spinner" style={{
              width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.25)',
              borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px'
            }} />
            Loading your favourites...
          </div>
        ) : favourites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-soft)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💝</div>
            <h3>No favourites yet</h3>
            <p>Start adding items to your favourites by clicking the heart button!</p>
          </div>
        ) : (
          <MenuList
            items={favourites}
            cartItems={cartItems}
            username={username}
            isAdmin={false}
            onAddToCart={onAddToCart}
            onDecreaseQty={onDecreaseQty}
            onIncreaseQty={onIncreaseQty}
            onFavouriteChange={handleFavouriteChange}
          />
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
