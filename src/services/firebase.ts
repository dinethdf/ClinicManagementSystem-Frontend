import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyChLG-5B5DlNFtQIXJzFlr8JP_hseCadog",
  authDomain: "cureguard-hms.firebaseapp.com",
  databaseURL: "https://cureguard-hms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cureguard-hms",
  storageBucket: "cureguard-hms.firebasestorage.app",
  messagingSenderId: "195352499964",
  appId: "1:195352499964:web:be48ee0db1a83164efa979",
  measurementId: "G-RMD0GRWYSS"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization errors in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export { database };