// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig'; // Import db
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; // Firestore methods

import CustomNavbar from './components/CustomNavbar';
import AuthComponent from './components/Auth'; // Renamed to avoid conflict with `auth` export
import CommunityPage from './components/CommunityPage';
import CommunityListPage from './components/CommunityListPage';
import Dashboard from './components/Dashboard'; // Import Dashboard
import { Container, Spinner } from 'react-bootstrap';

const VIEWS = {
  COMMUNITY_LIST: 'COMMUNITY_LIST',
  COMMUNITY_DETAIL: 'COMMUNITY_DETAIL',
  AUTH: 'AUTH',
  DASHBOARD: 'DASHBOARD', // New view
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentView, setCurrentView] = useState(VIEWS.COMMUNITY_LIST);
  const [selectedCommunityIdForDetail, setSelectedCommunityIdForDetail] = useState(null);

  // For Dashboard
  const [userMemberships, setUserMemberships] = useState([]); // Stores [{ communityId, communityName, roles: [] }, ...]
  const [selectedCommunityIdForDashboard, setSelectedCommunityIdForDashboard] = useState(null);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [loadingMembershipsError, setLoadingMembershipsError] = useState(null); 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[App.jsx AuthEffect] User state changed:", user ? user.email : "Logged out");
      setCurrentUser(user); // Set current user

      if (user) {
        // setLoadingAuth(false); // Moved below to ensure it's set after all user-related async ops
        console.log("[App.jsx AuthEffect] User logged in. Attempting to load memberships.");
        // setCurrentView(VIEWS.FETCHING_MEMBERSHIPS); // This was from a previous debug step, remove if dashboard is the goal
        setLoadingMemberships(true); // Indicate memberships are being loaded
        setLoadingMembershipsError(null);
        setUserMemberships([]);

        try {
          const fetchedMemberships = [];
          const communitiesSnapshot = await getDocs(collection(db, "communities"));
          console.log(`[App.jsx AuthEffect] Found ${communitiesSnapshot.docs.length} total communities.`);

          for (const communityDoc of communitiesSnapshot.docs) {
            // THIS IS THE CRITICAL PART TO DEBUG
            console.log(`[App.jsx AuthEffect] Checking community: ${communityDoc.id} (${communityDoc.data().name}) for user: ${user.uid}`);
            const memberDocRef = doc(db, "communities", communityDoc.id, "members", user.uid);
            const memberDocSnap = await getDoc(memberDocRef);

            if (memberDocSnap.exists()) { // <<<< THIS CONDITION IS LIKELY ALWAYS FALSE
              console.log(`[App.jsx AuthEffect] User ${user.uid} is member of ${communityDoc.id}. Roles:`, memberDocSnap.data().roles);
              fetchedMemberships.push({
                communityId: communityDoc.id,
                communityName: communityDoc.data().name || "Unnamed Community",
                roles: memberDocSnap.data().roles || ["member"]
              });
            } else {
              // ADD THIS ELSE BLOCK FOR DEBUGGING
              console.log(`[App.jsx AuthEffect] User ${user.uid} is NOT a member of ${communityDoc.id} (document at 'communities/${communityDoc.id}/members/${user.uid}' does not exist).`);
            }
          }

          
          setUserMemberships(fetchedMemberships); // This will be an empty array
          console.log("[App.jsx AuthEffect] Fetched memberships:", fetchedMemberships); // You see "Fetched memberships: []" - CONFIRMS THE ISSUE

          if (fetchedMemberships.length > 0) {
            // If a dashboard community was already selected by the user, try to keep it.
            // Otherwise, pick the first one.
            let currentDashboardSelection = selectedCommunityIdForDashboard;
            if (!currentDashboardSelection || !fetchedMemberships.find(m => m.communityId === currentDashboardSelection)) {
              currentDashboardSelection = fetchedMemberships[0].communityId;
              console.log("[App.jsx AuthEffect] Setting selectedDashboardCommunity to first membership:", currentDashboardSelection);
            }
            setSelectedCommunityIdForDashboard(currentDashboardSelection);
            console.log("[App.jsx AuthEffect] Setting view to DASHBOARD.");
            setCurrentView(VIEWS.DASHBOARD);
          } else {
            console.log("[App.jsx AuthEffect] User has no memberships. Setting view to COMMUNITY_LIST."); // THIS IS WHAT'S HAPPENING
            setSelectedCommunityIdForDashboard(null);
            setCurrentView(VIEWS.COMMUNITY_LIST);
          }
        } catch (error) {
          console.error("[App.jsx AuthEffect] Error fetching user memberships:", error);
          setLoadingMembershipsError(error.message);
          setCurrentView(VIEWS.COMMUNITY_LIST); // Fallback view on error
        } finally {
          setLoadingMemberships(false);
          setLoadingAuth(false); // Auth process (including membership loading) is complete
        }
      } else { // User is logged out
        console.log("[App.jsx AuthEffect] User logged out. Resetting states.");
        setUserMemberships([]);
        setSelectedCommunityIdForDashboard(null);
        //setSelectedCommunityIdForDetail(null); // also clear detail view if any
        setCurrentView(VIEWS.COMMUNITY_LIST); // Default view for guests
        setLoadingAuth(false); // Auth process complete
      }
    });
    return () => unsubscribe();
  }, [selectedCommunityIdForDashboard]); // Added selectedCommunityIdForDashboard as a dependency. This might be too much, let's see.
                                         // The main goal is to run this once auth changes. If selectedCommunityIdForDashboard changes
                                         // independently (e.g., user switches comm), that should be handled differently, not re-fetch all memberships.
                                         // Let's REMOVE selectedCommunityIdForDashboard from dependency array for now to simplify.
                                         // The effect should primarily react to `auth` changes.

  const handleLoginSuccess = (user) => {
    // setCurrentUser(user); // onAuthStateChanged will handle this
    // The useEffect for onAuthStateChanged will now trigger fetching memberships and setting view.
  };

  const handleLogout = () => {
    // setCurrentUser(null); // onAuthStateChanged will handle this
    // selectedCommunityIdForDashboard will be reset by onAuthStateChanged effect
    // currentView will be reset by onAuthStateChanged effect
  };

  const handleSelectCommunityForDetail = (communityId) => {
    setSelectedCommunityIdForDetail(communityId);
    setCurrentView(VIEWS.COMMUNITY_DETAIL);
  };

  const handleBackToListFromDetail = () => {
    setSelectedCommunityIdForDetail(null);
    setCurrentView(VIEWS.COMMUNITY_LIST);
  };

  const handleShowAuth = () => {
    setCurrentView(VIEWS.AUTH);
  };

  const handleShowCommunityList = () => {
    setSelectedCommunityIdForDetail(null); // Clear detailed view selection
    // If logged in and no memberships, this might still be the right view.
    // If logged in AND has memberships, clicking "Browse Communities" could arguably also go to DASHBOARD
    // or a more dedicated "find new communities" page. For now, simple list.
    setCurrentView(VIEWS.COMMUNITY_LIST);
  };
  
  const handleSelectCommunityForDashboard = (communityId) => {
    setSelectedCommunityIdForDashboard(communityId);
    // No need to change view if already in DASHBOARD, Dashboard component will re-render.
  };

  console.log("[App.jsx Render] CurrentUser:", currentUser ? currentUser.email : "null", "CurrentView:", currentView, "SelectedDashboardCommID:", selectedCommunityIdForDashboard);


  if (loadingAuth || (currentUser && loadingMemberships)) {
    console.log("[App.jsx Render] Showing loading spinner. loadingAuth:", loadingAuth, "loadingMemberships:", loadingMemberships);
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" /> <span className="ms-2">Loading Application...</span>
      </Container>
    );
  }

  let content;
  if (currentUser && selectedCommunityIdForDashboard && currentView === VIEWS.DASHBOARD) {
    console.log("[App.jsx Render] Rendering DASHBOARD.");
    content = <Dashboard
                currentUser={currentUser}
                userMemberships={userMemberships}
                selectedCommunityId={selectedCommunityIdForDashboard}
                onSelectCommunity={handleSelectCommunityForDashboard}
                onLogout={handleLogout} // Pass actual logout from firebase via navbar
              />;
  } else {
    console.log("[App.jsx Render] Not rendering dashboard. Rendering other view based on currentView:", currentView);
    switch (currentView) {
      case VIEWS.COMMUNITY_LIST:
        content = <CommunityListPage onSelectCommunity={handleSelectCommunityForDetail} />;
        break;
      case VIEWS.COMMUNITY_DETAIL:
        content = <CommunityPage communityId={selectedCommunityIdForDetail} onBackToList={handleBackToListFromDetail} />;
        break;
      case VIEWS.AUTH:
        content = <AuthComponent onLoginSuccess={handleLoginSuccess} />; // Ensure name is AuthComponent
        break;
      default: // Fallback if somehow in a weird state or user has no communities
        content = <CommunityListPage onSelectCommunity={handleSelectCommunityForDetail} />;
    }
  }

  return (
    <div>
      <CustomNavbar
        user={currentUser}
        onLogout={() => auth.signOut()} // Firebase signout directly
        onShowAuth={handleShowAuth}
        onShowCommunityList={handleShowCommunityList}
        // We might need to pass selectedCommunityName to Navbar if it's to be displayed there
        // for the dashboard view, or let Dashboard handle its own top bar.
        // For now, Dashboard handles its own top bar.
      />
      {/* App.jsx's main container might not be needed if Dashboard is full-width */}
      {/* <Container fluid className="pt-0"> No, Dashboard provides its own Container fluid */}
        {content}
      {/* </Container> */}
    </div>
  );
}

export default App;