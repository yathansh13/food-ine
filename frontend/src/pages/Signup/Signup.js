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
  const [role, setRole] = useState(null); // State to store user role
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error(error);
    } else {
      setRole(data.role);
      if (data.role === "staff") {
        navigate("/dashboard");
      }
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    if (isSigningIn) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        const { user } = data;
        const { error: roleError } = await supabase.from("user_roles").insert([
          {
            user_id: user.id,
            role: "customer", // Adjust role as necessary
          },
        ]);

        if (roleError) {
          setError(roleError.message);
        } else {
          fetchUserRole(user.id); // Fetch role after signup
        }
      }
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
      return null; // Render nothing since the user will be redirected to the dashboard
    }
    return (
      <div className="container">
        <div>Welcome Back!</div>
        <button onClick={showMenu}>Start Browsing</button>
      </div>
    );
  }
}
