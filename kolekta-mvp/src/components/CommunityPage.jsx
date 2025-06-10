
// src/components/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Card, Button, ListGroup, Spinner, Alert, Form, Modal, Row, Col } from 'react-bootstrap';

// NO LONGER HARDCODE COMMUNITY_ID HERE
// const COMMUNITY_ID = "nAosKOP75TnBTHdKaNHV";

const CommunityPage = ({ communityId, onBackToList }) => { // Added communityId and onBackToList props
  const [communityInfo, setCommunityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', address: '', contact: '' });

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!communityId) { // Check if communityId is provided
        setError("No community selected.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const communityDocRef = doc(db, 'communities', communityId); // Use the prop
        const communityDocSnap = await getDoc(communityDocRef);

        if (communityDocSnap.exists()) {
          const data = communityDocSnap.data();
          setCommunityInfo(data);
          setEditData({
            name: data.name || '',
            address: data.address || '',
            contact: data.contact || '',
          });

          const currentUser = auth.currentUser;
          // Admin check remains the same, relies on logged-in user
          if (currentUser && data.adminUserIds && data.adminUserIds.includes(currentUser.uid)) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setError(`Community with ID "${communityId}" not found.`);
        }
      } catch (err) {
        console.error("Error fetching community data:", err);
        setError("Failed to load community data. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]); // Re-fetch if communityId changes

  // handleShowEditModal, handleCloseEditModal, handleEditChange, handleSaveChanges remain mostly the same
  const handleShowEditModal = () => {
    if (communityInfo) {
        setEditData({
            name: communityInfo.name || '',
            address: communityInfo.address || '',
            contact: communityInfo.contact || '',
        });
    }
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!isAdmin || !communityId) return; // Use communityId prop
    const communityDocRef = doc(db, 'communities', communityId); // Use communityId prop
    try {
      const dataToUpdate = {
        name: editData.name,
        address: editData.address,
        contact: editData.contact,
      };
      await updateDoc(communityDocRef, dataToUpdate);
      setCommunityInfo(prev => ({ ...prev, ...dataToUpdate }));
      handleCloseEditModal();
      alert("Community details updated!");
    } catch (err) {
      console.error("Error updating community data:", err);
      setError("Failed to update community details. " + err.message);
    }
  };


  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading community information...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
        {onBackToList && <Button variant="link" onClick={onBackToList}>Back to list</Button>}
      </Container>
    );
  }

  if (!communityInfo) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">No community information available.</Alert>
        {onBackToList && <Button variant="link" onClick={onBackToList}>Back to list</Button>}
      </Container>
    );
  }
  
  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <Container className="mt-4">
        {onBackToList && <Button variant="outline-secondary" className="mb-3" onClick={onBackToList}>← Back to Communities List</Button>}
      <Card>
        <Card.Header as="h2" className="d-flex justify-content-between align-items-center">
          Welcome to {communityInfo.name}
          {isAdmin && auth.currentUser && ( // Ensure currentUser exists for admin actions
            <Button variant="outline-primary" size="sm" onClick={handleShowEditModal}>
              Edit Details
            </Button>
          )}
        </Card.Header>
        {/* ... rest of the Card.Body and Modal JSX remains the same ... */}
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card.Title>Details</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Address:</strong> {communityInfo.address}</ListGroup.Item>
                <ListGroup.Item><strong>Contact:</strong> {communityInfo.contact}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <Card.Title className="mt-3 mt-md-0">Prayer Times</Card.Title>
              {communityInfo.prayerTimes && Object.keys(communityInfo.prayerTimes).length > 0 ? (
                <ListGroup variant="flush">
                  {Object.entries(communityInfo.prayerTimes).map(([key, value]) => (
                    <ListGroup.Item key={key}><strong>{formatKey(key)}:</strong> {value}</ListGroup.Item>
                  ))}
                </ListGroup>
              ) : <Alert variant="info" className="mt-2">No prayer times available.</Alert>}
            </Col>
          </Row>

          <Card.Title className="mt-4">Upcoming Events</Card.Title>
          {communityInfo.upcomingEvents && communityInfo.upcomingEvents.length > 0 ? (
            <ListGroup>
              {communityInfo.upcomingEvents.map(event => (
                <ListGroup.Item key={event.id || event.name}>
                  <strong>{event.name}</strong> - {event.date}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info" className="mt-2">No upcoming events scheduled.</Alert>
          )}
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Community Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={editData.name} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={editData.address} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editContact">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" name="contact" value={editData.contact} onChange={handleEditChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CommunityPage;