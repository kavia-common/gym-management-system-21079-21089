import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Memberships management page for admin
 */
const Memberships = () => {
  const [plans, setPlans] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    duration_days: 30,
    price: 0,
    features: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
    fetchMemberships();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/memberships/plans');
      setPlans(response.data);
    } catch (err) {
      console.error('Failed to load plans', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberships = async () => {
    try {
      const response = await api.get('/api/memberships/');
      setMemberships(response.data);
    } catch (err) {
      console.error('Failed to load memberships', err);
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = {
        ...planForm,
        price: parseInt(planForm.price * 100), // Convert to cents
      };

      if (editingPlan) {
        await api.put(`/api/memberships/plans/${editingPlan.id}`, data);
      } else {
        await api.post('/api/memberships/plans', data);
      }

      setShowPlanForm(false);
      setEditingPlan(null);
      resetPlanForm();
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save plan');
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      duration_days: plan.duration_days,
      price: plan.price / 100, // Convert from cents
      features: plan.features || '',
    });
    setShowPlanForm(true);
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await api.delete(`/api/memberships/plans/${id}`);
      fetchPlans();
    } catch (err) {
      setError('Failed to delete plan');
    }
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: '',
      description: '',
      duration_days: 30,
      price: 0,
      features: '',
    });
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Memberships Management</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Membership Plans
        </button>
        <button
          className={`tab ${activeTab === 'memberships' ? 'active' : ''}`}
          onClick={() => setActiveTab('memberships')}
        >
          Active Memberships
        </button>
      </div>

      {activeTab === 'plans' && (
        <>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                resetPlanForm();
                setEditingPlan(null);
                setShowPlanForm(!showPlanForm);
              }}
            >
              {showPlanForm ? 'Cancel' : '+ Add Plan'}
            </button>
          </div>

          {showPlanForm && (
            <div className="form-card">
              <h2>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
              <form onSubmit={handlePlanSubmit} className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Plan Name *</label>
                    <input
                      type="text"
                      className="input"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration (days) *</label>
                    <input
                      type="number"
                      className="input"
                      min="1"
                      value={planForm.duration_days}
                      onChange={(e) => setPlanForm({ ...planForm, duration_days: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      step="0.01"
                      value={planForm.price}
                      onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Features (JSON or text)</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={planForm.features}
                    onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </form>
            </div>
          )}

          <div className="cards-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <h3>{plan.name}</h3>
                <div className="plan-price">${plan.price / 100}</div>
                <p className="plan-duration">{plan.duration_days} days</p>
                {plan.description && <p className="plan-description">{plan.description}</p>}
                <div className="plan-actions">
                  <button className="btn btn-outline" onClick={() => handleEditPlan(plan)}>
                    Edit
                  </button>
                  <button className="btn-icon" onClick={() => handleDeletePlan(plan.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {plans.length === 0 && (
            <div className="empty-state">
              <p>No plans found. Create your first membership plan!</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'memberships' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Plan ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>{membership.member_id}</td>
                  <td>{membership.plan_id}</td>
                  <td>{new Date(membership.start_date).toLocaleDateString()}</td>
                  <td>{new Date(membership.end_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${membership.status}`}>
                      {membership.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {memberships.length === 0 && (
            <div className="empty-state">
              <p>No active memberships found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Memberships;
