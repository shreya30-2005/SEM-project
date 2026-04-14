import React, { useState } from 'react';
import StarRating from '../common/StarRating';
import DynamicStarRating from '../common/DynamicStarRating';
import ReviewForm from '../common/ReviewForm';
import FavouriteButton from '../common/FavouriteButton';

const MenuList = ({ items, cartItems = [], isAdmin, username, onAddToCart, onDelete, onIncreaseQty, onDecreaseQty, onFavouriteChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  console.log('MenuList rendered with username:', username, 'items count:', items.length);

  const handleReviewAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger re-render to update ratings
  };

  const categories = ['All', ...new Set(items.map((i) => i.category || 'Uncategorized'))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const itemCat = item.category || 'Uncategorized';
    const matchesCategory = selectedCategory === 'All' || itemCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItem = filteredItems[0] || items[0] || null;

  const getImageSrc = (item) => {
    const image = item?.image;

    if (typeof image !== 'string') return '';

    const normalized = image.trim();
    if (!normalized) return '';

    return normalized;
  };

  const renderItemCard = (item) => {
    const cartIndex = cartItems.findIndex((i) => i._id === item._id);
    const inCart = cartIndex >= 0;

    return (
      <div key={item._id} className="menu-card menu-phone-card">
        <div className="menu-card-image-shell">
          {getImageSrc(item) ? (
            <img src={getImageSrc(item)} alt={item.name} className="menu-card-image" />
          ) : (
            <div className="menu-card-image menu-card-image-fallback">
              <span>{(item.name || 'F').charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="card-content">
          <div className="menu-card-head">
            <h4 className="menu-name">{item.name}</h4>
            <FavouriteButton itemId={item._id} username={username} />
          </div>

          <div className="menu-card-meta">
            <DynamicStarRating menuId={item._id} refreshTrigger={refreshTrigger} />
            <span className="menu-card-dot">•</span>
            <span>{item.category}</span>
          </div>

          <div className="menu-price-row">
            <div className="menu-price" style={{ margin: 0 }}>Rs. {item.price}</div>
          </div>

          <div className="card-actions card-actions-phone">
            {inCart ? (
              <div className="qty-control qty-control-phone">
                <button className="qty-btn" onClick={() => onDecreaseQty(cartIndex)}>-</button>
                <span className="qty-text" style={{ minWidth: '30px' }}>{cartItems[cartIndex].quantity || 1}</span>
                <button className="qty-btn" onClick={() => onIncreaseQty(cartIndex)}>+</button>
              </div>
            ) : (
              <button className="btn-primary" onClick={() => onAddToCart(item)}>
                Add
              </button>
            )}

            {isAdmin && (
              <button className="btn-danger" onClick={() => onDelete(item._id)} title="Delete Item">
                X
              </button>
            )}
          </div>

          {username ? (
            <ReviewForm 
              itemId={item._id} 
              itemName={item.name}
              username={username}
              onReviewAdded={handleReviewAdded}
            />
          ) : (
            <div style={{ padding: '10px', background: 'yellow', color: 'black' }}>No username for reviews</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="menu-experience">
      <section className="glass-panel menu-shell menu-shell-left" style={{ flex: 1 }}>
        <div className="menu-shell-header">
          <div>
            <h3 className="panel-title panel-title-compact" style={{ margin: 0 }}>FoodGo</h3>
            <p className="menu-shell-subtitle">Order your favourite food</p>
          </div>
          <div className="menu-avatar">FG</div>
        </div>

        <div className="menu-search-row">
          <label className="menu-search-field">
            <span className="menu-search-icon">search</span>
            <input
              type="text"
              className="form-input menu-search-input"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <button className="menu-filter-btn" type="button" aria-label="Filter menu">
            menu
          </button>
        </div>

        <div className="menu-chip-row">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <p className="menu-empty-state">No items found.</p>
        ) : (
          <div className="menu-phone-grid">
            {filteredItems.map(renderItemCard)}
          </div>
        )}
      </section>

      <aside className="glass-panel menu-shell menu-shell-right">
        {featuredItem ? (
          <>
            <div className="menu-detail-topbar">
              <button className="menu-icon-plain" type="button">back</button>
              <button className="menu-icon-plain" type="button">search</button>
            </div>

            <div className="menu-detail-image-wrap">
              {getImageSrc(featuredItem) ? (
                <img src={getImageSrc(featuredItem)} alt={featuredItem.name} className="menu-detail-image" />
              ) : (
                <div className="menu-detail-image menu-card-image-fallback">
                  <span>{(featuredItem.name || 'F').charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            <h3 className="menu-detail-title">{featuredItem.name}</h3>
            <div className="menu-detail-meta">
              <span>4.8</span>
              <span className="menu-card-dot">•</span>
              <span>14 min</span>
            </div>
            <p className="menu-detail-copy">
              Enjoy our delicious {featuredItem.name}. Freshly prepared and ready to order from your canteen menu.
            </p>

            <div className="menu-detail-scale">
              <div>
                <span className="menu-detail-scale-label">Spicy</span>
                <div className="menu-detail-bar">
                  <span className="menu-detail-bar-fill" />
                </div>
              </div>
              <div>
                <span className="menu-detail-scale-label">Portion</span>
                <div className="qty-control qty-control-phone">
                  <button className="qty-btn" type="button">-</button>
                  <span className="qty-text">1</span>
                  <button className="qty-btn" type="button">+</button>
                </div>
              </div>
            </div>

            <div className="menu-detail-footer">
              <div className="menu-detail-price">Rs. {featuredItem.price}</div>
              <button className="btn-success menu-order-btn" onClick={() => onAddToCart(featuredItem)}>
                ORDER NOW
              </button>
            </div>
          </>
        ) : (
          <p className="menu-empty-state">No featured item available.</p>
        )}
      </aside>
    </div>
  );
};

export default MenuList;
