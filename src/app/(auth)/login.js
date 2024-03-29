import { Text, View, TextInput, StyleSheet, Alert } from "react-native";
import { AuthStore, appSignIn, retrieveUserDevice } from "../../store/auth";
import { useRouter } from "expo-router";
import { useRef } from "react";

export default function LogIn() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            passwordRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <Text
        onPress={async () => {
          const resp = await appSignIn(emailRef.current, passwordRef.current);
          if (resp?.user) {
            const { success } = await retrieveUserDevice(resp?.user)
            if(success) {
              AuthStore.update((store) => {
                store.user = resp?.user;
                store.isLoggedIn = true;
              });
              router.replace("/(tabs)/home");
            } else {
              router.replace("/mqtt-setup");
            }
          } else {
            console.log(resp.error)
            Alert.alert("Login Error", resp.error?.message)
          }
        }}
      >
        Login
      </Text>
      <Text
        onPress={() => {
          router.push("/create-account");
        }}
      >
        Create Account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: "#455fff",
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#455fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
});