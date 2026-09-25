import React, { useState } from "react";

const BookingItem = ({ 
  room, 
  bookingIndex, 
  onRemove = () => {}, 
  onUpdateGuests = () => {} 
}) => {
  /* ================ STATE ================ */
  const [guests, setGuests] = useState(room.guests || 2);

  /* ================ STYLES ================ */
  const styles = {
    card: {
      borderRadius: '12px', 
      position: 'relative', 
      zIndex: 1
    },
    image: {
      objectFit: 'cover',
      borderRadius: '12px 0 0 12px'
    },
    guestButton: {
      width: '24px', 
      height: '24px', 
      padding: '0', 
      fontSize: '12px'
    },
    guestCount: {
      minWidth: '20px', 
      textAlign: 'center'
    }
  };

  /* ================ HANDLERS ================ */
  const handleGuestChange = (newGuests) => {
    setGuests(newGuests);
    onUpdateGuests(bookingIndex, newGuests);
  };

  const handleRemove = () => {
    onRemove(bookingIndex);
  };

  const handleDecreaseGuests = () => {
    handleGuestChange(Math.max(1, guests - 1));
  };

  const handleIncreaseGuests = () => {
    handleGuestChange(Math.min(room.maxGuests, guests + 1));
  };

  /* ================ UI ================ */
  return (
    <div className="card mb-3 border-0 shadow-sm" style={styles.card}>
      <div className="row g-0">
        <div className="col-4">
          <img 
            src={room.image} 
            alt={room.title}
            className="img-fluid h-100 w-100"
            style={styles.image}
          />
        </div>
        
        <div className="col-8">
          <div className="card-body p-3">
            <h6 className="card-title mb-1 fw-bold">{room.title}</h6>
            
            <p className="text-muted small mb-1">
              <i className="fas fa-map-marker-alt me-1"></i>
              {room.location}
            </p>
            
            <p className="mb-1 small">
              <span className="fw-semibold">₹{room.pricePerNight.toLocaleString()}</span> × {room.nights} nights
            </p>
            
            <p className="text-muted small mb-2">
              <i className="far fa-calendar me-1"></i>
              {room.checkIn} → {room.checkOut}
            </p>
            
            {/* Guest Selection */}
            <div className="d-flex align-items-center mb-2">
              <span className="small me-2">
                <i className="fas fa-users me-1"></i>
                Guests:
              </span>
              
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  style={styles.guestButton}
                  onClick={handleDecreaseGuests}
                  disabled={guests <= 1}
                >
                  -
                </button>
                
                <span className="mx-2 small fw-semibold" style={styles.guestCount}>
                  {guests}
                </span>
                
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  style={styles.guestButton}
                  onClick={handleIncreaseGuests}
                  disabled={guests >= room.maxGuests}
                >
                  +
                </button>
                
                <span className="text-muted small ms-2">(max {room.maxGuests})</span>
              </div>
            </div>
            
            <button 
              onClick={handleRemove}
              className="btn btn-link p-0 text-danger small fw-semibold text-decoration-underline"
            >
              <i className="fas fa-trash-alt me-1"></i>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;
