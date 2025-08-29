import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnMeuaH_sTDu_PvgtT4TN0_65E5u6J5pM",
  authDomain: "siuuuuu-7fce8.firebaseapp.com",
  projectId: "siuuuuu-7fce8",
  storageBucket: "siuuuuu-7fce8.firebasestorage.appspot.com",
  messagingSenderId: "156268451592",
  appId: "1:156268451592:web:29772cba780aa88413bebd",
  measurementId: "G-WTKPCZJP34",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
