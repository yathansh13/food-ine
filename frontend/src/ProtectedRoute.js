import React from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}
