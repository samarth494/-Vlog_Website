import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Vlogify</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>

        <div className="profile-dropdown">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="profile-icon"
          />
          <div className="dropdown-content">
            {!isLoggedIn ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signin">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
