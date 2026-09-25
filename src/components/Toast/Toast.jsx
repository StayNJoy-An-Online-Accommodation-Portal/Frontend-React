import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'error', show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastClass = () => {
    switch (type) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-danger';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-times-circle';
    }
  };

  return (
    <div 
      className={`toast show position-fixed ${getToastClass()} text-white`}
      style={{
        top: '20px',
        right: '20px',
        zIndex: 1060,
        minWidth: '300px',
        borderRadius: '8px'
      }}
    >
      <div className="toast-body d-flex align-items-center">
        <i className={`${getIcon()} me-2`}></i>
        <span className="flex-grow-1">{message}</span>
        <button 
          type="button" 
          className="btn-close btn-close-white ms-2" 
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default Toast;