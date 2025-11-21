import React from 'react';
import { User } from '../types';
import './Navigation.css';

interface NavigationProps {
  currentUser: User | null;
  currentView: 'home' | 'apply' | 'my-applications' | 'recruiter-dashboard';
  onViewChange: (view: 'home' | 'apply' | 'my-applications' | 'recruiter-dashboard') => void;
  onRoleToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  currentView,
  onViewChange,
  onRoleToggle,
}) => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🚀 DevFest Recruitment</h2>
      </div>

      <div className="nav-links">
        <button
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => onViewChange('home')}
        >
          Home
        </button>

        {currentUser?.role === 'applicant' && (
          <>
            <button
              className={`nav-link ${currentView === 'apply' ? 'active' : ''}`}
              onClick={() => onViewChange('apply')}
            >
              Apply for Job
            </button>
            <button
              className={`nav-link ${currentView === 'my-applications' ? 'active' : ''}`}
              onClick={() => onViewChange('my-applications')}
            >
              My Applications
            </button>
          </>
        )}

        {currentUser?.role === 'recruiter' && (
          <button
            className={`nav-link ${currentView === 'recruiter-dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('recruiter-dashboard')}
          >
            Dashboard
          </button>
        )}
      </div>

      <div className="nav-user">
        {currentUser ? (
          <>
            <div className="user-info">
              <span className="user-role-badge">
                {currentUser.role === 'applicant' ? '👤' : '👔'}
              </span>
              <span className="user-name">{currentUser.fullName}</span>
            </div>
            <button className="btn-role-toggle" onClick={onRoleToggle}>
              Switch to {currentUser.role === 'applicant' ? 'Recruiter' : 'Applicant'}
            </button>
          </>
        ) : (
          <button className="btn-login" onClick={onRoleToggle}>
            Login (Demo)
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

