import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoleDashboards.css';

const RestaurantDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Mock data - in a real app this would come from API calls
  useEffect(() => {
    const fetchRestaurantData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalOrders: 124,
          pendingOrders: 8,
          completedOrders: 116,
          revenue: 4586.25
        });
        
        setMenuItems([
          { id: 1, name: 'Butter Chicken', price: 12.99, category: 'Main Course', available: true },
          { id: 2, name: 'Vegetable Biryani', price: 10.99, category: 'Rice', available: true },
          { id: 3, name: 'Garlic Naan', price: 2.99, category: 'Bread', available: true },
          { id: 4, name: 'Mango Lassi', price: 3.99, category: 'Beverages', available: false },
          { id: 5, name: 'Gulab Jamun', price: 4.99, category: 'Desserts', available: true }
        ]);
        
        setOrders([
          { id: 'ORD-001', customer: 'John Doe', items: 3, total: 28.97, status: 'pending', time: '15 min ago' },
          { id: 'ORD-002', customer: 'Jane Smith', items: 2, total: 15.98, status: 'preparing', time: '30 min ago' },
          { id: 'ORD-003', customer: 'Robert Johnson', items: 4, total: 42.96, status: 'ready', time: '45 min ago' },
          { id: 'ORD-004', customer: 'Emily Brown', items: 1, total: 12.99, status: 'delivered', time: '1 hour ago' }
        ]);
        
        setLoading(false);
      }, 800);
    };
    
    fetchRestaurantData();
  }, []);
  
  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading restaurant dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="role-dashboard restaurant-dashboard">
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        <p>Welcome, {user.fullName || user.username} | Restaurant: {user.restaurantName || 'Your Restaurant'}</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
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
                <h3>Revenue</h3>
                <div className="stat-value">${stats.revenue.toFixed(2)}</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="recent-orders">
              <h3>Recent Orders</h3>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.items}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>{order.time}</td>
                      <td>
                        <button className="view-order-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'menu' && (
          <div className="menu-management">
            <div className="section-header">
              <h2>Menu Management</h2>
              <button className="add-item-btn">Add New Item</button>
            </div>
            
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`availability-badge ${item.available ? 'available' : 'unavailable'}`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="toggle-btn">
                        {item.available ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-management">
            <h2>Orders Management</h2>
            <p>View and manage all your restaurant orders here.</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="restaurant-settings">
            <h2>Restaurant Settings</h2>
            <p>Configure your restaurant profile, operating hours, and delivery options.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard; 