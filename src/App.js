import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";

// Layouts
import PublicLayout from "./components/layouts/PublicLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Public Pages
import LandingPage from "./pages/public/LandingPage";
import AboutPage from "./pages/public/AboutPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import UpdatePassword from "./pages/auth/UpdatePassword";

// Dashboard Pages
import CommonDashboard from "./pages/dashboard/CommonDashboard";

//Employee Pages
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import Apprentice from "./pages/employees/Apprentice";
import ApprenticeDetails from "./pages/employees/ApprenticeDetails";
import ApprenticeUpdate from "./pages/employees/ApprenticeUpdate";
import AttorneyDetails from "./pages/employees/AttorneyDetails";
import AttorneyUpdate from "./pages/employees/AttorneyUpdate";

//Client Pages
import ClientList from "./pages/clients/ClientList";
import ClientForm from "./pages/clients/ClientForm";
import ClientUpdateForm from "./pages/clients/ClientUpdateForm";
import ClientView from "./pages/clients/ClientView";
import ClientSeeView from "./pages/clients/ClientSeeView";

//Case Pages
import CaseDetails from "./pages/cases/CaseDetails";
import CaseStatus from "./pages/cases/CaseStatus";
import UpdateCase from "./pages/cases/UpdateCase";
import CaseStatusUpdate from "./pages/cases/CaseStatusUpdate";
import CaseHistory from "./pages/cases/CaseHistory";
import MyCaseBoard from "./pages/cases/MyCaseBoard";
import CaseBoard from "./pages/cases/CaseBoard";
import AddCase from "./pages/cases/AddCase";
import FeeDetails from "./pages/cases/FeeDetails";
import FeeUpdate from "./pages/cases/FeeUpdate";
import Task from "./pages/cases/Task";
import TaskUpdate from "./pages/cases/TaskUpdate";
import RivalParty from "./pages/cases/RivalParty";
import RivalPartyUpdate from "./pages/cases/RivalPartyUpdate";

// CSS
import "./App.css";
import { useTranslation } from "react-i18next";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is signed in with Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsAuthenticated(true);
          // Get lawyer ID from local storage
          const lawyerId = localStorage.getItem("lawyerId");

          // If we have a lawyer ID, set user info
          if (lawyerId) {
            const { data: userData, error } = await supabase
              .from("attorney_at_law")
              .select("*")
              .eq("lawyer_id", lawyerId)
              .single(); 

            // get only one record from the table

            if (userData && !error) {
              setUserInfo({

                //userdata --- id email   blh   0    ________
                ...userData,
                email: session.user.email,
              });
            }
          }
        } else {
          setIsAuthenticated(false);
          setUserInfo(null);
          localStorage.removeItem("lawyerId");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUserInfo(null);
      } 
      finally {
        setLoading(false);
      }
    };
    checkAuth();
    // Set up auth listener for changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          setIsAuthenticated(true);

          // Get lawyerId from localStorage or fetch from database
          const lawyerId = localStorage.getItem("lawyerId");
          if (lawyerId && session) {
            const { data, error } = await supabase
              .from("attorney_at_law")
              .select("*")
              .eq("lawyer_id", lawyerId)
              .single();

            if (data && !error) {
              setUserInfo({
                ...data,
                email: session.user.email,
              });
            }
          }
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUserInfo(null);
          localStorage.removeItem("lawyerId");
        }
      }
    );
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };

  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserInfo(null);
      localStorage.removeItem("lawyerId");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{t("loading")}</p>
      </div>
    );
  }


//--------------------------------------------------------------------------------------
  // Setting the Routes for Naviagation

  return (
    <Router>
      <Routes>
        {/* Routes which are accessible for everyone */}
        {/* Setting the Header and Nevigate to Home if its " / " */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/aboutUs" element={<AboutPage />} />

          <Route
            path="/clientseeview/:clientId/:caseId"
            element={<ClientSeeView />}
          />

          <Route
            path="/signin"
            element={

              // 
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <SignInPage onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <SignUpPage />
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Route>

        {/*Setting the Route to Dashboards */}
        {/* Setting the Dashboard Layout and Navigating to Common Dashboard */}
        {/* This route is protected and requires authentication */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={handleLogout} userInfo={userInfo} />
            ) : (
              <Navigate to="/home" />
            )
          }
        >
          <Route index element={<CommonDashboard userInfo={userInfo} />} />
          <Route
            path="dashboard"
            element={<CommonDashboard userInfo={userInfo} />}
          />
          <Route
            path="employee-details"
            element={<EmployeeDetails userInfo={userInfo} />}
          />
          <Route path="clients" element={<ClientList userInfo={userInfo} />} />



          <Route
            path="clients/update/:clientId"
            element={<ClientUpdateForm />}
          />

          
          <Route
            path="clients/add"
            element={<ClientForm userInfo={userInfo} />}
          />
          <Route
            path="client-view/:clientId/:caseId"
            element={<ClientView userInfo={userInfo} />}
          />
          <Route
            path="clientseeview/:clientId/:caseId"
            element={<ClientSeeView />}
          />
          {/* Cases */}

          <Route
            path="case-details"
            element={<CaseDetails userInfo={userInfo} />}
          />
          <Route
            path="/my-case-boards"
            element={<MyCaseBoard userInfo={userInfo} />}
          />
          <Route
            path="/case-boards"
            element={<CaseBoard userInfo={userInfo} />}
          />
          <Route
            path="/case-details/:caseId"
            element={<CaseDetails userInfo={userInfo} />}
          />
          <Route path="case/add" element={<AddCase userInfo={userInfo} />} />
          <Route
            path="case/update/:caseId"
            element={<UpdateCase userInfo={userInfo} />}
          />
          <Route
            path="case-history/:caseId"
            element={<CaseHistory userInfo={userInfo} />}
          />
          <Route
            path="casestatus/:caseId"
            element={<CaseStatus userInfo={userInfo} />}
          />
          <Route
            path="casestatus/:caseUpdateId/:caseId"
            element={<CaseStatusUpdate userInfo={userInfo} />}
          />
          <Route
            path="fee/add/:caseId"
            element={<FeeDetails userInfo={userInfo} />}
          />
          <Route
            path="fee/update/:feeId/:caseId"
            element={<FeeUpdate userInfo={userInfo} />}
          />
          <Route path="task/:caseId" element={<Task userInfo={userInfo} />} />
          <Route
            path="task/update/:taskId/:caseId"
            element={<TaskUpdate userInfo={userInfo} />}
          />
          <Route
            path="rival-party/:caseId"
            element={<RivalParty userInfo={userInfo} />}
          />
          <Route
            path="rival-party/update/:oppositePartyId/:caseId"
            element={<RivalPartyUpdate userInfo={userInfo} />}
          />

          {/* Employees */}

          <Route
            path="/employee-details/apprentice/add"
            element={<Apprentice userInfo={userInfo} />}
          />
          <Route
            path="/employee-details/apprentice-details"
            element={<ApprenticeDetails userInfo={userInfo} />}
          />
          <Route
            path="/employee-details/apprentice/update/:apprenticeId"
            element={<ApprenticeUpdate userInfo={userInfo} />}
          />
          <Route
            path="/employee-details/attorney-details"
            element={<AttorneyDetails userInfo={userInfo} />}
          />
          <Route
            path="/employee-details/attorney/update/:lawyerId"
            element={<AttorneyUpdate userInfo={userInfo} />}
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
