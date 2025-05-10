import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import RestaurantDashboard from './RestaurantDashboard';
import DeliveryAgentDashboard from './DeliveryAgentDashboard';
import AdminDashboard from './AdminDashboard';
import authService from '../services/authService';

const RoleDebugger = () => {
  const [currentRole, setCurrentRole] = useState('');
  const [userData, setUserData] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get current user data from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData(user);
        
        // Determine current role
        if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
          const normalizedRoles = user.roles.map(r => r.toUpperCase());
          if (normalizedRoles.some(r => r.includes('ADMIN'))) {
            setCurrentRole('ADMIN');
          } else if (normalizedRoles.some(r => r.includes('RESTAURANT'))) {
            setCurrentRole('RESTAURANT');
          } else if (normalizedRoles.some(r => r.includes('DELIVERY'))) {
            setCurrentRole('DELIVERY_AGENT');
          } else {
            setCurrentRole('CUSTOMER');
          }
        } else {
          setCurrentRole('CUSTOMER'); // Default
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage('Error loading user data. See console for details.');
    }
  }, []);

  const changeRole = (role) => {
    // Format role for storage
    const formattedRole = `ROLE_${role}`;
    
    // Update user roles in localStorage
    if (authService.updateUserRoles([formattedRole])) {
      setMessage(`Role changed to ${formattedRole}. Reload the page to see changes.`);
      setCurrentRole(role);
      
      // Get updated user data
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUserData(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error loading updated user data:', error);
      }
    } else {
      setMessage('Failed to update role. Make sure you are logged in.');
    }
  };

  const showDashboard = (type) => {
    setSelectedDashboard(type);
  };

  const renderDashboard = () => {
    if (!userData) return <p>No user data available</p>;

    switch (selectedDashboard) {
      case 'CUSTOMER':
        return <CustomerDashboard user={userData} />;
      case 'RESTAURANT':
        return <RestaurantDashboard user={userData} />;
      case 'DELIVERY_AGENT':
        return <DeliveryAgentDashboard user={userData} />;
      case 'ADMIN':
        return <AdminDashboard user={userData} />;
      default:
        return null;
    }
  };

  return (
    <div className="role-debugger" style={{ padding: '20px' }}>
      <h2>Role Debugger</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current User Info</h3>
        <p><strong>Username:</strong> {userData?.username || 'Not logged in'}</p>
        <p><strong>Current Role:</strong> {currentRole || 'None'}</p>
        <p><strong>All Roles:</strong> {userData?.roles?.join(', ') || 'None'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Change Role</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => changeRole('CUSTOMER')}
            style={{ 
              backgroundColor: currentRole === 'CUSTOMER' ? '#4CAF50' : '#f1f1f1',
              color: currentRole === 'CUSTOMER' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Customer
          </button>
          <button 
            onClick={() => changeRole('RESTAURANT')}
            style={{ 
              backgroundColor: currentRole === 'RESTAURANT' ? '#4CAF50' : '#f1f1f1',
              color: currentRole === 'RESTAURANT' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Restaurant
          </button>
          <button 
            onClick={() => changeRole('DELIVERY_AGENT')}
            style={{ 
              backgroundColor: currentRole === 'DELIVERY_AGENT' ? '#4CAF50' : '#f1f1f1',
              color: currentRole === 'DELIVERY_AGENT' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delivery Agent
          </button>
          <button 
            onClick={() => changeRole('ADMIN')}
            style={{ 
              backgroundColor: currentRole === 'ADMIN' ? '#4CAF50' : '#f1f1f1',
              color: currentRole === 'ADMIN' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Admin
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test Dashboard Views</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => showDashboard('CUSTOMER')}
            style={{ 
              backgroundColor: selectedDashboard === 'CUSTOMER' ? '#2196F3' : '#f1f1f1',
              color: selectedDashboard === 'CUSTOMER' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Customer Dashboard
          </button>
          <button 
            onClick={() => showDashboard('RESTAURANT')}
            style={{ 
              backgroundColor: selectedDashboard === 'RESTAURANT' ? '#2196F3' : '#f1f1f1',
              color: selectedDashboard === 'RESTAURANT' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Restaurant Dashboard
          </button>
          <button 
            onClick={() => showDashboard('DELIVERY_AGENT')}
            style={{ 
              backgroundColor: selectedDashboard === 'DELIVERY_AGENT' ? '#2196F3' : '#f1f1f1',
              color: selectedDashboard === 'DELIVERY_AGENT' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Delivery Agent Dashboard
          </button>
          <button 
            onClick={() => showDashboard('ADMIN')}
            style={{ 
              backgroundColor: selectedDashboard === 'ADMIN' ? '#2196F3' : '#f1f1f1',
              color: selectedDashboard === 'ADMIN' ? 'white' : 'black',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Admin Dashboard
          </button>
        </div>
      </div>
      
      {message && (
        <div style={{ 
          backgroundColor: '#FFF3CD', 
          color: '#856404', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      {selectedDashboard && (
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '20px', 
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <h3>Dashboard Preview: {selectedDashboard}</h3>
          {renderDashboard()}
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/dashboard" style={{ 
          backgroundColor: '#007BFF', 
          color: 'white', 
          padding: '10px 15px', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Go to Your Dashboard
        </Link>
      </div>
    </div>
  );
};

export default RoleDebugger; 