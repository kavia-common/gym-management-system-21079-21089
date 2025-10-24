import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Trainer classes page to view assigned classes
 */
const TrainerClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchTrainerClasses();
    }
  }, [user]);

  const fetchTrainerClasses = async () => {
    try {
      setLoading(true);
      // Get all classes and filter by current user
      const response = await api.get('/api/classes/');
      // In a real scenario, we'd need the trainer ID from the trainer profile
      setClasses(response.data);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Classes</h1>
        <p>View and manage your assigned classes</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="cards-grid">
        {classes.map((cls) => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <h3>{cls.title}</h3>
              <span className="badge">
                {cls.booked_count || 0}/{cls.capacity}
              </span>
            </div>
            {cls.description && <p className="class-description">{cls.description}</p>}
            <div className="class-details">
              <p>
                <strong>📅 Time:</strong>{' '}
                {new Date(cls.start_time).toLocaleString()}
              </p>
              <p>
                <strong>⏰ Duration:</strong>{' '}
                {Math.round(
                  (new Date(cls.end_time) - new Date(cls.start_time)) / 60000
                )}{' '}
                minutes
              </p>
              {cls.room && (
                <p>
                  <strong>📍 Room:</strong> {cls.room}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="empty-state">
          <p>No classes assigned yet.</p>
        </div>
      )}
    </div>
  );
};

export default TrainerClasses;
