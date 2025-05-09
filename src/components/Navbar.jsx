import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Popup from './Popup';
import SignupPopup from './SignupPopup';

const Navbar = ({ 
  onOrderClick, 
  onContactClick, 
  cartItemCount = 0, 
  favoriteCount = 0, 
  onCartClick, 
  user,
  onLogout,
  darkMode,
  onSearchChange
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOrderClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) {
      onSearchChange(e);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    setIsPopupOpen(true);
    setIsUserMenuOpen(false); // Close the user menu
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setIsSignupPopupOpen(true);
    setIsUserMenuOpen(false); // Close the user menu
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${darkMode ? 'dark-mode' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/logo.webp" alt="AaharExpress" className="navbar-logo" />
            </Link>
            <h1 
              className="brand-name" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: darkMode ? '#ffffff' : '#000000',
                fontSize: '32px',
                fontWeight: 'normal',
                letterSpacing: '1px'
              }}
            >
              AaharExpress
            </h1>
          </div>

          <div className="navbar-menu">
            <div className="search-container" style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                style={{ 
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  borderRadius: '8px'
                }}
              />
            </div>

            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About Us</Link>
              <a href="#" className="nav-link" onClick={(e) => {
                e.preventDefault();
                if (onContactClick) onContactClick();
              }}>Contact</a>
              
              {/* Favorites Link with Heart Icon */}
              <Link to="/favorites" className="nav-link favorites-link">
                <span className="favorites-icon">❤️</span>
                {favoriteCount > 0 && (
                  <span className="favorites-count">{favoriteCount}</span>
                )}
              </Link>
              
              {/* Cart Icon */}
              <button 
                className="cart-button nav-link" 
                onClick={onCartClick}
                aria-label="Shopping Cart"
              >
                <span className="cart-icon">🛒</span>
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </button>

              {/* Enhanced User Menu */}
              <div className="user-menu-container" ref={userMenuRef}>
                {user ? (
                  <div className="logged-in-user">
                    <Link to="/dashboard" className="user-greeting">
                      <span className="user-greeting-text">Welcome, {user.username}</span>
                    </Link>
                    <button 
                      onClick={onLogout} 
                      className="logout-button"
                      aria-label="Logout"
                    >
                      <span className="logout-icon">🚪</span>
                      <span className="logout-text">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    className="user-icon-button" 
                    onClick={toggleUserMenu} 
                    aria-label="User Menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <span className="user-icon">👤</span>
                  </button>
                )}
                
                {!user && isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <a href="#" className="dropdown-item" onClick={handleSignInClick}>
                      <span className="dropdown-icon">🔑</span>
                      Sign In
                    </a>
                    <a href="#" className="dropdown-item" onClick={handleSignupClick}>
                      <span className="dropdown-icon">📝</span>
                      Create Account
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <SignupPopup isOpen={isSignupPopupOpen} onClose={() => setIsSignupPopupOpen(false)} />
    </nav>
  );
};

export default Navbar;