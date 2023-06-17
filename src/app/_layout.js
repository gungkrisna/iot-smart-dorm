import { SplashScreen, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthStore, retrieveUserDevice } from "../store/auth";
import { MQTTProvider } from "../context/MQTTContext";

import {
  useFonts,
  EncodeSansSemiCondensed_100Thin,
  EncodeSansSemiCondensed_200ExtraLight,
  EncodeSansSemiCondensed_300Light,
  EncodeSansSemiCondensed_400Regular,
  EncodeSansSemiCondensed_500Medium,
  EncodeSansSemiCondensed_600SemiBold,
  EncodeSansSemiCondensed_700Bold,
  EncodeSansSemiCondensed_800ExtraBold,
  EncodeSansSemiCondensed_900Black,
} from '@expo-google-fonts/encode-sans-semi-condensed';

export const unstable_settings = {
  initialRouteName: 'index'
}

export default function Layout() {
  const { initialized } = AuthStore.useState();
  const [deviceData, setDeviceData] = useState(null);
  const [deviceName, setDeviceName] = useState(null);

  useEffect(() => {
    if (!initialized) return;

    const fetchUserDevice = async () => {
      const { deviceData, deviceName, error } = await retrieveUserDevice();

      if (error) {
        console.log("Error retrieving user device:", error);
      } else {
        setDeviceData(deviceData);
        setDeviceName(deviceName);
      }
    };

    fetchUserDevice();
  }, [initialized]);

  const [fontsLoaded] = useFonts({
    EncodeSansSemiCondensed_700Bold,
    EncodeSansSemiCondensed_400Regular,
    EncodeSansSemiCondensed_300Light,
    EncodeSansSemiCondensed_100Thin,
  });

  return (
    <>
      {fontsLoaded && deviceData && deviceName ? (
        <MQTTProvider
          rootPath={deviceName}
          userName={deviceData.username}
          password={deviceData.password}
          server={deviceData.server}
          port={deviceData.port}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </MQTTProvider>
      ) : (
        <SplashScreen />
      )}
    </>
  )
}