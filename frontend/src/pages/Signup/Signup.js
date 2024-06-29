import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [session, setSession] = useState(null);
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

  const showMenu = async () => {
    navigate("/");
  };

  if (!session) {
    return (
      <div className="main-form">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    );
  } else {
    return (
        <div class="container">
        <div>Welcome Back!</div>
        <button onClick={showMenu}>Start Browsing</button>
      </div>
    );
  }
}
