import { roomsData } from '../data/roomsData';
import apiService from '../services/api';

class DataStore {
  constructor() {
    this.listeners = [];
    this.complaints = JSON.parse(localStorage.getItem('globalComplaints') || '[]');
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback());
  }

  async getAllRooms() {
    return apiService.getAllProperties();
  }

  async getOwnerRooms(ownerEmail) {
    return apiService.getOwnerProperties();
  }

  async addRoom(roomData) {
    return apiService.createProperty(roomData);
  }

  async removeRoom(roomId) {
    console.log('DataStore: Removing room with ID:', roomId);
    const result = await apiService.deleteProperty(roomId);
    this.notify();
    return result;
  }

  async updateRoom(roomId, updatedData) {
    return apiService.updateProperty(roomId, updatedData);
  }

  async addBooking(booking) {
    return apiService.createBooking(booking);
  }

  async getAllBookings() {
    return apiService.getAllBookings();
  }

  async getUserBookings() {
    return apiService.getUserBookings();
  }

  async cancelBooking(bookingId) {
    return apiService.updateBookingStatus(bookingId, 'CANCELLED');
  }

  async searchProperties(searchParams) {
    return apiService.searchProperties(searchParams);
  }

  addComplaint(complaint) {
    this.complaints.push(complaint);
    localStorage.setItem('globalComplaints', JSON.stringify(this.complaints));
    return complaint;
  }

  getAllComplaints() {
    return [...this.complaints];
  }

  updateComplaintStatus(complaintId, status) {
    const index = this.complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      this.complaints[index].status = status;
      localStorage.setItem('globalComplaints', JSON.stringify(this.complaints));
      return this.complaints[index];
    }
    return null;
  }

  // Global admin actions
  updateUserStatus(userEmail, status) {
    const adminActions = JSON.parse(localStorage.getItem('adminActions') || '[]');
    const action = {
      id: Date.now(),
      type: 'USER_STATUS_UPDATE',
      userEmail,
      status,
      timestamp: new Date().toISOString(),
      adminEmail: localStorage.getItem('userEmail')
    };
    adminActions.push(action);
    localStorage.setItem('adminActions', JSON.stringify(adminActions));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('adminAction', { detail: action }));
    return action;
  }

  updatePropertyStatus(propertyId, status) {
    const adminActions = JSON.parse(localStorage.getItem('adminActions') || '[]');
    const action = {
      id: Date.now(),
      type: 'PROPERTY_STATUS_UPDATE',
      propertyId,
      status,
      timestamp: new Date().toISOString(),
      adminEmail: localStorage.getItem('userEmail')
    };
    adminActions.push(action);
    localStorage.setItem('adminActions', JSON.stringify(adminActions));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('adminAction', { detail: action }));
    return action;
  }

  deleteProperty(propertyId) {
    const adminActions = JSON.parse(localStorage.getItem('adminActions') || '[]');
    const action = {
      id: Date.now(),
      type: 'PROPERTY_DELETE',
      propertyId,
      timestamp: new Date().toISOString(),
      adminEmail: localStorage.getItem('userEmail')
    };
    adminActions.push(action);
    localStorage.setItem('adminActions', JSON.stringify(adminActions));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('adminAction', { detail: action }));
    return action;
  }

  getAdminActions() {
    return JSON.parse(localStorage.getItem('adminActions') || '[]');
  }

  isRoomAvailable(roomId, checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    return !this.bookings.some(booking => {
      if (booking.id !== roomId || booking.status === 'Cancelled') return false;

      const existingCheckIn = new Date(booking.checkInDate);
      const existingCheckOut = new Date(booking.checkOutDate);

      return checkIn < existingCheckOut && checkOut > existingCheckIn;
    });
  }

  // Cart functionality with API integration
  async getCart() {
    return apiService.getCart();
  }

  async addToCart(item) {
    return apiService.addToCart(item);
  }

  async removeFromCart(itemId) {
    return apiService.removeFromCart(itemId);
  }

  async clearCart() {
    return apiService.clearCart();
  }
}

export const dataStore = new DataStore();