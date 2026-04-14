import React, { useState } from 'react';

const Cart = ({ cartItems, onPlaceOrder, onRemove, onIncrease, onDecrease }) => {
  const [loading, setLoading] = useState(false);
  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      await onPlaceOrder();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel cart-shell" style={{ height: 'fit-content' }}>
      <div className="menu-detail-topbar">
        <button className="menu-icon-plain" type="button">cart</button>
        <button className="menu-icon-plain" type="button">pay</button>
      </div>

      <h3 className="panel-title panel-title-compact">Your Cart</h3>
      <p className="menu-shell-subtitle cart-subtitle">Review items before placing the order</p>

      {cartItems.length === 0 ? (
        <p className="menu-empty-state">Cart is empty</p>
      ) : (
        <div className="cart-phone-list">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item cart-item-phone">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">Rs. {item.price}</span>

                <div className="qty-control qty-control-phone">
                  <button className="qty-btn" onClick={() => onDecrease(index)}>-</button>
                  <span className="qty-text">{item.quantity || 1}</span>
                  <button className="qty-btn" onClick={() => onIncrease(index)}>+</button>
                </div>
              </div>

              <div className="cart-item-side">
                <span className="cart-line-total">Rs. {item.price * (item.quantity || 1)}</span>
                <button className="cart-remove-btn" onClick={() => onRemove(index)}>
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-total cart-total-phone">
        <span>Total</span>
        <span className="cart-grand-total">Rs. {total}</span>
      </div>

      <button
        className="btn-success menu-order-btn"
        disabled={cartItems.length === 0 || loading}
        onClick={handleOrder}
        style={{ opacity: cartItems.length === 0 ? 0.5 : 1 }}
      >
        {loading ? 'Placing Order...' : 'ORDER NOW'}
      </button>
    </div>
  );
};

export default Cart;
