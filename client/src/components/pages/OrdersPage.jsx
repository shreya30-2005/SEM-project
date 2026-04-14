import React, { useState, useEffect } from 'react';

const OrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? 'http://localhost:5000/orders'
        : `http://localhost:5000/orders?user=${encodeURIComponent(user.username)}`;

      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/update-order-status/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f59e0b';
      case 'Preparing':
        return '#3b82f6';
      case 'Ready':
        return '#8b5cf6';
      case 'Delivered':
        return '#10b981';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">{isAdmin ? 'All Orders' : 'My Orders'}</h1>
        <p className="page-subtitle">Track and manage your canteen orders</p>
      </div>

      <div className="page-body">
        {loading ? (
          <p style={{ color: '#7f6b75' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="glass-panel" style={{ color: '#7f6b75', textAlign: 'center' }}>
            No orders found.
          </div>
        ) : (
          <div className="grid-layout">
            {orders.map((order) => (
              <div
                key={order._id}
                className="glass-panel"
                style={{ marginBottom: '16px', position: 'relative', overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: getStatusColor(order.status)
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingLeft: '12px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontWeight: '700',
                          fontSize: '1.2rem',
                          color: getStatusColor(order.status)
                        }}
                      >
                        {order.status}
                      </span>
                      {isAdmin && (
                        <span style={{ color: '#8a7680', fontSize: '0.9rem' }}>
                          Ordered by:{' '}
                          <span style={{ color: '#4b3138', fontWeight: '600' }}>
                            {order.user || 'Unknown'}
                          </span>
                        </span>
                      )}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '16px',
                            padding: '6px 0',
                            borderBottom: '1px solid rgba(130, 106, 122, 0.14)'
                          }}
                        >
                          <span style={{ color: '#4b3138', fontWeight: '500' }}>
                            {item.quantity}x {item.name}
                          </span>
                          <span style={{ color: '#8d6bff', fontWeight: '700' }}>
                            Rs.{item.price * item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                      Total: Rs{order.total}
                    </div>

                    <div style={{ color: '#66748f', fontSize: '0.85rem', fontWeight: '500' }}>
                      {new Date(order.date).toLocaleString()}
                    </div>

                    {isAdmin && (
                      <div style={{ marginTop: 'auto' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          style={{
                            background: '#fff',
                            border: '1px solid #dbcfe7',
                            color: '#4b3138',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
