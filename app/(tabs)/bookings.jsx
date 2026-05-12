import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { db } from "../../config/firebaseConfig";

export default function Bookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  const fetchBookings = useCallback(async ({ silent } = {}) => {
    if (!silent) setLoading(true);
    const email = await AsyncStorage.getItem("userEmail");
    setUserEmail(email);
    if (!email) {
      setBookings([]);
      if (!silent) setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const q = query(collection(db, "bookings"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      const now = new Date();
      const data = querySnapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((item) => {
          if (!item.date) return false;
          return new Date(item.date) > now;
        });
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
    if (!silent) setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0d9488" />
      </SafeAreaView>
    );
  }

  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <LinearGradient
          colors={["#0f766e", "#0d9488"]}
          className="px-5 pb-10 pt-4 rounded-b-[28px]"
        >
          <Text className="text-white text-2xl font-bold">Your bookings</Text>
          <Text className="text-teal-100 mt-1">
            Sign in to see upcoming sessions and receipts in one place.
          </Text>
        </LinearGradient>
        <View className="flex-1 px-6 justify-center items-center -mt-8">
          <View className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm w-full max-w-sm items-center">
            <View className="w-16 h-16 rounded-full bg-teal-50 items-center justify-center mb-4">
              <Ionicons name="calendar-outline" size={32} color="#0d9488" />
            </View>
            <Text className="text-slate-900 font-bold text-lg text-center">
              Sign in to view bookings
            </Text>
            <Text className="text-slate-500 text-center mt-2 mb-6 leading-6">
              We match reservations using your account email from Firebase Auth.
            </Text>
            <PrimaryButton label="Sign in" onPress={() => router.push("/(auth)/signin")} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (bookings.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <LinearGradient
          colors={["#0f766e", "#0d9488"]}
          className="px-5 pb-10 pt-4 rounded-b-[28px]"
        >
          <Text className="text-white text-2xl font-bold">Your bookings</Text>
          <Text className="text-teal-100 mt-1">Nothing upcoming — time to book a pitch.</Text>
        </LinearGradient>
        <View className="flex-1 px-6 justify-center items-center -mt-8">
          <View className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm w-full max-w-sm items-center">
            <Ionicons name="football-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-900 font-bold text-lg text-center mt-4">
              No upcoming bookings
            </Text>
            <Text className="text-slate-500 text-center mt-2 mb-6">
              Explore venues from Home or Discover and lock your next slot.
            </Text>
            <PrimaryButton label="Browse turfs" onPress={() => router.push("/discover")} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <LinearGradient colors={["#0f766e", "#0d9488"]} className="px-5 pb-8 pt-4 rounded-b-[28px]">
        <Text className="text-white text-2xl font-bold">Your bookings</Text>
        <Text className="text-teal-100 mt-1">{bookings.length} upcoming session(s)</Text>
      </LinearGradient>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 112 }}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchBookings({ silent: true });
        }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100 shadow-sm">
            <Text className="text-teal-700 font-bold text-lg">
              {item.turf || item.turfTitle || item.name}
            </Text>
            <View className="flex-row items-center mt-3">
              <Ionicons name="time-outline" size={18} color="#64748b" />
              <Text className="text-slate-600 ml-2 flex-1">
                {item.date ? new Date(item.date).toLocaleString() : "—"}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-x-4 gap-y-2 mt-3">
              <Text className="text-slate-700">
                <Text className="font-semibold text-slate-900">Slot </Text>
                {item.slot ?? "—"}
              </Text>
              <Text className="text-slate-700">
                <Text className="font-semibold text-slate-900">Hours </Text>
                {item.selectedNumber ?? "—"}
              </Text>
            </View>
            <View className="flex-row items-start mt-3">
              <Ionicons name="location-outline" size={18} color="#64748b" style={{ marginTop: 2 }} />
              <Text className="text-slate-600 ml-2 flex-1">{item.location ?? "—"}</Text>
            </View>
            <Text className="text-teal-600 font-bold mt-4">{item.price ?? ""}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
