import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  FaUserGraduate,
  FaPlus,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";

import {
  faTrashCan,
  faEdit,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ApprenticeDetails.module.css";

const ApprenticeDetails = () => {
  const { t } = useTranslation();
  const [apprentices, setApprentices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalApprentices, setTotalApprentices] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract lawyerId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const lawyerId = queryParams.get("lawyerId");

  // Fetch apprentices on component mount and when lawyerId changes
  useEffect(() => {
    fetchApprentices();
  }, []);

  const fetchApprentices = async () => {
    try {
      //setLoading(true);

      // Fetch apprentices linked to this lawyer
      const { data, error } = await supabase.from("apprentice").select("*");

      if (error) {
        setError(error.message);
      } else {
        setApprentices(data || []);
        setTotalApprentices(data?.length || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (apprenticeId) => {
    if (
      window.confirm(
        t(
          "Confirm_Delete_Apprentice",
          "Are you sure you want to delete this apprentice?"
        )
      )
    ) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from("apprentice")
          .delete()
          .eq("id", apprenticeId);

        if (error) {
          setError(error.message);
        } else {
          fetchApprentices(); // Refresh the list after deletion
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateClick = (apprenticeId) => {
    navigate(`/employee-details/apprentice/update/${apprenticeId}`);
  };

  const handleAddClick = () => {
    navigate(`/employee-details/apprentice/add`);
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Filter apprentices based on search term
  const filteredApprentices = apprentices.filter(
    (apprentice) =>
      apprentice.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprentice.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprentice.education?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          // Navigates back to the previous page
          aria-label={t("Back")}
        >
          <FaArrowLeft className={styles.headerIcon} />
        </button>
        <div className={styles.titleContainer}>
          <FaUserGraduate className={styles.headerIcon} />
          <h2>{t("ApprenticeDetails")}</h2>
        </div>
        <button
          onClick={handleAddClick}
          className={styles.addButton}
          title={t("Add")}
        >
          <FaPlus className={styles.buttonIcon} />
          <span>{t("Add")}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        {/* <div className={styles.statCard}> */}
        {/* <div className={styles.statIcon}>
            <FaUserGraduate />
          </div> */}
        <div className={styles.statContent}>
          <h3>{t("TotalApprentices")}</h3>
          <p className={styles.statValue}>{totalApprentices}</p>
        </div>
        {/* </div> */}
      </div>

      {/* Search and filter */}
      <div className={styles.toolbarContainer}>
        <div className={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("SearchApprentice")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className={styles.notification}>
          <FaExclamationTriangle className={styles.notificationIcon} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("loading", "Loading...")}</p>
        </div>
      ) : (
        <>
          {/* Apprentices Table */}
          {filteredApprentices.length > 0 ? (
            <div className={styles.tableCard}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("Name", "Name")}</th>
                      <th>{t("Email", "Email")}</th>
                      <th>{t("Contact_No", "Contact No")}</th>
                      <th>{t("Education", "Education")}</th>
                      <th>{t("JoinedDate", "Joined Date")}</th>
                      <th>{t("Actions", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApprentices.map((apprentice) => (
                      <tr key={apprentice.id}>
                        <td>
                          <div className={styles.nameCell}>
                            <div className={styles.avatar}>
                              {apprentice.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <span>{apprentice.name}</span>
                          </div>
                        </td>
                        <td>{apprentice.email}</td>
                        <td>{apprentice.contact_no}</td>
                        <td>{apprentice.education || t("N/A", "N/A")}</td>
                        <td>{formatDate(apprentice.joined_date)}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => handleUpdateClick(apprentice.id)}
                              className={`${styles.actionButton} ${styles.editButton}`}
                              title={t(
                                "Update_Apprentice",
                                "Update Apprentice"
                              )}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDelete(apprentice.id)}
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              title={t(
                                "Delete_Apprentice",
                                "Delete Apprentice"
                              )}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FaUserGraduate className={styles.emptyIcon} />
              <p>{t("No_Apprentices_Found", "No apprentices found")}</p>
              <button
                onClick={handleAddClick}
                className={styles.addButtonEmpty}
              >
                {t("Add")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprenticeDetails;
