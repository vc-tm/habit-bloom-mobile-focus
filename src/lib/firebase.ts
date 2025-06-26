
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBeKf76tWLRKJ0cF8bqqZV_2IlpkRLI1-Q",
  authDomain: "habit-tracker-0567.firebaseapp.com",
  projectId: "habit-tracker-0567",
  storageBucket: "habit-tracker-0567.firebasestorage.app",
  messagingSenderId: "278103082783",
  appId: "1:278103082783:web:8ddd49944b5b5c5c5388122a",
  measurementId: "G-DTME8RMQCE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
