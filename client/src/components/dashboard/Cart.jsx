import React, { useState } from 'react';

const Cart = ({ cartItems, onPlaceOrder, onRemove, onIncrease, onDecrease }) => {
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleOrder = () => {
    if (cartItems.length === 0) return;
    setShowPayment(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Here you would integrate with a payment gateway
      // For now, we'll simulate payment success
      alert('Payment successful! Processing your order...');
      await onPlaceOrder();
      setShowPayment(false);
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          {loading ? 'Processing...' : 'PROCEED TO PAYMENT'}
        </button>
      </div>

      {showPayment && (
        <div className="payment-modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Payment Details</h3>
            <p>Total Amount: Rs. {total}</p>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-select"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="wallet">Digital Wallet</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input 
                    type="text" 
                    placeholder="yourname@upi"
                    className="form-input"
                    required
                  />
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="form-group">
                  <label>Wallet</label>
                  <select className="form-select">
                    <option>Paytm</option>
                    <option>PhonePe</option>
                    <option>Google Pay</option>
                    <option>Amazon Pay</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <p>You will pay Rs. {total} in cash when your order is delivered.</p>
              )}

              <div className="payment-modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowPayment(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-success" disabled={loading}>
                  {loading ? 'Processing...' : `Pay Rs. ${total}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
