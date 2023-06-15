import { Tabs } from "expo-router";
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <Feather name="home" color={focused ? 'rgb(1, 31, 75)' : '#b0b3b8'} size={24}/>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesome5 name="user-circle" color={focused ? 'rgb(1, 31, 75)' : '#b0b3b8'} size={24}/>,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;