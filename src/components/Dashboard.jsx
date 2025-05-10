import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import userService from '../services/userService';
import authService from '../services/authService';
import { checkApiEndpoints } from '../utils/apiCheck';

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
                currentPath: window.location.pathname
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.fullName || user.username || user.name || 'User'}!</h1>
        <p>Manage your account and orders from your personalized dashboard</p>
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
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <div className="dashboard-card">
            {orders && orders.length > 0 ? (
              <ul className="order-list">
                {orders.slice(0, 3).map(order => (
                  <li key={order.id} className="order-item">
                    <span>Order #{order.id}</span>
                    <span>{new Date(order.createdAt || order.timestamp).toLocaleDateString()}</span>
                    <span className={`order-status ${order.status?.toLowerCase() || 'processing'}`}>
                      {order.status || 'Processing'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no recent orders.</p>
            )}
            <div className="dashboard-action">
              <button className="view-all-button">View All Orders</button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Account Info</h2>
          <div className="dashboard-card">
            <div className="user-info-item">
              <span>Username:</span>
              <span>{user.username || 'N/A'}</span>
            </div>
            <div className="user-info-item">
              <span>Email:</span>
              <span>{user.email || 'N/A'}</span>
            </div>
            <div className="user-info-item">
              <span>Full Name:</span>
              <span>{user.fullName || user.name || 'Not provided'}</span>
            </div>
            <div className="user-info-item">
              <span>Phone:</span>
              <span>{user.mobileNumber || user.phone || 'Not provided'}</span>
            </div>
            {user.address && (
              <div className="user-info-item">
                <span>Address:</span>
                <span>{user.address}</span>
              </div>
            )}
            <div className="dashboard-action">
              <button 
                className="edit-profile-button"
                onClick={() => window.location.href = '/account-settings'}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Delivery Addresses</h2>
          <div className="dashboard-card">
            {user.addresses && user.addresses.length > 0 ? (
              <ul className="address-list">
                {user.addresses.map((address, index) => (
                  <li key={index} className="address-item">
                    <div className="address-type">{address.type || 'Address ' + (index + 1)}</div>
                    <div className="address-text">{address.street}, {address.city}, {address.state} {address.zipCode}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved addresses found.</p>
            )}
            <div className="dashboard-action">
              <button className="add-address-button">Add New Address</button>
            </div>
          </div>
        </div>
        
        {/* Debug panel */}
        {renderDebugPanel()}
      </div>
    </div>
  );
};

export default Dashboard;
