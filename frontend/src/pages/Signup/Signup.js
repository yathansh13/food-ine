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
  const navigate = useNavigate();

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
    return (
      <div className="container">
        <div>Welcome Back!</div>
        <button onClick={showMenu}>Start Browsing</button>
      </div>
    );
  }
}
