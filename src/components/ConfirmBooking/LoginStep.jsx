import React from "react";

const LoginStep = ({ onNavigateToLogin = () => {} }) => {
  /* ================ STYLES ================ */
  const styles = {
    card: {
      borderRadius: '16px'
    },
    stepNumber: {
      width: '32px', 
      height: '32px', 
      fontSize: '14px'
    },
    loginButton: {
      background: 'linear-gradient(135deg, #ff385c, #e61e4d)', 
      border: 'none'
    }
  };

  /* ================ HANDLERS ================ */
  const handleLoginClick = () => {
    onNavigateToLogin();
  };

  /* ================ UI ================ */
  return (
    <div className="card border-0 shadow-sm mb-4" style={styles.card}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={styles.stepNumber}>
            1
          </div>
          <h5 className="mb-0 fw-bold">Log in or sign up</h5>
        </div>

        <p className="text-muted mb-4">
          You need to be logged in to complete your booking.
        </p>

        <button 
          onClick={handleLoginClick}
          className="btn btn-primary w-100 py-3 fw-semibold"
          style={styles.loginButton}
        >
          <i className="fas fa-user me-2"></i>
          Login / Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginStep;
