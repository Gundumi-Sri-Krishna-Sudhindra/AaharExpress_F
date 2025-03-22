import React, { useState } from 'react';
import './popup.css';
import logo from '/logo.webp';
import SignupPopup from './SignupPopup';
import PasswordResetPopup from './PasswordResetPopup';

const Popup = ({isOpen, onClose}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showSignin, setShowSignin] = useState(true);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    
    if(!isOpen) return null;

    const handleSignupClick = () => {
        setShowSignin(false);
        setShowSignup(true);
        setShowPasswordReset(false);
    };

    const handleSigninClick = () => {
        setShowSignup(false);
        setShowSignin(true);
        setShowPasswordReset(false);
    };

    const handleForgotPassword = () => {
        setShowSignin(false);
        setShowSignup(false);
        setShowPasswordReset(true);
    };

    return (
        <>
            {showSignin && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={onClose}>×</button>
                        
                        <div className="popup-header">
                            <img src={logo} alt="Company Logo" className="popup-logo" />
                            <h2 className="popup-title">Sign In</h2>
                        </div>
                
                        <div className="popup-form">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label form-label-xl">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="input-large"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password" className="form-label form-label-xl">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="input-large"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </div>
                            
                            <div className="remember-forgot">
                                <div className="remember-me">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                                <button 
                                    className="forgot-password"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            
                            <button className="signin-button">Sign In</button>
                            <button 
                                className="signup-suggestion"
                                onClick={handleSignupClick}
                            >
                                Don't have account? <span style={{ color: '#ea580c' }}>Sign Up!</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {showSignup && (
                <SignupPopup 
                    isOpen={showSignup}
                    onClose={onClose}
                    onSignInClick={handleSigninClick}
                />
            )}

            {showPasswordReset && (
                <PasswordResetPopup 
                    isOpen={showPasswordReset}
                    onClose={onClose}
                    onBackToSignIn={handleSigninClick}
                />
            )}
        </>
    );
};

export default Popup;