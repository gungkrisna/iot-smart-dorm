import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { AuthStore, appSignOut } from "../../../store/auth";

const Tab3Index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <Text>
        {AuthStore.getRawState().user?.email}
      </Text>
      <Text>
        {AuthStore.getRawState().user?.displayName}
      </Text>
      <Button
        onPress={async () => {
          const resp = await appSignOut();
          if (!resp?.error) {
            router.replace("/(auth)/login");
          } else {
            console.log(resp.error);
            alert("Logout Error", resp.error?.message);
          }
        }}
        title="LOGOUT"
      />
    </View>
  );
};
export default Tab3Index;