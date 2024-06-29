import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or some loading animation
  }

  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}
