import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RivalPartyUpdate.module.css"; 
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faPhone,
  faMapPin,
  faBalanceScale,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const RivalPartyUpdate = () => {
  const { t } = useTranslation();
  const { caseId, lawyerId, oppositePartyId } = useParams();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [gsDivision, setGsDivision] = useState("");
  const [rivalCounsel, setRivalCounsel] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch existing data for the opposite party when the component mounts
  useEffect(() => {
    fetchOppositePartyData();
  }, []);

  // Fetch existing data for the opposite party
  const fetchOppositePartyData = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("opposite_parties")
        .select("*")
        .eq("oppositeparty_id", oppositePartyId)
        .single();

      if (fetchError) throw new Error(fetchError.message);
      if (!data) throw new Error("Opposite Party not found.");

      // Set the state with fetched data
      setName(data.name);
      setAddress(data.address || "");
      setContactNo(data.contact_no || "");
      setGsDivision(data.gs_division || "");
      setRivalCounsel(data.rival_counsel || "");
    } catch (error) {
      console.error("Error fetching opposite party data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("opposite_parties")
        .update({
          name,
          address,
          contact_no: contactNo,
          gs_division: gsDivision,
          rival_counsel: rivalCounsel,
        })
        .eq("oppositeparty_id", oppositePartyId);

      if (updateError) throw new Error(updateError.message);

      setSuccess("Rival Party details updated successfully!");

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Error updating:", error);
      setError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className={styles.pageTitle}>{t("UpdateRivalPartyDetails")}</h2>
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
                <label htmlFor="name">
                  <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                  {t("Name")}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={styles.inputIcon}
                  />
                  {t("Address")}
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactNo">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className={styles.inputIcon}
                  />
                  {t("Contact_No")}
                </label>
                <input
                  type="text"
                  id="contactNo"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gsDivision">
                  <FontAwesomeIcon
                    icon={faMapPin}
                    className={styles.inputIcon}
                  />
                  {t("GSDivision")}
                </label>
                <input
                  type="text"
                  id="gsDivision"
                  value={gsDivision}
                  onChange={(e) => setGsDivision(e.target.value)}
                  required
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rivalCounsel">
                  <FontAwesomeIcon
                    icon={faBalanceScale}
                    className={styles.inputIcon}
                  />
                  {t("RivalCounsel")}
                </label>
                <input
                  type="text"
                  id="rivalCounsel"
                  value={rivalCounsel}
                  onChange={(e) => setRivalCounsel(e.target.value)}
                  className={styles.textInput}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
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

export default RivalPartyUpdate;
