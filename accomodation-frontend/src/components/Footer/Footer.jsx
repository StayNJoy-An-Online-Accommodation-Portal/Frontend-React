import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Footer data structure for dynamic rendering
  const footerData = {
    company: {
      title: 'Company',
      links: [
        { text: 'About', url: '/about', external: false },
        { text: 'Events', url: '/events', external: false }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { text: 'Help Center', url: '/help', external: false },
        { text: 'Contact Us', url: '/contact', external: false }
      ]
    },
    hosting: {
      title: 'Hosting',
      links: [
        { text: 'Become a Host', url: '/property-dashboard', external: false },
        { text: 'Host Support', url: '/help', external: false }
      ]
    }
  };

  const legalLinks = [
    { text: 'Terms', url: '/terms' },
    { text: 'Privacy', url: '/privacy' },
    { text: 'Help', url: '/help' }
  ];

  const renderLink = (link) => {
    if (link.external) {
      return (
        <a 
          href={link.url} 
          className="text-decoration-none text-dark d-block mb-2 hover-red"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {link.text}
        </a>
      );
    }
    return (
      <Link 
        to={link.url} 
        className="text-decoration-none text-dark d-block mb-2 hover-red"
      >
        {link.text}
      </Link>
    );
  };

  return (
    <footer style={{ backgroundColor: '#f5f7fa' }} className="border-top">
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          {/* Dynamic Footer Columns */}
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key} className="col-6 col-md-4 text-center">
              <h5 className="fw-bold mb-3">{section.title}</h5>
              <ul className="list-unstyled">
                {section.links.map((link, index) => (
                  <li key={index}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-top py-3 text-center text-muted small">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0">&copy; {new Date().getFullYear()} StayNJoy, All rights reserved.</p>
          <div className="d-flex gap-3">
            {legalLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.url} 
                className="text-decoration-none text-muted hover-red"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;