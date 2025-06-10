import admin from 'firebase-admin';
import { createRequire } from 'module'; // Helper to require JSON

const require = createRequire(import.meta.url); // Create a require function for JSON files

// Initialize Firebase Admin SDK
const serviceAccount = require('./kolekta-web-firebase-key.json'); // Use the created require for JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- Configuration ---
// !! REPLACE THIS WITH THE ACTUAL UID FOR trabelsy21@gmail.com !!
const trabelsyUID = 'Tr7ubE5UvyWtGpKS78KcTW1LwqI3';
const trabelsyDisplayName = 'Nissim Trabelsy'; // Or your preferred display name
const trabelsyEmail = 'trabelsy21@gmail.com';

// Other test user (optional)
const otherUserUID = 'userUID1_from_auth_or_test';
const otherUserDisplayName = 'Sarah Cohen';
const otherUserEmail = 'sarah@example.com';


async function seedData() {
  if (trabelsyUID === 'YOUR_ACTUAL_TRABELSY_UID' || trabelsyUID === 'TRABELSY_USER_UID_PLACEHOLDER') { // Added original placeholder check too
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("ERROR: Please replace 'YOUR_ACTUAL_TRABELSY_UID' with the actual UID");
    console.error("       for 'trabelsy21@gmail.com' in the seedDatabase script.");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return;
  }

  console.log(`Starting to seed data for user: ${trabelsyDisplayName} (UID: ${trabelsyUID})...`);

  // --- Users Collection ---
  await db.collection('users').doc(trabelsyUID).set({
    uid: trabelsyUID,
    displayName: trabelsyDisplayName,
    email: trabelsyEmail,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    preferredLanguage: 'he'
  }, { merge: true });
  console.log(`Ensured user profile exists for ${trabelsyDisplayName}`);

  await db.collection('users').doc(otherUserUID).set({
    uid: otherUserUID,
    displayName: otherUserDisplayName,
    email: otherUserEmail,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    preferredLanguage: 'en'
  }, { merge: true });
  console.log(`Ensured user profile exists for ${otherUserDisplayName}`);

  // --- Communities ---
  const community1Id = 'ahavat-hesed-jlm';
  const community2Id = 'tiferet-moshe-ta';
  const community3Id = 'or-hadash-haifa';

  await db.collection('communities').doc(community1Id).set({
    name: 'Ahavat Hesed Jerusalem',
    address: '123 Kindness St, Jerusalem',
    contact: 'contact@ahavathesed.org',
    adminUserIds: [trabelsyUID],
    prayerTimes: { shacharit: "07:00", mincha: "18:00", maariv: "20:00" },
    upcomingEvents: [{id: "evt1", name: "Shabbat Dinner", date: "Next Friday"}]
  }, { merge: true });
  console.log(`Upserted community: Ahavat Hesed Jerusalem`);

  await db.collection('communities').doc(community2Id).set({
    name: 'Tiferet Moshe Tel Aviv',
    address: '456 Glory Ave, Tel Aviv',
    contact: 'info@tiferetmoshe.org',
    adminUserIds: [],
    prayerTimes: { shacharit: "06:30", mincha: "18:30", maariv: "20:30" }
  }, { merge: true });
  console.log(`Upserted community: Tiferet Moshe Tel Aviv`);

  await db.collection('communities').doc(community3Id).set({
    name: 'Or Hadash Haifa',
    address: '789 Light Rd, Haifa',
    contact: 'office@orhadash.org',
    adminUserIds: [otherUserUID]
  }, { merge: true });
  console.log(`Upserted community: Or Hadash Haifa`);

  // --- Memberships ---
  await db.collection('communities').doc(community1Id).collection('members').doc(trabelsyUID).set({
    roles: ['admin', 'gabbai'],
    displayName: trabelsyDisplayName,
    communityName: 'Ahavat Hesed Jerusalem',
    communityId: community1Id
  }, { merge: true });
  console.log(`Upserted ${trabelsyDisplayName} as Admin/Gabbai in Ahavat Hesed Jerusalem`);

  await db.collection('communities').doc(community2Id).collection('members').doc(trabelsyUID).set({
    roles: ['member'],
    displayName: trabelsyDisplayName,
    communityName: 'Tiferet Moshe Tel Aviv',
    communityId: community2Id
  }, { merge: true });
  console.log(`Upserted ${trabelsyDisplayName} as Member in Tiferet Moshe Tel Aviv`);

  await db.collection('communities').doc(community1Id).collection('members').doc(otherUserUID).set({
    roles: ['board_member'],
    displayName: otherUserDisplayName,
    communityName: 'Ahavat Hesed Jerusalem',
    communityId: community1Id
  }, { merge: true });
  console.log(`Upserted ${otherUserDisplayName} as Board Member in Ahavat Hesed Jerusalem`);

  await db.collection('communities').doc(community3Id).collection('members').doc(otherUserUID).set({
    roles: ['admin'],
    displayName: otherUserDisplayName,
    communityName: 'Or Hadash Haifa',
    communityId: community3Id
  }, { merge: true });
  console.log(`Upserted ${otherUserDisplayName} as Admin in Or Hadash Haifa`);

  // --- Announcements ---
  const announcementsRef = db.collection('communities').doc(community1Id).collection('announcements');
  await announcementsRef.add({
    title: 'Special Kiddush This Shabbat',
    content: 'Join us for a special kiddush sponsored by the Levy family.',
    postedAt: admin.firestore.FieldValue.serverTimestamp(),
    authorId: trabelsyUID,
    authorName: trabelsyDisplayName
  });
  await announcementsRef.add({
    title: 'Weekly Parasha Shiur',
    content: 'Rabbi Cohen\'s weekly Parasha shiur will be on Wednesday at 8 PM.',
    postedAt: admin.firestore.FieldValue.serverTimestamp(),
    authorId: otherUserUID,
    authorName: otherUserDisplayName
  });
  console.log(`Added announcements to Ahavat Hesed Jerusalem`);

  console.log('Data seeding completed!');
}

seedData().catch(error => {
  console.error('Error seeding data:', error);
});