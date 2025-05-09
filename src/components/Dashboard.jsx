import React from 'react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <p>Manage your account and orders from your personalized dashboard</p>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <div className="dashboard-card">
            {user.orders && user.orders.length > 0 ? (
              <ul className="order-list">
                {user.orders.slice(0, 3).map(order => (
                  <li key={order.id} className="order-item">
                    <span>Order #{order.id}</span>
                    <span>{new Date(order.timestamp).toLocaleDateString()}</span>
                    <span className={`order-status ${order.status}`}>{order.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no recent orders.</p>
            )}
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Account Info</h2>
          <div className="dashboard-card">
            <div className="user-info-item">
              <span>Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="user-info-item">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
            {user.name && (
              <div className="user-info-item">
                <span>Name:</span>
                <span>{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
