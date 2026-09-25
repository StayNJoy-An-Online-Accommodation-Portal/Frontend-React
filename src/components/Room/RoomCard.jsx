import React from "react";

const RoomCard = ({ room, onViewDetails = () => {} }) => {
  /* ================ STYLES ================ */
  const styles = {
    card: {
      borderRadius: '12px', 
      cursor: 'pointer'
    },
    image: {
      height: '200px',
      objectFit: 'cover',
      borderRadius: '12px 12px 0 0'
    },
    reserveButton: {
      background: '#ff385c', 
      color: 'white', 
      border: 'none', 
      borderRadius: '6px'
    },
    amenityBadge: {
      fontSize: '0.7rem'
    },
    overflowBadge: {
      fontSize: '0.7rem'
    }
  };

  /* ================ HANDLERS ================ */
  const handleCardClick = () => {
    onViewDetails(room);
  };

  const handleReserveClick = (e) => {
    e.stopPropagation();
    onViewDetails(room);
  };

  /* ================ UI ================ */
  return (
    <div 
      className="card h-100 border-0 shadow-sm" 
      style={styles.card} 
      onClick={handleCardClick}
    >
      <img 
        src={room.image} 
        alt={room.title}
        className="card-img-top"
        style={styles.image}
      />
      
      <div className="card-body p-3">
        <h6 className="card-title fw-bold mb-2">{room.title}</h6>
        
        <p className="text-muted small mb-2">
          <i className="fas fa-map-marker-alt me-1"></i>
          {room.location}
        </p>
        
        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          <div className="text-warning me-2">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star ${i < Math.floor(room.rating || 4.2) ? '' : 'text-muted'}`} style={{fontSize: '0.8rem'}}></i>
            ))}
          </div>
          <small className="text-muted">{(room.rating || 4.2).toFixed(1)}</small>
        </div>
        
        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-2">
            <div className="d-flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index} 
                  className="badge bg-light text-dark border" 
                  style={styles.amenityBadge}
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span 
                  className="badge bg-secondary" 
                  style={styles.overflowBadge}
                >
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-primary">
            ₹{room.pricePerNight.toLocaleString()}/night
          </span>
          
          <button 
            className="btn btn-sm px-3 py-1 fw-semibold"
            style={styles.reserveButton}
            onClick={handleReserveClick}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;