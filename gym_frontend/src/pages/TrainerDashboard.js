import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Trainer dashboard showing assigned classes and schedule
 */
const TrainerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/trainer');
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <p>Manage your classes and view your schedule</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🏋️</div>
          <div className="metric-content">
            <h3>My Classes</h3>
            <p className="metric-value">{data?.total_classes || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <h3>Today's Classes</h3>
            <p className="metric-value">{data?.today_classes || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Students</h3>
            <p className="metric-value">{data?.total_students || 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/trainer/classes" className="btn btn-primary">
              🏋️ View My Classes
            </Link>
            <Link to="/trainer/profile" className="btn btn-primary">
              👤 Edit Profile
            </Link>
          </div>
        </div>

        {data?.upcoming_classes && data.upcoming_classes.length > 0 && (
          <div className="section-card">
            <h2>Upcoming Classes</h2>
            <div className="classes-list">
              {data.upcoming_classes.slice(0, 5).map((cls) => (
                <div key={cls.id} className="class-item">
                  <div>
                    <h4>{cls.title}</h4>
                    <p className="text-secondary">
                      {new Date(cls.start_time).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="badge">{cls.booked_count}/{cls.capacity} booked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
