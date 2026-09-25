// This is the main dashboard page for property owners
// Here they can see all their properties, edit them, delete them, and add new ones
// It's like a control panel for managing their rental properties

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import PropertyDetails from "./PropertyDetails";
import EditProperty from "./EditProperty";
import { authUtils } from "../../utils/auth";
import apiService from "../../services/api";
import Toast from "../Toast/Toast";

const PropertyOwnerDashboard = () => {
  const navigate = useNavigate(); // This helps us move between pages
  
  // These are like memory boxes that store information
  const [properties, setProperties] = useState([]); // List of all owner's properties
  const [selectedRoom, setSelectedRoom] = useState(null); // Which property is currently selected
  const [showDetails, setShowDetails] = useState(false); // Should we show property details popup?
  const [editingProperty, setEditingProperty] = useState(null); // Which property is being edited
  const [showEdit, setShowEdit] = useState(false); // Should we show edit popup?
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // For showing success/error messages

  // Styling for the "Add Property" button to make it look nice
  const buttonStyle = {
    background: '#ff385c', // StayNJoy brand color
    border: 'none',
    borderRadius: '8px'
  };

  // Function to show toast messages (like "Property deleted successfully!")
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // This runs when the page first loads - it gets all properties from database
  useEffect(() => {
    const loadOwnerProperties = async () => {
      try {
        // Ask the server for this owner's properties
        const ownerProperties = await apiService.getOwnerProperties();
        console.log('Loaded owner properties:', ownerProperties);
        
        // Make the properties look nice for display
        const mappedProperties = ownerProperties.map(property => {
          // Different placeholder images so properties don't all look the same
          const imageUrls = [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
          ];
          // Pick different image based on property ID so each looks different
          const imageIndex = property.id % imageUrls.length;
          
          return {
            ...property,
            price: property.pricePerNight || property.price,
            // Use uploaded image if available, otherwise use placeholder
            image: property.images && property.images.length > 0 ? property.images[0] : imageUrls[imageIndex],
            amenities: property.amenities || []
          };
        });
        setProperties(mappedProperties);
      } catch (error) {
        console.error('Failed to load properties:', error);
      }
    };
    
    loadOwnerProperties();
  }, []); // Empty array means this only runs once when page loads

  // When user clicks "Add Property" button, take them to add property page
  const handleAddProperty = () => {
    navigate('/add-property');
  };

  // When user clicks back arrow, take them to home page
  const handleBack = () => {
    navigate('/');
  };

  // When user clicks delete button on a property card
  const handleDeleteProperty = async (propertyId) => {
    try {
      console.log('Deleting property with ID:', propertyId);
      console.log('Owner email:', localStorage.getItem('userEmail'));
      
      // Tell the server to delete this property
      await apiService.deleteProperty(propertyId);
      console.log('Property deleted successfully');
      
      // Show success message
      showToast('Property deleted successfully!', 'success');
      
      // Refresh the property list to remove the deleted one
      const ownerProperties = await apiService.getOwnerProperties();
      const mappedProperties = ownerProperties.map(property => {
        const imageUrls = [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
        ];
        const imageIndex = property.id % imageUrls.length;
        
        return {
          ...property,
          price: property.pricePerNight || property.price,
          image: property.images && property.images.length > 0 ? property.images[0] : imageUrls[imageIndex],
          amenities: property.amenities || []
        };
      });
      setProperties(mappedProperties);
    } catch (error) {
      console.error('Failed to delete property:', error);
      const errorMessage = error.message || 'Failed to delete property';
      
      // Show different colored messages based on the error
      if (errorMessage.includes('active bookings')) {
        showToast(errorMessage, 'warning'); // Orange warning if property has bookings
      } else {
        showToast(errorMessage, 'error'); // Red error for other problems
      }
    }
  };

  // When user clicks on a property card to see more details
  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetails(true); // This opens the details popup
  };

  // When user closes the property details popup
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRoom(null);
  };

  // When user clicks edit button on a property card
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowEdit(true); // This opens the edit popup
  };

  // When user saves changes in the edit popup
  const handleSaveEdit = async (updatedProperty) => {
    try {
      console.log('Updating property:', updatedProperty);
      console.log('Editing property ID:', editingProperty.id);
      
      // Send the updated information to the server
      const result = await apiService.updateProperty(editingProperty.id, updatedProperty);
      console.log('Property updated successfully:', result);
      
      // Refresh the property list to show the changes
      const ownerProperties = await apiService.getOwnerProperties();
      console.log('Reloaded properties after update:', ownerProperties);
      
      const mappedProperties = ownerProperties.map(property => {
        const imageUrls = [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
        ];
        const imageIndex = property.id % imageUrls.length;
        
        return {
          ...property,
          price: property.pricePerNight || property.price,
          image: property.images && property.images.length > 0 ? property.images[0] : imageUrls[imageIndex],
          amenities: property.amenities || []
        };
      });
      setProperties(mappedProperties);
      
      // Close the edit popup and show success message
      setShowEdit(false);
      setEditingProperty(null);
      showToast('Property updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update property:', error);
      showToast(`Failed to update property: ${error.message}`, 'error');
    }
  };

  // When user cancels editing (closes edit popup without saving)
  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditingProperty(null);
  };

  // This is what users see on the screen - the actual webpage layout
  return (
    <>
      <div className="container py-4">
        {/* Top section with title and Add Property button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            {/* Back arrow button to go to home page */}
            <button
              className="btn btn-outline-secondary me-3"
              onClick={handleBack}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 className="fw-bold mb-1">My Properties</h2>
              <p className="text-muted mb-0">Manage your listed properties</p>
            </div>
          </div>
          {/* Big red "Add Property" button */}
          <button
            className="btn btn-primary px-4 py-2 fw-semibold"
            style={buttonStyle}
            onClick={handleAddProperty}
          >
            <i className="fas fa-plus me-2"></i>
            Add Property
          </button>
        </div>

        {/* Grid of property cards - shows all the owner's properties */}
        <div className="row g-4">
          {properties.map((property) => (
            <div key={property.id} className="col-md-4 col-lg-3">
              {/* Each property gets its own card with edit/delete buttons */}
              <PropertyCard
                room={property}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteProperty}
                onEdit={handleEditProperty}
              />
            </div>
          ))}
        </div>

        {/* If owner has no properties yet, show this encouraging message */}
        {properties.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-home fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No Properties Listed</h4>
            <p className="text-muted">Start by adding your first property</p>
            <button
              className="btn btn-primary px-4 py-2 fw-semibold"
              style={buttonStyle}
              onClick={handleAddProperty}
            >
              <i className="fas fa-plus me-2"></i>
              Add Your First Property
            </button>
          </div>
        )}
      </div>

      {/* Popup window that shows detailed property information */}
      <PropertyDetails
        property={selectedRoom}
        show={showDetails}
        onClose={handleCloseDetails}
      />

      {/* Popup window for editing property details */}
      {showEdit && editingProperty && (
        <EditProperty
          property={editingProperty}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
      
      {/* Toast notification that appears at bottom of screen for success/error messages */}
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </>
  );
};

export default PropertyOwnerDashboard;
