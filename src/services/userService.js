import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

const userService = {
  // Fetch user details after successful login
  fetchUserAfterLogin: async (username) => {
    try {
      console.log('userService: Fetching user details after login for:', username);
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // First try to get user by username
      try {
        const response = await axios.get(`${API_BASE_URL}/users/username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('userService: User details fetched successfully:', response.data);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        
        return response.data;
      } catch (usernameError) {
        console.error('userService: Error fetching by username:', usernameError);
        
        // Fallback to /users/me endpoint
        const meResponse = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('userService: User details fetched from /me endpoint:', meResponse.data);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(meResponse.data));
        
        return meResponse.data;
      }
    } catch (error) {
      console.error('userService: Failed to fetch user details after login:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify token is valid
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Make a request to a protected endpoint to verify token
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      console.log('userService: getCurrentUser called');
      const token = authService.getToken();
      if (!token) {
        console.error('userService: No authentication token found');
        throw new Error('No authentication token found');
      }
      
      console.log('userService: Making request to /users/me');
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('userService: User data received:', response.data);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('userService: Error fetching current user:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user by username
  getUserByUsername: async (username) => {
    try {
      console.log(`userService: getUserByUsername called for ${username}`);
      const token = authService.getToken();
      if (!token) {
        console.error('userService: No authentication token found');
        throw new Error('No authentication token found');
      }
      
      console.log(`userService: Making request to /users/username/${username}`);
      const response = await axios.get(`${API_BASE_URL}/users/username/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('userService: User data received:', response.data);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error(`userService: Error fetching user by username (${username}):`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user orders
  getUserOrders: async (userId) => {
    try {
      console.log(`userService: getUserOrders called for user ${userId}`);
      const token = authService.getToken();
      if (!token) {
        console.error('userService: No authentication token found');
        throw new Error('No authentication token found');
      }
      
      console.log(`userService: Making request to /orders/user/${userId}`);
      const response = await axios.get(`${API_BASE_URL}/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('userService: Orders received:', response.data);
      return response.data;
    } catch (error) {
      console.error(`userService: Error fetching orders for user (${userId}):`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error(`Error updating user profile (${userId}):`, error);
      throw error;
    }
  },
  
  // Add new address
  addUserAddress: async (userId, addressData) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(`${API_BASE_URL}/users/${userId}/addresses`, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding address for user (${userId}):`, error);
      throw error;
    }
  }
};

export default userService; 