import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const PropertyDetails = ({ property, show, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (show && property) {
      loadPropertyAnalytics();
    }
  }, [show, property]);

  const loadPropertyAnalytics = async () => {
    try {
      // Get all bookings and filter for this property
      const allBookings = await apiService.getAllBookings();
      const propertyBookings = allBookings.filter(booking => booking.propertyId === property.id);
      setBookings(propertyBookings);

      // Get real reviews from database
      const propertyReviews = await apiService.getPropertyReviews(property.id);
      setReviews(propertyReviews);
    } catch (error) {
      console.error('Failed to load property analytics:', error);
      setBookings([]);
      setReviews([]);
    }
  };

  if (!show || !property) return null;

  const totalRevenue = property?.earnAmount || 0;
  const completedBookings = property?.bookingCount || 0;
  const averageRating = property?.averageRating || 0;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">{property.title} - Analytics</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Revenue & Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card border-0 bg-primary text-white text-center">
                  <div className="card-body">
                    <i className="fas fa-rupee-sign fs-1 mb-2"></i>
                    <h4 className="fw-bold">₹{totalRevenue.toLocaleString()}</h4>
                    <p className="mb-0">Total Revenue</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-success text-white text-center">
                  <div className="card-body">
                    <i className="fas fa-calendar-check fs-1 mb-2"></i>
                    <h4 className="fw-bold">{completedBookings}</h4>
                    <p className="mb-0">Total Bookings</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-warning text-white text-center">
                  <div className="card-body">
                    <i className="fas fa-star fs-1 mb-2"></i>
                    <h4 className="fw-bold">{averageRating ? averageRating.toFixed(1) : 'N/A'}</h4>
                    <p className="mb-0">Average Rating</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-info text-white text-center">
                  <div className="card-body">
                    <i className="fas fa-comments fs-1 mb-2"></i>
                    <h4 className="fw-bold">{reviews.length}</h4>
                    <p className="mb-0">Total Reviews</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Recent Bookings */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h6 className="fw-bold mb-0">Recent Bookings</h6>
                  </div>
                  <div className="card-body p-0">
                    {bookings.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Customer</th>
                              <th>Dates</th>
                              <th>Revenue</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 5).map((booking, index) => (
                              <tr key={booking.id || index}>
                                <td className="fw-semibold">{booking.userName || `Guest ${index + 1}`}</td>
                                <td>
                                  <small>{booking.checkInDate} - {booking.checkOutDate}</small>
                                </td>
                                <td className="text-success fw-bold">
                                  {booking.status === 'CANCELLED' ? (
                                    <span className="text-danger">₹0 (Refunded)</span>
                                  ) : (
                                    `₹${booking.totalAmount?.toLocaleString()}`
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${booking.status === 'CANCELLED' ? 'bg-danger' : 'bg-success'}`}>
                                    {booking.status || 'Completed'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-calendar-times text-muted fs-1 mb-3"></i>
                        <p className="text-muted">No bookings yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h6 className="fw-bold mb-0">Customer Reviews</h6>
                  </div>
                  <div className="card-body">
                    {reviews.length > 0 ? (
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {reviews.map((review) => (
                          <div key={review.id} className="mb-3 pb-3 border-bottom">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="fw-bold mb-1">{review.userName}</h6>
                                <div className="text-warning">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-muted'}`}></i>
                                  ))}
                                </div>
                              </div>
                              <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                            </div>
                            <p className="text-muted mb-0">{review.comment || 'No comment provided'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-comment-slash text-muted fs-1 mb-3"></i>
                        <p className="text-muted">No reviews yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;