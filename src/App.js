// src/App.js
import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call or load content after 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="App">
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <div>
          <h1>Welcome to Vlogify!</h1>
          {/* Your main content goes here */}
        </div>
      )}
    </div>
  );
}

export default App;
