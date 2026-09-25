import React from 'react';

const Terms = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold text-center mb-4">Terms of Service</h1>
          <p className="text-center text-muted mb-5">Last updated: January 1, 2026</p>
          
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">1. Acceptance of Terms</h3>
              <p className="text-muted">
                By accessing and using StayNJoy, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">2. Use License</h3>
              <p className="text-muted">
                Permission is granted to temporarily use StayNJoy for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">3. Booking and Payments</h3>
              <p className="text-muted">
                All bookings are subject to availability and confirmation. Payment is required 
                at the time of booking. Cancellation policies vary by property.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">4. Contact Information</h3>
              <p className="text-muted">
                Questions about the Terms of Service should be sent to us at legal@staynjoy.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;