import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

// PUBLIC_INTERFACE
/**
 * Main layout component with sidebar navigation
 */
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ];

    if (user.role === 'admin') {
      return [
        ...commonItems,
        { path: '/memberships', label: 'Memberships', icon: '💳' },
        { path: '/classes', label: 'Classes', icon: '🏋️' },
        { path: '/trainers', label: 'Trainers', icon: '👨‍🏫' },
        { path: '/bookings', label: 'Bookings', icon: '📅' },
      ];
    } else if (user.role === 'trainer') {
      return [
        ...commonItems,
        { path: '/trainer/classes', label: 'My Classes', icon: '🏋️' },
        { path: '/trainer/profile', label: 'My Profile', icon: '👤' },
      ];
    } else {
      return [
        ...commonItems,
        { path: '/member/classes', label: 'Browse Classes', icon: '🏋️' },
        { path: '/member/bookings', label: 'My Bookings', icon: '📅' },
        { path: '/member/membership', label: 'My Membership', icon: '💳' },
      ];
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Gym Manager</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-outline logout-btn">
            {sidebarOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          
          <div className="header-user">
            <span className="user-name">{user?.full_name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
