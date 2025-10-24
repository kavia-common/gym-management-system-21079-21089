import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Member dashboard showing personal memberships and bookings
 */
const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/member');
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
        <h1>My Dashboard</h1>
        <p>Welcome back! Here's your gym activity overview</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💳</div>
          <div className="metric-content">
            <h3>My Membership</h3>
            <p className="metric-value">{data?.membership_status || 'No Active'}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <h3>Upcoming Bookings</h3>
            <p className="metric-value">{data?.upcoming_bookings || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>Classes Attended</h3>
            <p className="metric-value">{data?.classes_attended || 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/member/classes" className="btn btn-primary">
              🏋️ Browse Classes
            </Link>
            <Link to="/member/bookings" className="btn btn-primary">
              📅 My Bookings
            </Link>
            <Link to="/member/membership" className="btn btn-primary">
              💳 My Membership
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
                  <span className="badge">{cls.room || 'TBA'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
