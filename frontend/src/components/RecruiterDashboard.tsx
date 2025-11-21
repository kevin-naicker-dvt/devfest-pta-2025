import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Application, ApplicationStats } from '../types';
import './RecruiterDashboard.css';

const RecruiterDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, statsRes] = await Promise.all([
        axios.get<Application[]>(`${API_URL}/api/applications`),
        axios.get<ApplicationStats>(`${API_URL}/api/applications/stats/summary`),
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplication = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
    setStatus(app.status);
  };

  const handleUpdateApplication = async () => {
    if (!selectedApp) return;

    try {
      await axios.put(`${API_URL}/api/applications/${selectedApp.id}`, {
        status,
        notes,
      });
      await fetchData();
      setSelectedApp(null);
    } catch (err) {
      console.error('Failed to update application:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      submitted: { color: '#3498db', label: 'Submitted' },
      under_review: { color: '#f39c12', label: 'Under Review' },
      interview: { color: '#9b59b6', label: 'Interview' },
      accepted: { color: '#27ae60', label: 'Accepted' },
      rejected: { color: '#e74c3c', label: 'Rejected' },
    };
    const badge = badges[status] || badges.submitted;
    return (
      <span className="status-badge" style={{ background: badge.color }}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="recruiter-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <h2>👔 Recruiter Dashboard</h2>
        <p>Manage job applications</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.submitted}</div>
            <div className="stat-label">New Submissions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.underReview}</div>
            <div className="stat-label">Under Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.interview}</div>
            <div className="stat-label">Interviews</div>
          </div>
        </div>
      )}

      <div className="applications-table">
        <h3>📋 Applications Queue</h3>
        {applications.length === 0 ? (
          <div className="empty-state">No applications yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="candidate-info">
                      <strong>{app.candidateFullName}</strong>
                      <small>{app.candidateEmail}</small>
                    </div>
                  </td>
                  <td>{app.position}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleSelectApplication(app)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button className="btn-close" onClick={() => setSelectedApp(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Candidate:</strong>
                <span>{selectedApp.candidateFullName}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{selectedApp.candidateEmail}</span>
              </div>
              <div className="detail-row">
                <strong>Position:</strong>
                <span>{selectedApp.position}</span>
              </div>
              <div className="detail-row">
                <strong>CV:</strong>
                <span>📄 {selectedApp.cvFilename}</span>
              </div>
              {selectedApp.coverLetter && (
                <div className="detail-section">
                  <strong>Cover Letter:</strong>
                  <p className="cover-letter">{selectedApp.coverLetter}</p>
                </div>
              )}
              <div className="form-group">
                <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this candidate..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedApp(null)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleUpdateApplication}>
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;

