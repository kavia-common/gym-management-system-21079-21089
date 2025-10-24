import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Classes management page for admin
 */
const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    room: '',
    capacity: 20,
    start_time: '',
    end_time: '',
    trainer_id: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/classes/');
      setClasses(response.data);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/api/trainers/');
      setTrainers(response.data);
    } catch (err) {
      console.error('Failed to load trainers', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingClass) {
        await api.put(`/api/classes/${editingClass.id}`, formData);
      } else {
        await api.post('/api/classes/', formData);
      }
      
      setShowForm(false);
      setEditingClass(null);
      resetForm();
      fetchClasses();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save class');
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description || '',
      room: cls.room || '',
      capacity: cls.capacity,
      start_time: cls.start_time,
      end_time: cls.end_time,
      trainer_id: cls.trainer_id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await api.delete(`/api/classes/${id}`);
      fetchClasses();
    } catch (err) {
      setError('Failed to delete class');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      room: '',
      capacity: 20,
      start_time: '',
      end_time: '',
      trainer_id: '',
    });
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Classes Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setEditingClass(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Class'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room</label>
                <input
                  type="text"
                  className="input"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="input"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Trainer *</label>
                <select
                  className="input"
                  value={formData.trainer_id}
                  onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                  required
                >
                  <option value="">Select trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      Trainer #{trainer.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Room</th>
              <th>Trainer</th>
              <th>Start Time</th>
              <th>Capacity</th>
              <th>Booked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>
                  <strong>{cls.title}</strong>
                  {cls.description && <div className="text-secondary">{cls.description}</div>}
                </td>
                <td>{cls.room || 'N/A'}</td>
                <td>Trainer #{cls.trainer_id}</td>
                <td>{new Date(cls.start_time).toLocaleString()}</td>
                <td>{cls.capacity}</td>
                <td>{cls.booked_count || 0}</td>
                <td>
                  <div className="action-buttons-inline">
                    <button className="btn-icon" onClick={() => handleEdit(cls)}>
                      ✏️
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(cls.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {classes.length === 0 && (
          <div className="empty-state">
            <p>No classes found. Add your first class!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
