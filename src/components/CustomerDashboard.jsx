import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoleDashboards.css';

const CustomerDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    savedAmount: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentOrders, setRecentOrders] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  
  // Mock data - in a real app this would come from API calls
  useEffect(() => {
    const fetchCustomerData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalOrders: 24,
          pendingOrders: 2,
          completedOrders: 22,
          savedAmount: 56.75
        });
        
        setRecentOrders([
          { id: 'ORD-125', restaurant: 'Spice Garden', items: 3, total: 28.97, status: 'delivered', date: '2023-07-15' },
          { id: 'ORD-118', restaurant: 'Pizza Palace', items: 2, total: 22.50, status: 'delivered', date: '2023-07-10' },
          { id: 'ORD-112', restaurant: 'Burger Barn', items: 4, total: 35.80, status: 'delivered', date: '2023-07-05' },
          { id: 'ORD-126', restaurant: 'Sushi World', items: 2, total: 42.30, status: 'pending', date: '2023-07-16' }
        ]);
        
        setFavoriteRestaurants([
          { id: 1, name: 'Spice Garden', cuisine: 'Indian', rating: 4.8 },
          { id: 2, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5 },
          { id: 3, name: 'Burger Barn', cuisine: 'American', rating: 4.3 }
        ]);
        
        setLoading(false);
      }, 800);
    };
    
    fetchCustomerData();
  }, []);
  
  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading customer dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="role-dashboard customer-dashboard">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
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
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
        <button 
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        <button 
          className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-icon">📋</div>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <div className="stat-value">{stats.pendingOrders}</div>
                <div className="stat-icon">⏳</div>
              </div>
              <div className="stat-card">
                <h3>Completed Orders</h3>
                <div className="stat-value">{stats.completedOrders}</div>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-card">
                <h3>Saved Amount</h3>
                <div className="stat-value">${stats.savedAmount.toFixed(2)}</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="recent-orders-section">
              <h3>Recent Orders</h3>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.restaurant}</td>
                      <td>{order.items}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <button className="view-order-btn">View</button>
                        {order.status === 'delivered' && (
                          <button className="reorder-btn">Reorder</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="favorite-restaurants">
              <h3>Your Favorite Restaurants</h3>
              <div className="restaurant-cards">
                {favoriteRestaurants.map(restaurant => (
                  <div key={restaurant.id} className="restaurant-card">
                    <h4>{restaurant.name}</h4>
                    <p>{restaurant.cuisine} Cuisine</p>
                    <div className="restaurant-rating">
                      <span>⭐ {restaurant.rating}</span>
                    </div>
                    <button className="order-now-btn">Order Now</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-history">
            <h2>Order History</h2>
            <p>View all your past orders and track current deliveries.</p>
            {/* Full order history would go here */}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div className="favorites-management">
            <h2>Favorite Restaurants & Dishes</h2>
            <p>Manage your favorite restaurants and dishes for quick reordering.</p>
            {/* Favorites management would go here */}
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div className="address-management">
            <h2>Delivery Addresses</h2>
            <p>Manage your saved delivery addresses.</p>
            {/* Address management would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard; 