// src/components/Auth.jsx
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

const Auth = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');

  // ... (handleCreateUserProfile and handleSubmit functions remain the same for now) ...
  const handleCreateUserProfile = async (user) => {
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
        
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(userCredential.user);
        } else {
          console.error('Auth.jsx: FATAL - onLoginSuccess is NOT a function here (Sign Up). Value:', onLoginSuccess);
          setError("An unexpected error occurred after sign up. Please try logging in.");
        }
      } else { // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Auth.jsx: User logged in:', userCredential.user.email);
        
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(userCredential.user);
        } else {
          console.error('Auth.jsx: FATAL - onLoginSuccess is NOT a function here (Login). Value:', onLoginSuccess);
          setError("An unexpected error occurred after login.");
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
      } else {
        friendlyMessage = "An unexpected error occurred during authentication. Please try again."
      }
      setError(friendlyMessage);
    }
  };


  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">{isSignUp ? 'Sign Up' : 'Login'}</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                {isSignUp && (
                  <Form.Group className="mb-3" controlId="formBasicDisplayName">
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required={isSignUp}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" >
                    {isSignUp ? 'Sign Up' : 'Login'}
                  </Button>
                </div>
              </Form>
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="mt-3 d-block text-center"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;