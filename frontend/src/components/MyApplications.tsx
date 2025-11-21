import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Application, User } from '../types';
import './MyApplications.css';

interface MyApplicationsProps {
  currentUser: User;
}

const MyApplications: React.FC<MyApplicationsProps> = ({ currentUser }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Application[]>(
        `${API_URL}/api/applications?email=${currentUser.email}`
      );
      setApplications(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      submitted: { color: '#3498db', label: 'Submitted', icon: '📤' },
      under_review: { color: '#f39c12', label: 'Under Review', icon: '👀' },
      interview: { color: '#9b59b6', label: 'Interview', icon: '🗓️' },
      accepted: { color: '#27ae60', label: 'Accepted', icon: '✅' },
      rejected: { color: '#e74c3c', label: 'Rejected', icon: '❌' },
    };

    const badge = badges[status] || badges.submitted;
    return (
      <span className="status-badge" style={{ background: badge.color }}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="my-applications-container">
        <div className="loading">Loading your applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-applications-container">
        <div className="error">❌ {error}</div>
      </div>
    );
  }

  return (
    <div className="my-applications-container">
      <div className="applications-header">
        <div className="header-content">
          <div>
            <h2>📋 My Applications</h2>
            <p>Track the status of your job applications</p>
          </div>
          <button onClick={fetchApplications} className="btn-refresh" disabled={loading}>
            {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Applications Yet</h3>
          <p>You haven't submitted any applications. Start by applying for a position!</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="card-header">
                <h3>{app.position}</h3>
                {getStatusBadge(app.status)}
              </div>
              <div className="card-body">
                <div className="card-detail">
                  <span className="detail-label">Applied:</span>
                  <span className="detail-value">{formatDate(app.createdAt)}</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(app.updatedAt)}</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">CV:</span>
                  <span className="detail-value">📄 {app.cvFilename}</span>
                </div>
                {app.coverLetter && (
                  <div className="card-section">
                    <span className="detail-label">Cover Letter:</span>
                    <p className="cover-letter-preview">{app.coverLetter.substring(0, 150)}{app.coverLetter.length > 150 ? '...' : ''}</p>
                  </div>
                )}
                {app.notes && (
                  <div className="card-notes">
                    <div className="notes-header">
                      <span className="detail-label">💬 Recruiter Feedback:</span>
                    </div>
                    <p className="notes-content">{app.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

