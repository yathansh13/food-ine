import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import OrderList from "../../components/orderList/OrderList";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

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
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      const ordersWithItems = data.map((order) => ({
        ...order,
        items: order.items || [],
      }));

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <OrderList orders={orders} progress="wip" />
      <OrderList orders={orders} progress="complete" />
    </div>
  );
}
