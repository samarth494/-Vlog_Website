import React, { useState } from 'react';
import './ProfileDropdown.css'; // Make sure to create this CSS file for styling

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="profile-dropdown-container">
      <img 
        src="/path-to-your-profile-logo.png" 
        alt="Profile Logo" 
        className="profile-logo" 
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li><a href="/login">Login</a></li>
            <li><a href="/signin">Sign In</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
