// React component for Navbar
import React, { useState } from 'react';
import './Navbar.css'; // Assuming the CSS file is named Navbar.css

export default function Navbar() {
  // Dummy user state for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">Cool Logo!</div>
      <div className="menu">
        {isLoggedIn ? (
          <>
            <button className="nav-item">Profile</button>
            <button className="nav-item">Cart</button>
            <button className="nav-item">Order History</button>
            <button className="nav-item" onClick={() => setIsLoggedIn(false)}>Logout</button>
          </>
        ) : (
          <button className="nav-item" onClick={() => setIsLoggedIn(true)}>Login</button>
        )}
      </div>
    </nav>
  );
}