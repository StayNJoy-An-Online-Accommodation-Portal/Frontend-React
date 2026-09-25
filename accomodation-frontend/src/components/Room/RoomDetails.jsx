import React, { useState } from "react";
import imageConfig from "../../data/images.json";
import Toast from "../Toast/Toast";
import { dataStore } from "../../utils/dataStore";

const RoomDetails = ({ room, show, onClose, onBook, existingBookings = [] }) => {
  const [nights, setNights] = useState(room?.nights || 1);
  const [checkInDate, setCheckInDate] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  if (!show || !room) return null;

  const additionalImages = room.images && room.images.length > 0 
    ? room.images.slice(0, 3) 
    : imageConfig.roomGallery[room.imageKey] || [room.image, room.image, room.image];

  const handleNightsChange = (change) => {
    const newNights = Math.max(1, nights + change);
    setNights(newNights);
  };

  const getCheckOutDate = () => {
    if (!checkInDate) return '';
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + nights);
    return checkOut.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getFormattedCheckIn = () => {
    if (!checkInDate) return '';
    const date = new Date(checkInDate);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const checkDateOverlap = () => {
    if (!checkInDate) return null;

    const selectedCheckIn = new Date(checkInDate);
    const selectedCheckOut = new Date(selectedCheckIn);
    selectedCheckOut.setDate(selectedCheckIn.getDate() + nights);

    // Ensure existingBookings is an array
    const bookingsArray = Array.isArray(existingBookings) ? existingBookings : [];
    
    // Filter bookings for this specific room and exclude cancelled bookings
    const roomBookings = bookingsArray.filter(booking => 
      booking.id === room.id && booking.status !== 'Cancelled'
    );

    for (const booking of roomBookings) {
      const existingCheckIn = new Date(booking.checkInDate || booking.checkIn);
      const existingCheckOut = new Date(booking.checkOutDate || booking.checkOut);

      // Check if dates overlap
      if (selectedCheckIn < existingCheckOut && selectedCheckOut > existingCheckIn) {
        return {
          isOverlapping: true,
          conflictingBooking: booking,
          message: `This room is already booked until ${existingCheckOut.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
        };
      }
    }

    return { isOverlapping: false };
  };

  const totalPrice = room.pricePerNight * nights;

  const handleBooking = () => {
    if (!checkInDate) {
      showToast('Please select check-in date', 'warning');
      return;
    }

    const overlapCheck = checkDateOverlap();
    if (overlapCheck && overlapCheck.isOverlapping) {
      showToast(overlapCheck.message, 'error');
      return;
    }
    
    // Check global availability
    const selectedCheckOut = new Date(new Date(checkInDate).getTime() + nights * 24 * 60 * 60 * 1000);
    const isAvailable = dataStore.isRoomAvailable(
      room.id, 
      checkInDate, 
      selectedCheckOut.toISOString().split('T')[0]
    );
    
    if (!isAvailable) {
      showToast('This room is not available for the selected dates', 'error');
      return;
    }

    onBook({
      ...room,
      nights,
      totalPrice,
      checkIn: getFormattedCheckIn(),
      checkOut: getCheckOutDate(),
      checkInDate: checkInDate,
      checkOutDate: new Date(new Date(checkInDate).getTime() + nights * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  return (
    <div className="modal show d-block" style={{
      backgroundColor: 'rgba(0,0,0,0.5)',
      background: 'linear-gradient(135deg, rgba(245,247,250,0.95) 0%, rgba(195,207,226,0.95) 100%)'
    }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{room.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-2 mb-4">
              {additionalImages.map((img, index) => (
                <div key={index} className="col-4">
                  <img
                    src={img}
                    alt={`${room.title} ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
              ))}
            </div>

            <div className="mb-3">
              <h6 className="fw-bold">Location</h6>
              <p className="text-muted mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                {room.location}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold">Amenities</h6>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-light text-dark">WiFi</span>
                <span className="badge bg-light text-dark">AC</span>
                <span className="badge bg-light text-dark">TV</span>
                <span className="badge bg-light text-dark">Parking</span>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold">Booking Details</h6>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Check-in Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {checkInDate && (
                  <>
                    <div className="col-12">
                      <div className="bg-light rounded p-2">
                        <small className="text-muted d-block">Check-out Date</small>
                        <span className="fw-semibold">{getCheckOutDate()}</span>
                      </div>
                    </div>
                    {(() => {
                      const overlapCheck = checkDateOverlap();
                      return overlapCheck.isOverlapping ? (
                        <div className="col-12">
                          <div className="alert alert-warning py-2 mb-0">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <small>{overlapCheck.message}</small>
                          </div>
                        </div>
                      ) : null;
                    })()
                    }
                  </>
                )}
              </div>
            </div>

            <div className="bg-light rounded p-3 mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Price per night</span>
                <span className="fw-bold">₹{room.pricePerNight.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Nights</span>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleNightsChange(-1)}
                    disabled={nights <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="fw-bold px-3">{nights}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleNightsChange(1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Total</span>
                <span className="fw-bold text-primary">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary px-4"
              style={{ background: 'linear-gradient(135deg, #ff385c, #e61e4d)', border: 'none' }}
              onClick={handleBooking}
            >
              <i className="fas fa-lock me-2"></i>
              Reserve Now
            </button>
          </div>
        </div>
      </div>
      
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />
    </div>
  );
};

export default RoomDetails;