import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUserGraduate,
  FaArrowLeft,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from "./ApprenticeUpdateForm.module.css"; 

const ApprenticeUpdateForm = () => {
  const { t } = useTranslation();
  const { apprenticeId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    education: "",
    joinedDate: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Fetch apprentice details when component mounts
  useEffect(() => {
    fetchApprentice();
  }, []);

  const fetchApprentice = async () => {
    try {
      // setLoading(true);
      const { data, error } = await supabase
        .from("apprentice")
        .select("*")
        .eq("id", apprenticeId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setFormData({
        name: data.name || "",
        email: data.email || "",
        contactNo: data.contact_no || "",
        education: data.education || "",
        joinedDate: data.joined_date || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Update data in Supabase for apprentices
      const { error: updateError } = await supabase
        .from("apprentice")
        .update({
          name: formData.name,
          email: formData.email,
          contact_no: formData.contactNo,
          education: formData.education || null,
          joined_date: formData.joinedDate,
        })
        .eq("id", apprenticeId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(
        t(
          "ApprenticeUpdatedSuccessfully",
          "Apprentice details updated successfully!"
        )
      );

      // Navigate back to apprentice details page after short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label={t("Back")}
        >
          <FaArrowLeft />
        </button>
        <h2>
          <FaUserGraduate className={styles.headerIcon} />{" "}
          {t("UpdateApprenticeDetails", "Update Apprentice Details")}
        </h2>
      </div>

      {/* Notification area */}
      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          <FaExclamationTriangle className={styles.notificationIcon} />
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
          <p>{t("loading", "Loading apprentice details...")}</p>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <div
              className={`${styles.formGroup} ${
                focusedField === "name" ? styles.focused : ""
              }`}
            >
              <label htmlFor="name">
                <FaUser className={styles.inputIcon} /> {t("Name", "Name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("EnterName", "Enter apprentice name")}
                required
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div
              className={`${styles.formGroup} ${
                focusedField === "email" ? styles.focused : ""
              }`}
            >
              <label htmlFor="email">
                <FaEnvelope className={styles.inputIcon} />{" "}
                {t("Email", "Email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("EnterEmail", "Enter email address")}
                required
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div
              className={`${styles.formGroup} ${
                focusedField === "contactNo" ? styles.focused : ""
              }`}
            >
              <label htmlFor="contactNo">
                <FaPhone className={styles.inputIcon} />{" "}
                {t("ContactNo", "Contact Number")}
              </label>
              <input
                type="text"
                id="contactNo"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder={t("EnterContactNumber", "Enter contact number")}
                required
                onFocus={() => setFocusedField("contactNo")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div
              className={`${styles.formGroup} ${
                focusedField === "education" ? styles.focused : ""
              }`}
            >
              <label htmlFor="education">
                <FaGraduationCap className={styles.inputIcon} />{" "}
                {t("Education", "Education")} ({t("Optional", "optional")})
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder={t(
                  "EnterEducation",
                  "Enter education details (optional)"
                )}
                onFocus={() => setFocusedField("education")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div
              className={`${styles.formGroup} ${
                focusedField === "joinedDate" ? styles.focused : ""
              }`}
            >
              <label htmlFor="joinedDate">
                <FaCalendarAlt className={styles.inputIcon} />{" "}
                {t("JoinedDate", "Joined Date")}
              </label>
              <input
                type="date"
                id="joinedDate"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
                required
                onFocus={() => setFocusedField("joinedDate")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate(-1)}
              >
                {t("Cancel", "Cancel")}
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={submitting}
              >
                {submitting
                  ? t("Updating", "Updating...")
                  : t("UpdateApprentice", "Update Apprentice")}
                {submitting && <span className={styles.buttonSpinner}></span>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApprenticeUpdateForm;
