import React, { useMemo } from "react";
import BookingItem from "./BookingItem";

const BookingCart = ({ 
  bookings = [], 
  onRemove = () => {}, 
  onReserve = () => {}, 
  onUpdateGuests = () => {} 
}) => {
  /* ================ STYLES ================ */
  const styles = {
    card: {
      borderRadius: '16px', 
      position: 'relative', 
      zIndex: 1
    },
    reserveButton: {
      background: 'linear-gradient(135deg, #ff385c, #e61e4d)', 
      border: 'none'
    }
  };

  /* ================ COMPUTED VALUES ================ */
  const priceSummary = useMemo(() => {
    const subtotal = bookings.reduce(
      (sum, item) => sum + item.pricePerNight * item.nights,
      0
    );

    const cleaningFee = subtotal * 0.1;
    const serviceFee = subtotal * 0.08;

    return {
      subtotal,
      cleaningFee,
      serviceFee,
      total: subtotal + cleaningFee + serviceFee
    };
  }, [bookings]);

  /* ================ HANDLERS ================ */
  const handleReserveClick = () => {
    onReserve(bookings);
  };

  /* ================ EARLY RETURN ================ */
  if (bookings.length === 0) {
    return null;
  }

  /* ================ UI ================ */
  return (
    <div className="card border-0 shadow-sm" style={styles.card}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-shopping-cart text-primary me-2"></i>
          <h4 className="mb-0 fw-bold">Your Bookings</h4>
        </div>

        <div className="mb-4">
          {bookings.map((room, index) => (
            <BookingItem
              key={`${room.id}-${index}`}
              room={room}
              bookingIndex={index}
              onRemove={onRemove}
              onUpdateGuests={onUpdateGuests}
            />
          ))}
        </div>

        <div className="bg-light rounded-3 p-3 mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>₹{priceSummary.subtotal.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Cleaning Fee</span>
            <span>₹{priceSummary.cleaningFee.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>Service Fee</span>
            <span>₹{priceSummary.serviceFee.toLocaleString()}</span>
          </div>
          
          <hr className="my-3" />
          
          <div className="d-flex justify-content-between">
            <strong className="fs-5">Total</strong>
            <strong className="fs-5 text-primary">₹{priceSummary.total.toLocaleString()}</strong>
          </div>
        </div>

        <button 
          onClick={handleReserveClick}
          className="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-3" 
          style={styles.reserveButton}
        >
          <i className="fas fa-lock me-2"></i>
          Reserve
        </button>
        
        <p className="text-muted text-center mt-2 small mb-0">
          You won't be charged yet
        </p>
      </div>
    </div>
  );
};

export default BookingCart;
