import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutDetails.css";

function CheckoutDetails() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const { cartCount, resetCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching user session:", error);
        return;
      }
      setUserId(data.session?.user?.id);
    };

    fetchUserId();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserId(session?.user?.id || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, cartCount]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from("cartitems")
        .select(
          `
          id,
          quantity,
          foods (
            price,
            name
          )
        `
        )
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      setCartItems(data);

      // Calculate subtotal
      const newSubtotal = data.reduce(
        (acc, item) => acc + item.foods.price * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleTableNumberChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) < 100)) {
      setTableNumber(value);
    }
  };

  const handleOrderNow = async () => {
    if (tableNumber === "") {
      alert("Please enter a valid table number between 1 and 99.");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      food_item_id: item.foods.id,
      name: item.foods.name,
      quantity: item.quantity,
      price: item.foods.price,
    }));

    try {
      const { error } = await supabase.from("orders").insert([
        {
          user_id: userId,
          table_number: parseInt(tableNumber, 10),
          total: subtotal * 1.1,
          cart_items: orderItems,
        },
      ]);

      if (error) throw error;
      await Promise.all(
        cartItems.map(async (item) => {
          await supabase.from("cartitems").delete().eq("id", item.id);
        })
      );

      alert("Order placed successfully!");

      setCartItems([]);
      setTableNumber("");
      resetCartCount();
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="checkout-details">
      <h3>Checkout</h3>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <h4>Total: ${total.toFixed(2)}</h4>
      <input
        type="number"
        placeholder="Table Number"
        value={tableNumber}
        onChange={handleTableNumberChange}
        min="1"
        max="99"
      />
      <button onClick={handleOrderNow}>Order Now</button>
    </div>
  );
}

export default CheckoutDetails;
