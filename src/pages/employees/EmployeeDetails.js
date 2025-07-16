import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./EmployeeDetails.module.css";
import { useTranslation } from "react-i18next";
import {
  Users,
  GraduationCap,
  Scale,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const EmployeeDetails = ({ userInfo }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [apprenticeCount, setApprenticeCount] = useState(0);
  const [attorneyCount, setAttorneyCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch counts for apprentices and attorneys based on employee type
  useEffect(() => {
    fetchCounts();
  }, []);
  const fetchCounts = async () => {
    try {
      // Fetch count of apprentices
      const { count: apprenticeCount } = await supabase
        .from("apprentice")
        .select("id", { count: "exact", head: true });

      // Fetch count of attorneys
      const { count: attorneyCount } = await supabase
        .from("attorney_at_law")
        .select("lawyer_id", { count: "exact", head: true });

      // Set counts in state
      setApprenticeCount(apprenticeCount || 0);
      setAttorneyCount(attorneyCount || 0);
      setTotalEmployees((apprenticeCount || 0) + (attorneyCount || 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.employeeDetailsContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>
          <Users className={styles.headerIcon} />
          {t("Employee_Details")}
        </h1>
      </div>

      {/* Error Handling */}
      {error && (
        <div className={styles.errorNotification}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <span>{t("loading")}</span>
        </div>
      ) : (
        <>
          {/* Total Employees Overview Card */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryIconWrapper}>
              <Users size={24} className={styles.summaryIcon} />
            </div>
            <div className={styles.summaryContent}>
              <h3 className={styles.summaryTitle}>{t("Total_Employees")}</h3>
              <div className={styles.summaryValue}>{totalEmployees}</div>
            </div>
          </div>

          {/* Employee Category Cards */}
          <div className={styles.cardsGrid}>
            {/* Apprentice Card */}

            <div
              className={`${styles.employeeCard} ${styles.apprenticeCard}`}
              onClick={() => navigate("/employee-details/apprentice-details")}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrapper}>
                  <GraduationCap size={24} className={styles.cardIcon} />
                </div>
                <h3 className={styles.cardTitle}>{t("ApprenticeDetails")}</h3>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDescription}>
                  {t("ApprenticeDetailsDescription")}
                </p>
                <div className={styles.statsRow}>
                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      {t("TotalApprentices")}
                    </span>
                    <span className={styles.statValue}>{apprenticeCount}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.viewDetailsButton}>
                  <span>{t("ViewDetails")}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Attorney Card */}
            <div
              className={`${styles.employeeCard} ${styles.attorneyCard}`}
              onClick={() => navigate("/employee-details/attorney-details")}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrapper}>
                  <Scale size={24} className={styles.cardIcon} />
                </div>
                <h3 className={styles.cardTitle}>{t("AttorneyDetails")}</h3>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDescription}>
                  {t("AttorneyDetailsDescription")}
                </p>
                <div className={styles.statsRow}>
                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      {t("TotalAttorneys")}
                    </span>
                    <span className={styles.statValue}>{attorneyCount}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.viewDetailsButton}>
                  <span>{t("ViewDetails")}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDetails;
