import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Trainer profile page to view and edit profile
 */
const TrainerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    specialties: '',
    certifications: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/trainers/');
      // Find profile for current user
      const myProfile = response.data.find((t) => t.user_id === user?.id);
      if (myProfile) {
        setProfile(myProfile);
        setFormData({
          bio: myProfile.bio || '',
          specialties: myProfile.specialties || '',
          certifications: myProfile.certifications || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/api/trainers/${profile.id}`, formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="info-banner">
          <p>No trainer profile found. Contact an administrator to create your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {editing ? (
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Bio</label>
              <textarea
                className="input"
                rows="4"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Specialties</label>
              <input
                type="text"
                className="input"
                value={formData.specialties}
                onChange={(e) =>
                  setFormData({ ...formData, specialties: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Certifications</label>
              <textarea
                className="input"
                rows="3"
                value={formData.certifications}
                onChange={(e) =>
                  setFormData({ ...formData, certifications: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    bio: profile.bio || '',
                    specialties: profile.specialties || '',
                    certifications: profile.certifications || '',
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">👨‍🏫</div>
            <div>
              <h2>{user?.full_name}</h2>
              <p className="text-secondary">{user?.email}</p>
            </div>
          </div>

          <div className="profile-section">
            <h3>Bio</h3>
            <p>{profile.bio || 'No bio provided'}</p>
          </div>

          <div className="profile-section">
            <h3>Specialties</h3>
            <p>{profile.specialties || 'No specialties listed'}</p>
          </div>

          <div className="profile-section">
            <h3>Certifications</h3>
            <p>{profile.certifications || 'No certifications listed'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
