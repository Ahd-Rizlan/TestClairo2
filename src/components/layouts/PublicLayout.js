import React, { useState } from "react";// maintainning the states
import { Outlet, Link, useLocation } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import "./PublicLayout.css";
import LanguageSlider from "./LanguageSlider";



const PublicLayout = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Check if the current page is the client view page
  //localhost:3000/dashboard/clientseeview/648c3e0f-4b2d-4a1b-8a5c-7f6d9e0f3a2b
  const isClientViewPage = location.pathname.includes("/clientseeview/");
  //true

  //localhost:3000/signin
  //localhost:3000/signup
  //localhost:3000/reset-password

  const isAuthPage =
    location.pathname.includes("/signin") ||
    location.pathname.includes("/signup") ||
    location.pathname.includes("/reset-password");




  return (
    <div className="public-layout">
      {/* Header/Navbar */}
      <header className="navbar">
        <div className="container navbar-container">
          {/* Logo */}

          <Link to="/home" className="logo">
            <span className="logo-text">Clairo</span>
          </Link>

          {/* Mobile Menu Toggle */}

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "X" : "☰"}
          </button>

          {/* Navigation Menu */}
          <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
            {!isClientViewPage && (
              <ul className="nav-links">
                <li>
                  <Link
                    to="/home"
                    className={location.pathname === "/" ? "active" : ""}
                    onClick={closeMenu}
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/aboutUs"
                    className={location.pathname === "/aboutUs" ? "active" : ""}
                    onClick={closeMenu}
                  >
                    {t("about")}
                  </Link>
                </li>
              </ul>
            )}

            {/* Language Slider is always shown */}
            <LanguageSlider />

            {/* Auth Buttons */}

            {/* true && */}

            {/* false ! false */}

            {!isClientViewPage && (
              <div className="auth-buttons">
                <Link
                  to="/signin"
                  className="button signin-button"
                  onClick={closeMenu}
                >
                  {t("signin")}
                </Link>
                <Link
                  to="/signup"
                  className="button signup-button"
                  onClick={closeMenu}
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={`public-main ${isAuthPage ? "auth-page-main" : ""}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <span className="logo-text">Clairo</span>
              </div>
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} Clairo.{" "}
                {t("all_rights_reserved")}
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
