import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./ClientSeeView.module.css"; 
import { useTranslation } from "react-i18next";
import { Calendar, Trash2 } from "lucide-react";

const ClientSeeView = () => {
  const { t } = useTranslation();
  const { clientId, caseId } = useParams(); // Get clientId and caseId from URL parameters
  const [caseDetails, setCaseDetails] = useState(null);
  const [caseTypeData, setCaseTypeData] = useState(null); // State for case type
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [clientData, setClientData] = useState(null); // State for clicked client details
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("status"); // 'status' or 'tasks'

  useEffect(() => {
    fetchCaseDetails();
    fetchClientDetails();
    fetchTasks();
  }, []); 

  const fetchCaseDetails = async () => {
    try {
      // Fetch case details directly using the caseId parameter
      const { data: casesData, error: casesError } = await supabase
        .from("cases")
        .select("case_id, case_no, case_type_id, opened_date")
        .eq("case_id", caseId) // Use the caseId from URL parameters
        .single();

      if (casesError) throw new Error(casesError.message);

      if (casesData) {
        setCaseDetails(casesData); // Set the case details

        // Fetch updates for this specific case using the correct case_id
        if (casesData.case_id) {
          const { data: updateData, error: updateError } = await supabase
            .from("case_updates")
            .select("*")
            .eq("case_id", casesData.case_id);

          if (updateError) throw new Error(updateError.message);
          setUpdates(updateData); // Set updates state with fetched data

          // Set most recent update
          if (updateData && updateData.length > 0) {
            const sortedUpdates = updateData.sort(
              (a, b) => new Date(b.previous_date) - new Date(a.previous_date)
            );
            setCurrentUpdate(sortedUpdates[0]);
          }
        }

        // Fetch the corresponding case type using the case_type_id
        if (casesData.case_type_id) {
          const { data: caseTypeDetail, error: caseTypeError } = await supabase
            .from("case_types")
            .select("*")
            .eq("id", casesData.case_type_id)
            .single();

          if (caseTypeError) throw new Error(caseTypeError.message);
          setCaseTypeData(caseTypeDetail); // Set fetched case type data
        }
      } else {
        throw new Error("No cases found for this client.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchClientDetails = async () => {
    try {
      // Fetch clicked client details based on clientId
      const { data: clientDetail, error: clientError } = await supabase
        .from("clients") // Assuming 'clients' is your table name
        .select("*")
        .eq("client_id", clientId)
        .single();

      if (clientError) throw new Error(clientError.message);
      setClientData(clientDetail); // Set clicked client details in state
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      // First fetch client_case_id using both clientId and caseId
      const { data: clientCaseEntry, error: clientCaseError } = await supabase
        .from("client_case")
        .select("client_case_id")
        .eq("client_id", clientId)
        .eq("case_id", caseId)
        .single();

      if (clientCaseError) throw new Error(clientCaseError.message);

      if (clientCaseEntry) {
        const clientCaseId = clientCaseEntry.client_case_id;

        // Now fetch tasks associated with this specific client_case_id.
        const { data: tasksData, error } = await supabase
          .from("client_case_task")
          .select("*")
          .eq("client_case_id", clientCaseId);

        if (error) throw new Error(error.message);

        setTasks(tasksData); // Update state with fetched tasks
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to fetch tasks: ${err.message}`);
    }
  };

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.clientViewContainer}>
      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.infoSection}>
        {/* Client Details Card */}
        {clientData && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t("ClientDetails")}</h2>
            <div className={styles.cardContent}>
              <div className={styles.clientAvatar}>
                {clientData.name
                  ? clientData.name.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <div className={styles.clientInfo}>
                <p className={styles.clientName}>{clientData.name}</p>
                <p className={styles.clientDetail}>
                  <span className={styles.label}>{t("ContactNo")}:</span>{" "}
                  {clientData.contact_no}
                </p>
                <p className={styles.clientDetail}>
                  <span className={styles.label}>{t("Email")}:</span>{" "}
                  {clientData.email}
                </p>
                {clientData.profession && (
                  <p className={styles.clientDetail}>
                    <span className={styles.label}>{t("Profession")}:</span>{" "}
                    {clientData.profession}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Case Details Card */}
        {caseDetails && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              {t("CaseNo")} {caseDetails.case_no}
            </h2>
            <div className={styles.cardContent}>
              <div className={styles.caseInfo}>
                <p className={styles.caseDetail}>
                  <span className={styles.label}>{t("CaseType")}</span>
                  {caseTypeData ? caseTypeData.case_type : "Loading..."}
                </p>
                <p className={styles.caseDetail}>
                  <span className={styles.label}>{t("OpenedDate")}</span>
                  {formatDate(caseDetails.opened_date)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs for Status Quo and Tasks */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "status" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("status")}
          >
            {t("StatusQuo")}
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "tasks" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            {t("Tasks/steps")}
          </button>
        </div>

        <div className={styles.tabContent}>
          {/* Status Quo Tab Content */}
          {activeTab === "status" && (
            <div className={styles.statusContent}>
            {currentUpdate ? (
              <div className={styles.statusCard}>
                <div className={styles.statusHeader}>
                  <h3 className={styles.statusTitle}>Status Quo</h3>
                </div>

                <div className={styles.dateGrid}>
                  <div className={styles.dateBlock}>
                    <div className={styles.dateCard}>
                      <div className={styles.dateLabel}>
                        Previous Date
                      </div>
                      <div className={styles.dateValue}>
                        <Calendar
                          size={18}
                          className={styles.dateIcon}
                        />
                        {formatDate(currentUpdate.previous_date)}
                      </div>
                    </div>
                  </div>

                  <div className={styles.dateBlock}>
                    <div className={styles.dateCard}>
                      <div className={styles.dateLabel}>Next Date</div>
                      <div className={styles.dateValue}>
                        <Calendar
                          size={18}
                          className={styles.dateIcon}
                        />
                        {formatDate(currentUpdate.next_date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Calendar size={48} className={styles.emptyIcon} />
                <p>{t("NoUpdatesFound")}</p>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Tasks Tab Content */}
        {activeTab === "tasks" &&
          (tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.client_case_task_id}
                className={`${styles.taskCard}`}
              >
                <div className={styles.taskContent}>
                  <h3>Task Name: {task.client_case_task}</h3>
                  <div className={styles.taskMeta}>
                    <span className={styles.taskDeadline}>
                      <Calendar size={14} /> {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>{t("NoTasksFound")}</p>
          ))}
      </div>
    </div>
  );
};

export default ClientSeeView;
