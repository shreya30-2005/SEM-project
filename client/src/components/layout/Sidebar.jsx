import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ user, onLogout, cartItemCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-brand">Canteen OS</h2>
        <div className="user-profile">
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div className="user-details">
            <span className="username">{user?.username}</span>
            <span className="role">{user?.role}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-title">MAIN MENU</div>
        <NavLink to="/menu" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🍽️</span>
          <span className="nav-label">Menu</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Cart</span>
          {cartItemCount > 0 && (
            <span className="badge">{cartItemCount}</span>
          )}
        </NavLink>
        <NavLink to="/favourites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">💝</span>
          <span className="nav-label">Favourites</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📦</span>
          <span className="nav-label">Orders</span>
        </NavLink>

        {isAdmin && (
          <>
            <div className="nav-group-title mt-4">ADMINISTRATION</div>
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
