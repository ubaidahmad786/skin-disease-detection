import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import Home from "../screens/Home";
import Services from "../screens/Services";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#00E5FF", // Cyan background
          borderTopWidth: 0, // removed border
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#1E293B",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/static/home.png")}
              style={{ height: 24, width: 24 }}
              tintColor={color}
            />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/static/history.png")}
              style={{ height: 24, width: 24 }}
              tintColor={color}
            />
          ),
        }}
        name="History"
        component={Services}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/static/profile.png")}
              style={{ height: 24, width: 24 }}
              tintColor={color}
            />
          ),
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}
