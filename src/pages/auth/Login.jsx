import { useState } from "react";
import {
    Link,
    Navigate,
    useLocation,
    useNavigate
} from "react-router-dom";

import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (authLoading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const {
      error,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(
        "Email ou mot de passe incorrect."
      );

      setLoading(false);
      return;
    }

    const destination =
      location.state?.from ||
      "/dashboard";

    navigate(destination, {
      replace: true,
    });
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          kaly<span>ma</span>
        </div>

        <h1>
          Bienvenue sur Kalyma
        </h1>

        <p>
          Connectez-vous à votre espace
          business.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="vous@entreprise.com"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Mot de passe
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              required
            />

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>

        </form>

        
        <div className="auth-footer">

          <span>
           Vous n'avez pas encore de compte ?
          </span>

          <Link to="/register">
            Se connecter
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;