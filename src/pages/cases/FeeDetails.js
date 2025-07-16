import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './FeeDetails.module.css'; 
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMoneyBillWave, faClipboard, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const FeeDetails = () => {
  const { t } = useTranslation();
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [newFee, setNewFee] = useState({ date: '', amount: '', purpose: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle adding a new fee detail
  const handleAddFee = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('fee_details').insert([
        { 
          case_id: caseId,
          date: newFee.date,
          amount: parseFloat(newFee.amount),
          purpose: newFee.purpose 
        }
      ]);

      if (error) throw error;

      // Redirect back to Case Details page after successful addition
      navigate(`/case-details/${caseId}`);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };



  return (
    <div className={styles.feeDetailsContainer}>
      <div className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={()=> navigate(-1) }
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className={styles.pageTitle}>{t('AddFeeDetails')}</h1>
      </div>

      {error && (
        <div className={styles.errorNotification}>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.formCard}>
        <form onSubmit={handleAddFee}>
          <div className={styles.formContent}>
            <div className={styles.formGroup}>
              <label htmlFor="feeDate">
                <FontAwesomeIcon icon={faCalendarAlt} className={styles.inputIcon} />
                {t('Date')}
              </label>
              <input 
                id="feeDate"
                type="date" 
                value={newFee.date} 
                onChange={(e) => setNewFee({ ...newFee, date: e.target.value })} 
                required
                className={styles.dateInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="feeAmount">
                <FontAwesomeIcon icon={faMoneyBillWave} className={styles.inputIcon} />
                {t('Amount')}
              </label>
              <input 
                id="feeAmount"
                type="number" 
                value={newFee.amount} 
                onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })} 
                placeholder={t('EnterAmount')} 
                required
                className={styles.numberInput}
                min={0}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="feePurpose">
                <FontAwesomeIcon icon={faClipboard} className={styles.inputIcon} />
                {t('Purpose')}
              </label>
              <input 
                id="feePurpose"
                type="text" 
                value={newFee.purpose} 
                onChange={(e) => setNewFee({ ...newFee, purpose: e.target.value })} 
                placeholder={t('EnterPurpose')}
                required
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={()=>navigate(-1) }
            >
              {t('Cancel')}
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? t('Adding') : t('Add')}
              <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeDetails;