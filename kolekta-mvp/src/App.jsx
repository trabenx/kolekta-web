// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import CustomNavbar from './components/CustomNavbar'; // Ensure this is CustomNavbar if you renamed it
import Auth from './components/Auth';
import CommunityPage from './components/CommunityPage';
import CommunityListPage from './components/CommunityListPage'; // Import new component
import { Container, Spinner } from 'react-bootstrap'; // For loading state

// Define view states
const VIEWS = {
  COMMUNITY_LIST: 'COMMUNITY_LIST',
  COMMUNITY_DETAIL: 'COMMUNITY_DETAIL',
  AUTH: 'AUTH',
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentView, setCurrentView] = useState(VIEWS.COMMUNITY_LIST); // Default view
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
      if (!user && currentView === VIEWS.COMMUNITY_DETAIL && !selectedCommunityId) {
        // If user logs out from a page that requires auth (not the case for CommunityPage now)
        // or if somehow in an invalid state, reset to list.
        // setCurrentView(VIEWS.COMMUNITY_LIST); // For now, community page is public
      }
    });
    return () => unsubscribe();
  }, [currentView, selectedCommunityId]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView(VIEWS.COMMUNITY_LIST); // Go to community list after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(VIEWS.COMMUNITY_LIST); // Go to community list after logout
    setSelectedCommunityId(null);
  };

  const handleSelectCommunity = (communityId) => {
    setSelectedCommunityId(communityId);
    setCurrentView(VIEWS.COMMUNITY_DETAIL);
  };

  const handleBackToList = () => {
    setSelectedCommunityId(null);
    setCurrentView(VIEWS.COMMUNITY_LIST);
  };

  const handleShowAuth = () => {
    setCurrentView(VIEWS.AUTH);
  };

  const handleShowCommunityList = () => {
    setSelectedCommunityId(null); // Clear selected community when going back to list
    setCurrentView(VIEWS.COMMUNITY_LIST);
  };


  if (loadingAuth) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" /> <span className="ms-2">Loading Application...</span>
      </Container>
    );
  }

  let content;
  switch (currentView) {
    case VIEWS.COMMUNITY_LIST:
      content = <CommunityListPage onSelectCommunity={handleSelectCommunity} />;
      break;
    case VIEWS.COMMUNITY_DETAIL:
      content = <CommunityPage communityId={selectedCommunityId} onBackToList={handleBackToList} />;
      break;
    case VIEWS.AUTH:
      content = <Auth onLoginSuccess={handleLoginSuccess} />;
      break;
    default:
      content = <CommunityListPage onSelectCommunity={handleSelectCommunity} />;
  }

  return (
    <div>
      <CustomNavbar
        user={currentUser}
        onLogout={handleLogout}
        onShowAuth={handleShowAuth}
        onShowCommunityList={handleShowCommunityList}
      />
      <Container fluid className="pt-3"> {/* Add some padding below navbar */}
        {content}
      </Container>
    </div>
  );
}

export default App;