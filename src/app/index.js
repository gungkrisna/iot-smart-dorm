import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { AuthStore } from "../store/firebase";
import React, { useEffect } from "react";
import { Text, View } from "react-native";


const Index = () => {

  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn } = AuthStore.useState();


  useEffect(() => {
    if (!navigationState?.key || !initialized) return;
    //retrieveUserDevice();

    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything
      //  segment is not anything in the auth group.
      !isLoggedIn &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace("/login");
    } else if (isLoggedIn) {
      // go to tabs root.
      router.replace("/(tabs)/home");
    }
  }, [segments, navigationState?.key, initialized]);


  return (
      <View>{!navigationState?.key ? <Text>Loading...</Text> : <></>}</View>
  );
};
export default Index;