import React, { useState, useEffect } from "react";
import { AUTH_EVENTS, authUtils } from "../../utils/auth";
import LoginStep from "./LoginStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import BookingInfoCard from "./BookingInfoCard";
import Login from "../Login/Login";
import Toast from "../Toast/Toast";

// Receipt Component
const Receipt = ({ bookings = [], selectedPaymentMethod = '' }) => {
  const styles = {
    card: {
      borderRadius: '16px',
      backgroundColor: '#f8f9fa'
    }
  };

  const subtotal = bookings.reduce((sum, booking) =>
    sum + (booking.pricePerNight * booking.nights), 0
  );
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;
  const primaryBooking = bookings[0];

  return (
    <div className="card border-0 shadow-sm" style={styles.card}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <i className="fas fa-receipt text-primary me-2 fs-4"></i>
          <h5 className="mb-0 fw-bold">Booking Receipt</h5>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Payment Method:</span>
            <span className="fw-semibold">
              {selectedPaymentMethod === 'card' && 'Credit/Debit Card'}
              {selectedPaymentMethod === 'paypal' && 'PayPal'}
              {selectedPaymentMethod === 'upi' && 'UPI'}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Property:</span>
            <span className="fw-semibold">{primaryBooking.title}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Check-in:</span>
            <span className="fw-semibold">{primaryBooking.checkIn}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Check-out:</span>
            <span className="fw-semibold">{primaryBooking.checkOut}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Guests:</span>
            <span className="fw-semibold">{bookings.reduce((sum, booking) => sum + (booking.guests || 2), 0)}</span>
          </div>
        </div>

        <hr />

        <div className="mb-3">
          <h6 className="fw-semibold mb-3">Price Breakdown</h6>
          {bookings.map((booking, index) => (
            <div key={booking.id || index} className="d-flex justify-content-between mb-2">
              <span className="small">
                {booking.title} - ₹{booking.pricePerNight.toLocaleString()} × {booking.nights} nights
              </span>
              <span className="small">₹{(booking.pricePerNight * booking.nights).toLocaleString()}</span>
            </div>
          ))}
          <div className="d-flex justify-content-between mb-2">
            <span>Taxes (18%)</span>
            <span>₹{taxes.toLocaleString()}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <strong>Total Amount</strong>
            <strong>₹{total.toLocaleString()}</strong>
          </div>
        </div>

        <div className="bg-success bg-opacity-10 rounded p-3">
          <div className="d-flex align-items-center">
            <i className="fas fa-check-circle text-success me-2"></i>
            <small className="text-success fw-semibold">
              Payment processed successfully!
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmBooking = ({ bookings = [], onBack = () => {} }) => {
  /* ================ STATE ================ */
  const [isAuthenticated, setIsAuthenticated] = useState(authUtils.isAuthenticated());
  const [showLogin, setShowLogin] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  /* ================ EFFECTS ================ */
  useEffect(() => {
    const handleLogout = () => {
      setIsAuthenticated(false);
    };

    const handleLogin = () => {
      setIsAuthenticated(true);
    };

    // Listen for global auth events
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    window.addEventListener(AUTH_EVENTS.LOGIN, handleLogin);

    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleLogin);
    };
  }, []);

  /* ================ HANDLERS ================ */
  const handleNavigateToLogin = () => {
    localStorage.setItem('pendingBookings', JSON.stringify(bookings));
    authUtils.setRedirectAfterLogin('/confirm-booking');
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleBackFromLogin = () => {
    setShowLogin(false);
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  /* ================ EARLY RETURN ================ */
  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} onBack={handleBackFromLogin} />;
  }
  
  /* ================ UI ================ */
  return (
    <div className="container py-4">
      <div className="row">
        {/* Left Column - Steps */}
        <div className="col-lg-7">
          <div className="mb-4">
            <button 
              onClick={onBack}
              className="btn btn-link p-0 text-decoration-none"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to listings
            </button>
          </div>

          <h2 className="mb-4 fw-bold">Confirm and pay</h2>

          {/* Conditional Step Rendering */}
          {!isAuthenticated ? (
            <LoginStep onNavigateToLogin={handleNavigateToLogin} />
          ) : (
            <>
              <PaymentStep
                bookings={bookings}
                onPaymentMethodSelect={setSelectedPaymentMethod}
              />
              <ReviewStep
                bookings={bookings}
                selectedPaymentMethod={selectedPaymentMethod}
                onConfirmPayment={() => setShowReceipt(true)}
                showToast={showToast}
              />
            </>
          )}
        </div>

        {/* Right Column - Booking Info Card */}
        <div className="col-lg-5">
          <div className="sticky-content">
            <BookingInfoCard bookings={bookings} />
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-receipt text-primary me-2"></i>
                  Booking Receipt
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReceipt(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Receipt bookings={bookings} selectedPaymentMethod={selectedPaymentMethod} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReceipt(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowReceipt(false)}
                >
                  <i className="fas fa-download me-2"></i>
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />
    </div>
  );
};

export default ConfirmBooking;
