
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { PerformanceMonitor } from '@/utils/performance';

const firebaseConfig = {
  apiKey: "AIzaSyBeKf76tWLRKJ0cF8bqqZV_2IlpkRLI1-Q",
  authDomain: "habit-tracker-0567.firebaseapp.com",
  projectId: "habit-tracker-0567",
  storageBucket: "habit-tracker-0567.firebasestorage.app",
  messagingSenderId: "278103082783",
  appId: "1:278103082783:web:8ddd49944b5b5c5c5388122a",
  measurementId: "G-DTME8RMQCE"
};

console.log('🔥 Initializing Firebase...');
PerformanceMonitor.start('firebase-init');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

PerformanceMonitor.end('firebase-init');

// Monitor connection status
let isOnline = navigator.onLine;

const handleOnline = async () => {
  if (!isOnline) {
    console.log('🌐 Network connection restored, enabling Firestore...');
    try {
      await enableNetwork(db);
      isOnline = true;
    } catch (error) {
      console.error('Failed to enable network:', error);
    }
  }
};

const handleOffline = async () => {
  if (isOnline) {
    console.log('📡 Network connection lost, disabling Firestore...');
    try {
      await disableNetwork(db);
      isOnline = false;
    } catch (error) {
      console.error('Failed to disable network:', error);
    }
  }
};

// Add network event listeners
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);

// Configure Google Auth Provider for better performance
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

console.log('✅ Firebase initialized successfully');
