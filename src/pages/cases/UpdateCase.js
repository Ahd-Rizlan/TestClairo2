import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaGavel,
  FaArrowLeft,
  FaCalendarAlt,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";
import styles from "./AddCase.module.css"; 

const UpdateCase = () => {
  const { t } = useTranslation();
  const [caseNo, setCaseNo] = useState("");
  const [openedDate, setOpenedDate] = useState("");
  const [court, setCourt] = useState("");
  const [caseTypeId, setCaseTypeId] = useState("");
  const [caseTypes, setCaseTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const { caseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaseTypes();
    fetchCaseDetails();
  }, []);

  const fetchCaseTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("case_types")
        .select("id, case_type");

      if (error) throw new Error(error.message);
      setCaseTypes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCaseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("case_id", caseId)
        .single();
      // fetch single case details
      if (error) throw new Error(error.message);
      setCaseNo(data.case_no);
      setOpenedDate(data.opened_date);
      setCourt(data.court);
      setCaseTypeId(data.case_type_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!caseNo || !openedDate || !caseTypeId) {
        throw new Error("All fields are required.");
      }

      const { error: updateError } = await supabase
        .from("cases")
        .update({
          case_no: caseNo,
          opened_date: openedDate,
          court: court,
          case_type_id: caseTypeId,
        })
        .eq("case_id", caseId);

      if (updateError)
        throw new Error(`Failed to update case: ${updateError.message}`);

      setSuccess("Case updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
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
          <FaGavel className={styles.headerIcon} /> {t("Update Case Details")}
        </h2>
      </div>

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

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("loading", "Loading...")}</p>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.formCard}>
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

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleBack}
              >
                {t("Cancel")}
              </button>
              <button type="submit" className={styles.primaryButton}>
                {t("Update")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateCase;
