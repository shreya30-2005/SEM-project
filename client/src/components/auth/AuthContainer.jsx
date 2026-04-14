import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const AuthContainer = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glass-panel" key={isLogin ? 'login' : 'register'}>
        {isLogin ? (
          <Login onToggle={toggleView} onAuth={onAuth} />
        ) : (
          <Register onToggle={toggleView} />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
