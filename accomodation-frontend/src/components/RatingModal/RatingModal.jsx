import React, { useState } from 'react';
import apiService from '../../services/api';
import Toast from '../Toast/Toast';

const RatingModal = ({ show, onClose, booking, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        propertyId: booking.propertyId,
        bookingId: booking.id,
        rating: rating,
        comment: comment.trim(),
        userEmail: localStorage.getItem('userEmail')
      };

      await apiService.createReview(reviewData);
      onRatingSubmitted('Review submitted successfully!');
      onClose();
      setRating(0);
      setComment('');
    } catch (error) {
      const friendlyMessage = error.message.includes('already reviewed') 
        ? 'You have already submitted a review for this booking.' 
        : `Failed to submit review: ${error.message}`;
      showToast(friendlyMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Rate Your Stay</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="text-center mb-4">
                <h6>{booking.property?.title}</h6>
                <p className="text-muted">{booking.property?.location}</p>
              </div>

              <div className="mb-4">
                <label className="form-label">Rating</label>
                <div className="d-flex justify-content-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star fs-2 mx-1 ${
                        star <= (hoveredRating || rating) ? 'text-warning' : 'text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    ></i>
                  ))}
                </div>
                <div className="text-center">
                  <small className="text-muted">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Comment (Optional)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength="1000"
                ></textarea>
                <div className="form-text">{comment.length}/1000 characters</div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-warning" 
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
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

export default RatingModal;