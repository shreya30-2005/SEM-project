import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WelcomeMessage from '../common/WelcomeMessage';
import './Layout.css';

const MainLayout = ({ user, onLogout, cartItemCount }) => {
  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={onLogout} cartItemCount={cartItemCount} />
      <main className="main-content">
        <WelcomeMessage username={user.username} />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
