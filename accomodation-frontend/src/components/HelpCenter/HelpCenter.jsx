import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from '../ChatBot/ChatBot';

const HelpCenter = ({ onBack }) => {
  /* ================ STATE ================ */
  const [activeSection, setActiveSection] = useState('about');
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();

  /* ================ CONSTANTS ================ */
  const sections = [
    { id: 'about', title: 'About StayNJoy', icon: 'fas fa-info-circle' },
    { id: 'booking', title: 'Booking & Reservations', icon: 'fas fa-calendar-check' },
    { id: 'payments', title: 'Payments & Refunds', icon: 'fas fa-credit-card' },
    { id: 'cancellations', title: 'Cancellations', icon: 'fas fa-times-circle' },
    { id: 'checkin', title: 'Check-in / Check-out', icon: 'fas fa-key' },
    { id: 'account', title: 'Account & Login', icon: 'fas fa-user-cog' },
    { id: 'hosts', title: 'Property Owners', icon: 'fas fa-home' },
    { id: 'contact', title: 'Contact & Support', icon: 'fas fa-headset' }
  ];

  const content = {
    about: {
      title: 'About StayNJoy',
      items: [
        {
          question: 'What is StayNJoy?',
          answer: 'StayNJoy is a trusted platform connecting travelers with unique accommodations worldwide. We help you find the perfect place to stay, from cozy apartments to luxury villas.'
        },
        {
          question: 'How does StayNJoy work?',
          answer: 'Simply search for your destination, browse available properties, read reviews, and book instantly. Our secure platform handles payments and provides 24/7 support.'
        },
        {
          question: 'Is StayNJoy safe to use?',
          answer: 'Yes! We verify all properties and hosts, use secure payment processing, and provide comprehensive insurance coverage for your peace of mind.'
        }
      ]
    },
    booking: {
      title: 'Booking & Reservations',
      items: [
        {
          question: 'How do I make a booking?',
          answer: 'Search for your destination, select dates, choose a property, review details, and click "Reserve". You\'ll receive instant confirmation via email.'
        },
        {
          question: 'Can I modify my booking?',
          answer: 'Yes, you can modify dates or guest count up to 24 hours before check-in, subject to availability and the host\'s cancellation policy.'
        },
        {
          question: 'What if my booking is declined?',
          answer: 'If a host declines your request, you\'ll receive a full refund within 3-5 business days. We\'ll also help you find alternative accommodations.'
        }
      ]
    },
    payments: {
      title: 'Payments & Refunds',
      items: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, PayPal, and digital wallets. All transactions are secured with bank-level encryption.'
        },
        {
          question: 'When am I charged?',
          answer: 'You\'re charged immediately upon booking confirmation. For longer stays, we may split payments with a portion due at booking and the rest before check-in.'
        },
        {
          question: 'How do refunds work?',
          answer: 'Refunds are processed according to the property\'s cancellation policy. Eligible refunds are returned to your original payment method within 5-10 business days.'
        }
      ]
    },
    cancellations: {
      title: 'Cancellations',
      items: [
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel through your account dashboard. Refund eligibility depends on the property\'s cancellation policy and timing of your cancellation.'
        },
        {
          question: 'What are the cancellation policies?',
          answer: 'Policies vary by property: Flexible (full refund 24h before), Moderate (full refund 5 days before), or Strict (50% refund 7 days before).'
        },
        {
          question: 'What if the host cancels?',
          answer: 'If a host cancels, you\'ll receive a full refund plus a travel credit. We\'ll also help you find comparable alternative accommodations.'
        }
      ]
    },
    checkin: {
      title: 'Check-in / Check-out',
      items: [
        {
          question: 'How do I check in?',
          answer: 'Check-in details are provided 48 hours before arrival. This includes property address, access codes, and host contact information.'
        },
        {
          question: 'What if I arrive early or late?',
          answer: 'Standard check-in is 3 PM and check-out is 11 AM. For different times, coordinate directly with your host through our messaging system.'
        },
        {
          question: 'What should I do if I can\'t access the property?',
          answer: 'Contact your host immediately through the app. If unavailable, call our 24/7 support line for immediate assistance.'
        }
      ]
    },
    account: {
      title: 'Account & Login Issues',
      items: [
        {
          question: 'I forgot my password',
          answer: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your registered email address within minutes.'
        },
        {
          question: 'How do I update my profile?',
          answer: 'Go to Account Settings to update personal information, payment methods, and preferences. Changes are saved automatically.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account in Settings > Privacy. Note that this action is permanent and cannot be undone.'
        }
      ]
    },
    hosts: {
      title: 'Property Owners / Hosts',
      items: [
        {
          question: 'How do I list my property?',
          answer: 'Click "Become a Host" to start listing. Add photos, description, amenities, and pricing. Our team reviews all listings within 24 hours.'
        },
        {
          question: 'What are the hosting fees?',
          answer: 'StayNJoy charges a 3% host service fee per booking. Guests pay a separate service fee. No upfront costs or monthly fees.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Payments are released 24 hours after guest check-in via bank transfer, PayPal, or other supported methods in your region.'
        }
      ]
    },
    contact: {
      title: 'Contact & Support',
      items: [
        {
          question: 'How can I contact support?',
          answer: 'Reach us via live chat (24/7), email at staynjoy@gmail.com, or phone at +91 9988776655. Average response time is under 2 hours.'
        },
        {
          question: 'Do you have emergency support?',
          answer: 'Yes! Our 24/7 emergency hotline is available for urgent issues during your stay. Find the number in your booking confirmation.'
        },
        {
          question: 'Where are you located?',
          answer: 'StayNJoy headquarters: Pune, Maharashtra. We operate globally with local support teams in major cities.'
        }
      ]
    }
  };

  /* ================ STYLES ================ */
  const styles = {
    sidebarCard: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    },
    mainCard: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    },
    accordionButton: {
      background: 'rgba(255,255,255,0.8)'
    },
    accordionBody: {
      background: 'rgba(255,255,255,0.9)'
    },
    quickContact: {
      background: 'rgba(255,56,92,0.1)'
    },
    liveChatButton: {
      background: '#ff385c',
      border: 'none'
    }
  };

  /* ================ COMPUTED VALUES ================ */
  const currentSection = sections.find(s => s.id === activeSection);
  const currentContent = content[activeSection];

  /* ================ HANDLERS ================ */
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleShowChatBot = () => {
    setShowChatBot(true);
  };

  const handleCloseChatBot = () => {
    setShowChatBot(false);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const getSectionButtonStyle = (sectionId) => ({
    background: activeSection === sectionId ? '#ff385c' : 'transparent',
    color: activeSection === sectionId ? 'white' : '#333'
  });

  /* ================ UI ================ */
  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm" style={styles.sidebarCard}>
            <div className="card-body p-3">
              <h5 className="fw-bold mb-3">
                <i className="fas fa-question-circle text-primary me-2"></i>
                Help Topics
              </h5>
              <div className="list-group list-group-flush">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`list-group-item list-group-item-action border-0 rounded mb-1 ${
                      activeSection === section.id ? 'active' : ''
                    }`}
                    style={getSectionButtonStyle(section.id)}
                  >
                    <i className={`${section.icon} me-2`}></i>
                    <small>{section.title}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm" style={styles.mainCard}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <i className={`${currentSection?.icon} text-primary fs-3 me-3`}></i>
                <h2 className="fw-bold mb-0">{currentContent?.title}</h2>
              </div>

              <div className="accordion" id="helpAccordion">
                {currentContent?.items.map((item, index) => (
                  <div key={index} className="accordion-item border-0 mb-3 rounded-3 shadow-sm">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${activeSection}${index}`}
                        style={styles.accordionButton}
                      >
                        {item.question}
                      </button>
                    </h3>
                    <div
                      id={`collapse${activeSection}${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#helpAccordion"
                    >
                      <div className="accordion-body" style={styles.accordionBody}>
                        <p className="mb-0 text-muted">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="mt-5 p-4 rounded-3" style={styles.quickContact}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="fw-bold text-primary mb-2">Still need help?</h5>
                    <p className="mb-0 text-muted">Our support team is available 24/7 to assist you.</p>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <button 
                      onClick={handleShowChatBot}
                      className="btn btn-primary px-4 py-2" 
                      style={styles.liveChatButton}
                    >
                      <i className="fas fa-comments me-2"></i>
                      Live Chat
                    </button>
                  </div>
                </div>
              </div>

              {(onBack || true) && (
                <div className="text-center mt-4">
                  <button 
                    onClick={handleBackClick}
                    className="btn btn-outline-secondary"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* ChatBot Component */}
      <ChatBot isOpen={showChatBot} onClose={handleCloseChatBot} />
    </div>
  );
};

export default HelpCenter;
