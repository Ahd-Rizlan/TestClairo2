import React, { useState } from "react"; // Importing React and useState hook
import { Link, useNavigate } from "react-router-dom"; // Importing Link and useNavigate from react-router-dom
import { supabase } from "../../supabaseClient"; // Importing supabase client
import { useTranslation } from "react-i18next"; // Importing useTranslation hook for internationalization
import "./AuthPages.css"; // Importing CSS styles for authentication pages

const SignInPage = ({ onLogin }) => {
  const navigate = useNavigate(); // Hook to navigate
  const { t } = useTranslation(); // Hook for translation

  
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading status
  const [formData, setFormData] = useState({
    // State for form data with email and password fields
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the formData state when input fields change
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the field based on name
    });
  };

  // NEW: Handle After Login
  const handleAfterLogin = async (user) => {
    try {
      {
        // Attorney profile does not exist yet, create it
        const { user_metadata } = user;

        // user_metadata contains the additional fields we need
        // Insert user_metadata into attorney_at_law table
        const { data: newAttorney, error: createError } = await supabase
          .from("attorney_at_law")
          .insert([
            {
              email: user.email,
              name: user_metadata.name,
              contact_no: user_metadata.contact_no,
              language_competency: user_metadata.language_competency,
              years_of_experience: user_metadata.years_of_experience,
            },
          ])
          .select();

        if (createError) throw createError;

        const attorneyId = newAttorney[0].lawyer_id;

        // Insert into users table
        const { error: userInsertError } = await supabase.from("users").insert([
          {
            email: user.email,
            username: user_metadata.username,
            lawyer_id: attorneyId,
          },
        ]);

        if (userInsertError) throw userInsertError;
      }
    } catch (error) {
      console.error("Attorney creation after login failed:", error);
    }
  };

  // Update inside handleSignIn
  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submit
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Call handleAfterLogin immediately after sign in
      if (data?.user) {
        await handleAfterLogin(data.user);
      }

      // Fetch user details after ensuring attorney profile exists
      const { data: userData, error: fetchUserError } = await supabase
        .from("users")
        .select("lawyer_id, username")
        .eq("email", formData.email)
        .single();

      if (fetchUserError) {
        setError(fetchUserError.message);
        setLoading(false);
        return;
      }

      if (userData) {
        // Store user data in local storage
        const username = userData.username;
        const lawyerId = userData.lawyer_id;
        localStorage.setItem("lawyerId", lawyerId);
        localStorage.setItem("username", username);
        onLogin();
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      setError(err.message || t("login_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>{t("signin")}</h1>

          <form className="auth-form" onSubmit={handleSignIn}>
            <div className="form-group">
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email} // Binding email input to formData state
                onChange={handleChange} // Updating state on input change
                className="auth-input"
                placeholder="abc@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t("password")}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password} // Binding password input to formData state
                onChange={handleChange} // Updating state on input change
                className="auth-input"
                placeholder="xxxxxx"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? t("signing_in") : t("signin")}
              </button>
            </div>

            <div className="auth-links">
              <Link to="/reset-password" className="forgot-password">
                {t("forgot_password")}
              </Link>

              <p className="signup-prompt">
                {t("dont_have_account")}
                <Link to="/signup" className="signup-link">
                  {t("signup")}
                </Link>
              </p>
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

export default SignInPage;