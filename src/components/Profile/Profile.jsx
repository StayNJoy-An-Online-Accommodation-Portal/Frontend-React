import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../../utils/auth';
import apiService from '../../services/api';
import { dataStore } from '../../utils/enhancedDataStore';
import Toast from '../Toast/Toast';
import RatingModal from '../RatingModal/RatingModal';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/login');
          return;
        }
        
        // Get user profile from backend API
        try {
          const userProfile = await apiService.getProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to load user profile from API:', error);
          // Fallback to localStorage data
          const userData = {
            email: userEmail,
            name: localStorage.getItem('userName') || 'User',
            role: localStorage.getItem('userRole') || 'customer',
            gender: 'Not specified',
            age: 'Not specified',
            createdAt: new Date().toISOString() // Fallback to current date
          };
          setUser(userData);
        }
        
        // Get user's booking history
        console.log('Loading bookings for user:', userEmail);
        const userBookingHistory = await apiService.getUserBookings();
        console.log('Loaded user bookings:', userBookingHistory);
        
        // Enrich bookings with property details
        const enrichedBookings = await Promise.all(
          userBookingHistory.map(async (booking) => {
            try {
              // Get property details for each booking
              const propertyDetails = await apiService.getPropertyById(booking.propertyId);
              return {
                ...booking,
                property: propertyDetails
              };
            } catch (error) {
              console.error('Failed to load property details for booking:', booking.id);
              return booking;
            }
          })
        );
        
        setUserBookings(enrichedBookings);
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Don't navigate to login on profile load error, just show empty bookings
        setUserBookings([]);
      }
    };
    
    loadUserProfile();
  }, [navigate]);

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (!user) return;

    if (!currentPassword.trim()) {
      showToast('Current password is required', 'error');
      return;
    }

    if (!newPassword.trim()) {
      showToast('New password is required', 'error');
      return;
    }

    if (!confirmPassword.trim()) {
      showToast('Please confirm your new password', 'error');
      return;
    }

    if (user.password !== currentPassword) {
      showToast('Current password is incorrect', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    // Update password in mockUsers
    const userIndex = mockUsers.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      mockUsers[userIndex].password = newPassword;
      showToast('Password updated successfully!', 'success');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              {/* Profile Header */}
              <div className="text-center mb-3">
                <div className="d-inline-block mb-2">
                  <div className="rounded-circle text-white d-flex align-items-center justify-content-center"
                    style={{ width: '70px', height: '70px', backgroundColor: '#6c757d' }}>
                    <i className="fas fa-user-circle" style={{ fontSize: '50px', color: 'white' }}></i>
                  </div>
                </div>
                <h4 className="fw-bold mb-1">{user.name}</h4>
                <p className="text-muted mb-1 small">{user.email}</p>
                {user.role === 'property_owner' && (
                  <span className="badge bg-light text-dark px-2 py-1">
                    <i className="fas fa-crown me-1 text-warning"></i>
                    Property Owner
                  </span>
                )}
              </div>

              {/* User Details */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Profile Information</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-muted">Role</label>
                    <p className="fw-semibold mb-0">{user.role === 'property_owner' ? 'Property Owner' : 'Customer'}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted">Member Since</label>
                    <p className="fw-semibold mb-0">
                      {user.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Booking History</h5>
                {userBookings.length > 0 ? (
                  <div className="row g-3">
                    {userBookings.map((booking, index) => (
                      <div key={booking.id || index} className="col-12">
                        <div className="card border">
                          <div className="card-body p-3">
                            <div className="row align-items-center">
                              <div className="col-md-3">
                                <img
                                  src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                                  alt={booking.property?.title || 'Property'}
                                  className="img-fluid rounded"
                                  style={{ height: '60px', objectFit: 'cover', width: '100%' }}
                                />
                              </div>
                              <div className="col-md-6">
                                <h6 className="fw-bold mb-1">{booking.property?.title || 'Property'}</h6>
                                <p className="text-muted mb-1">
                                  <i className="fas fa-map-marker-alt me-1"></i>
                                  {booking.property?.location || 'Location'}
                                </p>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="text-warning me-2">
                                    {[...Array(5)].map((_, i) => (
                                      <i key={i} className={`fas fa-star ${i < (booking.property?.averageRating || 0) ? '' : 'text-muted'}`}></i>
                                    ))}
                                  </div>
                                  <small className="text-muted">{booking.property?.averageRating?.toFixed(1) || '0.0'} ({booking.property?.reviewCount || 0} reviews)</small>
                                </div>
                                <small className="text-muted">
                                  {booking.checkInDate} - {booking.checkOutDate} • {booking.nights} night(s)
                                </small>
                              </div>
                              <div className="col-md-3 text-end">
                                <p className="fw-bold text-primary mb-2">₹{booking.totalAmount?.toLocaleString()}</p>
                                <div className="d-flex flex-column align-items-end">
                                  {booking.status === 'CANCELLED' ? (
                                    <span className="badge bg-danger fs-6 px-3 py-2">
                                      <i className="fas fa-times-circle me-1"></i>
                                      Cancelled
                                    </span>
                                  ) : (
                                    <>
                                      <span className="badge bg-danger fs-6 px-3 py-2">
                                        <i className="fas fa-check-circle me-1"></i>
                                        {booking.status || 'Confirmed'}
                                      </span>
                                      {(() => {
                                        const today = new Date();
                                        const checkInDate = new Date(booking.checkInDate);
                                        const checkOutDate = new Date(booking.checkOutDate);
                                        const timeDiff = checkInDate.getTime() - today.getTime();
                                        const hoursDiff = timeDiff / (1000 * 3600);
                                        const isCompleted = today > checkOutDate;
                                        
                                        if (hoursDiff > 48) {
                                          return (
                                            <button 
                                              className="btn btn-outline-danger btn-sm d-flex align-items-center mt-2"
                                              onClick={async () => {
                                                try {
                                                  await apiService.cancelBooking(booking.id);
                                                  const updatedBookings = await apiService.getUserBookings();
                                                  const enrichedBookings = await Promise.all(
                                                    updatedBookings.map(async (b) => {
                                                      try {
                                                        const propertyDetails = await apiService.getPropertyById(b.propertyId);
                                                        return { ...b, property: propertyDetails };
                                                      } catch (error) {
                                                        return b;
                                                      }
                                                    })
                                                  );
                                                  setUserBookings(enrichedBookings);
                                                  showToast('Booking cancelled successfully!', 'success');
                                                } catch (error) {
                                                  showToast(`${error.message}`, 'error');
                                                }
                                              }}
                                            >
                                              <i className="fas fa-ban me-1"></i>
                                              Cancel
                                            </button>
                                          );
                                        } else if (isCompleted) {
                                          return (
                                            <button 
                                              className="btn btn-outline-warning btn-sm d-flex align-items-center mt-2"
                                              onClick={() => {
                                                setSelectedBooking(booking);
                                                setShowRatingModal(true);
                                              }}
                                            >
                                              <i className="fas fa-star me-1"></i>
                                              Rate Property
                                            </button>
                                          );
                                        } else {
                                          return (
                                            <small className="text-muted mt-2">
                                              <i className="fas fa-info-circle me-1"></i>
                                              Cannot cancel within 48 hours
                                            </small>
                                          );
                                        }
                                      })()} 
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-calendar-times text-muted fs-1 mb-3"></i>
                    <p className="text-muted">No booking history found</p>
                  </div>
                )}
              </div>

              {/* Complaint Section - Only for customers */}
              {user.role !== 'admin' && user.role !== 'property_owner' && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Submit Complaint</h5>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    try {
                      const complaintData = {
                        userEmail: user.email,
                        propertyId: userBookings.length > 0 ? userBookings[0].propertyId : 15,
                        issue: formData.get('issue')
                      };
                      console.log('Submitting complaint:', complaintData);
                      await apiService.createComplaint(complaintData);
                      showToast('Complaint submitted successfully!', 'success');
                      e.target.reset();
                    } catch (error) {
                      console.error('Complaint submission error:', error);
                      showToast(`Failed to submit complaint: ${error.message}`, 'error');
                    }
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Property Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="property"
                        placeholder="Enter property name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Issue Description</label>
                      <textarea 
                        className="form-control" 
                        name="issue"
                        rows="3"
                        placeholder="Describe your issue"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-warning"
                    >
                      Submit Complaint
                    </button>
                  </form>
                </div>
              )}

              {/* Password Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <i className="fas fa-lock me-2 text-primary"></i>
                    Password
                  </h5>
                  <div>
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: 'linear-gradient(135deg, #ff385c, #e61e4d)', border: 'none' }}
                    >
                      Update Password
                    </button>
                  </form>
                ) : (
                  <p className="text-muted">{showPassword ? user.password : '••••••••'}</p>
                )}
              </div>

              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="btn btn-link w-100 text-decoration-none"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />

      <RatingModal
        show={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onRatingSubmitted={(message) => {
          showToast(message, 'success');
          setShowRatingModal(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
};

export default Profile;