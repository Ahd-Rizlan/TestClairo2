import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next";
import "./AuthPages.css";

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check if we have a session when the component loads
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          // Password recovery event detected
          setMessage(t("please_enter_new_password"));
        }
        // No session found, redirect to sign in
        navigate(-1);
      }
    );

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [navigate, t]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Password validation
    if (password !== confirmPassword) {
      setError(t("passwords_do_not_match"));
      return;
    }

    if (password.length < 6) {
      setError(t("password_too_short"));
      return;
    }

    setLoading(false);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage(t("password_updated_successfully"));
        // Redirect to sign in page immediately after successful password update
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || t("update_password_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>{t("update_password")}</h1>

          <form className="auth-form" onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label htmlFor="password">{t("new_password")}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder={t("enter_new_password")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t("confirm_password")}</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder={t("confirm_new_password")}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? t("updating") : t("update_password")}
              </button>
            </div>
          </form>
        </div>

        <div className="auth-image">
          <div className="auth-quote">
            <h2>Clairo</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
