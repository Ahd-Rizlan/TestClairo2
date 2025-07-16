import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Task.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faCalendarAlt, 
  faCalendarCheck,
  faArrowLeft, 
  faPlus, 
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const TaskForm = () => {
  const { t } = useTranslation();
  const { caseId } = useParams();
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('started');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate inputs before sending
      if (!taskName || !caseId) {
        throw new Error('All fields are required.');
      }

      // Insert data into Supabase for tasks including case_id
      const { error: taskError } = await supabase.from('tasks').insert([
        {
          task_name: taskName,
          start_date: startDate,
          end_date: endDate,
          status,
          case_id: caseId,
        },
      ]);

      if (taskError) {
        throw new Error(`Failed to save task: ${taskError.message}`);
      }

      setSuccess('Task added successfully!');
      
      // Navigate after success, but still inside the try block
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(true);
    }
  };

  // Resetting form fields
  const resetForm = () => {
    setTaskName('');
    setStartDate('');
    setEndDate('');
    setStatus('started');
  };

  // Function to go back
  const handleBack = () => {
    navigate(-1);
  };

  // Get status icon based on current status
  const getStatusIcon = (statusValue) => {
    switch(statusValue) {
      case 'completed':
        return faCheck;
      case 'in-progress':
      case 'started':
        return faClipboardList;
      default:
        return faClipboardList;
    }
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
        <h2 className={styles.pageTitle}>{t('AddTask')}</h2>
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

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t('Loading')}</p>
        </div>
      ) : (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContent}>
 
              
              {/* Step Field */}
              <div className={styles.formGroup}>
                <label htmlFor="taskName">
                  <FontAwesomeIcon icon={faClipboardList} className={styles.inputIcon} />
                  {t('StepName')}
                </label>
                <input 
                  type="text" 
                  id="taskName"
                  value={taskName} 
                  onChange={(e) => setTaskName(e.target.value)} 
                  required 
                  className={styles.textInput}
                  placeholder={t('EnterTaskName')}
                />
              </div>

              {/* Start Date Field */}
              <div className={styles.formGroup}>
                <label htmlFor="startDate">
                  <FontAwesomeIcon icon={faCalendarAlt} className={styles.inputIcon} />
                  {t('StartDate')}
                </label>
                <input 
                  type="date" 
                  id="startDate"
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className={styles.dateInput}
                />
              </div>

              {/* Deadline Field */}
              <div className={styles.formGroup}>
                <label htmlFor="endDate">
                  <FontAwesomeIcon icon={faCalendarCheck} className={styles.inputIcon} />
                  {t('Deadline')}
                </label>
                <input 
                  type="date" 
                  id="endDate"
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  required 
                  className={styles.dateInput}
                />
              </div>

              {/* Status Field */}
              <div className={styles.formGroup}>
                <label htmlFor="status">
                  <FontAwesomeIcon icon={getStatusIcon(status)} className={styles.inputIcon} />
                  {t('Status')}
                </label>
                <select 
                  id="status"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className={styles.selectInput}
                > 
                  <option value="started">{t('Started')}</option>
                  <option value="in-progress">{t('InProgress')}</option>
                  <option value="completed">{t('Completed')}</option>
                  <option value="on hold">{t('OnHold')}</option>
                  <option value="canceled">{t('Canceled')}</option>
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.resetButton}
                onClick={resetForm}
              >
                {t('Reset')}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
              >
                {t('Cancel')}
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? t('Adding') : t('Add')}
                <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskForm;