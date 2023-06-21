import { SplashScreen, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthStore, retrieveUserDevice } from "../store/auth";
import { MQTTProvider } from "../context/MQTTContext";

export const unstable_settings = {
  initialRouteName: 'index'
}

export default function Layout() {
  const { initialized, isLoggedIn, isDeviceSet } = AuthStore.useState();
  const [deviceData, setDeviceData] = useState(null);
  const [deviceName, setDeviceName] = useState(null);

  useEffect(() => {
    if (!initialized) return;

    const fetchUserDevice = async () => {
      const { deviceData, deviceName, error } = await retrieveUserDevice();

      if (error) {
        AuthStore.update((store) => {
          store.isLoggedIn = false;
        });
    
        console.log("Error retrieving user device:", error);
      } else {
        setDeviceData(deviceData);
        setDeviceName(deviceName);
      }
    };

    if (isLoggedIn) fetchUserDevice();
  }, [initialized, isLoggedIn]);


  return (
    <>
      { deviceData && deviceName ? (
        <MQTTProvider
          rootPath={deviceName}
          userName={deviceData.username}
          password={deviceData.password}
          server={deviceData.server}
          port={deviceData.port}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </MQTTProvider>
      ) : isLoggedIn ? (
        <SplashScreen />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </>
  )
}