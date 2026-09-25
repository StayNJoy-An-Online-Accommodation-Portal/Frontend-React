import { useState } from "react";

const ALL_AMENITIES = ["WiFi", "AC", "TV", "Parking", "Kitchen", "Pool", "Gym", "Balcony"];

export default function EditProperty({ property, onClose, onSave }) {
  const [form, setForm] = useState({ ...property });

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalBody: {
      padding: '24px'
    },
    modalFooter: {
      padding: '20px 24px',
      borderTop: '1px solid #e9ecef',
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6c757d',
      padding: '0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#212529'
    },
    imageGallery: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '24px'
    },
    imageWrapper: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '80px',
      objectFit: 'cover'
    },
    deleteImageBtn: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    counter: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    counterBtn: {
      width: '36px',
      height: '36px',
      border: '1px solid #dee2e6',
      borderRadius: '50%',
      background: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },
    counterValue: {
      fontSize: '16px',
      fontWeight: '500',
      minWidth: '30px',
      textAlign: 'center'
    },
    amenitiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '8px'
    },
    amenityChip: {
      padding: '8px 12px',
      border: '1px solid #dee2e6',
      borderRadius: '20px',
      background: 'white',
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    amenityChipActive: {
      backgroundColor: '#ff385c',
      color: 'white',
      borderColor: '#ff385c'
    },
    priceInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      fontSize: '16px'
    },
    earnAmount: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#28a745'
    },
    locationText: {
      color: '#6c757d',
      fontSize: '14px'
    },
    primaryBtn: {
      backgroundColor: '#ff385c',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    secondaryBtn: {
      backgroundColor: 'white',
      color: '#6c757d',
      border: '1px solid #dee2e6',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    fileInput: {
      width: '100%',
      padding: '12px',
      border: '2px dashed #dee2e6',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      cursor: 'pointer',
      textAlign: 'center',
      marginTop: '12px'
    }
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const removeImage = (index) => {
    if (form.images) {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setForm((prev) => ({
      ...prev,
      images: prev.images ? [...prev.images, ...imageUrls] : imageUrls,
      image: prev.images ? prev.image : imageUrls[0] // Update main image if no images array
    }));
  };

  const handleSave = () => {
    // Ensure the form data matches the backend DTO structure
    const updatedProperty = {
      title: form.title || '',
      location: form.location || '',
      pricePerNight: parseFloat(form.pricePerNight) || 0,
      description: form.description || '',
      maxGuests: parseInt(form.maxGuests) || 1,
      amenities: form.amenities || [],
      images: form.images || []
    };
    console.log('Saving property with data:', updatedProperty);
    onSave(updatedProperty);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={handleOverlayClick}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Edit Property – {form.title}
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Image Gallery */}
          {(form.images || form.image) && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Property Images</h4>
              <div style={styles.imageGallery}>
                {form.images ? (
                  form.images.map((img, index) => (
                    <div key={index} style={styles.imageWrapper}>
                      <img src={img} alt="property" style={styles.image} />
                      <button
                        style={styles.deleteImageBtn}
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={styles.imageWrapper}>
                    <img src={form.image} alt="property" style={styles.image} />
                  </div>
                )}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.fileInput}
              />
            </div>
          )}

          {/* Location */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Location</h4>
            <p style={styles.locationText}>{form.location}</p>
          </div>

          {/* Earn Amount */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Total Earnings</h4>
            <p style={styles.earnAmount}>₹{(form.earnAmount || 0).toLocaleString()}</p>
          </div>

          {/* Max Guests */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Maximum Guests</h4>
            <div style={styles.counter}>
              <button
                style={styles.counterBtn}
                onClick={() =>
                  setForm({ ...form, maxGuests: Math.max(1, form.maxGuests - 1) })
                }
              >
                −
              </button>
              <span style={styles.counterValue}>{form.maxGuests}</span>
              <button
                style={styles.counterBtn}
                onClick={() =>
                  setForm({ ...form, maxGuests: form.maxGuests + 1 })
                }
              >
                +
              </button>
            </div>
          </div>

          {/* Amenities */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Amenities</h4>
            <div style={styles.amenitiesGrid}>
              {ALL_AMENITIES.map((item) => (
                <span
                  key={item}
                  style={{
                    ...styles.amenityChip,
                    ...(form.amenities.includes(item) ? styles.amenityChipActive : {})
                  }}
                  onClick={() => toggleAmenity(item)}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Price per Night (₹)</h4>
            <input
              type="number"
              style={styles.priceInput}
              value={form.pricePerNight}
              onChange={(e) =>
                setForm({ ...form, pricePerNight: Number(e.target.value) })
              }
              min="1"
            />
          </div>

          {/* Title */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Property Title</h4>
            <input
              type="text"
              style={styles.priceInput}
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Description</h4>
            <textarea
              style={{...styles.priceInput, minHeight: '80px'}}
              value={form.description || ''}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.primaryBtn} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}