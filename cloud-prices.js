/**
 * Public read-only prices listener. No admin credentials are used on the menu.
 * With no Firebase configuration, the original HTML prices remain visible.
 */
import { firebaseConfig, firebaseReady } from './firebase-config.js';

if (firebaseReady) {
  Promise.all([
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
  ]).then(([appSDK, dbSDK]) => {
    const app = appSDK.initializeApp(firebaseConfig);
    const db = dbSDK.getFirestore(app);
    const ref = dbSDK.doc(db, 'menu', 'prices');
    dbSDK.onSnapshot(ref, snapshot => {
      const prices = snapshot.exists() ? (snapshot.data().prices || {}) : {};
      document.dispatchEvent(new CustomEvent('menu:prices-updated', {detail: {prices}}));
    }, err => {
      console.error('Could not load live menu prices:', err);
      // Never imply stale HTML prices were updated.
      document.dispatchEvent(new CustomEvent('menu:prices-error'));
    });
  }).catch(err => {
    console.error('Firebase menu connection failed:', err);
    document.dispatchEvent(new CustomEvent('menu:prices-error'));
  });
}
