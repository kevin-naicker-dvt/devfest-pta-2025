import React, { useState } from 'react';
import './App.css';
import { User } from './types';
import Navigation from './components/Navigation';
import ApplyForm from './components/ApplyForm';
import MyApplications from './components/MyApplications';
import RecruiterDashboard from './components/RecruiterDashboard';

type View = 'home' | 'apply' | 'my-applications' | 'recruiter-dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  // Mock users for demo
  const mockUsers = {
    applicant: {
      name: 'john.doe',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      role: 'applicant' as const,
    },
    recruiter: {
      name: 'jane.recruiter',
      email: 'jane.recruiter@company.com',
      fullName: 'Jane Recruiter',
      role: 'recruiter' as const,
    },
  };

  const handleRoleToggle = () => {
    if (!currentUser) {
      // First login - default to applicant
      setCurrentUser(mockUsers.applicant);
      setCurrentView('home');
    } else {
      // Toggle role
      const newUser =
        currentUser.role === 'applicant' ? mockUsers.recruiter : mockUsers.applicant;
      setCurrentUser(newUser);
      setCurrentView('home');
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleApplicationSuccess = () => {
    alert('✅ Application submitted successfully!');
    setCurrentView('my-applications');
  };

  return (
    <div className="App">
      <Navigation
        currentUser={currentUser}
        currentView={currentView}
        onViewChange={handleViewChange}
        onRoleToggle={handleRoleToggle}
      />

      <div className="main-content">
        {currentView === 'home' && (
          <div className="home-view">
            <div className="hero-section">
              <h1>🚀 Welcome to DevFest Recruitment</h1>
              <p className="hero-subtitle">
                Built for Google Developer Conference - Cloud-Native Recruitment Platform
              </p>

              {!currentUser ? (
                <div className="welcome-card">
                  <h2>Get Started</h2>
                  <p>
                    This is a demo application. Click "Login (Demo)" to simulate logging in as
                    either a job applicant or recruiter.
                  </p>
                  <button className="btn-primary" onClick={handleRoleToggle}>
                    🎭 Start Demo
                  </button>
                </div>
              ) : (
                <div className="welcome-card">
                  <h2>
                    Welcome, {currentUser.fullName}!{' '}
                    {currentUser.role === 'applicant' ? '👤' : '👔'}
                  </h2>
                  {currentUser.role === 'applicant' ? (
                    <>
                      <p>Ready to take the next step in your career?</p>
                      <button
                        className="btn-primary"
                        onClick={() => setCurrentView('apply')}
                      >
                        📝 Apply for a Position
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setCurrentView('my-applications')}
                      >
                        📋 View My Applications
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Manage and review job applications from candidates.</p>
                      <button
                        className="btn-primary"
                        onClick={() => setCurrentView('recruiter-dashboard')}
                      >
                        👔 Open Dashboard
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="tech-stack-home">
                <h3>Powered by Modern Tech Stack</h3>
                <div className="tech-grid">
                  <div className="tech-badge">
                    <span className="icon">⚛️</span>
                    <span>React + TypeScript</span>
                  </div>
                  <div className="tech-badge">
                    <span className="icon">🔷</span>
                    <span>NestJS</span>
                  </div>
                  <div className="tech-badge">
                    <span className="icon">🐘</span>
                    <span>PostgreSQL</span>
                  </div>
                  <div className="tech-badge">
                    <span className="icon">🐳</span>
                    <span>Docker</span>
                  </div>
                  <div className="tech-badge">
                    <span className="icon">☁️</span>
                    <span>Google Cloud</span>
                  </div>
                </div>
              </div>
            </div>

            <footer className="footer">
              <p>Built for Google Developer Conference - DevFest PTA 2025</p>
              <p className="repo-link">
                <a
                  href="https://github.com/kevin-naicker-dvt/devfest-pta-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📦 GitHub Repository
                </a>
              </p>
            </footer>
          </div>
        )}

        {currentView === 'apply' && currentUser?.role === 'applicant' && (
          <ApplyForm currentUser={currentUser} onSuccess={handleApplicationSuccess} />
        )}

        {currentView === 'my-applications' && currentUser?.role === 'applicant' && (
          <MyApplications currentUser={currentUser} />
        )}

        {currentView === 'recruiter-dashboard' && currentUser?.role === 'recruiter' && (
          <RecruiterDashboard />
        )}
      </div>
    </div>
  );
}

export default App;

