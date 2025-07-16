import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './RivalParty.module.css'; // Updated to use CSS modules
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faPhone, faMapPin, faBalanceScale, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

const RivalParty = () => {
  const { t } = useTranslation();
  const { caseId, lawyerId } = useParams();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [gsDivision, setGsDivion] = useState('');
  const [rivalCounsel, setRivalCounsel] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Validate required fields
      const { data, error: OppositePartyError } = await supabase
        .from('opposite_parties')
        .insert([
          {
            name,
            address,
            contact_no: contactNo,
            gs_division: gsDivision,
            rival_counsel: rivalCounsel,
            
          },
        ])
        .select('*')
        .single();
  
      if (OppositePartyError) {
        throw new Error(OppositePartyError.message);
      }
  
      if (!data || !data.oppositeparty_id) {
        throw new Error("Failed to retrieve the opposite party ID.");
      }
  
      // Insert into case_oppositeparty table
      const { error: caseOppositePartyError } = await supabase
        .from('case_oppositeparty')
        .insert([
          {
            case_id: caseId,
            oppositeparty_id: data.oppositeparty_id,
          },
        ]);
  
      if (caseOppositePartyError) {
        throw new Error(caseOppositePartyError.message);
      }
  
      setSuccess('Rival Party added successfully!');
      resetForm();
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(-1);
      }, 800);
      
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setAddress('');
    setContactNo('');
    setGsDivion(''); 
    setRivalCounsel('');
  };

  // Function to go back
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={handleBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className={styles.pageTitle}>{t('AddRivalPartyDetails')}</h2>
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

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                {t('Name')}
              </label>
              <input 
                type="text" 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className={styles.textInput}
                placeholder={t('EnterName')}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.inputIcon} />
                {t('Address')}
              </label>
              <input 
                type="text" 
                id="address"
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className={styles.textInput}
                placeholder={t('EnterAddress')}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactNo">
                <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
                {t('Contact_No')}
              </label>
              <input 
                type="text" 
                id="contactNo"
                value={contactNo} 
                onChange={(e) => setContactNo(e.target.value)} 
                className={styles.textInput}
                placeholder={t('EnterContactNumber')}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gsDivision">
                <FontAwesomeIcon icon={faMapPin} className={styles.inputIcon} />
                {t('GSDivision')}
              </label>
              <input 
                type="text" 
                id="gsDivision"
                value={gsDivision} 
                onChange={(e) => setGsDivion(e.target.value)} 
                required 
                className={styles.textInput}
                placeholder={t('EnterGSDivision')}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rivalCounsel">
                <FontAwesomeIcon icon={faBalanceScale} className={styles.inputIcon} />
                {t('RivalCounsel')}
              </label>
              <input 
                type="text" 
                id="rivalCounsel"
                value={rivalCounsel} 
                onChange={(e) => setRivalCounsel(e.target.value)} 
                className={styles.textInput}
                placeholder={t('EnterRivalCounsel')}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={handleBack}
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

export default RivalParty;