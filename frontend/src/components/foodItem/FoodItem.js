import React from "react";
import "./FoodItem.css";
import { supabase } from "../../utils/supabase";
import { useCart } from "../../context/CartContext";

export default function FoodItem({ id, name, image, price }) {
  const { incrementCartCount, userId } = useCart();

  async function addToCart(foodItemId) {
    try {
      const parsedFoodItemId = parseInt(foodItemId, 10);
      if (isNaN(parsedFoodItemId)) {
        throw new Error("Invalid food item ID");
      }

      const { data: existingItem, error } = await supabase
        .from("cartitems")
        .select("id, quantity")
        .eq("food_item_id", parsedFoodItemId)
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (existingItem) {
        const { error: updateError } = await supabase
          .from("cartitems")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("cartitems")
          .insert([
            { food_item_id: parsedFoodItemId, quantity: 1, user_id: userId },
          ]);

        if (insertError) throw insertError;
      }

      incrementCartCount(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  return (
    <div className="food-item">
      <img src={image} alt={name} className="food-image" />
      <h3>{name}</h3>
      <p>${price}</p>
      <button onClick={() => addToCart(id)} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
}
