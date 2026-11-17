/**
 * Firebase client settings from the Web App registered for Halaweyat Masr.
 * These client identifiers ARE NOT administrator passwords.
 * All writes are restricted by the published Firestore Security Rules and admin UID.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyBrj57Al7r_T0F_EEY8oPMg5Lm1XeXDxKw',
  authDomain: 'halaweyat-masr-cafe.firebaseapp.com',
  projectId: 'halaweyat-masr-cafe',
  storageBucket: 'halaweyat-masr-cafe.firebasestorage.app',
  messagingSenderId: '337029667241',
  appId: '1:337029667241:web:83c7b7ee432d567e84ccb8'
};

// Firebase Authentication requires an EMAIL internally, even though
// administrators type the friendly username "admin" on the website.
// Firebase login account for the single admin, fixed to match Authentication > Users.
export const adminLoginEmail = 'bavlynagy501@gmail.com';
export const adminUsername = 'admin';
export const adminUid = 'xYTJRUX7bMMdIkoepGViPhmIrsw2';

// Public menu can read cloud prices before the admin email is configured.
export const firebaseReady = Object.values(firebaseConfig).every(v => v && !v.includes('PASTE_'));
export const adminReady = firebaseReady && adminLoginEmail.includes('@') && !adminLoginEmail.includes('PASTE_');
