import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Clairo</h1>
            <p>
              A specialized case management system designed for Sri Lankan Law Chambers.
              Streamline your practice with our intuitive tools and comprehensive features.
            </p>
            <div className="hero-buttons">
              <Link to="/signin" className="btn btn-primary">Sign In</Link>
              <Link to="/signup" className="btn btn-outline">Sign Up</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img 
                src="https://img.freepik.com/free-vector/organized-archive-searching-files-database_335657-3137.jpg" 
                alt="Clairo Dashboard Preview" 
                className="preview-image" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
              </div>
              <h3>Dashboard</h3>
              <p>Simple and easy-to-read dashboard to track all your cases, deadlines, and important metrics at a glance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Centralized Client and Case Management</h3>
              <p>Manage all your clients and cases in one place with easy access to documents, history, and contact information.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Language Support</h3>
              <p>Full support for Sinhala, Tamil, and English to serve the diverse needs of Sri Lankan legal practice.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Automatic Reminder System</h3>
              <p>Never miss a court date or deadline with our straightforward reminder system that notifies you of upcoming events.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2>Testimonials</h2>
          <div className="testimonial-container">
            <div className="testimonial-item">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">Clairo has transformed how our chamber manages cases. The system's intuitive design makes it invaluable for our practice.</p>
              <div className="testimonial-author">
                <div className="author-avatar">NP</div>
                <div>
                  <h4>Nimal Perera</h4>
                  <p>Senior Partner, Colombo Law Associates</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-item">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">The client management features have saved us countless hours. Being able to access case information securely from anywhere has improved our efficiency.</p>
              <div className="testimonial-author">
                <div className="author-avatar">KS</div>
                <div>
                  <h4>Kumari Silva</h4>
                  <p>Managing Partner, Kandy Legal Consortium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Sign up today and experience the power of Clairo for your law chamber.</p>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;