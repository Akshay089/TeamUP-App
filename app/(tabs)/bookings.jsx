import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";

export default function Bookings() {
  const router=useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    const email = await AsyncStorage.getItem("userEmail");
    setUserEmail(email);
    if (!email) {
      setBookings([]);
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, "bookings"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#239B2D" />
      </View>
    );
  }

  if (!userEmail) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-black text-center m-4">Please sign in to view your bookings.</Text>
        <TouchableOpacity onPress={()=>router.push("/signin")} className="p-2 my-2 bg-white rounded-lg border-white">
            <Text className="text-xl font-semibold text-center text-green-600">
                Sign In
            </Text>
        </TouchableOpacity>
      </View>
      
    );
  }

  if (bookings.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl text-[#239B2D] text-center m-4">No bookings found.</Text>
      </View>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={bookings}
        onRefresh={fetchBookings}
        refreshing={loading}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="bg-[#f0fdf4] rounded-xl p-4 mb-4 shadow-md">
            <Text className="text-2xl font-bold text-[#239B2D] mb-2">{item.turf || item.name}</Text>
            <Text className="text-base text-[#222] mb-1">Date: {item.date ? new Date(item.date).toLocaleString() : "-"}</Text>
            <Text className="text-base text-[#222] mb-1">Slot: {item.slot}</Text>
            <Text className="text-base text-[#222] mb-1">Hours: {item.selectedNumber} hrs</Text>
            <Text className="text-base text-[#222] mb-1">Location: {item.location}</Text>
            <Text className="text-base text-[#222] mb-1">Price: {item.price}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}