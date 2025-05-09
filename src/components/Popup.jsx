import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './popup.css';
import logo from '/logo.webp';
import SignupPopup from './SignupPopup';
import PasswordResetPopup from './PasswordResetPopup';
import { loginSchema } from '../utils/validationSchemas';
import axios from 'axios';

const Popup = ({isOpen, onClose, onLogin}) => {
    const [showSignup, setShowSignup] = useState(false);
    const [showSignin, setShowSignin] = useState(true);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            // Clear any previous messages
            setLoginError('');
            setLoginSuccess('');
            
            // Make API call for authentication
            const response = await axios.post('http://localhost:8080/api/auth/signin', {
                username: values.email, // Assuming email is used as username
                password: values.password,
            });

            // Show success message
            setLoginSuccess('✅ Successfully signed in! Redirecting to dashboard...');
            console.log('Login success message set:', '✅ Successfully signed in! Redirecting to dashboard...');
            
            // If onLogin callback exists, pass the login data
            if (onLogin) {
                // Wait for a moment to show the success message
                setTimeout(() => {
                    onLogin(values.email, values.password);
                }, 2000);
            } else {
                // If no callback, handle redirect here
                const { accessToken, username } = response.data;
                localStorage.setItem('token', accessToken);
                
                // Get user details
                const userResponse = await axios.get(`http://localhost:8080/api/users/username/${username}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                // Store user in local storage
                localStorage.setItem('user', JSON.stringify(userResponse.data));
                
                // Wait for a moment to show the success message, then redirect
                setTimeout(() => {
                    onClose();
                    window.location.href = '/dashboard';
                }, 2000);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Invalid email or password');
        } finally {
            setSubmitting(false);
        }
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
                
                        <Formik
                            initialValues={{ email: '', password: '', rememberMe: false }}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ isSubmitting }) => (
                                <Form className="popup-form">
                                    {loginError && (
                                        <div className="error-message">
                                            {loginError}
                                        </div>
                                    )}
                                    
                                    {loginSuccess && (
                                        <div className="success-message">
                                            {loginSuccess}
                                        </div>
                                    )}
                                    
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label form-label-xl">Email</label>
                                        <Field
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="input-large"
                                            placeholder="Enter your email"
                                            disabled={!!loginSuccess}
                                        />
                                        <ErrorMessage name="email" component="div" className="error-text" />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label form-label-xl">Password</label>
                                        <div className="password-input-container">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                className="input-large"
                                                placeholder="Enter your password"
                                                disabled={!!loginSuccess}
                                            />
                                            <button 
                                                type="button" 
                                                className="toggle-password-button"
                                                onClick={togglePasswordVisibility}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                disabled={!!loginSuccess}
                                            >
                                                {showPassword ? "👁️" : "👁️‍🗨️"}
                                            </button>
                                        </div>
                                        <ErrorMessage name="password" component="div" className="error-text" />
                                    </div>
                                    
                                    <div className="remember-forgot">
                                        <div className="remember-me">
                                            <Field
                                                type="checkbox"
                                                id="rememberMe"
                                                name="rememberMe"
                                                disabled={!!loginSuccess}
                                            />
                                            <label htmlFor="rememberMe">Remember me</label>
                                        </div>
                                        <button 
                                            type="button"
                                            className="forgot-password"
                                            onClick={handleForgotPassword}
                                            disabled={!!loginSuccess}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="signin-button"
                                        disabled={isSubmitting || loginSuccess}
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </button>
                                    <button 
                                        type="button"
                                        className="signup-suggestion"
                                        onClick={handleSignupClick}
                                        disabled={loginSuccess}
                                    >
                                        Don't have account? <span style={{ color: '#ea580c' }}>Sign Up!</span>
                                    </button>
                                </Form>
                            )}
                        </Formik>
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