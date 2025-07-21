import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnMeuaH_sTDu_PvgtT4TN0_65E5u6J5pM",
  authDomain: "siuuuuu-7fce8.firebaseapp.com",
  projectId: "siuuuuu-7fce8",
  storageBucket: "siuuuuu-7fce8.firebasestorage.app",
  messagingSenderId: "156268451592",
  appId: "1:156268451592:web:29772cba780aa88413bebd",
  measurementId: "G-WTKPCZJP34",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };