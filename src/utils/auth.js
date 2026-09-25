// Auth utility for global state management
import apiService from '../services/api';

export const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout'
};

export const authUtils = {
  login: (userData) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userRole', userData.role || 'user');
    
    // Dispatch global event for immediate UI updates
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN, { 
      detail: userData 
    }));
    
    // Force storage event for cross-component sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userName',
      newValue: userData.name,
      storageArea: localStorage
    }));
  },

  logout: async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout API call failed, proceeding with local logout');
    }
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('pendingBookings');
    localStorage.removeItem('redirectAfterLogin');
    localStorage.removeItem('authToken');
    
    // Dispatch global event
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
    
    // Force storage event for cross-component sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userName',
      newValue: null,
      storageArea: localStorage
    }));
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  getUserRole: () => {
    return localStorage.getItem('userRole') || 'user';
  },

  getUserName: () => {
    return localStorage.getItem('userName') || '';
  },

  hasRole: (role) => {
    return authUtils.getUserRole() === role;
  },

  setRedirectAfterLogin: (path) => {
    localStorage.setItem('redirectAfterLogin', path);
  },

  getRedirectAfterLogin: () => {
    const redirect = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');
    return redirect;
  }
};