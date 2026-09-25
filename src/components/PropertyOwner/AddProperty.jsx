// This is the form where property owners can add new properties to rent out
// It's like filling out a listing form - they enter details, upload photos, and submit for approval
// Once submitted, the property goes to admin for approval before appearing on the website

import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { authUtils } from "../../utils/auth";
import apiService from "../../services/api";

const AddProperty = () => {
  const navigate = useNavigate(); // For moving between pages
  const { handlePropertyAdded } = useOutletContext(); // Function from parent component (not currently used)
  
  // This stores all the form data as the user types
  const [formData, setFormData] = React.useState({
    title: '', // Property name like "Cozy Beach Villa"
    location: '', // Where it's located like "Goa, India"
    pricePerNight: '', // How much per night in rupees
    description: '', // Detailed description of the property
    maxGuests: '', // Maximum number of people who can stay
    amenities: [], // List of features like WiFi, AC, Pool etc.
    images: [] // Photos of the property
  });
  
  const [loading, setLoading] = React.useState(false); // Shows spinner while submitting

  // List of amenities that property owners can choose from
  const amenitiesList = ['WiFi', 'AC', 'Kitchen', 'Pool', 'Parking', 'Gym', 'Balcony', 'TV'];

  // Styling to make the form look nice
  const cardStyle = { borderRadius: '12px' }; // Rounded corners for the form card
  const buttonStyle = {
    background: '#ff385c', // StayNJoy brand color
    border: 'none', 
    borderRadius: '8px'
  };
  const imageStyle = { 
    height: '100px', // Fixed height for uploaded image previews
    objectFit: 'cover', // Crop images nicely
    width: '100%' 
  };

  // When user clicks the back arrow, take them back to property dashboard
  const handleBack = () => {
    navigate('/property-dashboard');
  };

  // When user types in any text field, update the form data
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get which field and what they typed
    setFormData(prev => ({ ...prev, [name]: value })); // Update that specific field
  };

  // When user clicks checkboxes for amenities (WiFi, AC, etc.)
  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity) // Remove if already selected
        : [...prev.amenities, amenity] // Add if not selected
    }));
  };

  // When user selects image files to upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    
    // Convert each image file to base64 format for storage
    files.forEach(file => {
      const reader = new FileReader(); // Browser tool to read files
      reader.onload = (event) => {
        const base64String = event.target.result; // The image as text data
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, base64String] // Add to existing images
        }));
      };
      reader.readAsDataURL(file); // Start converting file to base64
    });
    
    // Clear the file input so user can select same file again if needed
    e.target.value = '';
  };

  // When user clicks X button to remove an uploaded image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index) // Remove image at that position
    }));
  };

  // When user clicks "Add Property" button to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Don't refresh the page
    setLoading(true); // Show loading spinner

    try {
      // Prepare the data to send to the server
      const newProperty = {
        title: formData.title,
        location: formData.location,
        pricePerNight: parseInt(formData.pricePerNight), // Convert text to number
        description: formData.description,
        maxGuests: parseInt(formData.maxGuests), // Convert text to number
        amenities: formData.amenities,
        images: formData.images // Send the base64 image data
      };

      console.log('Submitting property:', newProperty);
      
      // Send the property data to the backend server
      const result = await apiService.createProperty(newProperty);
      console.log('Property created successfully:', result);
      
      alert('Property added successfully!'); // Show success message
      navigate('/property-dashboard'); // Go back to dashboard
    } catch (error) {
      console.error('Error adding property:', error);
      alert(`Failed to add property: ${error.message}`); // Show error message
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-4">
            <button className="btn btn-outline-secondary me-3" onClick={handleBack}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="fw-bold mb-0">Add New Property</h2>
          </div>

          <div className="card border-0 shadow-sm" style={cardStyle}>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Property Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Cozy Beach Villa"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Goa, India"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Price per Night (₹)</label>
                    <input
                      type="number"
                      name="pricePerNight"
                      className="form-control"
                      value={formData.pricePerNight}
                      onChange={handleInputChange}
                      placeholder="5000"
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Max Guests</label>
                    <input
                      type="number"
                      name="maxGuests"
                      className="form-control"
                      value={formData.maxGuests}
                      onChange={handleInputChange}
                      placeholder="4"
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property..."
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Amenities</label>
                  <div className="row">
                    {amenitiesList.map(amenity => (
                      <div key={amenity} className="col-md-3 col-6 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                          />
                          <label className="form-check-label">{amenity}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Property Images</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.images.length > 0 && (
                    <div className="row mt-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="col-md-3 col-6 mb-2">
                          <div className="position-relative">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="img-fluid rounded"
                              style={imageStyle}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              onClick={() => removeImage(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={handleBack}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 fw-semibold"
                    style={buttonStyle}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Adding Property...
                      </>
                    ) : (
                      'Add Property'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
