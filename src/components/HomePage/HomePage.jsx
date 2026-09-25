import React, { useState, useEffect } from "react";
import AppLayout from "../Layout/AppLayout";
import Navbar from "../Navbar/Navbar";
import Carousel from "../Carousel/Carousel";
import BookingCart from "../Booking/BookingCart";
import RoomCard from "../Room/RoomCard";
import RoomDetails from "../Room/RoomDetails";
import ConfirmBooking from "../ConfirmBooking/ConfirmBooking";
import Login from "../Login/Login";
import ChatBot from "../ChatBot/ChatBot";
import { dataStore } from "../../utils/enhancedDataStore";
import apiService from "../../services/api";

const HomePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const rooms = await dataStore.getAllRooms();
        console.log('Loaded rooms from database:', rooms);
        // Map database format to frontend format
        const mappedRooms = rooms.map(room => {
          // Generate dynamic dates (today + 1 day for checkin, today + 3 days for checkout)
          const today = new Date();
          const checkInDate = new Date(today);
          checkInDate.setDate(today.getDate() + 1);
          const checkOutDate = new Date(today);
          checkOutDate.setDate(today.getDate() + 3);
          
          const formatDate = (date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${date.getDate()} ${months[date.getMonth()]}`;
          };
          
          return {
            ...room,
            price: room.pricePerNight || room.price,
            image: room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
            nights: 2,
            checkIn: formatDate(checkInDate),
            checkOut: formatDate(checkOutDate),
            amenities: room.amenities || []
          };
        });
        setAllRooms(mappedRooms);
        setFilteredRooms(mappedRooms);
      } catch (error) {
        console.error('Failed to load rooms:', error);
      }
    };
    
    loadRooms();
  }, []);

  useEffect(() => {
    const handleSearchEvent = (event) => {
      const query = event.detail;
      setSearchQuery(query);
      performSearch(query);
    };

    window.addEventListener('search', handleSearchEvent);
    return () => window.removeEventListener('search', handleSearchEvent);
  }, [allRooms]);

  useEffect(() => {
    const handleClearSearchEvent = () => {
      setSearchQuery("");
      performSearch("");
    };

    window.addEventListener('clearSearch', handleClearSearchEvent);
    return () => window.removeEventListener('clearSearch', handleClearSearchEvent);
  }, [allRooms]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRemove = (bookingIndex) => {
    setBookings((prev) => prev.filter((_, index) => index !== bookingIndex));
  };

  const handleUpdateGuests = (bookingIndex, guests) => {
    setBookings(prev => prev.map((booking, index) => 
      index === bookingIndex ? { ...booking, guests } : booking
    ));
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRoom(null);
  };

  const handleBookRoom = async (room) => {
    try {
      // Add to local cart only, don't save to database yet
      setBookings(prev => [...prev, room]);
      setShowDetails(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Failed to book room:', error);
      // Still add to local cart as fallback
      setBookings(prev => [...prev, room]);
      setShowDetails(false);
      setSelectedRoom(null);
    }
  };

  const handleReserve = (bookings) => {
    setSelectedBooking(bookings);
    setShowConfirmBooking(true);
  };

  const handleBackToListings = () => {
    setShowConfirmBooking(false);
    setSelectedBooking(null);
  };

  const performSearch = (query) => {
    if (!query.trim()) {
      setFilteredRooms(allRooms);
      setNoResultsMessage("");
    } else {
      const filtered = allRooms.filter(room =>
        room.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRooms(filtered);
      if (filtered.length === 0) {
        setNoResultsMessage(`Sorry, no rooms are currently available in "${query}". Please try searching for a different location or check back later for new listings.`);
      } else {
        setNoResultsMessage("");
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    performSearch("");
  };

  const handleNavbarLogin = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatBotToggle = () => {
    setShowChatBot(!showChatBot);
  };

  if (showLogin) {
    return (
      <Login onLoginSuccess={handleLoginSuccess} onBack={() => setShowLogin(false)} />
    );
  }

  if (showConfirmBooking) {
    return (
      <ConfirmBooking 
        bookings={selectedBooking}
        onBack={handleBackToListings}
      />
    );
  }
  return (
    <>
      {/* Carousel with gap from navbar */}
      <div className="mt-2">
        <Carousel />
      </div>
      
      {/* Main Content */}
      <div className="container py-4">
        <div className="row">
          <div className={bookings.length > 0 ? "col-lg-8" : "col-12"}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Available Rooms</h2>
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleClearSearch}
                  title="Clear search and show all rooms"
                >
                  <i className="fas fa-times me-1"></i>
                  Clear Search
                </button>
              )}
            </div>
            <div className="row g-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={bookings.length > 0 ? "col-md-6 col-lg-4" : "col-md-4 col-lg-3"}
                >
                  <RoomCard room={room} onViewDetails={handleViewDetails} />
                </div>
              ))}
            </div>
            {noResultsMessage && (
              <div className="text-center mt-4">
                <div className="alert alert-info" role="alert">
                  <i className="fas fa-info-circle me-2"></i>
                  {noResultsMessage}
                </div>
              </div>
            )}
          </div>

          {bookings.length > 0 && (
            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="sticky-content">
                <BookingCart
                  bookings={bookings}
                  onRemove={handleRemove}
                  onReserve={handleReserve}
                  onUpdateGuests={handleUpdateGuests}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <RoomDetails
        room={selectedRoom}
        show={showDetails}
        onClose={handleCloseDetails}
        onBook={handleBookRoom}
        existingBookings={dataStore.getAllBookings()}
      />

      {/* Fixed Buttons */}
      <div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000}}>
        {/* Chatbot Button */}
        <button 
          className="btn btn-primary rounded-circle mb-3 shadow"
          style={{width: '60px', height: '60px', background: 'linear-gradient(135deg, #ff385c, #e61e4d)', border: 'none'}}
          onClick={handleChatBotToggle}
          title="Chat with us"
        >
          <i className="fas fa-comments fs-5"></i>
        </button>
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button 
            className="btn btn-secondary rounded-circle shadow d-block"
            style={{width: '50px', height: '50px'}}
            onClick={scrollToTop}
            title="Scroll to top"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        )}
      </div>

      {/* ChatBot Component */}
      <ChatBot 
        isOpen={showChatBot} 
        onClose={() => setShowChatBot(false)} 
      />
    </>
  );
};

export default HomePage;

