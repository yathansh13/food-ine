import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./Dashboard.css"; // Ensure the path is correct

function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "wip"); // Filter for work-in-progress orders
    if (error) {
      console.error(error);
    } else {
      setOrders(data);
    }
  };

  const markAsCompleted = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);
    if (error) {
      console.error(error);
    } else {
      // Update UI by removing the completed order
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Order Management</h1>
      {orders.length === 0 ? (
        <p className="no-orders-text">No new orders</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <p>Table: {order.table_number}</p>
              <p>Total: ${order.total}</p>
              {order.cart_items.map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity}
                </li>
              ))}
              <button
                className="mark-completed-btn"
                onClick={() => markAsCompleted(order.id)}
              >
                Mark as Completed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
