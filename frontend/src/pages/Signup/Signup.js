import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        fetchUserRole(session.user.id);
      }
    };

    fetchSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchUserRole(session.user.id);
        } else {
          setRole(null);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      setRole(data.role);
      if (data.role === "staff") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let result;
      if (isSigningIn) {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        });

        if (result.data.user) {
          await supabase.from("user_roles").insert([
            {
              user_id: result.data.user.id,
              role: "customer",
            },
          ]);
          fetchUserRole(result.data.user.id);
        }
      }

      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const showMenu = async () => {
    navigate("/");
  };

  if (!session) {
    return (
      <div className="main-div">
        <form className="form-css" onSubmit={handleAuth}>
          <div className="input-fields">
            <h2>{isSigningIn ? "Sign In" : "Sign Up"}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isSigningIn ? "Sign In" : "Sign Up"}</button>
            {error && <p className="error">{error}</p>}
          </div>
          <p className="sub-text">
            {isSigningIn
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              className="sub-button"
              type="button"
              onClick={() => setIsSigningIn(!isSigningIn)}
            >
              {isSigningIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    );
  } else {
    if (role === "staff") {
      return null;
    }
    return (
      <div className="container">
        <div>Welcome Back!</div>
        <button onClick={showMenu}>Start Browsing</button>
      </div>
    );
  }
}
