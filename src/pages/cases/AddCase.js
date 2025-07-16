import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaGavel,
  FaArrowLeft,
  FaCalendarAlt,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";
import styles from "./AddCase.module.css"; 


const AddCase = () => {
  const { t } = useTranslation();
  const [caseNo, setCaseNo] = useState("");
  const [openedDate, setOpenedDate] = useState("");
  const [court, setCourt] = useState("");
  const [caseTypeId, setCaseTypeId] = useState("");
  const [caseTypes, setCaseTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch case types
  useEffect(() => {
    fetchCaseTypes();
  }, []);

  const fetchCaseTypes = async () => {
    try {
      setLoading(true);
      const { data: caseTypeData, error: caseTypeError } = await supabase
        .from("case_types")
        .select("id, case_type");

      if (caseTypeError) throw new Error(caseTypeError.message);
      setCaseTypes(caseTypeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Go back to case board
  const handleBack = () => {
    navigate("/case-boards");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!caseNo || !openedDate || !caseTypeId) {
        throw new Error("All fields are required.");
      }

      const { error: caseError } = await supabase.from("cases").insert([
        {
          case_no: caseNo,
          opened_date: openedDate,
          court: court,
          case_type_id: caseTypeId,
        },
      ]);

      if (caseError)
        throw new Error(`Failed to save case: ${caseError.message}`);

      setSuccess("Case added successfully!");
      resetForm();
      navigate("/case-boards");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setCaseNo("");
    setOpenedDate("");
    setCourt("");
    setCaseTypeId("");
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <button
          className={styles.backButton}
          onClick={handleBack}
          aria-label={t("Back")}
        >
          <FaArrowLeft />
        </button>
        <h2>
          <FaGavel className={styles.headerIcon} /> {t("AddCaseDetails")}
        </h2>
      </div>

      {/* Notification area */}
      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={`${styles.notification} ${styles.successNotification}`}>
          <span>{success}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("loading", "Loading...")}</p>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.formCard}>

            {/* Case Number Field */}
            
            <div className={styles.formGroup}>
              <label htmlFor="caseNo">
                <FaClipboardList className={styles.inputIcon} /> {t("CaseNo")}
              </label>
              <input
                type="text"
                id="caseNo"
                value={caseNo}
                onChange={(e) => setCaseNo(e.target.value)}
                placeholder={t("EnterCaseNumber")}
                required
              />
            </div>

            {/* Case Type Field */}
            <div className={styles.formGroup}>
              <label htmlFor="caseTypeId">
                <FaGavel className={styles.inputIcon} /> {t("CaseType")}
              </label>
              <select
                id="caseTypeId"
                value={caseTypeId}
                onChange={(e) => setCaseTypeId(e.target.value)}
                required
                className={styles.selectInput}
              >
                <option value="">{t("SelectCaseType")}</option>
                {caseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.case_type}
                  </option>
                ))}
              </select>
            </div>

            {/* Opened Date Field */}
            <div className={styles.formGroup}>
              <label htmlFor="openedDate">
                <FaCalendarAlt className={styles.inputIcon} /> {t("OpenedDate")}
              </label>
              <input
                type="date"
                id="openedDate"
                value={openedDate}
                onChange={(e) => setOpenedDate(e.target.value)}
                required
              />
            </div>

            {/* Court Field */}
            <div className={styles.formGroup}>
              <label htmlFor="court">
                <FaBuilding className={styles.inputIcon} /> {t("Court")}
              </label>
              <input
                type="text"
                id="court"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                placeholder={t("EnterCourt")}
                required
              />
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={resetForm}
              >
                {t("Reset")}
              </button>
              <button type="submit" className={styles.primaryButton}>
                {t("Add")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddCase;
