import React, { useState, useEffect } from "react"; // Importing React and hooks
import { supabase } from "../../supabaseClient"; // Importing Supabase client
import styles from "./ClientList.module.css"; // Importing CSS module for styling
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom for navigation
import { useTranslation } from "react-i18next"; // Importing useTranslation hook for internationalization
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesomeIcon for icons
import {
  faUserTie,
  faSearch,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"; // Importing FontAwesome icons
import { FaPlus } from "react-icons/fa"; // Importing FontAwesome icons
import { Pencil, Trash2 } from "lucide-react"; // Importing Lucide icons

const ClientList = ({}) => {
  const { t } = useTranslation(); // Hook for translation
  const [clients, setClients] = useState([]); // State to manage clients data initialized to an empty array
  const [error, setError] = useState(null); // State to manage error messages initialized to null
  const [totalClients, setTotalClients] = useState(0); // State to manage total clients count initialized to 0
  const [loading, setLoading] = useState(true); // State to manage loading status initialized to true
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search term initialized to an empty string
  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch clients from Supabase on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Fetch clients linked to this lawyer
      const { data } = await supabase.from("clients").select("*");
      setClients(data); // Set clients data to state took from supabase
      setTotalClients(data.length); // Set total clients count to state
    } catch (err) {
      setError(err.message); // Set error message to state
    } finally {
      setLoading(false); // Set loading status to false
    }
  };

  // Function to handle client deletion with confirmation and associated cases check
  const handleDelete = async (clientId) => {
    if (window.confirm(t("confirm_delete_client"))) {
      try {
        setLoading(true);
        //  Check if the client is associated with any cases
        const { data: associatedCases } = await supabase
          .from("client_case")
          .select("case_id")
          .eq("client_id", clientId);
        // If there are associated cases, fetch their details
        if (associatedCases && associatedCases.length > 0) {
          //  Retrieve case numbers from the cases table
          const caseIds = associatedCases.map((c) => c.case_id);
          const { data: caseDetails, error: detailsError } = await supabase
            .from("cases")
            .select("case_no")
            .in("case_id", caseIds);
          if (detailsError) throw detailsError;
          //  Create a message listing the associated case numbers
          const caseNumbers = caseDetails.map((c) => c.case_no).join(", ");
          alert(`${t("client_association_warning")}: ${caseNumbers}`);
          return;
          // Exit without deleting Because of associated cases
        }
        //  Proceed with deletion since there are no associated cases
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("client_id", clientId);
        // take clientId from the client list and  after delete it from supabase
        setClients(clients.filter((client) => client.client_id !== clientId));
        setTotalClients(totalClients - 1); // Decrease total clients count by 1
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      // Check if the client name, email, or profession includes the search term
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.profession &&
        client.profession.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.clientListContainer}>
      <div className={styles.header}>
        <h2>
          <FontAwesomeIcon icon={faUserTie} className={styles.headerIcon} />
          {t("Client_List")}
        </h2>
        <button
          onClick={() => navigate("/clients/add")}
          className={styles.addButton}
        >
          <FontAwesomeIcon icon={FaPlus} className={styles.buttonIcon} />
          {t("Add")}
        </button>
      </div>

      {/* Total Clients Overview */}
      <div className={styles.totalClientsCard}>
        <div className={styles.cardContent}>
          <h3>{t("TotalClients")}</h3>
          <div className={styles.clientCount}>{totalClients}</div>
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.notificationIcon}
          />
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("SearchClient")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("loading")}</p>
        </div>
      ) : (
        <>
          {filteredClients.length > 0 ? (
            <div className={styles.tableCard}>
              <div className={styles.tableContainer}>
                <table className={styles.clientTable}>
                  <thead>
                    <tr>
                      <th>{t("ClientName")}</th>
                      <th>{t("ContactNo")}</th>
                      <th>{t("Email")}</th>
                      <th>{t("Profession")}</th>
                      <th>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.client_id}>
                        <td>
                          <div className={styles.nameCell}>
                            <div className={styles.avatar}>
                              {client.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <span>{client.name}</span>
                          </div>
                        </td>
                        <td>{client.contact_no}</td>
                        <td>{client.email}</td>
                        <td>{client.profession || "-"}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() =>
                                navigate(`/clients/update/${client.client_id}`)
                              }
                              className={`${styles.actionButton} ${styles.editButton}`}
                              title={t("Update")}
                            >
                              <Pencil />
                            </button>
                            <button
                              onClick={() => handleDelete(client.client_id)}
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              title={t("Delete")}
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={styles.emptyStateCard}>
              <div className={styles.emptyState}>
                <FontAwesomeIcon
                  icon={faUserTie}
                  className={styles.emptyIcon}
                />
                <p>
                  {searchTerm
                    ? t("No Clients Matching Search")
                    : t("No Clients Found")}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientList;
