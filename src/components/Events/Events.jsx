import React from 'react';

const Events = () => {
  const events = [
    {
      title: 'StayEase Travel Summit 2026',
      date: 'March 15-17, 2026',
      location: 'Mumbai, India',
      description: 'Join industry leaders for networking and insights into the future of travel.'
    },
    {
      title: 'Host Appreciation Week',
      date: 'April 1-7, 2026',
      location: 'Global',
      description: 'Celebrating our amazing hosts with special rewards and recognition.'
    },
    {
      title: 'Tech Innovation Conference',
      date: 'June 20-22, 2026',
      location: 'Bangalore, India',
      description: 'Exploring cutting-edge technology in hospitality and travel booking.'
    }
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold text-center mb-5">Upcoming Events</h1>
          
          {events.map((event, index) => (
            <div key={index} className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h3 className="fw-bold text-primary">{event.title}</h3>
                <div className="d-flex gap-4 mb-3">
                  <span className="text-muted">
                    <i className="fas fa-calendar me-2"></i>
                    {event.date}
                  </span>
                  <span className="text-muted">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {event.location}
                  </span>
                </div>
                <p className="text-muted mb-0">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;