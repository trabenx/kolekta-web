// src/components/Auth.jsx
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Auth = ({ onLoginSuccess }) => {
  // Log to check the prop upon component initialization/render
  console.log("Auth.jsx: INITIALIZING/RENDERING. onLoginSuccess type:", typeof onLoginSuccess, "Value:", onLoginSuccess);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');

  const handleCreateUserProfile = async (user) => {
    // ... (keep existing code)
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email,
        createdAt: serverTimestamp(),
        preferredLanguage: 'en',
      });
      console.log('User profile created in Firestore');
    } catch (err) {
      console.error('Error creating user profile:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
            setError("Please enter a display name.");
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Auth.jsx: User signed up:', userCredential.user.email);
        await handleCreateUserProfile(userCredential.user);
        
        // Log before calling onLoginSuccess
        console.log('Auth.jsx: In handleSubmit (Sign Up). About to call onLoginSuccess. Type:', typeof onLoginSuccess);
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(userCredential.user);
        } else {
          console.error('Auth.jsx: FATAL - onLoginSuccess is NOT a function here (Sign Up). Value:', onLoginSuccess);
          setError("An unexpected error occurred after sign up. Please try logging in."); // User-friendly error
        }
      } else { // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Auth.jsx: User logged in:', userCredential.user.email);
        
        // Log before calling onLoginSuccess
        console.log('Auth.jsx: In handleSubmit (Login). About to call onLoginSuccess. Type:', typeof onLoginSuccess);
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(userCredential.user);
        } else {
          console.error('Auth.jsx: FATAL - onLoginSuccess is NOT a function here (Login). Value:', onLoginSuccess);
          setError("An unexpected error occurred after login."); // User-friendly error
        }
      }
    } catch (err) {
      console.error('Authentication error:', err.code, err.message);
      let friendlyMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already in use. Please try logging in or use a different email.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak. Please use a stronger password (at least 6 characters).';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address is not valid.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid login credentials. Please check your email and password.';
      }
      setError(friendlyMessage);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div>
            <label htmlFor="displayName">Display Name:</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required={isSignUp}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.75rem', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError('');
        }}
        style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default Auth;