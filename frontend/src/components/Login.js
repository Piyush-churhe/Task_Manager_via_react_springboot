// src/components/Login.js
import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '' // Only for registration
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login logic
        const data = await authAPI.login({
          username: formData.username,
          password: formData.password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.username);
        onLogin(true);
      } else {
        // Registration logic
        await authAPI.register({
          username: formData.username,
          password: formData.password,
          email: formData.email
        });

        // After registration, automatically login
        const loginData = await authAPI.login({
          username: formData.username,
          password: formData.password
        });

        localStorage.setItem('token', loginData.token);
        localStorage.setItem('username', formData.username);
        onLogin(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'} to Task Manager</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-button"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              className="switch-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;