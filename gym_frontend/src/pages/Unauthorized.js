import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

// PUBLIC_INTERFACE
/**
 * Unauthorized access page
 */
const Unauthorized = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🚫</h1>
          <h2>Unauthorized Access</h2>
          <p>You don't have permission to access this page.</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
