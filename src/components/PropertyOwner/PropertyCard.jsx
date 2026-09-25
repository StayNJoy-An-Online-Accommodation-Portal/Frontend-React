// This is a single property card that shows on the property owner dashboard
// It's like a business card for each property - shows photo, price, amenities etc.
// Property owners can click to view details, edit, or delete their properties

import React from "react";

const PropertyCard = ({
  room, // The property information to display
  onViewDetails = () => { }, // What happens when user clicks to see more details
  onDelete = () => { }, // What happens when user clicks delete button
  onEdit = () => { } // What happens when user clicks edit button
}) => {
  // Styling to make the property cards look modern and attractive
  const styles = {
    card: {
      borderRadius: '25px', // Rounded corners
      boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)', // Nice shadow effect
      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)', // Subtle gradient background
      backdropFilter: 'blur(10px)', // Glass-like effect
      border: '2px solid rgba(255,255,255,0.2)'
    },
    image: {
      height: '200px', // Fixed height so all images look uniform
      objectFit: 'cover', // Crop image nicely to fit
      borderRadius: '23px 23px 0 0', // Rounded top corners only
      cursor: 'pointer' // Show hand cursor when hovering
    },
    cardBody: {
      cursor: 'pointer' // Whole card body is clickable
    },
    amenityBadge: {
      fontSize: '0.7rem' // Small text for amenity tags
    },
    overflowBadge: {
      fontSize: '0.7rem' // Small text for "+2 more" type badges
    }
  };

  // When user clicks anywhere on the card to see property details
  const handleViewDetails = (e) => {
    e.preventDefault(); // Don't do default browser action
    e.stopPropagation(); // Don't trigger other click events
    onViewDetails(room); // Call the function passed from parent component
  };

  // When user clicks the red delete button
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Don't trigger the card click event
    console.log('Delete button clicked for property:', room.id);
    onDelete(room.id); // Tell parent component to delete this property
  };

  // When user clicks the blue edit button
  const handleEditClick = (e) => {
    e.stopPropagation(); // Don't trigger the card click event
    onEdit(room); // Tell parent component to open edit form for this property
  };

  // This is what users see - the actual property card layout
  return (
    <div className="card h-100 border-0" style={styles.card}>
      {/* Top section with property image and action buttons */}
      <div className="position-relative">
        {/* Main property photo - clickable to view details */}
        <img
          src={room.image}
          alt={room.title}
          className="card-img-top"
          style={styles.image}
          onClick={handleViewDetails}
        />

        {/* Edit and Delete buttons floating on top-right of image */}
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
          {/* Blue edit button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleEditClick}
            title="Edit Property"
          >
            <i className="fas fa-edit"></i>
          </button>
          {/* Red delete button */}
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteClick}
            title="Delete Property"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Bottom section with property details - clickable to view more */}
      <div className="card-body p-3" style={styles.cardBody} onClick={handleViewDetails}>
        {/* Property name/title */}
        <h6 className="card-title fw-bold mb-2">{room.title}</h6>

        {/* Location with map pin icon */}
        <p className="text-muted small mb-2">
          <i className="fas fa-map-marker-alt me-1"></i>
          {room.location}
        </p>

        {/* Amenities section - shows WiFi, AC, Pool etc. */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-2">
            <div className="d-flex flex-wrap gap-1">
              {/* Show first 3 amenities as small badges */}
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border"
                  style={styles.amenityBadge}
                >
                  {amenity}
                </span>
              ))}
              {/* If more than 3 amenities, show "+2 more" type badge */}
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

        {/* Bottom row with price, earnings, and rating */}
        <div className="d-flex justify-content-between align-items-center">
          {/* Price per night in Indian Rupees */}
          <span className="fw-bold text-primary">
            ₹{room.pricePerNight.toLocaleString()}/night
          </span>

          {/* How much money this property has earned */}
          <div className="small fw-semibold text-success">
            Earned ₹{(room.earnAmount || 0).toLocaleString()}
          </div>

          {/* Star rating from guests */}
          <div className="text-muted small">
            <i className="fas fa-star text-warning me-1"></i>
            {room.rating} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
