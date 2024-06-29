import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../utils/supabase";
import "./Navbar.css"; // Ensure the path is correct

export default function Navbar() {
  const { cartCount, fetchCartCount, userId } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchCartCount(userId);
    }
  }, [userId]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    navigate("/signup");
  };

  function openCart() {
    navigate("/cart");
  }

  function openMenu() {
    navigate("/");
  }

  function openSignup() {
    navigate("/signup");
  }
  function openOrders() {
    navigate("/orders");
  }

  return (
    <nav className="navbar">
      <div className="logo">Cool Logo!</div>
      <div className="menu">
        {userId ? (
          <>
            <button className="nav-item" onClick={openMenu}>
              Menu
            </button>
            <button className="nav-item" onClick={openCart}>
              Cart <span className="cart-badge">{cartCount}</span>
            </button>
            <button className="nav-item" onClick={openOrders}>
              Orders
            </button>
            <button className="nav-item" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="nav-item" onClick={openSignup}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
