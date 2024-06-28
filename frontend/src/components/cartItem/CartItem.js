import React from "react";
import "./CartItem.css"; // Assuming you have a CSS file for styling

function CartItem({ item }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p>${item.price}</p>
        <p>Quantity: {item.quantity}</p>
      </div>
    </div>
  );
}

export default CartItem;
