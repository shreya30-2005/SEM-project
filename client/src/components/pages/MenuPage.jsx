import React, { useState, useEffect } from 'react';
import MenuList from '../dashboard/MenuList';

const MenuPage = ({ cartItems, username, onAddToCart, onIncreaseQty, onDecreaseQty }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await fetch('http://localhost:5000/menu');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Discover Your Menu</h1>
        <p className="page-subtitle">Browse, preview, and add items without changing your existing data</p>
      </div>
      
      <div className="page-body">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-soft)' }}>
            <div className="spinner" style={{ 
              width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.25)', 
              borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' 
            }} />
            Loading menu items...
          </div>
        ) : (
          <MenuList 
            items={items} 
            cartItems={cartItems}
            username={username}
            isAdmin={false} // Delete logic moved to Admin panel 
            onAddToCart={onAddToCart}
            onDecreaseQty={onDecreaseQty}
            onIncreaseQty={onIncreaseQty}
          />
        )}
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MenuPage;
