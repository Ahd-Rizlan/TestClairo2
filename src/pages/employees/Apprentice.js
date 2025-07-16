import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import for internationalization
import { FaUserGraduate, FaArrowLeft, FaTimes, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import styles from './Apprentice.module.css'; 

const Apprentice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    education: '',
    joinedDate: ''
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

 

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactNo: '',
      education: '',
      joinedDate: ''
    });
    setError(null);
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   // setLoading(true);
    setError(null);

    try {
      // Insert data into Supabase for apprentices
      const { error: apprenticeError } = await supabase.from('apprentice').insert([
        {
          name: formData.name,
          email: formData.email,
          contact_no: formData.contactNo,
          education: formData.education || null,
          joined_date: formData.joinedDate,
         
        },
      ]);

      if (apprenticeError) {
        throw new Error(apprenticeError.message);
      }

      setSuccess(t('ApprenticeAddedSuccessfully', 'Apprentice details added successfully!'));
      
      // Reset form after successful submission
      resetForm();
      
      // Navigate back to apprentice details page after short delay
      setTimeout(() => {
        navigate(`/employee-details/apprentice-details`);
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['form-container']}>
      <div className={styles['form-header']}>
        <button 
          className={styles['back-button']} 
          onClick={()=>navigate(-1)}
          aria-label={t('Back')}
        >
          <FaArrowLeft />
        </button>
        <h2><FaUserGraduate className={styles['header-icon']} /> {t('AddApprenticeDetails', 'Add Apprentice Details')}</h2>
      </div>

      {/* Notification area */}
      {error && (
        <div className={`${styles.notification} ${styles['error-notification']}`}>
          <FaTimes className={styles['notification-icon']} />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className={`${styles.notification} ${styles['success-notification']}`}>
          <span>{success}</span>
        </div>
      )}

      <div className={styles['card-container']}>
        <form onSubmit={handleSubmit} className={styles['form-card']}>
          <div className={`${styles['form-group']} ${focusedField === 'name' ? styles.focused : ''}`}>
            <label htmlFor="name">
              <FaUser className={styles['input-icon']} /> {t('Name', 'Name')}
            </label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              placeholder={t('EnterName', 'Enter apprentice name')}
              required 
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className={`${styles['form-group']} ${focusedField === 'email' ? styles.focused : ''}`}>
            <label htmlFor="email">
              <FaEnvelope className={styles['input-icon']} /> {t('Email', 'Email')}
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder={t('EnterEmail', 'Enter email address')}
              required
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className={`${styles['form-group']} ${focusedField === 'contactNo' ? styles.focused : ''}`}>
            <label htmlFor="contactNo">
              <FaPhone className={styles['input-icon']} /> {t('ContactNo', 'Contact Number')}
            </label>
            <input 
              type="text" 
              id="contactNo"
              name="contactNo"
              value={formData.contactNo} 
              onChange={handleChange} 
              placeholder={t('EnterContactNumber', 'Enter contact number')}
              required 
              onFocus={() => setFocusedField('contactNo')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className={`${styles['form-group']} ${focusedField === 'education' ? styles.focused : ''}`}>
            <label htmlFor="education">
              <FaGraduationCap className={styles['input-icon']} /> {t('Education', 'Education')} ({t('Optional', 'optional')})
            </label>
            <input 
              type="text" 
              id="education"
              name="education"
              value={formData.education} 
              onChange={handleChange} 
              placeholder={t('EnterEducation', 'Enter education details (optional)')}
              onFocus={() => setFocusedField('education')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className={`${styles['form-group']} ${focusedField === 'joinedDate' ? styles.focused : ''}`}>
            <label htmlFor="joinedDate">
              <FaCalendarAlt className={styles['input-icon']} /> {t('JoinedDate', 'Joined Date')}
            </label>
            <input 
              type="date" 
              id="joinedDate"
              name="joinedDate"
              value={formData.joinedDate} 
              onChange={handleChange} 
              required 
              onFocus={() => setFocusedField('joinedDate')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className={styles['form-actions']}>
            <button 
              type="button" 
              className={styles['secondary-button']}
              onClick={resetForm}
            >
              {t('Reset', 'Reset')}
            </button>
            <button 
              type="submit" 
              className={styles['primary-button']}
              disabled={loading}
            >
              {loading ? t('Adding', 'Adding...') : t('AddApprentice', 'Add Apprentice')}
              {loading && <span className={styles['button-spinner']}></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Apprentice;