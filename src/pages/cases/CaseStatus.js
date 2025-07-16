import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./CaseStatus.module.css"; 

const CaseStatus = () => {
  const { t } = useTranslation();
  const { caseId, lawyerId } = useParams(); // Extract caseId and lawyerId from URL parameters
  const [caseNo, setCaseNo] = useState(""); // State for case number
  const [previousDate, setPreviousDate] = useState("");
  const [description, setDescription] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Initialize navigate function

  // Fetch the specific case from Supabase when the component mounts
  useEffect(() => {
    fetchCase();
  }, []);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const { data: caseData, error: caseError } = await supabase
        .from("cases")
        .select("*")
        .eq("case_id", caseId) // Fetch the specific case by ID
        .single(); // Get a single record

      if (caseError) {
        throw new Error(caseError.message);
      } else if (caseData) {
        setCaseNo(caseData.case_no); // Automatically populate the case number
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert data into Supabase for case updates
      const { error } = await supabase.from("case_updates").insert([
        {
          case_id: caseId,
          previous_date: previousDate,
          description,
          next_date: nextDate,
          next_step: nextStep,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setSuccess("Case update added successfully!"); // Set success message
      resetForm(); // Reset form fields

      // Navigate back to the specified path after successful submission
      setTimeout(() => {
        navigate(-1); // Keeping original navigation path
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  const resetForm = () => {
    setPreviousDate("");
    setDescription("");
    setNextDate("");
    setNextStep("");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.updateContainer}>
      <div className={styles.header}>
        <h2>{t("AddStatusQuo")}</h2>
      </div>

      {/* Notification Messages */}
      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`${styles.notification} ${styles.successNotification}`}>
          {success}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("Loading")}</p>
        </div>
      ) : (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            {/* Display the Case No */}
            <div className={styles.formGroup}>
              <label>{t("CaseNo")}</label>
              <input
                type="text"
                value={caseNo}
                readOnly
                className={styles.readOnlyInput}
              />
            </div>

            {/* Enable input fields only if a case is loaded */}
            {caseNo && (
              <>
                <div className={styles.formGroup}>
                  <label>{t("PreviousDate")}:</label>
                  <input
                    type="date"
                    value={previousDate}
                    onChange={(e) => setPreviousDate(e.target.value)}
                    required
                    className={styles.dateInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("Description")}:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className={styles.textareaInput}
                    rows={4}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("NextDate")}:</label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    required
                    className={styles.dateInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("NextStep")}:</label>
                  <input
                    type="text"
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    required
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.secondaryButton}
                  >
                    {t("Cancel")}
                  </button>
                  <button type="submit" className={styles.primaryButton}>
                    {t("Add")}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CaseStatus;
