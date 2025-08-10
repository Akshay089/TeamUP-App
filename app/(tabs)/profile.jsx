import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebaseConfig";

export default function Profile() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };
    fetchUserEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userEmail");
      setUserEmail(null);
      Alert.alert("You have been logged out successfully.");
      router.push("/(auth)/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignup = () => {
    router.push("/(auth)/signup");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View className="w-full bg-[#f0fdf4] rounded-xl p-6 items-center shadow-md">
        <Ionicons name="person-circle-outline" size={80} color="#239B2D" />
        <Text className="text-2xl font-bold text-black mt-4">Welcome to your profile!</Text>
        {
          userEmail ? (
            <>
              <Text className="text-base text-gray-700 mt-2 mb-6">{userEmail}</Text>
              <TouchableOpacity onPress={handleLogout} className="bg-green-600 px-6 py-2 rounded-full">
                <Text className="text-white font-semibold text-base">Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={handleSignup} className="bg-green-600 px-6 py-2 rounded-full mt-6">
              <Text className="text-white font-semibold text-base">Sign Up</Text>
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
}
