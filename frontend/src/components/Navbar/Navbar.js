// React component for Navbar
import React, { useState } from "react";
import "./Navbar.css"; // Assuming the CSS file is named Navbar.css
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  // Dummy user state for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const cartCount = 0;
  function openCart() {
    navigate("/cart");
  }
  function openMenu() {
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="logo">Cool Logo!</div>
      <div className="menu">
        {isLoggedIn ? (
          <>
            <button className="nav-item" onClick={openMenu}>
              Menu
            </button>
            <button className="nav-item" onClick={openCart}>
              Cart <span className="cart-badge">{cartCount}</span>
            </button>
            <button className="nav-item">Order History</button>
            <button className="nav-item" onClick={() => setIsLoggedIn(false)}>
              Logout
            </button>
          </>
        ) : (
          <button className="nav-item" onClick={() => setIsLoggedIn(true)}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
