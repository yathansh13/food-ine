import React from "react";
import CartItem from "../../components/cartItem/CartItem";
import CheckoutDetails from "../../components/checkoutDetails/CheckoutDetails";
import { supabase } from "../../utils/supabase";
import "./Cart.css"; // Assuming you have a CSS file for styling
import { useState, useEffect } from "react";

function Cart() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetchFoodItems();
  }, []);

  async function fetchFoodItems() {
    try {
      let { data: foods, error } = await supabase.from("foods").select("*");

      if (error) {
        throw error;
      }
      console.log(foods);

      setFoodItems(foods);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once fetching is done
    }
  }
  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {foodItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <CheckoutDetails />
    </div>
  );
}

export default Cart;
