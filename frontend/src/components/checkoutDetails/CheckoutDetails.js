import React from "react";

function CheckoutDetails() {
  // Placeholder totals, replace with actual calculations
  const subtotal = 100; // Example subtotal
  const tax = 10; // Example tax
  const total = subtotal + tax;

  return (
    <div className="checkout-details">
      <h3>Checkout</h3>
      <p>Subtotal: ${subtotal}</p>
      <p>Tax: ${tax}</p>
      <h4>Total: ${total}</h4>
      <button>Proceed to Checkout</button>
    </div>
  );
}

export default CheckoutDetails;
