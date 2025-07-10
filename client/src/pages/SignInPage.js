import React, { useState } from 'react';
import './SignInPage.css';
import { FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';  // User icon for avatar
import { Link } from 'react-router-dom';  // For routing

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
    } else {
      // Implement sign-in logic here
      console.log('Signing in with:', { email, password });
      setError('');
      // Redirect to the dashboard or home page
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <FaUserCircle className="signin-icon" />
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
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
          <button type="submit" className="btn-signin">Sign In</button>
        </form>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="signin-link">
          <p>Already have an account? <Link to="/login">Login</Link></p> {/* Link to Login page */}
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
