import { Stack, useRouter } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { SafeAreaView, FlatList, ActivityIndicator, StyleSheet, View, RefreshControl, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SectionHeader } from "../../../components/SectionHeader";
import { Entypo } from "@expo/vector-icons"
import ListItem from "../../../components/ListItem";
import { MQTTContext } from "../../../context/MQTTContext";
import { retrieveAutomation, getLedName } from "../../../store/auth";
import SafeViewAndroid from "../../../components/AndroidSafeArea";
import FormatTime from "../../../utils/FormatTime";
import WeekdaysArrayToString from "../../../utils/WeekdaysArrayToString";
import useAutomationData from "../../../hooks/useAutomationData";
import ToggleSwitch from "toggle-switch-react-native"

const Tab2Index = () => {
  const router = useRouter();
  const { isLoading, rootPath } = useContext(MQTTContext);
  const { isFetching, automationDocuments, onUpdateAutomationDocuments } = useAutomationData();
  const [refreshing, setRefreshing] = useState(false);
  const [ledName, setLedName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getLedName(0, (name) => {
        setLedName(name);
      });
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await retrieveAutomation(onUpdateAutomationDocuments);
    } catch (error) {
      console.log('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ ...SafeViewAndroid.AndroidSafeArea, ...styles.container, ...styles.container }}>
      <StatusBar style='dark' />
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Automation"
        }}
      />

      <View style={styles.containerBody}>
        <SectionHeader style={{ paddingVertical: 8, paddingHorizontal: 20 }} title="Automation" />

        {automationDocuments.length > 0 ? (
          <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 8, paddingHorizontal: 20, }}
            data={automationDocuments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {


              return (
                <ListItem
                  text={`${item.turnOn ? "Nyalakan" : "Matikan"} LED ${ledName}`}
                  subtitle={`${WeekdaysArrayToString(item.days, true)} • ${FormatTime(item.clock)}`}
                />
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />) : (
            <Text style={{paddingVertical: 8, paddingHorizontal: 20, }}>No data</Text>
          )}

      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBody: {
    flex: 1,
    flexDirection: 'column'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Tab2Index;