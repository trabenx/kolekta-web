// src/components/CommunityListPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

const CommunityListPage = ({ onSelectCommunity }) => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const communitiesCollectionRef = collection(db, 'communities');
        const querySnapshot = await getDocs(communitiesCollectionRef);
        const communitiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCommunities(communitiesData);
        setFilteredCommunities(communitiesData); // Initially show all
      } catch (err) {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const results = communities.filter(community =>
      (community.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (community.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    setFilteredCommunities(results);
  }, [searchTerm, communities]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading communities...</p>
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-3"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 justify-content-center">
        <Col md={8} lg={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search communities by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {filteredCommunities.length === 0 && !loading && (
        <Alert variant="info">No communities found matching your criteria.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredCommunities.map(community => (
          <Col key={community.id}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{community.name || 'Unnamed Community'}</Card.Title>
                <Card.Text>
                  {community.address || 'No address provided.'}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => onSelectCommunity(community.id)}
                  className="mt-auto"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CommunityListPage;