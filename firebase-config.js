import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth/react-native';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAbCFwiETsIes9jYw6He0z1ljSJwJi0-AY",
    authDomain: "iot-smart-dorm-388010.firebaseapp.com",
    projectId: "iot-smart-dorm-388010",
    storageBucket: "iot-smart-dorm-388010.appspot.com",
    messagingSenderId: "44823889871",
    appId: "1:44823889871:web:08963cdf77e1366c98f4ba",
    measurementId: "G-069ZJW1103"
};
  
export const FIREBASE_APP = initializeApp(firebaseConfig);
initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_AUTH = getAuth();
export const FIREBASE_DB = getFirestore(FIREBASE_APP);