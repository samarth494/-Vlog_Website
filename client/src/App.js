import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Dashboard from './pages/Dashboard';
import UploadPage from './components/UploadPage';
import SignInPage from './pages/SignInPage';  // Import SignInPage
import LoginPage from './pages/LoginPage';  // Import LoginPage
import PrivateRoute from './components/PrivateRoute';
import ProfileDropdown from './components/ProfileDropdown';  // Import ProfileDropdown
import Navbar from './components/navBar';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // Splash screen for 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <div className="App">
          <Navbar />
          
          <Routes>
            {/* Route to Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Login and Sign In Pages */}
            <Route path="/login" element={<LoginPage />} />  {/* Login page route */}
            <Route path="/signin" element={<SignInPage />} />  {/* Sign In page route */}
            
            {/* Protected Route for Upload Page */}
            <Route
              path="/upload"
              element={
                  <UploadPage />
              }
            />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
