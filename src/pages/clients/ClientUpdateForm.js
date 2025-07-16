import React, { useState, useEffect } from "react"; // Importing React and useState hook
import { useParams, useNavigate } from "react-router-dom"; // Importing useParams and useNavigate from react-router-dom for routing
import { supabase } from "../../supabaseClient"; // Importing Supabase client
import { useTranslation } from "react-i18next"; // Importing useTranslation hook for internationalization
import styles from "./ClientUpdateForm.module.css"; // Importing CSS module for styling

const ClientUpdateForm = () => {
  const { t } = useTranslation(); // Importing useTranslation hook for internationalization
  const { clientId } = useParams(); // Get clientId from URL parameters
  const navigate = useNavigate(); // For navigation
  const [name, setName] = useState(""); // State to manage client name setting initial value to empty string
  const [contactNo, setContactNo] = useState(""); // State to manage client contact number setting initial value to empty string
  const [email, setEmail] = useState(""); // State to manage client email setting initial value to empty string
  const [profession, setProfession] = useState(""); // State to manage client profession setting initial value to empty string
  const [error, setError] = useState(null); // State to manage error messages setting initial value to null
  const [success, setSuccess] = useState(null); // State to manage success messages setting initial value to null
  const [loading, setLoading] = useState(true); // State to manage loading status setting initial value to true

  // Fetch client details when the component mounts(Loads initially )
  useEffect(() => {
    fetchClientDetails();
  }, []);
  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      // Fetch client details from Supabase using the clientId from URL parameters
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("client_id", clientId)
        .single();
      // Use .single() to get exactly one row

      if (error) {
        throw new Error(error.message);
      } else {
        // if no error throw then set the data to the fields variables
        setName(data.name);
        setContactNo(data.contact_no);
        setEmail(data.email);
        setProfession(data.profession || "");
      }
    } catch (err) {
      setError(err.message);
      // Handle error if fetching client details fails
    } finally {
      setLoading(false);
      // Set loading to false after fetching data
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear any previous error messages
    setSuccess(null); // Clear any previous success messages
    setLoading(true); // Enable loading state
    try {
      const { error } = await supabase
        .from("clients")
        // Update the client details in the database
        .update({
          name,
          contact_no: contactNo,
          email,
          profession: profession || null,
        })
        .eq("client_id", clientId);
      // Check for errors during the update operation
      if (error) {throw new Error(error.message); }
      setSuccess(t("ClientUpdatedSuccessfully"));
      // Navigate back to client list after short delay
      setTimeout(() => {
        // Set a timeout to navigate back to the previous page after 1.5 seconds
        navigate(-1);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{t("UpdateClientDetails")}</h2>
      </div>

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

      {loading && !success ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("Loading")}</p>
        </div>
      ) : (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>{t("Name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.textInput}
                placeholder={t("EnterClientName")}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("ContactNo")}</label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
                className={styles.textInput}
                placeholder={t("EnterContactNumber")}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("Email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.textInput}
                placeholder={t("EnterEmail")}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("Profession")}</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className={styles.textInput}
                placeholder={t("EnterProfession")}
                disabled={loading}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.secondaryButton}
                disabled={loading}
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={loading}
              >
                {loading ? t("Updating") : t("Update")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientUpdateForm;
