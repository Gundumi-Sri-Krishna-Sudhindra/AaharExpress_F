import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import userService from '../services/userService';
import authService from '../services/authService';
import { checkApiEndpoints } from '../utils/apiCheck';
import AdminDashboard from './AdminDashboard';
import RestaurantDashboard from './RestaurantDashboard';
import CustomerDashboard from './CustomerDashboard';
import DeliveryAgentDashboard from './DeliveryAgentDashboard';

const Dashboard = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [apiCheckResults, setApiCheckResults] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Dashboard mounted, fetching user data');
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          console.error('Not authenticated in Dashboard component');
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          // Redirect to home page if not authenticated
          window.location.replace('/');
          return;
        }
        
        console.log('Dashboard - authenticated, fetching user data');
        // Always try to get fresh user data from the server
        try {
          const userData = await userService.getCurrentUser();
          console.log('Dashboard - user data fetched successfully:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Fetch user's orders if we have a user ID
          if (userData && userData.id) {
            try {
              console.log('Dashboard - fetching orders for user:', userData.id);
              const ordersData = await userService.getUserOrders(userData.id);
              console.log('Dashboard - orders fetched:', ordersData);
              setOrders(ordersData);
            } catch (orderError) {
              console.error('Error fetching orders:', orderError);
              // Continue with the user data we have
            }
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          
          // If server request fails, try to use cached user data
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            console.log('Dashboard - using cached user data');
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setError('Could not refresh user data. Using cached data.');
          } else {
            console.error('Dashboard - no cached user data available');
            setError('Failed to load user data. Please try again later.');
            // If we can't get user data and have no cached data, logout
            authService.logout();
            // Redirect to home page
            window.location.replace('/');
          }
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An error occurred while loading your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Add a debug function
  const runApiChecks = async () => {
    setApiCheckResults('Running checks...');
    try {
      const results = await checkApiEndpoints();
      setApiCheckResults(JSON.stringify(results, null, 2));
    } catch (error) {
      setApiCheckResults(`Error running checks: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <h2>Not Logged In</h2>
        <p>Please log in to view your dashboard</p>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
      </div>
    );
  }

  // Add this at the end of the component, right before the closing tag
  const renderDebugPanel = () => {
    if (!debugMode) return null;
    
    return (
      <div className="dashboard-section debug-panel">
        <h2>Debug Panel</h2>
        <div className="dashboard-card">
          <div className="debug-controls">
            <button onClick={runApiChecks} className="debug-button">
              Check API Endpoints
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
              }} 
              className="debug-button danger"
            >
              Clear Auth Data
            </button>
          </div>
          
          {apiCheckResults && (
            <div className="debug-results">
              <h3>API Check Results:</h3>
              <pre>{apiCheckResults}</pre>
            </div>
          )}
          
          <div className="debug-info">
            <h3>Current Auth State:</h3>
            <pre>
              {JSON.stringify({
                isAuthenticated: authService.isAuthenticated(),
                hasToken: !!localStorage.getItem('token'),
                hasUserData: !!localStorage.getItem('user'),
                currentPath: window.location.pathname,
                roles: authService.getUserRoles()
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate dashboard based on user role
  const renderRoleDashboard = () => {
    // Check for admin role first
    if (authService.isAdmin()) {
      console.log('Rendering Admin Dashboard');
      return <AdminDashboard user={user} />;
    }
    
    // Check for restaurant role
    if (authService.isRestaurant()) {
      console.log('Rendering Restaurant Dashboard');
      return <RestaurantDashboard user={user} />;
    }
    
    // Check for delivery agent role
    if (authService.isDeliveryAgent()) {
      console.log('Rendering Delivery Agent Dashboard');
      return <DeliveryAgentDashboard user={user} />;
    }
    
    // Default to customer dashboard
    console.log('Rendering Customer Dashboard');
    return <CustomerDashboard user={user} />;
  };

  // Debug toggle button to be displayed at the top right of any dashboard
  const DebugToggle = () => (
    <button 
      onClick={() => setDebugMode(!debugMode)} 
      className="debug-toggle"
      style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        opacity: 0.5
      }}
    >
      🛠️
    </button>
  );

  return (
    <>
      {renderRoleDashboard()}
      <DebugToggle />
      {renderDebugPanel()}
    </>
  );
};

export default Dashboard;
