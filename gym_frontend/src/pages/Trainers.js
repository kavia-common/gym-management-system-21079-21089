import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Trainers management page for admin
 */
const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerClasses, setTrainerClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/trainers/');
      setTrainers(response.data);
    } catch (err) {
      setError('Failed to load trainers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerClasses = async (trainerId) => {
    try {
      const response = await api.get(`/api/trainers/${trainerId}/classes`);
      setTrainerClasses(response.data);
    } catch (err) {
      console.error('Failed to load trainer classes', err);
    }
  };

  const handleViewDetails = async (trainer) => {
    setSelectedTrainer(trainer);
    await fetchTrainerClasses(trainer.id);
  };

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;

    try {
      await api.delete(`/api/trainers/${id}`);
      fetchTrainers();
      if (selectedTrainer?.id === id) {
        setSelectedTrainer(null);
      }
    } catch (err) {
      setError('Failed to delete trainer');
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Trainers Management</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="cards-grid">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <div className="trainer-avatar">👨‍🏫</div>
            <h3>Trainer #{trainer.user_id}</h3>
            {trainer.specialties && (
              <p className="trainer-specialties">
                <strong>Specialties:</strong> {trainer.specialties}
              </p>
            )}
            {trainer.bio && <p className="trainer-bio">{trainer.bio}</p>}
            <div className="trainer-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(trainer)}
              >
                View Classes
              </button>
              <button
                className="btn-icon"
                onClick={() => handleDeleteTrainer(trainer.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {trainers.length === 0 && (
        <div className="empty-state">
          <p>No trainers found.</p>
        </div>
      )}

      {selectedTrainer && (
        <div className="modal-overlay" onClick={() => setSelectedTrainer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trainer #{selectedTrainer.user_id} Classes</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedTrainer(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {trainerClasses.length > 0 ? (
                <div className="classes-list">
                  {trainerClasses.map((cls) => (
                    <div key={cls.id} className="class-item">
                      <div>
                        <h4>{cls.title}</h4>
                        <p className="text-secondary">
                          {new Date(cls.start_time).toLocaleString()}
                        </p>
                        {cls.room && <p className="text-secondary">Room: {cls.room}</p>}
                      </div>
                      <span className="badge">
                        {cls.booked_count || 0}/{cls.capacity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No classes assigned to this trainer.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;
