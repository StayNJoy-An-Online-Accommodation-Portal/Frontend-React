import React, { useState, useRef, useEffect } from 'react';

const ChatBot = ({ isOpen, onClose = () => {} }) => {
  /* ================ STATE ================ */
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi! I'm StayEase's assistant. I can help with bookings, payments, cancellations, and more. What do you need help with?", 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  /* ================ EFFECTS ================ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ================ STYLES ================ */
  const styles = {
    container: {
      zIndex: 1050, 
      width: '350px', 
      height: '500px'
    },
    card: {
      borderRadius: '25px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.2)'
    },
    header: {
      background: 'linear-gradient(135deg, #ff385c, #e61e4d)', 
      borderRadius: '23px 23px 0 0',
      boxShadow: '0 2px 10px rgba(255,56,92,0.3)'
    },
    avatar: {
      width: '35px', 
      height: '35px'
    },
    closeButton: {
      fontSize: '1.2rem'
    },
    messagesBody: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderLeft: '2px solid rgba(255,255,255,0.1)',
      borderRight: '2px solid rgba(255,255,255,0.1)'
    },
    userMessage: {
      maxWidth: '75%',
      borderRadius: '18px 18px 5px 18px',
      boxShadow: '0 4px 12px rgba(13,110,253,0.3), 0 2px 4px rgba(0,0,0,0.1)',
      border: 'none'
    },
    botMessage: {
      maxWidth: '75%',
      borderRadius: '18px 18px 18px 5px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.05)'
    },
    typingIndicator: {
      borderRadius: '18px 18px 18px 5px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.05)'
    },
    footer: {
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '0 0 23px 23px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      borderTop: '1px solid rgba(0,0,0,0.05)'
    },
    input: {
      borderRadius: '25px 0 0 25px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.1)'
    },
    sendButton: {
      borderRadius: '0 25px 25px 0', 
      background: 'linear-gradient(135deg, #ff385c, #e61e4d)',
      boxShadow: '0 4px 12px rgba(255,56,92,0.3), 0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,56,92,0.2)'
    }
  };

  /* ================ HANDLERS ================ */
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('book') || input.includes('reservation')) {
      return "To make a booking, browse our available rooms and click 'Book Now'. You'll need to provide check-in/out dates and guest details.";
    }
    if (input.includes('cancel')) {
      return "You can cancel bookings up to 24 hours before check-in for a full refund. Go to 'My Bookings' to manage your reservations.";
    }
    if (input.includes('payment') || input.includes('pay')) {
      return "We accept all major credit cards and PayPal. Payments are processed securely and you'll receive confirmation within minutes.";
    }
    if (input.includes('refund')) {
      return "Refunds are processed within 5-7 business days. Cancellations made 24+ hours before check-in receive full refunds.";
    }
    if (input.includes('contact') || input.includes('support')) {
      return "Our support team is available 24/7 at support@stayease.com or call 1-800-ROOMS. You can also check our Help Center.";
    }
    if (input.includes('check') && (input.includes('in') || input.includes('out'))) {
      return "Standard check-in is 3:00 PM and check-out is 11:00 AM. Contact your host for early/late arrangements.";
    }
    if (input.includes('price') || input.includes('cost')) {
      return "Room prices vary by location, dates, and amenities. Use our search filters to find options within your budget.";
    }
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help with your booking questions. What can I assist you with today?";
    }
    
    return "I'm here to help with bookings, payments, cancellations, and general questions. Could you please be more specific about what you need help with?";
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getResponse(currentInput),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /* ================ UI ================ */
  if (!isOpen) return null;

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={styles.container}>
      <div className="card border-0 h-100" style={styles.card}>
        {/* Header */}
        <div className="card-header border-0 d-flex align-items-center justify-content-between p-3" style={styles.header}>
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-2" style={styles.avatar}>
              <i className="fas fa-robot text-primary"></i>
            </div>
            <div>
              <h6 className="text-white mb-0 fw-bold">StayEase's Assistant</h6>
              <small className="text-white-50">Online now</small>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm text-white p-0" style={styles.closeButton}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="card-body p-3 overflow-auto" style={styles.messagesBody}>
          {messages.map(message => (
            <div key={message.id} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div 
                className={`p-2 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-dark'}`} 
                style={message.sender === 'user' ? styles.userMessage : styles.botMessage}
              >
                <p className="mb-1 small">{message.text}</p>
                <small className={message.sender === 'user' ? 'text-white-50' : 'text-muted'}>
                  {formatTimestamp(message.timestamp)}
                </small>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="bg-white p-2" style={styles.typingIndicator}>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="card-footer border-0 p-3" style={styles.footer}>
          <div className="input-group">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={styles.input}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading || !inputText.trim()}
              className="btn btn-primary border-0"
              style={styles.sendButton}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        
        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #999;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
