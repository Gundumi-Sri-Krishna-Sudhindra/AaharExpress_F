import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      emoji: "🚀",
      title: "Fast Delivery",
      description: "Fresh food delivered to your doorstep in 30 minutes or less",
      stats: "Average delivery time: 25 minutes"
    },
    {
      emoji: "🍲",
      title: "Premium Quality",
      description: "Restaurant-quality meals prepared with the freshest ingredients",
      stats: "4.8/5 average food rating"
    },
    {
      emoji: "💝",
      title: "Food Donation",
      description: "Donate meals directly to those in need through our platform",
      stats: "15,000+ meals donated monthly"
    },
    {
      emoji: "♻️",
      title: "Leftover Rescue",
      description: "Contribute your excess food to reduce waste and feed the hungry",
      stats: "98% of donated food successfully distributed"
    },
    {
      emoji: "🌱",
      title: "Eco-Friendly Packaging",
      description: "All our deliveries use sustainable, biodegradable packaging materials",
      stats: "50% reduction in plastic waste"
    },
    {
      emoji: "🔔",
      title: "Real-Time Tracking",
      description: "Monitor your food or donation journey from kitchen to destination",
      stats: "100% delivery transparency"
    }
  ];

  const impactStats = [
    { label: "Daily Orders", value: "5K+", emoji: "🍽️" },
    { label: "Partner Restaurants", value: "500+", emoji: "🍳" },
    { label: "Cities Served", value: "30+", emoji: "🌆" },
    { label: "Lives Impacted", value: "250K+", emoji: "❤️" }
  ];

  return (
    <div className={`about-container ${isVisible ? 'visible' : ''}`}>
      <button className="close-btn" onClick={() => navigate('/')}>✖</button>
      
      <div className="header">
        <div className="logo-container">
          <span className="logo-emoji">🍱</span>
          <h1>AaharExpress</h1>
        </div>
        <p className="tagline">Delicious meals delivered, leftover food repurposed.</p>
      </div>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          AaharExpress is revolutionizing food delivery with a purpose. We don't just deliver delicious meals to your door—we're creating a sustainable ecosystem where excess food finds its way to those who need it most.
        </p>
        <p>
          Through our innovative platform, we enable customers to enjoy premium food delivery while making it easy to donate meals or contribute leftover food to community members in need.
        </p>
      </section>
      
      <div className="stats-banner">
        {impactStats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-emoji">{stat.emoji}</span>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="services-section">
        <h2>What We Offer</h2>
        <div className="services-grid">
          {services.map((item, index) => (
            <div key={index} className="service-card">
              <span className="emoji">{item.emoji}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="stats-text">{item.stats}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="impact-section">
        <h2>Making A Difference</h2>
        <div className="impact-content">
          <div className="impact-text">
            <p>
              At AaharExpress, we believe that good food should never go to waste. Our dual mission tackles both hunger and food waste by creating an efficient bridge between excess and need.
            </p>
            <p>
              Every order you place helps fuel our donation program, ensuring that nutritious meals reach underprivileged communities, homeless shelters, and food banks across the country.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mission-box">
        <h2>Join The Movement</h2>
        <p>Help us create a world where everyone has access to good food and nothing goes to waste.</p>
        <div className="cta-buttons">
          <button className="join-btn primary">Order & Donate</button>
          <button className="join-btn secondary">Become a Partner</button>
        </div>
      </section>

      <footer className="app-download">
        <p>Get AaharExpress on your device</p>
        <div className="app-buttons">
          <button className="app-btn">App Store</button>
          <button className="app-btn">Play Store</button>
        </div>
      </footer>
    </div>
  );
};

export default About;