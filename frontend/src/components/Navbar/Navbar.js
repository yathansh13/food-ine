import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../utils/supabase";
import "./Navbar.css"; // Ensure the path is correct

export default function Navbar() {
  const { cartCount, fetchCartCount, userId } = useCart();
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchCartCount(userId);
      fetchUserRole(userId);
    }
  }, [userId]);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw error;
      }

      setUserRole(data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

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

  function openDashboard() {
    navigate("/dashboard");
  }

  return (
    <nav className="navbar">
      <div className="logo">Cool Logo!</div>
      <div className="menu">
        {userId ? (
          userRole === "staff" ? (
            <>
              <button className="nav-item" onClick={openDashboard}>
                Dashboard
              </button>
              <button className="nav-item" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
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
          )
        ) : (
          <button className="nav-item" onClick={openSignup}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
