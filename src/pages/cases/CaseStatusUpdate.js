import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next";
import styles from "./CaseStatusUpdate.module.css"; 

const CaseStatusUpdate = () => {
  const { t } = useTranslation();
  const { caseUpdateId, caseId, lawyerId } = useParams(); // Get parameters from URL
  const [previousDate, setPreviousDate] = useState("");
  const [description, setDescription] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [nextStep, setNextStep] = useState("started"); // Default status
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch task details when the component mounts
  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const { data: caseUpdateData, error: CaseUpdateError } = await supabase
        .from("case_updates")
        .select("*")
        .eq("case_update_id", caseUpdateId) // Fetch specific task by ID
        .single();

      if (CaseUpdateError) throw new Error(CaseUpdateError.message);
      if (caseUpdateData) {
        setPreviousDate(caseUpdateData.previous_date);
        setDescription(caseUpdateData.description);
        setNextDate(caseUpdateData.next_date);
        setNextStep(caseUpdateData.next_step); // Set the current status
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Update data in Supabase for tasks including case_id
      const { error: updateError } = await supabase
        .from("case_updates")
        .update({
          previous_date: previousDate,
          description: description,
          next_date: nextDate,
          next_step: nextStep,
        })
        .eq("case_update_id", caseUpdateId); // Specify which task to update

      if (updateError) {
        console.error("Error details:", updateError);
        throw new Error(
          `Failed to add case status update: ${updateError.message}`
        );
      }

      setSuccess("Case Status updated successfully!");

      // Redirect back to CaseDetails after successful update
      // After successful update
      setTimeout(() => {
        if (caseId) {
          navigate(`/case-history/${caseId}`); // Navigate to case history if no lawyer ID
        } else {
          navigate(`/case-details/${caseId}`); // Navigate to case details with lawyer ID
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSuccess(null);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (caseId) {
      navigate(`/case-details/${caseId}`);
    } else {
      navigate(`/case-history/${caseId}`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{t("UpdateCaseStatusDetails")}</h2>
      </div>

      {/* Error and Success Messages */}
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
              <label>{t("NextStep")}:</label>
              <input
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                required
                className={styles.textInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("NextDate")}:</label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className={styles.dateInput}
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
                {t("Update")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CaseStatusUpdate;
