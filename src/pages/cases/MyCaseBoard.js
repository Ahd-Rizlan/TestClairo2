import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./MyCaseBoard.module.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const CaseBoard = ({ userInfo }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [caseTypes, setCaseTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get lawyer ID from different possible sources
  const queryParams = new URLSearchParams(location.search);
  const queryLawyerId = queryParams.get("lawyerId");
  const lawyerId =
    queryLawyerId || userInfo?.lawyer_id || localStorage.getItem("lawyerId");

  // Fetch all cases and case types when the component mounts
  useEffect(() => {
    fetchCasesAndTypes();
  }, []);

  const fetchCasesAndTypes = async () => {
    try {
      // setLoading(true);

      // Build query to fetch cases
      const query = supabase
        .from("cases")
        .select("*")
        .eq("lawyer_id", lawyerId);

      const { data: caseData, error: caseError } = await query;

      if (caseError) {
        setError(caseError.message);
      } else {
        setCases(caseData);
        setFilteredCases(caseData);
      }

      // Fetch all case types
      const { data: typeData, error: typeError } = await supabase
        .from("case_types")
        .select("*");

      if (typeError) {
        setError(typeError.message);
      } else {
        setCaseTypes(typeData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    filterCases(value, selectedTypes);
  };

  // Handle case type selection change
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    const newSelectedTypes = checked
      ? [...selectedTypes, value]
      : selectedTypes.filter((typeId) => typeId !== value);

    setSelectedTypes(newSelectedTypes);
    filterCases(searchInput, newSelectedTypes);
  };

  // Filter cases based on search input and selected types
  const filterCases = (searchValue, selectedTypes) => {
    let filtered = cases;

    if (searchValue) {
      filtered = filtered.filter((caseItem) =>
        caseItem.case_no.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (selectedTypes.length > 0) {
      // Create a string of selected types to check against case numbers
      const selectedLetters = selectedTypes
        .map((typeId) => typeId.trim())
        .join("");
      filtered = filtered.filter((caseItem) =>
        [...caseItem.case_no].some((letter) => selectedLetters.includes(letter))
      );
    }

    setFilteredCases(filtered);
  };

  return (
    <div className={styles.caseBoardContainer}>
      <div className={styles.header}>
        {/* <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className={styles.headerIcon} />
        </button> */}
        <h2>{t("MyCases")}</h2>
        <div></div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t("loading")}</p>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className={styles.searchFilterContainer}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchInput}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <FontAwesomeIcon icon={faSearch} /> {t("search")}
              </button>
            </div>

            {/* Case Type Filter */}
            <div className={styles.caseTypeFilter}>
              <h3>{t("filter_case_type")}</h3>
              <div className={styles.checkboxGrid}>
                {caseTypes.map((type) => (
                  <div
                    key={type.case_type_id}
                    className={styles.checkboxContainer}
                  >
                    <input
                      type="checkbox"
                      id={type.case_type_id}
                      value={type.case_type_id}
                      checked={selectedTypes.includes(type.case_type_id)}
                      onChange={handleTypeChange}
                    />
                    <label htmlFor={type.case_type_id}>{type.case_type}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Case Button */}
          <button
            onClick={() => navigate("/case/add")}
            className={styles.addCaseButton}
          >
            <FontAwesomeIcon icon={faPlus} /> {t("add_case")}
          </button>

          {/* Case Cards */}
          <div className={styles.caseCards}>
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <Link
                  key={caseItem.case_id}
                  to={`/case-details/${caseItem.case_id}`}
                  className={styles.caseCard}
                >
                  <h3>{caseItem.case_no}</h3>
                  <p>
                    <strong>{t("opened_date")}:</strong>{" "}
                    {new Date(caseItem.opened_date).toLocaleDateString()}
                  </p>
                </Link>
              ))
            ) : (
              <div className={styles.noCases}>
                <p>{t("No cases found")}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CaseBoard;
