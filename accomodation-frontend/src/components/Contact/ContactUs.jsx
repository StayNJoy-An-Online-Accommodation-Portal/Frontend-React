import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="fw-bold">Contact Us</h1>
            <p className="text-muted">Have a question or need help? We're here to assist you.</p>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Message *</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary px-4 py-2" style={{ backgroundColor: '#ff385c', border: 'none' }}>
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="row mt-5 text-center">
            <div className="col-md-4">
              <i className="fas fa-envelope fs-2 text-primary mb-3"></i>
              <h5>Email</h5>
              <p className="text-muted">staynjoy@gmail.com</p>
            </div>
            <div className="col-md-4">
              <i className="fas fa-phone fs-2 text-primary mb-3"></i>
              <h5>Phone</h5>
              <p className="text-muted">+91 9988776655</p>
            </div>
            <div className="col-md-4">
              <i className="fas fa-clock fs-2 text-primary mb-3"></i>
              <h5>Support Hours</h5>
              <p className="text-muted">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;