import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
      if (session) {
        fetchCartCount(session.user.id);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
      if (session) {
        fetchCartCount(session.user.id);
      } else {
        setCartCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCartCount = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("cartitems")
        .select("quantity")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      const totalCount = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const incrementCartCount = (quantity = 1) => {
    setCartCount((prevCount) => prevCount + quantity);
  };

  const decrementCartCount = (quantity = 1) => {
    setCartCount((prevCount) => Math.max(prevCount - quantity, 0));
  };

  const resetCartCount = () => {
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        incrementCartCount,
        decrementCartCount,
        fetchCartCount,
        resetCartCount,
        userId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
