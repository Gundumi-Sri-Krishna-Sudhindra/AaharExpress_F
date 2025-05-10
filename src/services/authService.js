import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Debug function to log authentication state
const logAuthState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  console.log('Auth State:', {
    hasToken: !!token,
    tokenFirstChars: token ? token.substring(0, 15) + '...' : null,
    hasUser: !!user,
    userInfo: user ? JSON.parse(user).username : null,
    axiosDefaultAuth: axios.defaults.headers.common['Authorization'] ? 'Set' : 'Not Set'
  });
};

const authService = {
  // Login user and get token
  login: async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Store token in localStorage
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        
        // Also store basic user data from the response
        const userData = {
          id: response.data.id || 0,
          username: response.data.username,
          email: response.data.email || '',
          fullName: response.data.fullName || response.data.name || '',
          mobileNumber: response.data.mobileNumber || response.data.phone || '',
          address: response.data.address || '',
          memberSince: response.data.memberSince || response.data.createdAt || new Date().toISOString(),
          roles: response.data.roles || []
        };
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set default Authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        console.log('Token and user data saved, Authorization header set');
        logAuthState();
      } else {
        console.error('No accessToken in response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Verify if token is valid
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        return false;
      }
      
      console.log('Verifying token validity...');
      
      // Try multiple endpoints that might be available for verification
      try {
        // First try the /auth/verify endpoint
        const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Token verified with /auth/verify');
        return true;
      } catch (verifyError) {
        console.log('Verify endpoint failed, trying user endpoint');
        
        // If that fails, try getting user data as a fallback
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (userResponse.status === 200) {
          console.log('Token verified with /users/me');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token verification failed:', error.response?.data || error.message);
      // If verification fails, clear token
      authService.logout();
      return false;
    }
  },
  
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    console.log('Logging out, clearing auth data');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear Authorization header
    delete axios.defaults.headers.common['Authorization'];
    logAuthState();
  },
  
  // Get current token
  getToken: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('getToken: No token found');
    }
    return token;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Check if both token and user data exist
    if (!token || !userStr) {
      console.log('isAuthenticated check: false - missing token or user data');
      return false;
    }
    
    // Validate that user data is proper JSON
    try {
      const userData = JSON.parse(userStr);
      // Accept either username or id as valid identifiers
      if (!userData || (!userData.username && !userData.id)) {
        console.log('isAuthenticated check: false - missing required user identifiers');
        return false;
      }
      
      // Silently migrate user data format if needed
      if (userData.name && !userData.fullName) {
        userData.fullName = userData.name;
      }
      if (userData.phone && !userData.mobileNumber) {
        userData.mobileNumber = userData.phone;
      }
      // Save migrated data
      if ((userData.name && !userData.fullName) || (userData.phone && !userData.mobileNumber)) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('isAuthenticated: migrated user data format');
      }
      
      console.log('isAuthenticated check: true - valid token and user data');
      return true;
    } catch (error) {
      console.error('isAuthenticated check: false - error parsing user data', error);
      // If user data is corrupted, clear it
      localStorage.removeItem('user');
      return false;
    }
  },
  
  // Force authentication state for testing
  forceAuth: (token, userData) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      console.log('Authentication forced');
      logAuthState();
      return true;
    }
    return false;
  },
  
  // Check if user has a specific role
  hasRole: (role) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;
      
      const userData = JSON.parse(userStr);
      if (!userData.roles || !Array.isArray(userData.roles)) return false;
      
      // Normalize the role strings for comparison
      const normalizedRoles = userData.roles.map(r => {
        if (typeof r !== 'string') return '';
        // Remove ROLE_ prefix if it exists and convert to uppercase for comparison
        return r.replace('ROLE_', '').toUpperCase();
      });
      
      // Normalize the requested role
      const normalizedRole = role.replace('ROLE_', '').toUpperCase();
      
      return normalizedRoles.includes(normalizedRole);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  },
  
  // Check if user is an Admin
  isAdmin: () => {
    return authService.hasRole('ADMIN');
  },
  
  // Check if user is a Restaurant
  isRestaurant: () => {
    return authService.hasRole('RESTAURANT');
  },
  
  // Check if user is a Customer
  isCustomer: () => {
    return authService.hasRole('CUSTOMER');
  },
  
  // Check if user is a Delivery Agent
  isDeliveryAgent: () => {
    return authService.hasRole('DELIVERY_AGENT');
  },
  
  // Get current user's roles
  getUserRoles: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return [];
      
      const userData = JSON.parse(userStr);
      if (!userData.roles || !Array.isArray(userData.roles)) return [];
      
      // Normalize role names
      return userData.roles.map(role => {
        if (typeof role !== 'string') return '';
        const normalizedRole = role.replace('ROLE_', '');
        return normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1).toLowerCase();
      }).filter(role => role !== '');
    } catch (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
  },
  
  // Add token to axios headers for all requests
  setupAxiosInterceptors: () => {
    console.log('Setting up axios interceptors');
    
    // Set default Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Initial Authorization header set from stored token');
    } else {
      console.log('No token found for initial setup');
    }
    
    // Request interceptor
    axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          console.log('401 Unauthorized response detected, logging out');
          // Token expired or invalid, logout user
          authService.logout();
          window.location.replace('/');
        }
        return Promise.reject(error);
      }
    );
    
    logAuthState();
  },
  
  // Fix common authentication issues
  fixAuthState: () => {
    console.log('Attempting to fix authentication state');
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      console.log('No token found, cannot fix authentication state');
      return false;
    }
    
    if (!userStr) {
      console.log('Token exists but no user data, creating placeholder user data');
      const placeholderUser = {
        id: 0,
        username: 'user',
        email: 'user@example.com',
        fullName: '',
        mobileNumber: '',
        address: '',
        memberSince: new Date().toISOString(),
        roles: ['ROLE_USER']
      };
      
      localStorage.setItem('user', JSON.stringify(placeholderUser));
      console.log('Created placeholder user data');
      
      // Set Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Reset Authorization header');
      
      return true;
    }
    
    try {
      // Check if user data is valid JSON
      const userData = JSON.parse(userStr);
      let isUpdated = false;
      
      // Fix required fields if missing
      if (!userData.username) {
        console.log('Username missing, adding default');
        userData.username = 'user';
        isUpdated = true;
      }
      
      // Ensure new fields exist
      if (!userData.fullName && userData.name) {
        userData.fullName = userData.name;
        isUpdated = true;
      }
      
      if (!userData.mobileNumber && userData.phone) {
        userData.mobileNumber = userData.phone;
        isUpdated = true;
      }
      
      if (!userData.memberSince) {
        userData.memberSince = new Date().toISOString();
        isUpdated = true;
      }
      
      if (isUpdated) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Updated user data with new field format');
      }
      
      // Ensure Authorization header is set
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Fixed authentication state');
      return true;
    } catch (error) {
      console.error('Error fixing authentication state:', error);
      return false;
    }
  }
};

// Setup axios interceptors on import
authService.setupAxiosInterceptors();

export default authService; 