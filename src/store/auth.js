import { Store, registerInDevtools } from "pullstate";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth/react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase-config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
});

const unsub = onAuthStateChanged(FIREBASE_AUTH, (user) => {
  console.log("onAuthStateChange", user);
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });
});

export const appSignIn = async (email, password) => {
  try {
    const resp = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const user = resp.user;

    AuthStore.update((store) => {
      store.user = user;
      store.isLoggedIn = true;
    });

    return { user };
  } catch (error) {
    console.log("Error signing in:", error);
    return { error };
  }
};


export const appSignOut = async () => {
  try {
    await signOut(FIREBASE_AUTH);
    AuthStore.update((store) => {
      store.user = null;
      store.isLoggedIn = false;
    });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

export const appSignUp = async (email, password, firstName, lastName) => {
  try {
    const resp = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const currentUser = resp.user;

    await updateProfile(resp.user, {
      displayName: firstName + " " + lastName,
    });

    const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
    await setDoc(userDocRef, {
      email: currentUser.email,
      firstName: firstName,
      lastName: lastName,
      createdAt: serverTimestamp(),
    });

    AuthStore.update((store) => {
      store.user = FIREBASE_AUTH.currentUser;
      store.isLoggedIn = true;
    });

    return { user: FIREBASE_AUTH.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const retrieveUserDevice = async () => {
  try {
    const currentUser = FIREBASE_AUTH.currentUser;
    const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    const deviceRef = userSnapshot.data().device;
    const deviceDocSnapshot = await getDoc(deviceRef);
    const deviceData = deviceDocSnapshot.data();

    const deviceName = deviceRef.id; // Get the document name (e.g., 'ROOM_1')
    return { deviceData, deviceName };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

registerInDevtools({ AuthStore });