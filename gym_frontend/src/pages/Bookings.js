import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Bookings management page for admin
 */
const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings/');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.patch(`/api/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bookings Management</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Member ID</th>
              <th>Class ID</th>
              <th>Status</th>
              <th>Booked At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>{booking.member_id}</td>
                <td>{booking.class_id}</td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{new Date(booking.created_at).toLocaleString()}</td>
                <td>
                  {booking.status === 'confirmed' && (
                    <button
                      className="btn btn-outline"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="empty-state">
            <p>No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
