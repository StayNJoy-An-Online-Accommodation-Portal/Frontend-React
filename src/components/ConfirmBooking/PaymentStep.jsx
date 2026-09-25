import React, { useState } from "react";

const PaymentStep = ({ bookings = [], onPaymentMethodSelect = () => {} }) => {
  /* ================ STATE ================ */
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

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
    receiptCard: {
      borderRadius: '16px',
      backgroundColor: '#f8f9fa'
    }
  };

  /* ================ UI ================ */
  return (
    <div className="card border-0 shadow-sm mb-4" style={styles.card}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={styles.stepNumber}>
            2
          </div>
          <h5 className="mb-0 fw-bold">Add a payment method</h5>
        </div>

        <div className="mb-3">
          <div className="d-flex gap-2 mb-3">
            <button
              className={`btn flex-fill py-2 ${selectedPaymentMethod === 'card' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                setSelectedPaymentMethod('card');
                onPaymentMethodSelect('card');
              }}
            >
              <i className="fab fa-cc-visa me-2"></i>
              Card
            </button>
            <button
              className={`btn flex-fill py-2 ${selectedPaymentMethod === 'paypal' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                setSelectedPaymentMethod('paypal');
                onPaymentMethodSelect('paypal');
              }}
            >
              <i className="fab fa-paypal me-2"></i>
              PayPal
            </button>
            <button
              className={`btn flex-fill py-2 ${selectedPaymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                setSelectedPaymentMethod('upi');
                onPaymentMethodSelect('upi');
              }}
            >
              <i className="fas fa-university me-2"></i>
              UPI
            </button>
          </div>
        </div>

        {selectedPaymentMethod === 'card' && (
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Card number</label>
              <input type="text" className="form-control" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="col-6">
              <label className="form-label">Expiry</label>
              <input type="text" className="form-control" placeholder="MM/YY" />
            </div>
            <div className="col-6">
              <label className="form-label">CVV</label>
              <input type="text" className="form-control" placeholder="123" />
            </div>
            <div className="col-12">
              <label className="form-label">Cardholder name</label>
              <input type="text" className="form-control" placeholder="Name on card" />
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'paypal' && (
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">PayPal Email</label>
              <input type="email" className="form-control" placeholder="your-email@example.com" />
            </div>
            <div className="col-12">
              <label className="form-label">PayPal Password</label>
              <input type="password" className="form-control" placeholder="Enter your PayPal password" />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="paypalRemember" />
                <label className="form-check-label small" htmlFor="paypalRemember">
                  Remember this account for future payments
                </label>
              </div>
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'upi' && (
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">UPI ID</label>
              <input type="text" className="form-control" placeholder="yourname@upi" />
            </div>
            <div className="col-12">
              <label className="form-label">Bank Account Number</label>
              <input type="text" className="form-control" placeholder="Enter your bank account number" />
            </div>
            <div className="col-12">
              <label className="form-label">IFSC Code</label>
              <input type="text" className="form-control" placeholder="Enter IFSC code" />
            </div>
          </div>
        )}

        <div className="bg-light rounded p-3 mt-3">
          <div className="d-flex align-items-center">
            <i className="fas fa-shield-alt text-success me-2"></i>
            <small className="text-muted">
              Your payment information is encrypted and secure
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  /* ================ RECEIPT COMPONENT ================ */
  const Receipt = () => {
    const subtotal = bookings.reduce((sum, booking) =>
      sum + (booking.pricePerNight * booking.nights), 0
    );
    const taxes = subtotal * 0.18;
    const total = subtotal + taxes;
    const primaryBooking = bookings[0];

    return (
      <div className="card border-0 shadow-sm mb-4" style={styles.receiptCard}>
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

  return (
    <>
      <div className="card border-0 shadow-sm mb-4" style={styles.card}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                 style={styles.stepNumber}>
              2
            </div>
            <h5 className="mb-0 fw-bold">Add a payment method</h5>
          </div>

          <div className="mb-3">
            <div className="d-flex gap-2 mb-3">
              <button
                className={`btn flex-fill py-2 ${selectedPaymentMethod === 'card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                <i className="fab fa-cc-visa me-2"></i>
                Card
              </button>
              <button
                className={`btn flex-fill py-2 ${selectedPaymentMethod === 'paypal' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handlePaymentMethodSelect('paypal')}
              >
                <i className="fab fa-paypal me-2"></i>
                PayPal
              </button>
              <button
                className={`btn flex-fill py-2 ${selectedPaymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handlePaymentMethodSelect('upi')}
              >
                <i className="fas fa-university me-2"></i>
                UPI
              </button>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Card number</label>
              <input type="text" className="form-control" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="col-6">
              <label className="form-label">Expiry</label>
              <input type="text" className="form-control" placeholder="MM/YY" />
            </div>
            <div className="col-6">
              <label className="form-label">CVV</label>
              <input type="text" className="form-control" placeholder="123" />
            </div>
            <div className="col-12">
              <label className="form-label">Cardholder name</label>
              <input type="text" className="form-control" placeholder="Name on card" />
            </div>
          </div>

          <div className="bg-light rounded p-3 mt-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-shield-alt text-success me-2"></i>
              <small className="text-muted">
                Your payment information is encrypted and secure
              </small>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && <Receipt />}
    </>
  );
};

export default PaymentStep;
