// src/components/Navbar.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout(); // Callback to update App state
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <h1>Kolekta MVP</h1>
      {user && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
};

export default Navbar;