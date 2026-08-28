import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { NavLink } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import KalymaLogo from "../../assets/brands/kalyma-logo-light.svg";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      /*
       * Selon la configuration Supabase :
       *
       * - Si la confirmation email est désactivée,
       *   l'utilisateur sera directement connecté.
       *
       * - Si la confirmation email est activée,
       *   session sera null jusqu'à validation
       *   de l'adresse email.
       */

      if (data.session) {
        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      setSuccess(
        "Votre compte a été créé. Consultez votre boîte email pour confirmer votre adresse."
      );
    } catch (err) {
      console.error(
        "Erreur inscription :",
        err
      );

      if (
        err.message?.includes(
          "User already registered"
        )
      ) {
        setError(
          "Un compte existe déjà avec cette adresse email."
        );
      } else {
        setError(
          err.message ||
            "Impossible de créer votre compte."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
           <NavLink className="" to="/">
          <img src={KalymaLogo} style={{width:"350px"}} alt="Kalyma" />
        </NavLink>
        </div>

        <h1>
          Créer votre espace Kalyma
        </h1>

        <p>
          Commencez à structurer et piloter
          votre activité depuis un seul espace.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="vous@entreprise.com"
              autoComplete="email"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Création du compte..."
              : "Créer mon espace"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Vous avez déjà un compte ?
          </span>

          <Link to="/login">
            Se connecter
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;