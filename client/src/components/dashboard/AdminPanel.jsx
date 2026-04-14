import React, { useEffect, useState } from 'react';

const defaultItem = {
  name: '',
  price: '',
  category: 'Snacks',
  image: '',
};

const AdminPanel = ({ onAdd, editItem, onCancelEdit }) => {
  const [item, setItem] = useState({
    ...defaultItem,
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  useEffect(() => {
    if (editItem) {
      setItem({
        name: editItem.name || '',
        price: editItem.price ?? '',
        category: editItem.category || 'Snacks',
        image: editItem.image || '',
      });
      setStatusMessage('');
      setStatusType('');
      return;
    }

    setItem({ ...defaultItem });
    setStatusMessage('');
    setStatusType('');
  }, [editItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name || !item.price) return;

    setLoading(true);
    setStatusMessage('');
    setStatusType('');
    try {
      const isEditing = Boolean(editItem?._id);
      const response = await fetch(
        isEditing
          ? `http://localhost:5000/update-item/${editItem._id}`
          : 'http://localhost:5000/add-item',
        {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          price: Number(item.price),
          category: item.category,
          image: item.image.trim(),
        }),
      });

      if (response.ok) {
        setItem({ ...defaultItem });
        onAdd();
        if (isEditing && onCancelEdit) {
          onCancelEdit();
        }
        setStatusType('success');
        setStatusMessage(isEditing ? 'Food item updated successfully.' : 'Food item added successfully.');
      } else {
        const errorText = await response.text();
        setStatusType('error');
        setStatusMessage(errorText || 'Unable to save the food item.');
      }
    } catch (err) {
      console.error('Failed to save item', err);
      setStatusType('error');
      setStatusMessage('Something went wrong while saving the food item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h3 className="panel-title">{editItem ? 'Edit Item' : 'Admin Panel'}</h3>

      {statusMessage && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '14px',
            fontWeight: '600',
            background: statusType === 'success' ? '#ecfff1' : '#fff1f1',
            color: statusType === 'success' ? '#20744a' : '#b44759',
            border: statusType === 'success' ? '1px solid #bde8cb' : '1px solid #f2c6ce'
          }}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-form">
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Burger"
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Price (Rs.)</label>
          <input
            type="number"
            className="form-input"
            placeholder="50"
            value={item.price}
            onChange={(e) => setItem({ ...item, price: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            className="form-input"
            value={item.category}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
            disabled={loading}
            style={{ appearance: 'none', background: 'rgba(255,255,255,0.9)' }}
          >
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
            <option value="Lunch">Lunch</option>
            <option value="Dessert">Dessert</option>
            <option value="Special">Special</option>
          </select>
        </div>

        <div className="form-group" style={{ flexBasis: '100%' }}>
          <label>Image URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="Paste image URL, e.g. https://example.com/burger.jpg"
            value={item.image}
            onChange={(e) => setItem({ ...item, image: e.target.value })}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ flex: '0 0 auto', padding: '14px 24px' }}
        >
          {loading ? (editItem ? 'Saving...' : 'Adding...') : (editItem ? 'Save Changes' : 'Add Item')}
        </button>

        {editItem && (
          <button
            type="button"
            className="btn-danger"
            disabled={loading}
            onClick={onCancelEdit}
            style={{ flex: '0 0 auto', padding: '14px 24px' }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminPanel;
