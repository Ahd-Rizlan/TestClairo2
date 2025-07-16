import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useTranslation } from 'react-i18next';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true); 
    

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
        //redirect here if we want to update password 
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage(t('reset_password_email_sent'));
      }
    } catch (err) {
      setError(err.message || t('reset_password_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>{t('reset_password')}</h1>
       
          
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="email">{t('email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder={t('enter_your_mail')}
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            <div className="form-group">
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? t('sending') : t('send_reset_link')}
              </button>
            </div>
            
            <div className="auth-links">
              <Link to="/signin" className="back-to-signin">
                &larr; {t('back_to_signin')}
              </Link>
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

export default ResetPasswordPage;