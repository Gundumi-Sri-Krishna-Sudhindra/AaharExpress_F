import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoleDashboards.css';

const DeliveryAgentDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedToday: 0,
    earnings: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  
  // Mock data - in a real app this would come from API calls
  useEffect(() => {
    const fetchDeliveryData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalDeliveries: 152,
          pendingDeliveries: 3,
          completedToday: 7,
          earnings: 285.50
        });
        
        setActiveDeliveries([
          { 
            id: 'DEL-045', 
            restaurant: 'Spice Garden', 
            customer: 'John Doe',
            customerAddress: '123 Main St, Apt 4B',
            status: 'pickup', 
            estimatedTime: '15 min',
            distance: '2.3 km'
          },
          { 
            id: 'DEL-046', 
            restaurant: 'Pizza Palace', 
            customer: 'Jane Smith',
            customerAddress: '456 Oak Ave',
            status: 'enroute', 
            estimatedTime: '8 min',
            distance: '1.5 km'
          },
          { 
            id: 'DEL-047', 
            restaurant: 'Burger Barn', 
            customer: 'Robert Johnson',
            customerAddress: '789 Pine Blvd',
            status: 'assigned', 
            estimatedTime: '25 min',
            distance: '3.2 km'
          }
        ]);
        
        setDeliveryHistory([
          { id: 'DEL-044', restaurant: 'Sushi World', customer: 'Emily Brown', earnings: 12.50, date: '2023-07-16', rating: 5 },
          { id: 'DEL-043', restaurant: 'Taco Time', customer: 'Michael Wilson', earnings: 10.75, date: '2023-07-16', rating: 4 },
          { id: 'DEL-042', restaurant: 'Pasta Place', customer: 'Sarah Davis', earnings: 14.25, date: '2023-07-15', rating: 5 },
          { id: 'DEL-041', restaurant: 'Spice Garden', customer: 'Thomas Miller', earnings: 11.50, date: '2023-07-15', rating: 4 }
        ]);
        
        setLoading(false);
      }, 800);
    };
    
    fetchDeliveryData();
  }, []);
  
  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading delivery agent dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="role-dashboard delivery-dashboard">
      <div className="dashboard-header">
        <h1>Delivery Agent Dashboard</h1>
        <p>Welcome, {user.fullName || user.username}</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Deliveries
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`tab-button ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Deliveries</h3>
                <div className="stat-value">{stats.totalDeliveries}</div>
                <div className="stat-icon">🚚</div>
              </div>
              <div className="stat-card">
                <h3>Pending Deliveries</h3>
                <div className="stat-value">{stats.pendingDeliveries}</div>
                <div className="stat-icon">⏳</div>
              </div>
              <div className="stat-card">
                <h3>Completed Today</h3>
                <div className="stat-value">{stats.completedToday}</div>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-card">
                <h3>Today's Earnings</h3>
                <div className="stat-value">${stats.earnings.toFixed(2)}</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="active-deliveries-section">
              <h3>Active Deliveries</h3>
              <div className="delivery-cards">
                {activeDeliveries.map(delivery => (
                  <div key={delivery.id} className={`delivery-card ${delivery.status}`}>
                    <div className="delivery-header">
                      <h4>Order {delivery.id}</h4>
                      <span className={`status-badge ${delivery.status}`}>
                        {delivery.status === 'pickup' ? 'Ready for Pickup' : 
                         delivery.status === 'enroute' ? 'En Route' : 'Assigned'}
                      </span>
                    </div>
                    <div className="delivery-details">
                      <p><strong>Restaurant:</strong> {delivery.restaurant}</p>
                      <p><strong>Customer:</strong> {delivery.customer}</p>
                      <p><strong>Address:</strong> {delivery.customerAddress}</p>
                      <p><strong>Est. Time:</strong> {delivery.estimatedTime}</p>
                      <p><strong>Distance:</strong> {delivery.distance}</p>
                    </div>
                    <div className="delivery-actions">
                      {delivery.status === 'assigned' && (
                        <button className="action-button">Start Pickup</button>
                      )}
                      {delivery.status === 'pickup' && (
                        <button className="action-button">Confirm Pickup</button>
                      )}
                      {delivery.status === 'enroute' && (
                        <button className="action-button">Complete Delivery</button>
                      )}
                      <button className="map-button">View Map</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="recent-deliveries">
              <h3>Recent Deliveries</h3>
              <table className="deliveries-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Customer</th>
                    <th>Earnings</th>
                    <th>Date</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map(delivery => (
                    <tr key={delivery.id}>
                      <td>{delivery.id}</td>
                      <td>{delivery.restaurant}</td>
                      <td>{delivery.customer}</td>
                      <td>${delivery.earnings.toFixed(2)}</td>
                      <td>{delivery.date}</td>
                      <td>{'⭐'.repeat(delivery.rating)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'active' && (
          <div className="active-deliveries-page">
            <h2>Active Deliveries</h2>
            <p>Manage your current delivery assignments.</p>
            {/* Full active deliveries management would go here */}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="delivery-history">
            <h2>Delivery History</h2>
            <p>View your past deliveries and performance metrics.</p>
            {/* Delivery history would go here */}
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div className="earnings-management">
            <h2>Earnings & Payments</h2>
            <p>Track your earnings and payment history.</p>
            {/* Earnings management would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAgentDashboard; 