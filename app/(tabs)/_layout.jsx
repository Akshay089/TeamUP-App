import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BlurView } from "expo-blur";
import { withLayoutContext } from "expo-router";
import { Platform, StyleSheet } from "react-native";

const { Navigator } = createMaterialTopTabNavigator();

const inactive = "#94a3b8";
const active = "#0d9488";

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabRoot() {
  return (
    <MaterialTopTabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0, // Position at bottom
          left: 0,
          right: 0,
          backgroundColor: Platform.OS === "ios" ? "transparent" : "#ffffff",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#e2e8f0",
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          height: Platform.OS === "ios" ? 88 : 78,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          marginHorizontal: 12,
          marginBottom: Platform.OS === "ios" ? 20 : 12,
          borderRadius: 24,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={72}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        swipeEnabled: true, // Enable swipe gestures between screens
        animationEnabled: true, // Smooth animations
        tabBarPosition: 'bottom', // Position tabs at bottom
      }}
    >
      <MaterialTopTabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </MaterialTopTabs>
  );
}
