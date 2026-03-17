import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDxE0Q-3_kvU-oupfk8jZ0m9kEdJGura_Y',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'eucharistki-songs.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'eucharistki-songs',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'eucharistki-songs.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '841648364425',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:841648364425:web:af90e0aa7c2bec3b2edf58',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
