import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Member membership page to view membership status
 */
const MemberMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemberships();
    fetchPlans();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/memberships/');
      setMemberships(response.data);
    } catch (err) {
      setError('Failed to load membership');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/memberships/plans');
      setPlans(response.data);
    } catch (err) {
      console.error('Failed to load plans', err);
    }
  };

  const activeMembership = memberships.find((m) => m.status === 'active');

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Membership</h1>
        <p>View your membership status and available plans</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {activeMembership ? (
        <div className="membership-card">
          <h2>Active Membership</h2>
          <div className="membership-details">
            <div className="membership-info">
              <p>
                <strong>Plan ID:</strong> {activeMembership.plan_id}
              </p>
              <p>
                <strong>Start Date:</strong>{' '}
                {new Date(activeMembership.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{' '}
                {new Date(activeMembership.end_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-badge ${activeMembership.status}`}>
                  {activeMembership.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="info-banner">
          <p>You don't have an active membership. Contact an administrator to get started!</p>
        </div>
      )}

      <div className="section-header">
        <h2>Available Membership Plans</h2>
      </div>

      <div className="cards-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <div className="plan-price">${plan.price / 100}</div>
            <p className="plan-duration">{plan.duration_days} days</p>
            {plan.description && <p className="plan-description">{plan.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberMembership;
