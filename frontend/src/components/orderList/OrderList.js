import React from "react";

const OrderList = ({ orders, progress }) => {
  const filteredOrders = orders.filter((order) => order.status === progress);

  return (
    <div className="orders-section">
      <h3>{progress === "wip" ? "Preparing" : "Past Orders"}</h3>
      {filteredOrders.map((order) => (
        <div key={order.id} className="order-item">
          <h3>Order ID: {order.id}</h3>
          <p>Table Number: {order.table_number}</p>
          <p>Total: ${order.total.toFixed(2)}</p>

          <div>
            <h4>Order Details:</h4>
            <ul>
              {order.cart_items.map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
