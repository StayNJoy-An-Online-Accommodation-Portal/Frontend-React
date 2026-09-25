import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await fetch('/api/health/ping');
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isOnline) return null; // Don't show anything when online

  return (
    <div className="alert alert-warning alert-dismissible fade show m-0" role="alert">
      <div className="d-flex align-items-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        <span className="me-auto">
          {isChecking ? 'Checking connection...' : 'Offline mode - Using local data'}
        </span>
        <button 
          className="btn btn-sm btn-outline-warning"
          onClick={checkConnection}
          disabled={isChecking}
        >
          {isChecking ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-sync-alt"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus;