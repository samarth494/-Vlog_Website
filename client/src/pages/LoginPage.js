import React, { useState } from 'react';
import './LoginPage.css';
import { FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; // ⬅️ Import axios instance

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ⬅️ For redirection

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('/auth/login', { email, password });

      // Save token to localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to profile page
      navigate('/profile');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <FaUserCircle className="login-icon" />
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <div className="password-container">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="eye-icon" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-login">Login</button>
        </form>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="signin-link">
          <p>Don't have an account? <Link to="/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
