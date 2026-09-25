// This is the main communication bridge between our React frontend and Java Spring Boot backend
// Think of it like a translator that helps the website talk to the database server
// All the functions here send requests to get data, save data, update data, or delete data

// API service for backend integration
const API_BASE_URL = import.meta.env.PROD ? '/api/proxy/api' : 'http://localhost:8081/api';
console.log('API_BASE_URL:', API_BASE_URL, 'PROD:', import.meta.env.PROD);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL; // The address where our backend server lives
  }

  // Functions to manage login tokens (like a digital ID card)
  getAuthToken() {
    return localStorage.getItem('authToken'); // Get the user's login token from browser storage
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token); // Save the user's login token to browser storage
  }

  removeAuthToken() {
    localStorage.removeItem('authToken'); // Delete the login token (for logout)
  }

  // The main function that sends requests to the backend server
  // All other functions use this one to actually talk to the server
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`; // Build the full web address
    const token = this.getAuthToken(); // Get user's login token if they're logged in
    
    // Set up the request with headers (like putting a return address on a letter)
    const config = {
      headers: {
        'Content-Type': 'application/json', // Tell server we're sending JSON data
        ...(token && { 'Authorization': `Bearer ${token}` }), // Include login token if user is logged in
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config); // Actually send the request to server
      
      // Check if the server responded with an error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle different types of responses from server
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json(); // Return the data if server sent JSON
      } else {
        return {}; // Return empty object for operations like delete that don't return data
      }
    } catch (error) {
      // If we can't reach the server at all, give a helpful error message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Backend server is not running. Please start the backend server.');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // === USER AUTHENTICATION FUNCTIONS ===
  // These handle user registration, login, and logout
  
  async register(userData) {
    // Create a new user account
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    // Log in an existing user
    const response = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // If login successful, save the token for future requests
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async logout() {
    // Log out the current user by removing their token
    this.removeAuthToken();
  }

  // === USER MANAGEMENT FUNCTIONS ===
  // These are mainly used by admins to manage users
  
  async getAllUsers() {
    // Get list of all registered users (admin only)
    return this.request('/users');
  }

  async getUserById(id) {
    // Get details of a specific user
    return this.request(`/users/${id}`);
  }

  async changePassword(email, passwordData) {
    // Change a user's password
    return this.request(`/users/${email}/password`, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  async toggleUserStatus(id) {
    // Block or unblock a user (admin only)
    return this.request(`/users/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  // === PROPERTY MANAGEMENT FUNCTIONS ===
  // These handle all property-related operations
  
  async getAllProperties() {
    // Get all approved properties (for regular users to browse)
    return this.request('/properties/approved');
  }

  async getAllPropertiesForAdmin() {
    // Get all properties including pending ones (admin only)
    try {
      return this.request('/properties');
    } catch (error) {
      console.log('Properties endpoint failed, using approved');
      return this.request('/properties/approved'); // Fallback to approved only
    }
  }

  async getPropertyRooms(propertyId) {
    // Get rooms for a specific property (currently returns all approved)
    return this.request('/properties/approved');
  }

  async searchProperties(searchParams) {
    // Search for properties based on location, price, etc.
    const queryString = new URLSearchParams(searchParams).toString();
    return this.request(`/properties/search?${queryString}`);
  }

  async createProperty(propertyData) {
    // Add a new property (property owners only)
    const ownerEmail = localStorage.getItem('userEmail');
    return this.request(`/properties?ownerEmail=${ownerEmail}`, {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id, propertyData) {
    // Update an existing property (property owners only)
    const ownerEmail = localStorage.getItem('userEmail');
    return this.request(`/properties/${id}?ownerEmail=${ownerEmail}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id) {
    // Delete a property (property owners and admins only)
    const ownerEmail = localStorage.getItem('userEmail');
    return this.request(`/properties/${id}/owner?ownerEmail=${encodeURIComponent(ownerEmail)}`, {
      method: 'DELETE',
    });
  }

  async getOwnerProperties() {
    // Get all properties owned by the current user
    const ownerEmail = localStorage.getItem('userEmail');
    return this.request(`/properties/owner/${ownerEmail}`);
  }

  async getPropertyById(id) {
    // Get details of a specific property
    return this.request(`/properties/${id}`);
  }

  // === BOOKING MANAGEMENT FUNCTIONS ===
  // These handle reservations and bookings
  
  async createBooking(bookingData) {
    // Make a new booking/reservation
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings() {
    // Get all bookings made by the current user
    const userEmail = localStorage.getItem('userEmail');
    return this.request(`/bookings/user/${userEmail}`);
  }

  async getAllBookings() {
    // Get all bookings in the system (admin only)
    return this.request('/bookings');
  }

  async updatePropertyStatus(id, status) {
    // Approve or reject a property (admin only)
    return this.request(`/properties/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  }

  async cancelBooking(id) {
    // Cancel an existing booking
    const userEmail = localStorage.getItem('userEmail');
    return this.request(`/bookings/${id}/cancel?userEmail=${encodeURIComponent(userEmail)}`, {
      method: 'PUT',
    });
  }

  // === SHOPPING CART FUNCTIONS ===
  // These handle the booking cart (currently not fully implemented)
  
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(item) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/remove/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // === SEARCH AND DISCOVERY FUNCTIONS ===
  
  async searchGlobal(query) {
    // Search across all content on the platform
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }

  async getCarouselImages() {
    // Get images for the homepage carousel
    return this.request('/carousel/images');
  }

  // === COMMUNICATION FUNCTIONS ===
  
  async sendChatMessage(message) {
    // Send message to chatbot (if implemented)
    return this.request('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async submitHelpRequest(helpData) {
    // Submit a help request or support ticket
    return this.request('/help/submit', {
      method: 'POST',
      body: JSON.stringify(helpData),
    });
  }

  async getHelpRequests() {
    // Get all help requests (admin only)
    return this.request('/help/requests');
  }

  // === DASHBOARD AND ANALYTICS FUNCTIONS ===
  
  async getAdminDashboard() {
    // Get admin dashboard data
    return this.request('/dashboard/admin');
  }

  async getOwnerDashboard() {
    // Get property owner dashboard data
    return this.request('/dashboard/owner');
  }

  async getAnalytics(type) {
    // Get analytics data for charts and reports
    return this.request(`/analytics/${type}`);
  }

  // === NOTIFICATION FUNCTIONS ===
  
  async getNotifications() {
    // Get user's notifications
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    // Mark a notification as read
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // === TESTING FUNCTIONS ===
  
  async testConnection() {
    // Test if backend server is reachable
    return this.request('/test/connection');
  }

  async testDataSubmission(data) {
    // Test data submission to backend
    return this.request('/test/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // === USER PROFILE FUNCTIONS ===
  
  async updateProfile(profileData) {
    // Update user's profile information
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile() {
    // Get current user's profile information
    return this.request('/users/profile');
  }

  // === REVIEW AND RATING FUNCTIONS ===
  
  async createReview(reviewData) {
    // Submit a review for a property after staying
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getPropertyReviews(propertyId) {
    // Get all reviews for a specific property
    return this.request(`/reviews/property/${propertyId}`);
  }

  async getUserReviews(userEmail) {
    // Get all reviews written by a specific user
    return this.request(`/reviews/user/${userEmail}`);
  }

  // === COMPLAINT MANAGEMENT FUNCTIONS ===
  
  async createComplaint(complaintData) {
    // Submit a complaint about a property or service
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }

  async getUserComplaints(userEmail) {
    // Get all complaints submitted by a user
    return this.request(`/complaints/user/${userEmail}`);
  }

  async getAllComplaints() {
    // Get all complaints in the system (admin only)
    return this.request('/complaints/admin/all');
  }

  async updateComplaintStatus(complaintId, statusData) {
    // Update the status of a complaint (admin only)
    return this.request(`/complaints/${complaintId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }
}

// Create a single instance of the API service that the whole app can use
export const apiService = new ApiService();
export default apiService;
