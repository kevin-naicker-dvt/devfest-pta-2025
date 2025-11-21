import React, { useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import './ApplyForm.css';

interface ApplyFormProps {
  currentUser: User;
  onSuccess: () => void;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ currentUser, onSuccess }) => {
  const [position, setPosition] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFilename, setCvFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const positions = [
    'Senior Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Full Stack Developer',
    'Mobile Developer',
    'Data Engineer',
    'QA Engineer',
  ];

  const handleFileSimulation = () => {
    // Simulate file selection
    const simulatedFilename = `${currentUser.name}_cv_${Date.now()}.pdf`;
    setCvFilename(simulatedFilename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/applications`, {
        candidateName: currentUser.name,
        candidateEmail: currentUser.email,
        candidateFullName: currentUser.fullName,
        position,
        cvFilename,
        coverLetter,
      });

      // Reset form
      setPosition('');
      setCoverLetter('');
      setCvFilename('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-form-container">
      <div className="apply-form-card">
        <h2>📝 Submit Your Application</h2>
        <p className="form-subtitle">Complete the form below to apply for a position</p>

        <form onSubmit={handleSubmit} className="apply-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={currentUser.fullName}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={currentUser.email}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a position...</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cv">CV / Resume (Demo - Simulated Upload) *</label>
            <div className="cv-upload">
              {cvFilename ? (
                <div className="cv-uploaded">
                  <span className="cv-icon">📄</span>
                  <span className="cv-name">{cvFilename}</span>
                  <button
                    type="button"
                    onClick={() => setCvFilename('')}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleFileSimulation}
                  className="btn-upload"
                >
                  📎 Simulate CV Upload
                </button>
              )}
            </div>
            <small className="form-hint">
              Demo mode: Click to simulate a CV file upload
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter (Optional)</label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Tell us why you're a great fit for this position..."
              className="form-textarea"
            />
          </div>

          {error && <div className="form-error">❌ {error}</div>}

          <button
            type="submit"
            disabled={loading || !position || !cvFilename}
            className="btn-submit"
          >
            {loading ? 'Submitting...' : '🚀 Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;

