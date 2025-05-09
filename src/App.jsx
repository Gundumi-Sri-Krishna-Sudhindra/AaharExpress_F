import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Popup from './components/Popup';
import About from './components/About';
import Features from './components/Features';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import Dashboard from './components/Dashboard';

import Testimonials from './components/Testimonials';
import SpecialOffers from './components/SpecialOffers';
import Newsletter from './components/Newsletter';

import PasswordResetPopup from './components/PasswordResetPopup';
import MenuPage from './components/MenuPage';
import ContactUsPopup from './components/ContactUsPopup';
import FavoritesPage from './components/FavoritesPage';
import './App.css';
import axios from 'axios';

const App = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing saved cart:", error);
        setCartItems([]);
      }
    }
    
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error parsing saved favorites:", error);
        setFavorites([]);
      }
    }
    
    // Load favoriteItems for backwards compatibility with your FavoritesPage component
    const savedFavoriteIds = localStorage.getItem('favoriteItems');
    if (savedFavoriteIds) {
      try {
        // This ensures that the old format is handled properly
        localStorage.setItem('favoriteItems', savedFavoriteIds);
      } catch (error) {
        console.error("Error handling saved favorite IDs:", error);
      }
    }
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
      }
    }
    
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error("Error parsing saved orders:", error);
        setOrders([]);
      }
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Also update favoriteItems for backwards compatibility with your current FavoritesPage
    const favoriteIds = favorites.map(item => item.id);
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteIds));
  }, [favorites]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem
      ));
    } else {
      setCartItems([...cartItems, {...item, quantity: 1}]);
    }
    
    // Show cart feedback
    setIsCartOpen(true);
    setTimeout(() => setIsCartOpen(false), 3000);
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? {...item, quantity: newQuantity} : item
    ));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };
  
  // Favorites functionality
  const handleAddToFavorites = (item) => {
    if (!favorites.some(favorite => favorite.id === item.id)) {
      setFavorites([...favorites, item]);
    }
  };
  
  const handleRemoveFromFavorites = (itemId) => {
    setFavorites(favorites.filter(item => item.id !== itemId));
  };
  
  const isItemFavorite = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };

  const handleCheckout = (shippingDetails) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'processing',
      timestamp: new Date().toISOString(), // Store as ISO string for consistent formatting
      shippingDetails,
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    setActiveOrder(newOrder);
    handleClearCart();
    return newOrder;
  };
  
  const handleLogin = async (username, password) => {
    try {
      // Call the login API
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        username,
        password,
      });

      // Assuming response.data contains user info and token
      const { accessToken, username: fetchedUsername } = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', accessToken);

      // Fetch user data using the username
      const userResponse = await axios.get(`http://localhost:8080/api/users/username/${fetchedUsername}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token for authentication
        },
      });

      // Set the user data in state
      setUser(userResponse.data);
      setIsAuthModalOpen(false); // Close the auth modal
      
      // Redirect to dashboard using window.location since we don't have access to useNavigate here
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handlePasswordReset = (email) => {
    // Implement password reset logic here
    console.log("Password reset requested for:", email);
    setIsPasswordResetOpen(false);
    // Could show a confirmation message or redirect
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle Contact popup
  const handleContactPopup = () => {
    setIsContactPopupOpen(true);
  };

  // Handle viewing an order
  const handleViewOrder = (order) => {
    setActiveOrder(order);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar 
          onOrderClick={() => setIsPopupOpen(true)} 
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          favoriteCount={favorites.length}
          onCartClick={() => setIsCartOpen(!isCartOpen)}
          onAuthClick={() => setIsAuthModalOpen(true)}
          onContactClick={handleContactPopup}
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <SpecialOffers 
                  onAddToCart={handleAddToCart} 
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  isItemFavorite={isItemFavorite}
                />
                <Features />
                <Testimonials />
                <Newsletter />
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={
              <MenuPage 
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                isItemFavorite={isItemFavorite}
                searchQuery={searchQuery}
                filterCategory={filterCategory}
              />
            } />
            <Route path="/dashboard" element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            <Route path="/favorites" element={
              <FavoritesPage 
                favorites={favorites}
                onRemoveFavorite={handleRemoveFromFavorites}
                onAddToCart={handleAddToCart}
              />
            } />
            <Route path="/checkout" element={
              <Checkout 
                cartItems={cartItems} 
                onCheckout={handleCheckout}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveFromCart}
                user={user}
              />
            } />
            <Route path="/tracking" element={
              <OrderTracking 
                order={activeOrder} 
                onBackToHome={() => setActiveOrder(null)} 
              />
            } />
            <Route path="/profile" element={
              user ? (
                <UserProfile 
                  user={user} 
                  orders={orders} 
                  onViewOrder={handleViewOrder} 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </main>
        
        <Footer />
        
        <Popup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
          cartItems={cartItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveFromCart}
          onForgotPassword={() => {
            setIsPopupOpen(false);
            setIsPasswordResetOpen(true);
          }}
          onCheckout={() => {
            setIsPopupOpen(false);
            // Navigate to checkout page
          }}
          onLogin={handleLogin}
        />

        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            // Navigate to checkout page
          }}
        />

        

        <PasswordResetPopup 
          isOpen={isPasswordResetOpen}
          onClose={() => setIsPasswordResetOpen(false)}
          onBackToSignIn={() => {
            setIsPasswordResetOpen(false);
            setIsAuthModalOpen(true);
          }}
          onSubmit={handlePasswordReset}
        />
        
        <ContactUsPopup
          isOpen={isContactPopupOpen}
          onClose={() => setIsContactPopupOpen(false)}
        />
      </div>
    </Router>
  );
};

export default App;