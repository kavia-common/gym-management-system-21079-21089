import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Admin dashboard showing gym metrics and overview
 */
const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/admin');
      setMetrics(response.data);
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
        <h1>Admin Dashboard</h1>
        <p>Overview of gym operations and metrics</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Members</h3>
            <p className="metric-value">{metrics?.total_members || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💳</div>
          <div className="metric-content">
            <h3>Active Memberships</h3>
            <p className="metric-value">{metrics?.active_memberships || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏋️</div>
          <div className="metric-content">
            <h3>Total Classes</h3>
            <p className="metric-value">{metrics?.total_classes || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👨‍🏫</div>
          <div className="metric-content">
            <h3>Trainers</h3>
            <p className="metric-value">{metrics?.total_trainers || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <h3>Today's Bookings</h3>
            <p className="metric-value">{metrics?.today_bookings || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Revenue (Month)</h3>
            <p className="metric-value">${(metrics?.monthly_revenue || 0) / 100}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <a href="/classes" className="btn btn-primary">
              📅 Manage Classes
            </a>
            <a href="/trainers" className="btn btn-primary">
              👨‍🏫 Manage Trainers
            </a>
            <a href="/memberships" className="btn btn-primary">
              💳 Manage Memberships
            </a>
            <a href="/bookings" className="btn btn-primary">
              📋 View Bookings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
