import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

interface HelloResponse {
  message: string;
  source: string;
  timestamp: string;
}

function App() {
  const [helloMessage, setHelloMessage] = useState<string>('Loading...');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchHelloWorld();
  }, []);

  const fetchHelloWorld = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<HelloResponse>(`${API_URL}/api/hello`);
      setHelloMessage(response.data.message);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
      console.error('Error fetching hello world:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🚀 DevFest PTA 2025</h1>
          <p className="subtitle">3-Tier Cloud Architecture Demo</p>
        </header>

        <div className="card">
          <div className="card-header">
            <h2>Architecture Test: Hello World</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Connecting to backend...</p>
              </div>
            ) : error ? (
              <div className="error">
                <p>❌ Error: {error}</p>
                <button onClick={fetchHelloWorld} className="btn-retry">
                  Retry
                </button>
              </div>
            ) : (
              <div className="success">
                <div className="message-box">
                  <h3>✅ {helloMessage}</h3>
                </div>
                <div className="tech-stack">
                  <div className="tech-item">
                    <span className="icon">⚛️</span>
                    <span>React + TypeScript</span>
                  </div>
                  <div className="tech-item">
                    <span className="icon">🔷</span>
                    <span>NestJS API</span>
                  </div>
                  <div className="tech-item">
                    <span className="icon">🐘</span>
                    <span>PostgreSQL</span>
                  </div>
                  <div className="tech-item">
                    <span className="icon">🐳</span>
                    <span>Docker</span>
                  </div>
                </div>
                <button onClick={fetchHelloWorld} className="btn-refresh">
                  🔄 Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>Built for Google Developer Conference</p>
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
    </div>
  );
}

export default App;

