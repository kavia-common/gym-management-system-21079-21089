import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Member classes browsing and booking page
 */
const MemberClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/classes/');
      // Filter future classes
      const futureClasses = response.data.filter(
        (cls) => new Date(cls.start_time) > new Date()
      );
      setClasses(futureClasses);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = async (classId) => {
    setError('');
    setSuccess('');

    try {
      await api.post('/api/bookings/', { class_id: classId });
      setSuccess('Class booked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book class');
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Browse Classes</h1>
        <p>Find and book classes that fit your schedule</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

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
              {cls.room && (
                <p>
                  <strong>📍 Room:</strong> {cls.room}
                </p>
              )}
              <p>
                <strong>👨‍🏫 Trainer:</strong> #{cls.trainer_id}
              </p>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => handleBookClass(cls.id)}
              disabled={(cls.booked_count || 0) >= cls.capacity}
            >
              {(cls.booked_count || 0) >= cls.capacity ? 'Full' : 'Book Class'}
            </button>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="empty-state">
          <p>No upcoming classes available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default MemberClasses;
