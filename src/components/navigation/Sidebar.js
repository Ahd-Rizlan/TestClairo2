import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Sidebar.css";

const Sidebar = ({ isOpen, currentPath, onNavigation, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Initialize the navigate function
  // Navigation items
  const navItems = [
    {
      path: "/dashboard",
      label: t("dashboard"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      ),
    },
    {
      path: "/employee-details",
      label: t("employees"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      path: "/clients",
      label: t("clients"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      path: "/my-case-boards",
      label: t("MyCases"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
    },
  ];

  // Settings navigation items
  const settingsItems = [
    {
      path: "#",
      label: t("Profile"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      path: "#",
      label: t("Settings"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === "/dashboard" && currentPath === "/dashboard") {
      return true;
    }
    return currentPath.includes(path) && path !== "/dashboard";
  };

  // Handle logout function with memory clearing
  const handleLogout = () => {
    // Clear any stored credentials from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("credentials");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear sessionStorage 
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("credentials");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    // clear all form data that might be saved in the browser
    const inputElements = document.querySelectorAll(
      'input[type="email"], input[type="password"]'
    );
    inputElements.forEach((input) => {
      input.value = "";
      // Set autocomplete attribute to prevent browser from remembering these fields
      input.setAttribute("autocomplete", "off");
    });

    // Call the existing onLogout function
    if (onLogout) {
      onLogout();
    }

    // Navigate to the home page
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Sidebar header with logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-text">CLAIRO</span>
        </div>
      </div>

      {/* User profile section */}
      <div className="sidebar-user">
        <div className="user-avatar">
       
          {username ? username.charAt(0).toUpperCase() : "A"}
        </div>
        <div className="user-info">
          <h3 className="user-name">{username || "Attorney"}</h3>
          <p className="user-role">{t("Attorney_at_Law")}</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">{t("Main")}</h4>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <button
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => onNavigation(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings section */}
        <div className="nav-section">
          <h4 className="nav-section-title">{t("Account")}</h4>
          <ul className="nav-list">
            {settingsItems.map((item) => (
              <li key={item.path} className="nav-item">
                <button
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => onNavigation(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sidebar footer with logout button */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <span className="logout-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span className="logout-label">{t("signout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
