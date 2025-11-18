// src/components/Header.js
import React from 'react';

const Header = ({ username, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>📝 Task Manager</h1>
        <div className="user-info">
          <span>Welcome, {username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;