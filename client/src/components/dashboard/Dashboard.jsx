import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';
import MenuList from './MenuList';
import Cart from './Cart';
import WelcomeMessage from '../common/WelcomeMessage';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('http://localhost:5000/menu');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // const handleAddToCart = (item) => {
  //   setCartItems([...cartItems, item]);
  // };
  //or
  const handleAddToCart = (item) => {
  const existing = cartItems.find(i => i._id === item._id);

  if (existing) {
    setCartItems(cartItems.map(i =>
      i._id === item._id
        ? { ...i, quantity: (i.quantity || 1) + 1 }
        : i
    ));
  } else {
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  }
};

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/delete-item/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMenu();
      }
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };
  const handleIncreaseQty = (index) => {
  const updated = [...cartItems];
  updated[index].quantity = (updated[index].quantity || 1) + 1;
  setCartItems(updated);
};

const handleDecreaseQty = (index) => {
  const updated = [...cartItems];
  if ((updated[index].quantity || 1) > 1) {
    updated[index].quantity -= 1;
    setCartItems(updated);
  } else {
    handleRemoveFromCart(index);
  }
};
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch('http://localhost:5000/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
          total: cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
          user: user.username
        })
      });
      if (res.ok) {
        alert('Order placed successfully!');
        setCartItems([]);
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error("Failed to place order", err);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-nav">
        <h1 className="nav-title">Canteen Dashboard</h1>
        <div className="nav-actions">
          <span className="user-badge">{user.role}: {user.username}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <WelcomeMessage username={user.username} />

      <div className="dashboard-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isAdmin && <AdminPanel onAdd={fetchMenu} />}
          <MenuList 
            items={items} 
            cartItems={cartItems}
            isAdmin={isAdmin}
            username={user.username}
            onAddToCart={handleAddToCart}
            onDecreaseQty={handleDecreaseQty}
            onIncreaseQty={handleIncreaseQty}
            onDelete={handleDeleteItem} 
          />
        </div>
        
        <div>
          <Cart 
            cartItems={cartItems} 
            onRemove={handleRemoveFromCart}
            onPlaceOrder={handlePlaceOrder}
            onIncrease={handleIncreaseQty}
            onDecrease={handleDecreaseQty}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
