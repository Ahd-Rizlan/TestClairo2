import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AttorneyDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faEdit,
  faUserTie,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AttorneyDetails = () => {
  const { t } = useTranslation();
  const [lawyers, setLawyers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract lawyerId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const lawyerId = queryParams.get("lawyerId");

  // Fetch lawyers on component mount
  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      // setLoading(true);

      // Fetch all lawyers
      const { data, error } = await supabase
        .from("attorney_at_law")
        .select("*");

      if (error) {
        setError(error.message);
      } else {
        setLawyers(data || []);
        setTotalLawyers(data?.length || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lawyerId) => {
    // Retrieve the logged-in user's ID from local storage
    const currentUserId = localStorage.getItem("lawyerId");

    // Ensure correct key
    console.log("Current User ID from localStorage:", currentUserId);
    console.log("Requested Delete ID:", lawyerId);

    // Prevent self-deletion
    // Show an alert message
    if (currentUserId === lawyerId) {
      alert(t("Cannot Delete Attorney"));
      return;
    }
    const { data: assignedCases, error: caseCheckError } = await supabase
      .from("cases")
      .select("case_id")
      .eq("lawyer_id", lawyerId);

    if (caseCheckError) {
      setError(caseCheckError.message);
      return;
    }

    if (assignedCases.length > 0) {
      alert(t("Cannot delete. Attorney has assigned cases."));
      return;
    }
    if (window.confirm(t("confirm_delete_lawyer"))) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from("attorney_at_law")
          .delete()
          .eq("lawyer_id", lawyerId);

        if (error) {
          setError(error.message);
        } else {
          fetchLawyers();
          // Refresh the list after deletion
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateClick = (lawyerId) => {
    navigate(`/employee-details/attorney/update/${lawyerId}`);
  };

  // Filter lawyers based on search term
  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.language_competency
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.lawyerDetailsContainer}>
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
          <FontAwesomeIcon icon={faUserTie} className={styles.headerIcon} />
          <h2>{t("AttorneyDetails")}</h2>
        </div>
        <div></div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className={styles.alert}>
          <div className={styles.alertIcon}>!</div>
          <div className={styles.alertMessage}>{error}</div>
          <button
            className={styles.alertClose}
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className={styles.dashboardCards}>
        {/* <div className={styles.card}> */}
        {/* <div className={styles.cardIcon}>
            <FontAwesomeIcon icon={faUserTie} />
          </div> */}
        <div className={styles.cardContent}>
          <h3>{t("TotalAttorneys")}</h3>
          <div className={styles.count}>{lawyers.length}</div>
        </div>
        {/* </div> */}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loaderRing}></div>
          <p>{t("loading")}</p>
        </div>
      ) : (
        <div className={styles.contentCard}>
          {/* Search and Filter Controls */}
          <div className={styles.tableControls}>
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t("Search attorneys...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Attorneys Table */}
          {filteredLawyers.length === 0 ? (
            <div className={styles.emptyState}>
              <FontAwesomeIcon icon={faUserTie} className={styles.emptyIcon} />
              <p>
                {searchTerm ? t("no_search_results") : t("no_attorneys_found")}
              </p>
            </div>
          ) : (
            <div className={styles.tableCard}>
              <div className={styles.tableResponsive}>
                <table className={styles.lawyersTable}>
                  <thead>
                    <tr>
                      <th>
                        <div className={styles.thContent}>{t("Name")}</div>
                      </th>
                      <th>
                        <div className={styles.thContent}>{t("Email")}</div>
                      </th>
                      <th>
                        <div className={styles.thContent}>
                          {t("Contact_No")}
                        </div>
                      </th>
                      <th>
                        <div className={styles.thContent}>
                          {t("Language_Competency")}
                        </div>
                      </th>
                      <th>
                        <div className={styles.thContent}>
                          {t("Years_Of_Experience")}
                        </div>
                      </th>
                      <th>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLawyers.map((lawyer) => (
                      <tr key={lawyer.lawyer_id}>
                        <td data-label={t("Name")}>
                          <div className={styles.nameCell}>
                            <div className={styles.avatar}>
                              {lawyer.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <span>{lawyer.name}</span>
                          </div>

                          {/* {lawyer.name} */}
                        </td>
                        <td data-label={t("Email")}>{lawyer.email}</td>
                        <td data-label={t("Contact_No")}>
                          {lawyer.contact_no}
                        </td>
                        <td data-label={t("Language_Competency")}>
                          {lawyer.language_competency}
                        </td>
                        <td data-label={t("Years_Of_Experience")}>
                          {lawyer.years_of_experience}
                        </td>
                        <td data-label={t("Actions")}>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() =>
                                handleUpdateClick(lawyer.lawyer_id)
                              }
                              className={styles.editButton}
                              title={t("update_attorney")}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDelete(lawyer.lawyer_id)}
                              className={styles.deleteButton}
                              title={t("delete_attorney")}
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
          )}
        </div>
      )}
    </div>
  );
};

export default AttorneyDetails;
