import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { debugAuthState, fixAuthRoles } from '../utils/debugAuthState';

const RoleFixer = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [fixed, setFixed] = useState(false);
  
  useEffect(() => {
    // Check auth state when component mounts
    checkAuthState();
  }, []);
  
  const checkAuthState = () => {
    setMessage('Checking auth state...');
    const user = debugAuthState();
    setUserData(user);
    setMessage(user ? 'Auth state checked!' : 'No valid user data found.');
  };
  
  const handleFixRoles = () => {
    const wasFixed = fixAuthRoles();
    setFixed(wasFixed);
    
    if (wasFixed) {
      setMessage('Roles fixed! Reloading in 2 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setMessage('No role fixes needed.');
      checkAuthState(); // Refresh the display
    }
  };
  
  const handleSelectRole = (role) => {
    if (!userData) return;
    
    // Format role with ROLE_ prefix if needed
    const formattedRole = role.toUpperCase().startsWith('ROLE_') 
      ? role.toUpperCase() 
      : `ROLE_${role.toUpperCase()}`;
    
    // Update user roles
    const wasUpdated = authService.updateUserRoles([formattedRole]);
    
    if (wasUpdated) {
      setMessage(`Role updated to ${formattedRole}! Reloading in 2 seconds...`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setMessage('Failed to update role.');
    }
  };
  
  if (!userData) {
    return (
      <div className="role-fixer">
        <h2>Role Diagnostics</h2>
        <p>{message || 'No user data available.'}</p>
        <button onClick={checkAuthState}>Check Auth State</button>
      </div>
    );
  }
  
  return (
    <div className="role-fixer" style={{ 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      <h2>Role Diagnostics</h2>
      
      <div className="auth-info" style={{ marginBottom: '15px' }}>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Current Roles:</strong> {Array.isArray(userData.roles) 
          ? userData.roles.join(', ') 
          : 'No roles found'}</p>
      </div>
      
      <div className="role-actions" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={handleFixRoles}>Fix Roles Format</button>
        <button onClick={checkAuthState}>Refresh State</button>
      </div>
      
      <div className="role-selector" style={{ marginBottom: '15px' }}>
        <h3>Change Role</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleSelectRole('CUSTOMER')}>Customer</button>
          <button onClick={() => handleSelectRole('RESTAURANT')}>Restaurant</button>
          <button onClick={() => handleSelectRole('DELIVERY_AGENT')}>Delivery Agent</button>
          <button onClick={() => handleSelectRole('ADMIN')}>Admin</button>
        </div>
      </div>
      
      {message && (
        <div className="message" style={{ 
          padding: '10px', 
          backgroundColor: fixed ? '#d4edda' : '#f8d7da',
          borderRadius: '5px',
          color: fixed ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default RoleFixer; 