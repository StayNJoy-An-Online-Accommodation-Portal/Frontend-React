import React, { useState, useEffect } from 'react';

const BackendStatus = () => {
  const [isBackendRunning, setIsBackendRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // ✅ Use Vite env variable with local fallback
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

  const checkBackendStatus = async () => {
    try {
      // ✅ Now uses the correct local URL
      const response = await fetch(`${API_BASE}/health/ping`);
      setIsBackendRunning(response.ok);
    } catch (error) {
      setIsBackendRunning(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) return null;

  if (!isBackendRunning) {
    return (
      <div className="alert alert-danger m-0">
        <div className="d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <span className="me-auto">
            <strong>Backend Server Not Running!</strong> Start: mvnw spring-boot:run
          </span>
          <button className="btn btn-sm btn-outline-danger" onClick={checkBackendStatus}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="alert alert-success m-0">
      <div className="d-flex align-items-center">
        <i className="fas fa-check-circle me-2"></i>
        <span>Backend server running - Database active!</span>
      </div>
    </div>
  );
};

export default BackendStatus;