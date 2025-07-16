import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./TaskUpdate.module.css"; 
import { useTranslation } from "react-i18next";

const TaskUpdate = () => {
  const { t } = useTranslation();
  const { taskId, caseId, lawyerId } = useParams();
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("started");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch task details when the component mounts
  useEffect(() => {
    fetchTaskDetails();
  }, []);


  // Fetch task details from Supabase
  const fetchTaskDetails = async () => {
    try {
      setLoading(false);
      const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_id", taskId)
        .single();

      if (taskError) throw new Error(taskError.message);
      if (taskData) {
        setTaskName(taskData.task_name);
        setStartDate(taskData.start_date);
        setEndDate(taskData.end_date);
        setStatus(taskData.status);
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
    setLoading(true);

    try {
      // Validate inputs before sending
      if (!taskName || !startDate || !caseId) {
        throw new Error("All fields are required.");
      }

      // Update data in Supabase for tasks including case_id
      const { error: updateError } = await supabase
        .from("tasks")
        .update({
          task_name: taskName,
          start_date: startDate,
          end_date: endDate,
          status,
        })
        .eq("task_id", taskId);

      if (updateError) {
        console.error("Error details:", updateError);
        throw new Error(`Failed to update task: ${updateError.message}`);
      }

      setSuccess("Task updated successfully!");

      // Redirect back to CaseBoard after successful update
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>{t("UpdateTaskDetails")}</h2>
      </div>

      {/* Error Handling */}
      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          {error}
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className={`${styles.notification} ${styles.successNotification}`}>
          {success}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("loading")}</p>
        </div>
      ) : (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            {/* Step Field */}
            <div className={styles.formGroup}>
              <label>{t("StepName")}:</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            {/* Start Date Field */}
            <div className={styles.formGroup}>
              <label>{t("StartDate")}:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            {/* Deadline Field */}
            <div className={styles.formGroup}>
              <label>{t("Deadline")}:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={styles.formInput}
              />
            </div>

            {/* Status Field */}
            <div className={styles.formGroup}>
              <label>{t("Status")}:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.formSelect}
              >
                <option value="started">{t("Started")}</option>
                <option value="in-progress">{t("InProgress")}</option>
                <option value="completed">{t("Completed")}</option>
                <option value="on hold">{t("OnHold")}</option>
                <option value="canceled">{t("Canceled")}</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
              >
                {t("Cancel")}
              </button>
              <button type="submit" className={styles.submitButton}>
                {t("Update")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskUpdate;
