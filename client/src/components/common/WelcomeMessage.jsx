import React from 'react';
import './WelcomeMessage.css';

const WelcomeMessage = ({ username }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <span className="welcome-icon">👋</span>
        <div className="welcome-text">
          <h2>Welcome, <span className="username-highlight">{username}</span>!</h2>
          <p>Ready to order some delicious food?</p>
        </div>
        <button 
          className="close-welcome" 
          onClick={() => {/* Do nothing - keep it visible */}}
          style={{ opacity: 0.5, cursor: 'default' }}
          disabled
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default WelcomeMessage;
