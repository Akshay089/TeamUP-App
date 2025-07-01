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
    try{
        await signOut(auth);
        await AsyncStorage.removeItem("userEmail");
        setUserEmail(null);
        Alert.alert("You have been logged out successfully.");
        router.push("/(auth)/signin");
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };


  const handleSignup = async () => {
    router.push("/(auth)/signup");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-black text-xl font-bold">Welcome to your profile!</Text>
      {
          userEmail?(
          <>
          <Text className="text-black text-lg mb-6">{userEmail}</Text>
          <TouchableOpacity onPress={handleLogout} className="p-2 my-2 bg-white rounded-lg border-white">
              <Text className="text-xl font-semibold text-center text-green-600">
                  Logout
              </Text>
          </TouchableOpacity>
           </>
          ):(
            <>
          <TouchableOpacity onPress={handleSignup} className="p-2 my-2 bg-white rounded-lg border-white">
              <Text className="text-xl font-semibold text-center text-green-600">
                  Sign up
              </Text>
          </TouchableOpacity>
          </>)}
    </View>
  );
}
//<> and </> are used to wrap multiple elements without adding extra nodes to the DOM...such as <View> or <Text>.
//This is called a Fragment — specifically, the short syntax for <React.Fragment></React.Fragment>.
//When you need to return multiple JSX elements without adding extra nesting or layout.