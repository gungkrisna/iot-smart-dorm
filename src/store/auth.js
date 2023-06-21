import { Store, registerInDevtools } from "pullstate";
import { initializeApp, getApps } from "firebase/app"
import { firebaseConfig } from "../../firebase-config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth/react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase-config";
import { doc, getDoc, setDoc, updateDoc, where, getDocs, addDoc, query, onSnapshot, collection, serverTimestamp, orderBy, limit } from "firebase/firestore";


if (!getApps.length) initializeApp(firebaseConfig);

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

    return { user: FIREBASE_AUTH.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appMQTTSetup = async (deviceNameRef, serverRef, portRef, usernameRef, passwordRef) => {
  try {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      return { error: "User not authenticated" };
    }

    const devicesCollectionRef = collection(FIREBASE_DB, "devices");
    const deviceDocRef = doc(devicesCollectionRef, deviceNameRef);

    const deviceDocSnapshot = await getDoc(deviceDocRef);

    if (deviceDocSnapshot.exists()) {
      const deviceData = deviceDocSnapshot.data();
      if (
        deviceData.server === serverRef &&
        deviceData.port === Number(portRef) &&
        deviceData.username === usernameRef &&
        deviceData.password === passwordRef
      ) {
      } else {
        return { error: "Configuration data mismatch" };
      }
    } else {
      await setDoc(deviceDocRef, {
        server: serverRef,
        port: Number(portRef),
        username: usernameRef,
        password: passwordRef
      });
    }

    const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
    await updateDoc(userDocRef, { device: deviceDocRef });

    AuthStore.update((store) => {
      store.user = FIREBASE_AUTH.currentUser;
      store.isLoggedIn = true;
    });

    return { success: true, message: "Configuration updated" };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const retrieveUserDevice = async (user) => {
  try {
    const currentUser = user || FIREBASE_AUTH.currentUser;
    const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    const userData = userSnapshot.data();
    if (!userData.device) {
      return { success: false, error: "User has no device configured" };
    }

    const deviceRef = userData.device;
    const deviceDocSnapshot = await getDoc(deviceRef);

    if (!deviceDocSnapshot.exists()) {
      return { success: false, error: "Device invalid" };
    }

    const deviceData = deviceDocSnapshot.data();
    const deviceName = deviceRef.id; // Get the document name (e.g., 'ROOM_1')
    return { success: true, deviceData, deviceName };
  } catch (error) {
    console.log(error);
    return { error };
  }
};


const getDeviceDocRef = async () => {
  try {
    const currentUser = FIREBASE_AUTH.currentUser;
    const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    const deviceRef = userSnapshot.data().device;
    const deviceName = deviceRef.id;
    const deviceDocRef = doc(FIREBASE_DB, "devices", deviceName);

    return deviceDocRef;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addAutomation = async (props) => {
  try {
    const deviceDocRef = await getDeviceDocRef();

    const automationData = {
      clock: props.clock,
      isRepeat: props.isRepeat,
      days: props.days,
      timezone: props.timezone,
      device: props.device,
      index: props.index,
      path: props.path,
      turnOn: props.turnOn,
      updatedAt: props.updatedAt
    };

    await addDoc(collection(deviceDocRef, "/automation"), automationData);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const retrieveAutomation = async (onUpdate) => {
  try {
    const deviceDocRef = await getDeviceDocRef();
    const automationCollectionRef = collection(deviceDocRef, "/automation");
    let automationQuery = query(automationCollectionRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(automationQuery, (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      onUpdate(documents);
    });

    return () => unsubscribe();
  } catch (error) {
    console.log(error);
  }
};

export const getLedName = async (ledIndex, onUpdate) => {
  try {
    const deviceDocRef = await getDeviceDocRef();
    const ledCollectionRef = collection(deviceDocRef, "led");
    const ledQuery = query(ledCollectionRef, where("index", "==", Number(ledIndex)));

    const unsubscribe = onSnapshot(ledQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const ledName = doc.data().alias;
        console.log
        onUpdate(ledName);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error retrieving LED name:", error);
    onUpdate(null);
    return () => {};
  }
};

export const setLedName = async (ledIndex, newName) => {
  try {
    const deviceDocRef = await getDeviceDocRef();
    const ledCollectionRef = collection(deviceDocRef, "led");
    const ledQuery = query(ledCollectionRef, where("index", "==", Number(ledIndex)));
    const querySnapshot = await getDocs(ledQuery);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const ledDocRef = doc.ref;
      await updateDoc(ledDocRef, { alias: newName });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error setting LED name:", error);
    return false;
  }
};

registerInDevtools({ AuthStore });