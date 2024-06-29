import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase";

export default function StaffProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          setRole(data.role);
        }
      }

      setLoading(false);
    };

    fetchSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.error("Error fetching user role:", error);
              } else {
                setRole(data.role);
              }
              setLoading(false);
            });
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return children;
}
