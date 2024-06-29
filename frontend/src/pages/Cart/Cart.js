import React, { useState, useEffect } from "react";
import CartItem from "../../components/cartItem/CartItem";
import CheckoutDetails from "../../components/checkoutDetails/CheckoutDetails";
import { supabase } from "../../utils/supabase";
import "./Cart.css";
import { useCart } from "../../context/CartContext";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { userId, incrementCartCount, decrementCartCount } = useCart();

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from("cartitems")
        .select(
          `
          id,
          quantity,
          foods (
            id,
            name,
            image,
            description,
            price
          )
        `
        )
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const { error } = await supabase
        .from("cartitems")
        .update({ quantity: newQuantity })
        .eq("id", cartItemId);
      if (error) throw error;
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const incrementQuantity = (cartItemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(cartItemId, newQuantity);
    incrementCartCount(1);
  };

  const decrementQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(cartItemId, newQuantity);
      decrementCartCount(1);
    }
  };

  return (
    <div className="cart-page">
      <div>
        {cartItems.map((item) => (
          <div className="cart-items" key={item.id}>
            <CartItem item={item.foods} />
            <div className="quantity-counter">
              <p>Quantity</p>
              <button onClick={() => decrementQuantity(item.id, item.quantity)}>
                -
              </button>
              <p>{item.quantity}</p>
              <button onClick={() => incrementQuantity(item.id, item.quantity)}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <CheckoutDetails />
    </div>
  );
}

export default Cart;
