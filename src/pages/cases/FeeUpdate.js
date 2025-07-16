import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./FeeUpdate.module.css"; 
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMoneyBillWave,
  faClipboard,
  faSave,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const FeeUpdate = () => {
  const { t } = useTranslation();
  const { feeId, caseId, lawyerId } = useParams();
  const [newFee, setNewFee] = useState({ date: "", amount: "", purpose: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch fee details when the component mounts
  useEffect(() => {
    fetchFeeDetails();
  }, []);

  // Fetch fee details from Supabase
  
  const fetchFeeDetails = async () => {
    try {
      setLoading(true);
      const { data: feeData, error: feeError } = await supabase
        .from("fee_details")
        .select("*")
        .eq("fee_id", feeId)
        .single();

      if (feeError) throw new Error(feeError.message);
      if (feeData) {
        setNewFee({
          date: feeData.date,
          amount: feeData.amount,
          purpose: feeData.purpose,
        });
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
    setSubmitting(true);

    try {
      // Update data in Supabase for fees including case_id
      const { error: updateFeeError } = await supabase
        .from("fee_details")
        .update({
          case_id: caseId,
          date: newFee.date,
          amount: parseFloat(newFee.amount),
          purpose: newFee.purpose,
        })
        .eq("fee_id", feeId);

      if (updateFeeError) {
        throw new Error(`Failed to update fee: ${updateFeeError.message}`);
      }

      setSuccess("Fee updated successfully!");

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Function to go back to case details
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.feeUpdateContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className={styles.pageTitle}>{t("UpdateFeeDetails")}</h2>
      </div>

      {error && (
        <div className={styles.errorNotification}>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.successNotification}>
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("Loading")}</p>
        </div>
      ) : (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              <div className={styles.formGroup}>
                <label htmlFor="feeDate">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={styles.inputIcon}
                  />
                  {t("Date")}
                </label>
                <input
                  id="feeDate"
                  type="date"
                  value={newFee.date}
                  onChange={(e) =>
                    setNewFee({ ...newFee, date: e.target.value })
                  }
                  required
                  className={styles.dateInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="feeAmount">
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className={styles.inputIcon}
                  />
                  {t("Amount")}
                </label>
                <input
                  id="feeAmount"
                  type="number"
                  value={newFee.amount}
                  onChange={(e) =>
                    setNewFee({ ...newFee, amount: e.target.value })
                  }
                  placeholder={t("EnterAmount")}
                  required
                  className={styles.numberInput}
                  min={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="feePurpose">
                  <FontAwesomeIcon
                    icon={faClipboard}
                    className={styles.inputIcon}
                  />
                  {t("Purpose")}
                </label>
                <input
                  id="feePurpose"
                  type="text"
                  value={newFee.purpose}
                  onChange={(e) =>
                    setNewFee({ ...newFee, purpose: e.target.value })
                  }
                  placeholder={t("EnterPurpose")}
                  required
                  className={styles.textInput}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleBack}
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? t("Updating") : t("Update")}
                
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeeUpdate;
