// This is the main control panel for administrators of the StayNJoy platform
// Admins can see overall statistics, manage users, approve/reject properties, view bookings, and handle complaints
// It's like a command center where admins oversee the entire platform

import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Toast from '../Toast/Toast';

const AdminDashboard = () => {
  // These store which tab is currently active (dashboard, users, properties, bookings)
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // For user details popup
  const [selectedUser, setSelectedUser] = useState(null); // Which user is selected
  const [showUserDetails, setShowUserDetails] = useState(false); // Should we show user popup?
  
  // For property images popup
  const [selectedProperty, setSelectedProperty] = useState(null); // Which property is selected
  const [showPropertyImages, setShowPropertyImages] = useState(false); // Should we show property images?
  
  // Data from database
  const [complaints, setComplaints] = useState([]); // List of customer complaints
  const [bookings, setBookings] = useState([]); // List of all bookings
  const [users, setUsers] = useState([]); // List of all users
  const [properties, setProperties] = useState([]); // List of all properties

  // For showing success/error messages
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // This runs when the admin dashboard first loads - gets all data from database
  useEffect(() => {
    const loadData = async () => {
      // Get all properties (including pending ones that need approval)
      try {
        const allProperties = await apiService.getAllPropertiesForAdmin();
        console.log('Admin loaded properties:', allProperties);
        if (allProperties && allProperties.length > 0) {
          // Make the data look nice for display in tables
          const mappedProperties = allProperties.map(property => ({
            ...property,
            owner: property.ownerName || property.ownerEmail, // Show owner name or email
            price: `₹${property.pricePerNight}`, // Add rupee symbol
            images: property.images || ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'] // Fallback image
          }));
          setProperties(mappedProperties);
        } else {
          console.log('No properties found, using fallback');
          setProperties([]);
        }
      } catch (error) {
        console.error('Failed to load properties:', error);
        setProperties([]);
      }

      // Get all bookings made by customers
      try {
        const allBookings = await apiService.getAllBookings();
        console.log('Admin loaded bookings:', allBookings);
        if (allBookings && allBookings.length > 0) {
          // Format booking data for display
          const mappedBookings = allBookings.map(booking => ({
            ...booking,
            customer: booking.guestName || booking.guestEmail, // Show customer name or email
            property: booking.propertyTitle || booking.propertyName, // Show property name
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            amount: booking.totalAmount || booking.amount
          }));
          setBookings(mappedBookings);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setBookings([]);
      }

      // Get all registered users
      try {
        const allUsers = await apiService.getAllUsers();
        console.log('Admin loaded users:', allUsers);
        if (allUsers && allUsers.length > 0) {
          // Format user data for display
          const mappedUsers = allUsers.map(user => ({
            ...user,
            name: user.name || user.username || user.email, // Use name, or fallback to email
            type: user.role === 'property_owner' ? 'Host' : 'Guest', // Friendly role names
            status: user.status === 'ACTIVE' ? 'Active' : 'Blocked', // Friendly status names
            joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' // Format join date
          }));
          setUsers(mappedUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers([]);
      }

      // Get all customer complaints
      try {
        const allComplaints = await apiService.getAllComplaints();
        setComplaints(allComplaints);
      } catch (error) {
        console.error('Failed to load complaints:', error);
        setComplaints([]);
      }
    };
    
    loadData(); // Actually run the data loading
  }, []); // Empty array means this only runs once when page loads

  // Listen for admin actions (not currently used but ready for future features)
  useEffect(() => {
    const handleAdminAction = (event) => {
      const action = event.detail;
      showToast(`Admin action: ${action.type}`, 'info');
    };
    
    window.addEventListener('adminAction', handleAdminAction);
    return () => window.removeEventListener('adminAction', handleAdminAction);
  }, []);

  // Function to show toast messages (success, error, warning)
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // When admin clicks "View Details" button for a user
  const handleViewUserDetails = (userId) => {
    const localUser = users.find(u => u.id === userId);
    if (localUser) {
      const userToShow = {
        ...localUser,
        role: localUser.type === 'Host' ? 'property_owner' : 'user'
      };
      setSelectedUser(userToShow);
      setShowUserDetails(true); // This opens the user details popup
    }
  };

  // When admin closes the user details popup
  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetails(false);
  };

  // When admin clicks on a property title to see its images
  const handleViewPropertyImages = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowPropertyImages(true); // This opens the property images popup
    }
  };

  // When admin closes the property images popup
  const handleClosePropertyImages = () => {
    setSelectedProperty(null);
    setShowPropertyImages(false);
  };

  // When admin clicks Block/Unblock button for a user
  const toggleUserStatus = async (userId) => {
    try {
      // Tell the server to change user status
      await apiService.toggleUserStatus(userId);
      
      // Refresh the user list to show the change
      const allUsers = await apiService.getAllUsers();
      const mappedUsers = allUsers.map(user => ({
        ...user,
        type: user.role === 'property_owner' ? 'Host' : 'Guest',
        status: user.status === 'ACTIVE' ? 'Active' : 'Blocked',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
      }));
      setUsers(mappedUsers);
      
      const user = users.find(u => u.id === userId);
      showToast(`User ${user?.name || 'User'} status updated`);
    } catch (error) {
      console.error('Failed to update user status:', error);
      showToast('Failed to update user status', 'error');
    }
  };

  // When admin clicks Approve/Reject buttons for a property
  const updatePropertyStatus = async (propertyId, newStatus) => {
    try {
      // Tell the server to change property status
      await apiService.updatePropertyStatus(propertyId, newStatus);
      
      // Refresh the property list to show the change
      const allProperties = await apiService.getAllPropertiesForAdmin();
      const mappedProperties = allProperties.map(property => ({
        ...property,
        owner: property.ownerName || property.ownerEmail,
        price: `₹${property.pricePerNight}`,
        images: property.images || ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400']
      }));
      setProperties(mappedProperties);
      showToast(`Property ${newStatus}`);
    } catch (error) {
      console.error('Failed to update property status:', error);
      showToast('Failed to update property status', 'error');
    }
  };

  // When admin clicks Delete button for a property
  const deleteProperty = async (propertyId) => {
    try {
      // Tell the server to delete the property
      await apiService.deleteProperty(propertyId);
      
      // Remove the property from the list immediately
      setProperties(properties.filter(p => p.id !== propertyId));
      showToast(`Property deleted successfully`, 'success');
    } catch (error) {
      console.error('Failed to delete property:', error);
      const errorMessage = error.message || 'Failed to delete property';
      
      // Show different colored messages based on the error
      if (errorMessage.includes('active bookings')) {
        showToast(errorMessage, 'warning'); // Orange warning if property has active bookings
      } else {
        showToast(errorMessage, 'error'); // Red error for other problems
      }
    }
  };

  return (
    <>
      <div className="container py-4">
        <h1 className="fw-bold mb-4">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard Analytics
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              Property Management
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Booking Overview
            </button>
          </li>
        </ul>

        {/* Dashboard Analytics Tab */}
        {activeTab === 'dashboard' && (
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-users text-primary fs-1 mb-3"></i>
                  <h3 className="fw-bold">{users.length}</h3>
                  <p className="text-muted mb-0">Total Users</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-home text-success fs-1 mb-3"></i>
                  <h3 className="fw-bold">{properties.length}</h3>
                  <p className="text-muted mb-0">Total Properties</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-calendar-check text-warning fs-1 mb-3"></i>
                  <h3 className="fw-bold">{bookings.length}</h3>
                  <p className="text-muted mb-0">Total Bookings</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-rupee-sign text-info fs-1 mb-3"></i>
                  <h3 className="fw-bold">₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}</h3>
                  <p className="text-muted mb-0">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Overview Tab */}
        {activeTab === 'bookings' && (
          <>
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white">
                <h3 className="fw-bold mb-0">All Bookings</h3>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Customer</th>
                        <th>Property</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id}>
                          <td className="fw-semibold">{booking.customer}</td>
                          <td>{booking.property}</td>
                          <td>{booking.checkIn}</td>
                          <td>{booking.checkOut}</td>
                          <td>₹{booking.amount.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${
                              booking.status === 'Completed' ? 'bg-success' : 
                              booking.status === 'Active' ? 'bg-primary' : 'bg-danger'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h3 className="fw-bold mb-0">Customer Complaints</h3>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Customer</th>
                        <th>Property</th>
                        <th>Issue</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(complaint => (
                        <tr key={complaint.id}>
                          <td className="fw-semibold">{complaint.user?.name || complaint.customer}</td>
                          <td>{complaint.property?.title || complaint.property}</td>
                          <td>{complaint.issue}</td>
                          <td>{new Date(complaint.createdAt).toLocaleDateString() || complaint.date}</td>
                          <td>
                            <span className={`badge ${complaint.status === 'RESOLVED' || complaint.status === 'Resolved' ? 'bg-success' : 'bg-warning'}`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td>
                            {(complaint.status === 'PENDING' || complaint.status === 'Pending') && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={async () => {
                                  try {
                                    await apiService.updateComplaintStatus(complaint.id, {
                                      status: 'RESOLVED',
                                      adminResponse: 'Issue resolved by admin'
                                    });
                                    const updatedComplaints = await apiService.getAllComplaints();
                                    setComplaints(updatedComplaints);
                                    showToast('Complaint resolved');
                                  } catch (error) {
                                    showToast('Failed to resolve complaint', 'error');
                                  }
                                }}
                              >
                                Resolve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}


        {activeTab === 'users' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h3 className="fw-bold mb-0">All Users</h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="fw-semibold">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.type === 'Host' ? 'bg-primary' : 'bg-secondary'}`}>
                            {user.type}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.joinDate}</td>
                        <td>
                          <button 
                            className={`btn btn-sm ${user.status === 'Active' ? 'btn-danger' : 'btn-success'} me-2`}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === 'Active' ? 'Block' : 'Unblock'}
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewUserDetails(user.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Property Management Tab */}
        {activeTab === 'properties' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h3 className="fw-bold mb-0">All Properties</h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Property Title</th>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>Price/Night</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td className="fw-semibold">
                          <button 
                            className="btn btn-link p-0 text-start fw-semibold text-decoration-none"
                            onClick={() => handleViewPropertyImages(property.id)}
                            style={{color: '#0d6efd'}}
                          >
                            {property.title}
                          </button>
                        </td>
                        <td>{property.owner}</td>
                        <td>{property.location}</td>
                        <td>{property.price}</td>
                        <td>
                          <span className={`badge ${
                            property.status === 'Approved' ? 'bg-success' : 
                            property.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td>
                          {(property.status === 'Pending' || property.status === 'PENDING' || !property.status) && (
                            <>
                              <button 
                                className="btn btn-sm btn-success me-2"
                                onClick={() => updatePropertyStatus(property.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => updatePropertyStatus(property.id, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteProperty(property.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{borderRadius: '16px'}}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">User Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseUserDetails}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-4 text-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
                         style={{width: '80px', height: '80px', fontSize: '24px', fontWeight: 'bold'}}>
                      {selectedUser.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                    </div>
                    <h5 className="fw-bold">{selectedUser.name}</h5>
                    <p className="text-muted">{selectedUser.email}</p>
                  </div>
                  <div className="col-md-8">
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="bg-light rounded p-3">
                          <label className="form-label text-muted small">Role</label>
                          <p className="fw-semibold mb-0">{selectedUser.role === 'property_owner' ? 'Property Owner' : selectedUser.role === 'admin' ? 'Admin' : 'Guest'}</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded p-3">
                          <label className="form-label text-muted small">Gender</label>
                          <p className="fw-semibold mb-0">{selectedUser.gender || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded p-3">
                          <label className="form-label text-muted small">Age</label>
                          <p className="fw-semibold mb-0">{selectedUser.age || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded p-3">
                          <label className="form-label text-muted small">Status</label>
                          <span className={`badge ${users.find(u => u.email === selectedUser.email)?.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                            {users.find(u => u.email === selectedUser.email)?.status || 'Active'}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="bg-light rounded p-3">
                          <label className="form-label text-muted small">Join Date</label>
                          <p className="fw-semibold mb-0">{users.find(u => u.email === selectedUser.email)?.joinDate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={handleCloseUserDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Property Images Modal */}
      {showPropertyImages && selectedProperty && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content" style={{borderRadius: '16px'}}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{selectedProperty.title} - Images</h5>
                <button type="button" className="btn-close" onClick={handleClosePropertyImages}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {selectedProperty.images?.map((image, index) => (
                    <div key={index} className="col-md-4">
                      <div className="card border-0 shadow-sm">
                        <img 
                          src={image} 
                          alt={`${selectedProperty.title} ${index + 1}`}
                          className="card-img-top"
                          style={{height: '250px', objectFit: 'cover', borderRadius: '8px 8px 0 0'}}
                        />
                        <div className="card-body p-2 text-center">
                          <small className="text-muted">Image {index + 1}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {(!selectedProperty.images || selectedProperty.images.length === 0) && (
                  <div className="text-center py-5">
                    <i className="fas fa-image text-muted fs-1 mb-3"></i>
                    <p className="text-muted">No images available for this property</p>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={handleClosePropertyImages}>
                  Close
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
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </>
  );
};

export default AdminDashboard;