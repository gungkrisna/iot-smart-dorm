import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Alert, Pressable } from "react-native";
import { AuthStore, appMQTTSetup } from "../../store/auth";
import { useRouter } from "expo-router";

export default function MQTTSetup() {
  const router = useRouter();
  const [deviceName, setDeviceName] = useState("");
  const [server, setServer] = useState("");
  const [port, setPort] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const useDemoMQTTCredential = () => {
    setDeviceName(() => "ROOM_1");
    setServer(() => "6f4d1220c6cb4852ab4266f96abc384e.s2.eu.hivemq.cloud");
    setPort(() => "8884");
    setUsername(() => "hivemq.webclient.1685212985222");
    setPassword(() => "2X!M8.43LxhJ>AR;navy");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Text style={styles.label}>Device Name</Text>
        <TextInput
          value={deviceName}
          placeholder="DEVICE_1"
          autoCapitalize="none"
          nativeID="device"
          onChangeText={(text) => {
            setDeviceName(text);
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Server</Text>
        <TextInput
          value={server}
          placeholder="s2.eu.hivemq.cloud"
          autoCapitalize="none"
          nativeID="server"
          onChangeText={(text) => {
            setServer(text);
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Port</Text>
        <TextInput
          value={port}
          placeholder="8884"
          autoCapitalize="none"
          nativeID="port"
          keyboardType="numeric"
          maxLength={4}
          onChangeText={(text) => {
            const sanitizedText = text.replace(/[^0-9]/g, '');
            setPort(sanitizedText);
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          placeholder="username"
          autoCapitalize="none"
          nativeID="username"
          onChangeText={(text) => {
            setUsername(text);
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          placeholder="password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            setPassword(text);
          }}
          style={styles.textInput}
        />
      </View>
      <Text
        onPress={async () => {
          const resp = await appMQTTSetup(deviceName, server, port, username, password);
          if (resp.success) {
            router.replace("/(tabs)/home");
          } else {
            Alert.alert("Setup Failed", resp.error);
          }
        }}
      >
        Add MQTT Credential
      </Text>
      <Pressable onPress={useDemoMQTTCredential}><Text>Use Demo MQTT Credential</Text></Pressable>
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
