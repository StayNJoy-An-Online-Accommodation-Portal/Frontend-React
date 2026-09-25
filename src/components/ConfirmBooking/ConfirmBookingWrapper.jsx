import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmBooking from './ConfirmBooking';
import { authUtils } from '../../utils/auth';

const ConfirmBookingWrapper = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get pending bookings from localStorage
    const pendingBookings = localStorage.getItem('pendingBookings');
    if (pendingBookings) {
      setBookings(JSON.parse(pendingBookings));
      localStorage.removeItem('pendingBookings');
    } else {
      // No pending bookings, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  if (bookings.length === 0) {
    return null; // Loading or redirecting
  }

  return <ConfirmBooking bookings={bookings} onBack={handleBack} />;
};

export default ConfirmBookingWrapper;