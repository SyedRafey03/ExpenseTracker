import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

function AuthPage({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'signup';
        try {
            const res = await axios.post(`http://localhost:5000/auth/${endpoint}`, formData);
            if (isLogin) {
                onLoginSuccess(res.data.user);
            } else {
                alert("Account created! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="auth-split-container">
            {/* LEFT SIDE: THE FORM */}
            <div className="auth-left">
                <div className="auth-form-container">
                    <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
                    <p className="subtitle">Securely access your financial dashboard</p>
                    
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="input-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your username" 
                                    required 
                                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                />
                            </div>
                        )}
                        <div className="input-group">
                            <label>Email address</label>
                            <input 
                                type="email" 
                                placeholder="name@domain.com" 
                                required 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            />
                        </div>
                        
                        {error && <p className="error-text">{error}</p>}
                        
                        <button type="submit" className="primary-btn">
                            {isLogin ? "Sign in" : "Get started"}
                        </button>
                    </form>

                    <p className="toggle-text">
                        {isLogin ? "Don't have an account?" : "Already have an account?"} 
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? " Create one" : " Log in"}
                        </span>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: BRANDING CONTENT */}
            <div className="auth-right">
                <div className="branding-content">
                    <h1>Expense <span className="highlight">Tracker</span></h1>
                    <p className="tagline">The smartest way to manage your personal finances and grow your savings.</p>
                    
                    <div className="feature-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;