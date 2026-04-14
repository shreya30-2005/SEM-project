import React from 'react';
import Cart from '../dashboard/Cart';

const CartPage = ({ cartItems, onRemove, onPlaceOrder, onIncrease, onDecrease }) => {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Checkout Preview</h1>
        <p className="page-subtitle">A cleaner order card while keeping your same cart logic</p>
      </div>

      <div className="page-body" style={{ maxWidth: '520px' }}>
        <Cart 
          cartItems={cartItems}
          onRemove={onRemove}
          onPlaceOrder={onPlaceOrder}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      </div>
    </div>
  );
};

export default CartPage;
