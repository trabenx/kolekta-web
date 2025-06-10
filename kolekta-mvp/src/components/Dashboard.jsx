// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Assuming you might need db later, or auth
import { doc, getDoc } from 'firebase/firestore';
import {
  Container,
  Row,
  Col,
  Nav,
  NavDropdown,
  Alert,
  Spinner,
  Button, // If you use Button
  Card // <<<<<<<<<<<<<<< ADD THIS IMPORT
  // ListGroup, Modal, Form if used in Dashboard's final version
} from 'react-bootstrap';

// Placeholder for icons - we can add react-icons later
const SettingsIcon = () => <span>⚙️</span>; // Placeholder
const UserIcon = () => <span>🧑</span>; // Placeholder
const LanguageIcon = ({ lang }) => lang === 'he' ? <span>🇮🇱</span> : <span>🇺🇸</span>; // Placeholder

const Dashboard = ({ currentUser, userMemberships, selectedCommunityId, onSelectCommunity, onLogout }) => {
  const [currentRole, setCurrentRole] = useState('');
  const [selectedCommunityDetails, setSelectedCommunityDetails] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const selectedMembership = userMemberships.find(mem => mem.communityId === selectedCommunityId);

  useEffect(() => {
    const fetchRoleAndCommunityDetails = async () => {
      if (!currentUser || !selectedCommunityId) {
        setLoadingRole(false);
        return;
      }
      setLoadingRole(true);
      try {
        // Fetch role for the selected community
        if (selectedMembership && selectedMembership.roles) {
          setCurrentRole(selectedMembership.roles.join(', ')); // Display all roles, comma-separated
        } else {
          // Fallback if roles are not directly in userMemberships (should be ideally)
          // This might happen if userMemberships doesn't yet have roles pre-fetched
          const memberDocRef = doc(db, 'communities', selectedCommunityId, 'members', currentUser.uid);
          const memberDocSnap = await getDoc(memberDocRef);
          if (memberDocSnap.exists() && memberDocSnap.data().roles) {
            setCurrentRole(memberDocSnap.data().roles.join(', '));
          } else {
            setCurrentRole('Member (role not specified)');
          }
        }

        // Fetch full community details for the selected community (if needed beyond name)
        const communityDocRef = doc(db, 'communities', selectedCommunityId);
        const communityDocSnap = await getDoc(communityDocRef);
        if (communityDocSnap.exists()) {
          setSelectedCommunityDetails({ id: communityDocSnap.id, ...communityDocSnap.data() });
        } else {
          console.error("Selected community details not found!");
          setSelectedCommunityDetails(null);
        }

      } catch (error) {
        console.error("Error fetching role or community details:", error);
        setCurrentRole('Error loading role');
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRoleAndCommunityDetails();
  }, [currentUser, selectedCommunityId, selectedMembership]);

  if (loadingRole || !selectedCommunityDetails) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading dashboard context...</p>
      </Container>
    );
  }
  
  const currentCommunityName = selectedCommunityDetails?.name || 'Unknown Community';
  const otherMemberships = userMemberships.filter(mem => mem.communityId !== selectedCommunityId);

  // For UI text - can be moved to i18n later
  const lang = 'en'; // or 'he' - make this dynamic later
  const texts = {
    en: {
      selectedCommunity: "Selected community",
      settings: "Settings",
      home: "Home",
      aliyot: "Aliyot",
      messages: "Messages",
      classes: "Classes",
      payments: "Payments",
      sifreiTorah: "Sifrei Torah",
      welcome: `Welcome ${currentUser.displayName || currentUser.email}`,
      youAreA: "you are a",
      in: "in",
      alsoMemberOf: "You are also a member of:",
      regularMember: "(regular member)", // Placeholder, role should come from data
      switchToAnother: "Switch community",
      todaysServices: "Today's Services",
      aliyotForShabbat: "Aliyot for Shabbat",
      communityMessages: "Community Messages",
      thisWeeksClasses: "This Week's Classes",
      paymentStatus: "Payment Status",
      sifreiTorahStatus: "Sifrei Torah",
    },
    he: {
      // ... Hebrew translations ...
      selectedCommunity: "קהילה נבחרת",
      welcome: `שלום ${currentUser.displayName || currentUser.email}`,
      youAreA: "אתה", // Should be gender aware later
      in: "ב",
      // ... more ...
    }
  };
  const t = texts[lang];


  return (
    <Container fluid className="dashboard-container p-0">
      {/* Top Bar */}
      <Row className="bg-light p-2 align-items-center gx-2" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Col xs="auto">
          {/* Language Switcher - Placeholder */}
          <NavDropdown title={<><LanguageIcon lang={lang} /> {lang === 'en' ? 'English' : 'עברית'}</>} id="language-switcher">
            <NavDropdown.Item onClick={() => alert('Switch to English (not implemented)')}>🇺🇸 English</NavDropdown.Item>
            <NavDropdown.Item onClick={() => alert('Switch to Hebrew (not implemented)')}>🇮🇱 Hebrew</NavDropdown.Item>
          </NavDropdown>
        </Col>
        <Col>
          {t.selectedCommunity}: {' '}
          <NavDropdown title={currentCommunityName} id="community-switcher" disabled={userMemberships.length <= 1}>
            {userMemberships.map(mem => (
              <NavDropdown.Item 
                key={mem.communityId} 
                onClick={() => onSelectCommunity(mem.communityId)}
                active={mem.communityId === selectedCommunityId}
              >
                {mem.communityName}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Col>
        <Col xs="auto" className="text-end">
          {currentUser.displayName || currentUser.email} <UserIcon /> <SettingsIcon /> {/* User settings - Placeholder */}
        </Col>
      </Row>

      {/* Sub Navigation Bar */}
      <Nav fill variant="tabs" defaultActiveKey="/home" className="bg-light pt-2" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Nav.Item><Nav.Link href="#" onClick={(e) => e.preventDefault()}>{t.home}</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="#" onClick={(e) => e.preventDefault()} disabled>{t.aliyot}</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="#" onClick={(e) => e.preventDefault()} disabled>{t.messages}</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="#" onClick={(e) => e.preventDefault()} disabled>{t.classes}</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="#" onClick={(e) => e.preventDefault()} disabled>{t.payments}</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="#" onClick={(e) => e.preventDefault()} disabled>{t.sifreiTorah}</Nav.Link></Nav.Item>
      </Nav>

      <Container className="mt-3">
        {/* Welcome Message & Other Communities */}
        <Alert variant="success">
          ✔ {t.welcome}, {t.youAreA} <strong>{currentRole}</strong> {t.in} "{currentCommunityName}".
        </Alert>
        {otherMemberships.length > 0 && (
          <Alert variant="info">
            🕍 {t.alsoMemberOf}
            <ul>
              {otherMemberships.map(mem => (
                <li key={mem.communityId}>
                  "{mem.communityName}" ({mem.roles ? mem.roles.join(', ') : t.regularMember})
                </li>
              ))}
            </ul>
            {/* <Button variant="link" onClick={() => alert("Switch community UI needed")}>{t.switchToAnother} ⮕</Button> */}
          </Alert>
        )}

        {/* Placeholder for Widgets - This is where Zmanim, Aliyot, etc. will go */}
        <Row className="mt-4">
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>{t.todaysServices}</Card.Header>
              <Card.Body>Shacharit: (Data) <br/> Mincha: (Data)</Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>{t.aliyotForShabbat}</Card.Header>
              <Card.Body>Maftir: (Data) <br/> Haftarah: (Data)</Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>{t.communityMessages}</Card.Header>
              <Card.Body>- Placeholder Message 1 <br/>- Placeholder Message 2</Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>{t.thisWeeksClasses}</Card.Header>
              <Card.Body>- Placeholder Class 1 <br/>- Placeholder Class 2</Card.Body>
            </Card>
          </Col>
        </Row>
         <Row>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>{t.paymentStatus}</Card.Header>
              <Card.Body>- Placeholder Payment Info</Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>{t.sifreiTorahStatus}</Card.Header>
              <Card.Body>- Placeholder Torah Info</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Dashboard;