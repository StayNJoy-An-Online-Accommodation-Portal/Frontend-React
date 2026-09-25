import React from 'react';

const Privacy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold text-center mb-4">Privacy Policy</h1>
          <p className="text-center text-muted mb-5">Last updated: January 1, 2026</p>
          
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Information We Collect</h3>
              <p className="text-muted">
                We collect information you provide directly to us, such as when you create an account, 
                make a booking, or contact us for support.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">How We Use Your Information</h3>
              <p className="text-muted">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Information Sharing</h3>
              <p className="text-muted">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Contact Us</h3>
              <p className="text-muted">
                If you have questions about this Privacy Policy, please contact us at privacy@staynjoy.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;