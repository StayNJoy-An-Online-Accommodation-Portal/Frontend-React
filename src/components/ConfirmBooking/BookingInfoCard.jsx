import React from "react";

const BookingInfoCard = ({ bookings = [] }) => {
  /* ================ STYLES ================ */
  const styles = {
    card: {
      borderRadius: '16px'
    },
    image: {
      width: '80px', 
      height: '80px', 
      objectFit: 'cover'
    },
    starIcon: {
      fontSize: '12px'
    },
    infoIcon: {
      fontSize: '14px'
    }
  };

  /* ================ COMPUTED VALUES ================ */
  const subtotal = bookings.reduce((sum, booking) => 
    sum + (booking.pricePerNight * booking.nights), 0
  );
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;
  const primaryBooking = bookings[0];
  const totalGuests = bookings.reduce((sum, booking) => sum + (booking.guests || 2), 0);

  /* ================ HELPERS ================ */
  const getPropertyTitle = () => {
    return bookings.length === 1 ? primaryBooking.title : `${bookings.length} Properties`;
  };

  const getLocationText = () => {
    return bookings.length === 1 ? primaryBooking.location : 'Multiple locations';
  };

  const getDateText = () => {
    return bookings.length === 1 
      ? `${primaryBooking.checkIn} - ${primaryBooking.checkOut}`
      : 'Multiple date ranges';
  };

  /* ================ EARLY RETURN ================ */
  if (!bookings || bookings.length === 0) {
    return (
      <div className="card border-0 shadow-sm" style={styles.card}>
        <div className="card-body p-4 text-center">
          <p className="text-muted">No bookings selected</p>
        </div>
      </div>
    );
  }

  /* ================ UI ================ */
  return (
    <div className="card border-0 shadow-sm" style={styles.card}>
      <div className="card-body p-4">
        {/* Property Info */}
        <div className="d-flex mb-4">
          <img 
            src={primaryBooking.image} 
            alt={primaryBooking.title}
            className="rounded me-3"
            style={styles.image}
          />
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-bold">{getPropertyTitle()}</h6>
            <p className="text-muted small mb-1">{getLocationText()}</p>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <i className="fas fa-star text-warning me-1" style={styles.starIcon}></i>
                <span className="small fw-semibold">4.8</span>
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* Booking Details */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Your trip</h6>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <div className="fw-semibold">Dates</div>
              <div className="text-muted small">{getDateText()}</div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">Guests</div>
              <div className="text-muted small">{totalGuests} guests</div>
            </div>
          </div>
        </div>

        <hr />

        {/* Price Breakdown */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Price details</h6>
          
          {bookings.map((booking, index) => (
            <div key={booking.id || index} className="d-flex justify-content-between mb-2">
              <span className="small">
                {booking.title} - ₹{booking.pricePerNight.toLocaleString()} × {booking.nights} nights
              </span>
              <span className="small">₹{(booking.pricePerNight * booking.nights).toLocaleString()}</span>
            </div>
          ))}
          
          <div className="d-flex justify-content-between mb-3 mt-3">
            <span>Taxes</span>
            <span>₹{taxes.toLocaleString()}</span>
          </div>
          
          <hr />
          
          <div className="d-flex justify-content-between">
            <strong>Total (INR)</strong>
            <strong>₹{total.toLocaleString()}</strong>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-light rounded p-3">
          <div className="d-flex align-items-start">
            <i className="fas fa-info-circle text-muted me-2 mt-1" style={styles.infoIcon}></i>
            <div>
              <div className="fw-semibold small">Free cancellation before 48 hours</div>
              <div className="text-muted small">
                Get a full refund if you cancel at least 48 hours before check-in.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfoCard;
