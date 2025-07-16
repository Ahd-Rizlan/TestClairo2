import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./ClientView.module.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  User,
  Briefcase,
  Scale,
  Calendar,
  Mail,
  Phone,
  Share2,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";

const ClientView = () => {
  const { t } = useTranslation();
  const { clientId, caseId } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [lawyerData, setLawyerData] = useState(null);
  const [caseTypeData, setCaseTypeData] = useState(null);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("status"); // 'status' or 'tasks'

  // State for managing tasks
  const [taskInput, setTaskInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAllTasks();

    fetchCaseDetails();
    fetchClientDetails();
    fetchTasks();
  }, []);

  const fetchCaseDetails = async () => {
    try {
      // setLoading(true);

      const { data: casesData, error: casesError } = await supabase
        .from("cases")
        .select("case_id, case_no, case_type_id, opened_date, lawyer_id")
        .eq("case_id", caseId)
        .single();

      if (casesError) throw new Error(casesError.message);

      if (casesData) {
        setCaseDetails(casesData);

        // Fetch lawyer details
        if (casesData.lawyer_id) {
          const { data: lawyerDetail, error: lawyerError } = await supabase
            .from("attorney_at_law")
            .select("*")
            .eq("lawyer_id", casesData.lawyer_id)
            .single();

          if (lawyerError) throw new Error(lawyerError.message);
          setLawyerData(lawyerDetail);
        }

        // Fetch updates
        if (casesData.case_id) {
          const { data: updateData, error: updateError } = await supabase
            .from("case_updates")
            .select("*")
            .eq("case_id", casesData.case_id);

          if (updateError) throw new Error(updateError.message);
          setUpdates(updateData);

          // Set most recent update
          if (updateData && updateData.length > 0) {
            const sortedUpdates = updateData.sort(
              (a, b) => new Date(b.previous_date) - new Date(a.previous_date)
            );
            setCurrentUpdate(sortedUpdates[0]);
          }
        }

        // Fetch case type
        if (casesData.case_type_id) {
          const { data: caseTypeDetail, error: caseTypeError } = await supabase
            .from("case_types")
            .select("*")
            .eq("id", casesData.case_type_id)
            .single();

          if (caseTypeError) throw new Error(caseTypeError.message);
          setCaseTypeData(caseTypeDetail);
        }
      } else {
        throw new Error("No cases found for this client.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientDetails = async () => {
    try {
      const { data: clientDetail, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("client_id", clientId)
        .single();

      if (clientError) throw new Error(clientError.message);
      setClientData(clientDetail);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      // fetch client_case_id using both clientId and caseId
      const { data: clientCaseEntry, error: clientCaseError } = await supabase
        .from("client_case")
        .select("client_case_id")
        .eq("client_id", clientId)
        .eq("case_id", caseId)
        .single();

      if (clientCaseError) throw new Error(clientCaseError.message);

      if (clientCaseEntry) {
        const clientCaseId = clientCaseEntry.client_case_id;

        // fetch tasks
        const { data: tasksData, error } = await supabase
          .from("client_case_task")
          .select("*")
          .eq("client_case_id", clientCaseId);

        if (error) throw new Error(error.message);
        setTasks(tasksData);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to fetch tasks: ${err.message}`);
    }
  };

  const handleAddTask = async () => {
    try {
      if (!taskInput || !deadlineInput) {
        alert("Please fill in both task and deadline.");
        return;
      }

      // Fetch client_case_id
      const { data: clientCaseEntry } = await supabase
        .from("client_case")
        .select("client_case_id")
        .eq("client_id", clientId)
        .eq("case_id", caseId)
        .single();

      if (clientCaseEntry) {
        const currentCaseId = clientCaseEntry.client_case_id;

        // Insert the new task
        const { error } = await supabase.from("client_case_task").insert({
          client_case_task: taskInput,
          deadline: deadlineInput,
          client_case_id: currentCaseId,
        });

        if (error) throw new Error(error.message);

        // Clear inputs
        setTaskInput("");
        setDeadlineInput("");

        // Refresh tasks
        fetchTasks();

        // Show success message
        setStatus("Task added successfully!");
        setTimeout(() => setStatus(""), 3000);
      } else {
        alert("No associated cases found for this client.");
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to add task: ${err.message}`);
    }
  };

  const fetchAllTasks = async () => {
    const { data, error } = await supabase.from("client_case_task").select("*");
    if (error) {
      setError(error.message);
    } else {
      setTasks(data);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const { error } = await supabase
        .from("client_case_task")
        .delete()
        .eq("client_case_task_id", taskId);
      if (error) {
        setError(error.message);
      } else {
        fetchTasks(); // Refresh the list after deletion
        setStatus("Task deleted successfully!");
        setTimeout(() => setStatus(""), 3000);
      }
    }
  };

  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/clientseeview/${clientId}/${caseId}`;
    const message = "Check out this case details:\n\n" + shareUrl;
    const phoneNumber = clientData.contact_no;

    if (!phoneNumber || !message) {
      alert("Invalid client contact number.");
      return;
    }

    //console.log(message);
    try {
        const response = await axios.post('http://localhost:5000/send-message', {
            phoneNumber,
            message,
        });
        setStatus('URL sent successfully!');
        setTimeout(() => setStatus(''), 3000);
    } catch (error) {
        console.error('Error sending URL:', error);
        setStatus('Failed to send URL.');
        setTimeout(() => setStatus(''), 3000);
    }
  };

  // Format dates for better display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status for task (overdue, upcoming, etc.)
  const getTaskStatus = (deadline) => {
    if (!deadline) return "no-deadline";

    const today = new Date();
    const deadlineDate = new Date(deadline);

    // Remove time from dates for comparison
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      return "overdue";
    } else if (deadlineDate.getTime() === today.getTime()) {
      return "today";
    } else {
      // Calculate days difference
      const diffTime = Math.abs(deadlineDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 3) {
        return "upcoming";
      } else {
        return "future";
      }
    }
  };

  return (
    <div className={styles.clientViewContainer}>
      <div className={styles.dashboardHeader}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label={t("Back")}
        >
          <FaArrowLeft className={styles.headerIcon} />
        </button>
        <h1 className={styles.dashboardTitle}>
          <User className={styles.headerIcon} />
          Client View
        </h1>
        <button className={styles.shareButton} onClick={handleShare}>
          <Share2 size={18} />
          Share with Client
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <div className={styles.statusMessage}>
          <CheckCircle size={18} />
          <span>{status}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorNotification}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <span>{t("Loading")}</span>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          <div className={styles.sidebarColumn}>
            {/* Client Details Card */}
            {clientData && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardHeaderTitle}>
                    <User size={20} />
                    <span>{t("ClientDetails")}</span>
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.clientProfile}>
                    <div className={styles.avatarContainer}>
                      <div className={styles.avatar}>
                        {clientData.name
                          ? clientData.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    </div>
                    <div className={styles.profileInfo}>
                      <h3 className={styles.profileName}>{clientData.name}</h3>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                          <Phone size={16} className={styles.contactIcon} />
                          <span>{clientData.contact_no}</span>
                        </div>
                        <div className={styles.contactItem}>
                          <Mail size={16} className={styles.contactIcon} />
                          <span>{clientData.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Case Details Card */}
            {caseDetails && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardHeaderTitle}>
                    <Briefcase size={20} />
                    <span>
                      {t("CaseNo")} {caseDetails.case_no}
                    </span>
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>{t("CaseType")}</span>
                      <span className={styles.infoValue}>
                        {caseTypeData ? caseTypeData.case_type : "Loading..."}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        {t("OpenedDate")}
                      </span>
                      <span className={styles.infoValue}>
                        {formatDate(caseDetails.opened_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attorney Details */}
            {lawyerData && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardHeaderTitle}>
                    <Scale size={20} />
                    <span>{t("AttorneyDetails")}</span>
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.lawyerProfile}>
                    <div className={styles.avatarContainer}>
                      <div
                        className={`${styles.avatar} ${styles.lawyerAvatar}`}
                      >
                        {lawyerData.name
                          ? lawyerData.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    </div>
                    <div className={styles.profileInfo}>
                      <h3 className={styles.profileName}>{lawyerData.name}</h3>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                          <Phone size={16} className={styles.contactIcon} />
                          <span>{lawyerData.contact_no}</span>
                        </div>
                        <div className={styles.contactItem}>
                          <Mail size={16} className={styles.contactIcon} />
                          <span>{lawyerData.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.mainColumn}>
            {/* Tabs for Status and Tasks */}
            <div className={styles.tabsCard}>
              <div className={styles.tabsHeader}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "status" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("status")}
                >
                  <Calendar size={18} />
                  <span>{t("StatusQuo")}</span>
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "tasks" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("tasks")}
                >
                  <ClipboardList size={18} />
                  <span>{t("Tasks/steps")}</span>
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

                {/* Tasks Tab Content */}
                {activeTab === "tasks" && (
                  <div className={styles.tasksContent}>
                    {/* Add Task Form */}
                    <div className={styles.addTaskCard}>
                      <h3 className={styles.formTitle}>{t("AddTask")}</h3>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          {/* <label>{t("StepName")}</label> */}
                          <input
                            type="text"
                            placeholder={t("Enter task description")}
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            className={styles.textInput}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          {/* <label>{t("Deadline")}</label> */}
                          <input
                            type="date"
                            value={deadlineInput}
                            onChange={(e) => setDeadlineInput(e.target.value)}
                            className={styles.dateInput}
                          />
                        </div>
                        <button
                          onClick={handleAddTask}
                          className={styles.addButton}
                        >
                          <Plus size={16} />
                          {t("Add")}
                        </button>
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className={styles.tasksListCard}>
                      <h3 className={styles.tasksListTitle}>
                        {t("ClientTasksHeading")}
                      </h3>

                      {tasks.length > 0 ? (
                        <div className={styles.tasksGrid}>
                          {tasks.map((task) => {
                            const taskStatus = getTaskStatus(task.deadline);
                            return (
                              <div
                                key={task.client_case_task_id}
                                className={`${styles.taskCard} ${styles[taskStatus]}`}
                              >
                                <div className={styles.taskContent}>
                                  <h4 className={styles.taskName}>
                                    {task.client_case_task}
                                  </h4>
                                  <div className={styles.taskMeta}>
                                    <span className={styles.taskDeadline}>
                                      <Calendar size={14} />
                                      {formatDate(task.deadline)}
                                    </span>
                                    <span
                                      className={`${styles.taskStatusBadge} ${styles[taskStatus]}`}
                                    >
                                      {taskStatus === "overdue"
                                        ? "Overdue"
                                        : taskStatus === "today"
                                        ? "Today"
                                        : taskStatus === "upcoming"
                                        ? "Soon"
                                        : "Scheduled"}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDelete(task.client_case_task_id)
                                  }
                                  className={styles.deleteButton}
                                  title={t("Delete")}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <ClipboardList
                            size={48}
                            className={styles.emptyIcon}
                          />
                          <p>{t("NoTasksFound")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientView;
