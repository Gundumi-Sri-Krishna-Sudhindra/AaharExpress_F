import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="content-wrapper">
            <h1 className="hero-title">
              Delicious Food
              <span className="highlight"> Delivered</span> 
              <br />To Your Door
            </h1>
            
            <p className="hero-description">
              Choose from a wide variety of cuisines and enjoy contactless delivery. 
              Fresh ingredients, amazing taste, delivered to you.
            </p>
            
            <div className="cta-buttons">
              <Link to="/menu">
                <button className="hero-btn">Explore Menu</button>
              </Link>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Restaurants</span>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item">
                  <span className="stat-number">25-40</span>
                  <span className="stat-label">Min Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-image-container">
          <div className="image-wrapper">
            <img src="/f.webp" alt="Delicious food spread" className="hero-image" />
            <div className="floating-card">
              <div className="card-icon" style={{ marginLeft: "+2.5rem" }}>🔥</div>
              <div className="card-text">
                <span className="card-title">Today's Hot Deals</span>
                <span className="card-subtitle">Up to 50% off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;