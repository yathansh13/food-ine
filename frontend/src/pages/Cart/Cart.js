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

      const delta =
        newQuantity - cartItems.find((item) => item.id === cartItemId).quantity;
      if (delta > 0) {
        incrementCartCount(delta);
      } else if (delta < 0) {
        decrementCartCount(-delta);
      }

      if (newQuantity === 0) {
        await supabase.from("cartitems").delete().eq("id", cartItemId);
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== cartItemId)
        );
        decrementCartCount(1);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const incrementQuantity = (cartItemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(cartItemId, newQuantity);
  };

  const decrementQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(cartItemId, newQuantity);
    } else if (currentQuantity === 1) {
      updateQuantity(cartItemId, 0);
    }
  };

  return (
    <div className="cart-page">
      <div>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">
            Your cart seems to be empty, explore more items!
          </p>
        ) : (
          cartItems.map((item) => (
            <div className="cart-items" key={item.id}>
              <CartItem item={item.foods} />
              <div className="quantity-counter">
                <p>Quantity</p>
                <button
                  className="counter-button"
                  onClick={() => decrementQuantity(item.id, item.quantity)}
                >
                  -
                </button>
                <p>{item.quantity}</p>
                <button
                  className="counter-button"
                  onClick={() => incrementQuantity(item.id, item.quantity)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <CheckoutDetails cartItems={cartItems} fetchCartItems={fetchCartItems} />
    </div>
  );
}

export default Cart;
