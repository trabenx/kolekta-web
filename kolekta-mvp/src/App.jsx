// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import CommunityPage from './components/CommunityPage';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // console.log("Auth state changed, current user:", user ? user.email : null); // Optional: keep for debugging auth state
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user) => {
    console.log("App.jsx: handleLoginSuccess CALLED with user:", user ? user.email : "UNKNOWN_USER");
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar user={currentUser} onLogout={handleLogout} />
      <div className="container">
        {!currentUser ? (
          <>
            {/* Log to check the prop just before passing it */}
            {console.log("App.jsx: RENDERING Auth. handleLoginSuccess type:", typeof handleLoginSuccess)}
            <Auth onLoginSuccess={handleLoginSuccess} />
          </>
        ) : (
          <CommunityPage />
        )}
      </div>
    </div>
  );
}

export default App;