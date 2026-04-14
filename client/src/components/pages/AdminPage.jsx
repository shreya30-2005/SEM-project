import React, { useState, useEffect } from 'react';
import AdminPanel from '../dashboard/AdminPanel';

const AdminPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenu = async () => {
    try {
      const res = await fetch('http://localhost:5000/menu');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch menu', err);
    } finally {
      setLoading(false);
    }
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
      console.error('Failed to delete item', err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Administration</h1>
        <p className="page-subtitle">Manage canteen menu items</p>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#432228' }}>
              {editingItem ? 'Edit Food Item' : 'Add New Item'}
            </h2>
            <AdminPanel
              onAdd={fetchMenu}
              editItem={editingItem}
              onCancelEdit={() => setEditingItem(null)}
            />
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#432228' }}>Current Menu Inventory</h2>
            {loading ? (
              <p>Loading inventory...</p>
            ) : items.length === 0 ? (
              <p className="glass-panel" style={{ color: '#94a3b8' }}>Inventory is empty.</p>
            ) : (
              <div className="glass-panel">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '12px', color: '#8e7a7f', fontWeight: '500' }}>Image</th>
                      <th style={{ padding: '12px', color: '#8e7a7f', fontWeight: '500' }}>Item Name</th>
                      <th style={{ padding: '12px', color: '#8e7a7f', fontWeight: '500' }}>Category</th>
                      <th style={{ padding: '12px', color: '#8e7a7f', fontWeight: '500' }}>Price (Rs.)</th>
                      <th style={{ padding: '12px', color: '#8e7a7f', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '56px',
                                height: '56px',
                                objectFit: 'cover',
                                borderRadius: '14px',
                                border: '1px solid #f0dcdc',
                                background: '#fff'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff1f1',
                                color: '#c98c8c',
                                fontWeight: '700'
                              }}
                            >
                              N/A
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '16px 12px', fontWeight: '500' }}>{item.name}</td>
                        <td style={{ padding: '16px 12px', color: '#8e7a7f' }}>{item.category || 'Uncategorized'}</td>
                        <td style={{ padding: '16px 12px', color: '#ff6b6b', fontWeight: '700' }}>Rs. {item.price}</td>
                        <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                          <button
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '8px' }}
                            onClick={() => setEditingItem(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="logout-btn"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
