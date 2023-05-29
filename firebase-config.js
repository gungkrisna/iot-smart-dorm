import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app'
import { getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  
let app;
let auth;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Export the app and auth variables
export { app, auth };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase