import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold text-center mb-4">About StayNJoy</h1>
          
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Our Mission</h3>
              <p className="text-muted">
                StayNJoy connects travelers with unique accommodations worldwide. Founded in 2026, 
                we've helped over 1 million guests find their perfect stay.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">What We Do</h3>
              <p className="text-muted">
                We provide a trusted platform for property owners to list their spaces and for 
                travelers to discover authentic local experiences in over 50 countries.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Our Values</h3>
              <ul className="text-muted">
                <li>Trust and Safety First</li>
                <li>Exceptional Customer Service</li>
                <li>Supporting Local Communities</li>
                <li>Innovation in Travel Technology</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;