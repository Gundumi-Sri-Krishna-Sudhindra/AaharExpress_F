import React, { useState } from 'react';
import './popup.css';
import logo from '/logo.webp';

const SignupPopup = ({isOpen, onClose, onSignInClick}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if(!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ 
                width: "500px", 
                maxWidth: "95vw", 
                padding: "24px",
                maxHeight: "95vh",
                overflow: "auto"
            }}>
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="popup-header" style={{ marginBottom: "10px" }}>
                    <img 
                        src={logo} 
                        alt="Company Logo" 
                        className="popup-logo" 
                        style={{ height: "110px", margin: "0 auto 10px", display: "block" }} 
                    />
                    <h2 className="popup-title" style={{ fontSize: "1.5rem", textAlign: "center", margin: "0" }}>Create Account</h2>
                </div>
        
                <form className="popup-form" onSubmit={handleSubmit} style={{ gap: "8px" }}>
                    <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label htmlFor="username" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label htmlFor="email" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label htmlFor="password" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="signin-button" 
                        style={{ 
                            padding: "10px", 
                            fontSize: "1rem", 
                            marginTop: "8px",
                            width: "100%"
                        }}
                    >
                        Sign Up
                    </button>
                    <button 
                        type="button"
                        className="signup-suggestion"
                        onClick={onSignInClick}
                        style={{ fontSize: "0.9rem", marginTop: "3px" }}
                    >
                        Already have an account? <span style={{ color: '#ea580c' }}>Sign In!</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPopup;