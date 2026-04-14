import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './components/auth/AuthContainer';
import MainLayout from './components/layout/MainLayout';
import MenuPage from './components/pages/MenuPage';
import CartPage from './components/pages/CartPage';
import AdminPage from './components/pages/AdminPage';
import OrdersPage from './components/pages/OrdersPage';
import FavouritesPage from './components/pages/FavouritesPage';
import './components/dashboard/Dashboard.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]); // Reset cart on logout
  };

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
          user: user.username,
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
          total: cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
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

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const isAdmin = user?.role === 'admin';

  return (
    <BrowserRouter>
      {!user ? (
        <AuthContainer onAuth={handleAuth} />
      ) : (
        <Routes>
          <Route element={<MainLayout user={user} onLogout={handleLogout} cartItemCount={totalCartCount} />}>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route 
              path="/menu" 
              element={
                <MenuPage 
                  cartItems={cartItems}
                  username={user.username}
                  onAddToCart={handleAddToCart}
                  onIncreaseQty={handleIncreaseQty}
                  onDecreaseQty={handleDecreaseQty}
                />
              } 
            />
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cartItems={cartItems}
                  onRemove={handleRemoveFromCart}
                  onPlaceOrder={handlePlaceOrder}
                  onIncrease={handleIncreaseQty}
                  onDecrease={handleDecreaseQty}
                />
              } 
            />
            <Route 
              path="/favourites" 
              element={
                <FavouritesPage 
                  username={user.username}
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onIncreaseQty={handleIncreaseQty}
                  onDecreaseQty={handleDecreaseQty}
                />
              } 
            />
            <Route path="/orders" element={<OrdersPage user={user} />} />
            {isAdmin && <Route path="/admin" element={<AdminPage />} />}
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/menu" replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
