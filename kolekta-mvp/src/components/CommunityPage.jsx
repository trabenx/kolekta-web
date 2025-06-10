// src/components/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig'; // Import db and auth
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions

// IMPORTANT: Replace this with the actual ID of the community document you created in Firestore.
const COMMUNITY_ID = "nAosKOP75TnBTHdKaNHV"; // E.g., "kolekta-central-synagogue" or the auto-ID

const CommunityPage = () => {
  const [communityInfo, setCommunityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!COMMUNITY_ID) {
        setError("Community ID is not set. Please configure it in CommunityPage.jsx");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const communityDocRef = doc(db, 'communities', COMMUNITY_ID);
        const communityDocSnap = await getDoc(communityDocRef);

        if (communityDocSnap.exists()) {
          const data = communityDocSnap.data();
          setCommunityInfo(data);
          setEditData({ // Initialize editData with fetched data
            name: data.name,
            address: data.address,
            contact: data.contact,
            // For simplicity, prayerTimes and upcomingEvents are not directly editable in this basic form
          });
          // Check if current user is an admin
          const currentUser = auth.currentUser;
          if (currentUser && data.adminUserIds && data.adminUserIds.includes(currentUser.uid)) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setError(`Community with ID "${COMMUNITY_ID}" not found.`);
        }
      } catch (err) {
        console.error("Error fetching community data:", err);
        setError("Failed to load community data. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []); // Re-fetch if COMMUNITY_ID changes, though it's constant here

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!isAdmin) return;
    const communityDocRef = doc(db, 'communities', COMMUNITY_ID);
    try {
        // Only update fields that are part of editData
        const dataToUpdate = {
            name: editData.name,
            address: editData.address,
            contact: editData.contact,
            // Note: prayerTimes and upcomingEvents are more complex to update this way
            // and would require more sophisticated form handling.
        };
      await updateDoc(communityDocRef, dataToUpdate);
      setCommunityInfo(prev => ({ ...prev, ...dataToUpdate })); // Update local state immediately
      setIsEditing(false);
      alert("Community details updated!");
    } catch (err) {
      console.error("Error updating community data:", err);
      alert("Failed to update community details. " + err.message);
    }
  };

  if (loading) return <div>Loading community information...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!communityInfo) return <div>No community information available.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      {isAdmin && !isEditing && (
        <button onClick={() => setIsEditing(true)} style={{ float: 'right', marginBottom: '1rem' }}>Edit Details</button>
      )}
      {isAdmin && isEditing && (
        <div style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
          <h3>Edit Community Details</h3>
          <div>
            <label>Name: </label>
            <input type="text" name="name" value={editData.name || ''} onChange={handleEditChange} style={{width: '80%', padding:'0.5rem', marginBottom:'0.5rem'}}/>
          </div>
          <div>
            <label>Address: </label>
            <input type="text" name="address" value={editData.address || ''} onChange={handleEditChange} style={{width: '80%', padding:'0.5rem', marginBottom:'0.5rem'}}/>
          </div>
          <div>
            <label>Contact: </label>
            <input type="text" name="contact" value={editData.contact || ''} onChange={handleEditChange} style={{width: '80%', padding:'0.5rem', marginBottom:'0.5rem'}}/>
          </div>
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
        </div>
      )}

      <h2>Welcome to {communityInfo.name}</h2>
      <p><strong>Address:</strong> {communityInfo.address}</p>
      <p><strong>Contact:</strong> {communityInfo.contact}</p>

      <h3>Prayer Times:</h3>
      {communityInfo.prayerTimes ? (
        <ul>
          {Object.entries(communityInfo.prayerTimes).map(([key, value]) => (
            <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}</li>
          ))}
        </ul>
      ) : <p>No prayer times available.</p>}

      <h3>Upcoming Events:</h3>
      {communityInfo.upcomingEvents && communityInfo.upcomingEvents.length > 0 ? (
        <ul>
          {communityInfo.upcomingEvents.map(event => (
            <li key={event.id || event.name}>{event.name} - {event.date}</li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events scheduled.</p>
      )}
    </div>
  );
};

export default CommunityPage;
