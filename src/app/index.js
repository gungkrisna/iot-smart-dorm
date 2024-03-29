import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { AuthStore } from "../store/auth";
import React, { useEffect } from "react";
import { Text, View } from "react-native";


const Index = () => {

  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn } = AuthStore.useState();


  useEffect(() => {
    if (!navigationState?.key || !initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything
      //  segment is not anything in the auth group.
      !isLoggedIn &&
      !inAuthGroup
    ) {
      router.replace("/login");
    } else if (isLoggedIn) {
      router.replace("/(tabs)/home");
    }
  }, [segments, navigationState?.key, initialized]);


  return (
      <View>{!navigationState?.key ? <Text>Loading...</Text> : <></>}</View>
  );
};
export default Index;