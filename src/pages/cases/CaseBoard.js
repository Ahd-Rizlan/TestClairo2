import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./CaseBoard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const CaseBoard = () => {
  const { t } = useTranslation();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [caseTypes, setCaseTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCasesAndTypes();
  }, []);
  // Fetch all cases and case types when the component mounts
  const fetchCasesAndTypes = async () => {
    try {
      setLoading(true);

      //fetch alll cases and case types
      const { data: caseData, error: caseError } = await supabase
        .from("cases")
        .select("*");

      if (caseError) {
        setError(caseError.message);
      } else {
        setCases(caseData);
        setFilteredCases(caseData);
      }

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
    if (checked) {
      setSelectedTypes((prev) => [...prev, value]);
    } else {
      setSelectedTypes((prev) => prev.filter((typeId) => typeId !== value));
    }
    filterCases(
      searchInput,
      checked
        ? [...selectedTypes, value]
        : selectedTypes.filter((typeId) => typeId !== value)
    );
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
          <div className={styles.searchFilterSection}>
            <div className={styles.searchBar}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchInput}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
            </div>

            {/* Case Type Filter */}
            <div className={styles.caseTypeFilter}>
              <div className={styles.filterHeader}>
                <h3>{t("filter_case_type")}</h3>
              </div>
              <div className={styles.checkboxGroup}>
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
                      className={styles.checkbox}
                    />
                    <label
                      htmlFor={type.case_type_id}
                      className={styles.checkboxLabel}
                    >
                      {type.case_type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Case Button */}
          <div className={styles.actionButtonContainer}>
            <button
              onClick={() => navigate("/case/add")}
              className={styles.addButton}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
              {t("Add")}
            </button>
          </div>

          {/* Case Cards */}

          <div className={styles.caseCardGrid}>
            {filteredCases.length === 0 ? (
              <div className={styles.emptyState}>
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className={styles.emptyIcon}
                />
                <p>{t("No cases found")}</p>
              </div>
            ) : (
              filteredCases.map((caseItem) => (
                <Link
                  key={caseItem.case_id}
                  to={`/case-details/${caseItem.case_id}`}
                  className={styles.caseCard}
                >
                  <div className={styles.caseCardHeader}>
                    <h3>{caseItem.case_no}</h3>
                  </div>
                  <div className={styles.caseCardContent}>
                    <p>
                      <strong>{t("opened_date")}:</strong>
                      {caseItem.opened_date}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CaseBoard;
