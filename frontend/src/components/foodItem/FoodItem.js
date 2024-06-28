import React from "react";
import "./FoodItem.css";

export default function FoodItem({ name, image, price, onClick, addToCart }) {
  return (
    <div className="food-item" onClick={onClick}>
      <img src={image} alt={name} className="food-image" />
      <h3>{name}</h3>
      <p>${price}</p>
      <button onClick={addToCart} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
}
