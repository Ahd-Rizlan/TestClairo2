import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./CaseHistory.module.css"; // Updated to use CSS modules
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faHistory,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";

import { useTranslation } from "react-i18next";

const CaseHistory = () => {
  const { t } = useTranslation();
  const { caseId } = useParams(); // Get caseId from URL parameters
  const [caseData, setCaseData] = useState(null);
  const [previousUpdates, setPreviousUpdates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    fetchPreviousUpdates();
  }, []);

  
  const fetchPreviousUpdates = async () => {
    try {
      setLoading(true);
      // Fetch updates for the specific case
      const { data: previousUpdateData, error: previousUpdateError } =
        await supabase.from("case_updates").select("*").eq("case_id", caseId); // Fetch updates for the current case

      if (previousUpdateError) throw new Error(previousUpdateError.message);
      setPreviousUpdates(previousUpdateData);

      // Fetch case details to get lawyerId
      const { data: caseDetail, error: caseError } = await supabase
        .from("cases")
        .select("*")
        .eq("case_id", caseId)
        .single();

      if (caseError) throw new Error(caseError.message);
      setCaseData(caseDetail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Function to format dates nicely (if needed)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.caseHistoryContainer}>
      <div className={styles.headerSection}>
        <button
          className={styles["back-button"]}
          onClick={() => navigate(-2)}
          aria-label={t("Back")}
        >
          <FaArrowLeft />
        </button>
        <h1>
          <FontAwesomeIcon icon={faHistory} className={styles.headerIcon} />
          {t("CaseHistory")}
        </h1>
        {caseData && (
          <div className={styles.caseInfo}>
            <span className={styles.caseNumber}>
              {t("CaseNo")} <strong>{caseData.case_no}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className={styles.notification}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.notificationIcon}
          />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("Loading")}</p>
        </div>
      ) : (
        <>
          {previousUpdates.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.updatesTable}>
                <thead>
                  <tr>
                    <th>{t("PreviousDate")}</th>
                    <th>{t("Description")}</th>
                    <th>{t("NextStep")}</th>
                    <th>{t("NextDate")}</th>
                    <th className={styles.actionColumn}>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {previousUpdates.map((update) => (
                    <tr key={update.case_update_id}>
                      <td>{formatDate(update.previous_date)}</td>
                      <td className={styles.descriptionCell}>
                        {update.description}
                      </td>
                      <td>{update.next_step}</td>
                      <td>{formatDate(update.next_date)}</td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.actionButton}
                          onClick={() =>
                            navigate(
                              `/casestatus/${update.case_update_id}/${caseId}`
                            )
                          }
                          title={t("UpdateCaseStatus")}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FontAwesomeIcon icon={faHistory} />
              </div>
              <p>{t("NoPreviousUpdates")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CaseHistory;
