// src/components/CustomNavbar.jsx (or Navbar.jsx)
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Navbar as RBNavbar, Nav, Button, Container } from 'react-bootstrap';

const CustomNavbar = ({ user, onLogout, onShowAuth, onShowCommunityList }) => { // Added onShowAuth, onShowCommunityList
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout(); // This should also reset view to community list or home
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
<RBNavbar bg="light" variant="light" expand="lg" className="mb-3">      <Container>
        <RBNavbar.Brand href="#" onClick={(e) => { e.preventDefault(); onShowCommunityList(); }}>
          Kolekta
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
        <RBNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={onShowCommunityList}>Browse Communities</Nav.Link>
            {/* Add more Nav.Links here as your app grows */}
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <Button variant="outline-light" onClick={handleLogout}>Logout ({user.displayName || user.email})</Button>
            ) : (
              <Button variant="outline-light" onClick={onShowAuth}>Login / Sign Up</Button>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default CustomNavbar;