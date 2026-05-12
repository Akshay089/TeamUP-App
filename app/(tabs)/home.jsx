import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import NearbyTurfs from "../../components/NearbyTurfs";
import Logo from "../../assets/images/logo.jpg";
import { db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

export default function Home() {
  const router = useRouter();
  const [turfs, setTurfs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const userName = user?.fullName?.split(" ")[0] || (isGuest ? "Guest" : "Player");

  const loadTurfs = useCallback(async () => {
    try {
      const res = await getDocs(query(collection(db, "turfs")));
      const list = [];
      res.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
      setTurfs(list);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    }
  }, []);

  useEffect(() => {
    loadTurfs();
  }, [loadTurfs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTurfs();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/turf/${item.name}`)}
      className="mx-4 mb-5 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm shadow-slate-200/90"
    >
      <Image
        resizeMode="cover"
        source={{
          uri: item.image || "https://via.placeholder.com/800x480.png?text=Turf",
        }}
        className="w-full h-52"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-start gap-3">
          <Text className="text-slate-900 text-xl font-bold flex-shrink">{item.name}</Text>
          <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full">
            <Text className="text-amber-900 font-semibold">{item.rating ?? "—"}</Text>
            <MaterialIcons name="star" size={18} color="#f59e0b" style={{ marginLeft: 4 }} />
          </View>
        </View>
        <View className="flex-row items-center mt-2">
          <Ionicons name="location-outline" size={18} color="#64748b" />
          <Text className="text-slate-500 ml-1 flex-1" numberOfLines={2}>
            {item.location}
          </Text>
        </View>
        <Text className="text-teal-600 text-xl font-bold mt-3">{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <LinearGradient
        colors={["#0f766e", "#0d9488"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center px-4 py-4 rounded-b-3xl"
      >
        <Image source={Logo} className="h-12 w-12 rounded-2xl border border-white/30" />
        <View className="ml-3 flex-1">
          <Text className="text-teal-100 text-sm font-medium">Welcome back</Text>
          <Text className="text-white text-xl font-bold">{userName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          hitSlop={12}
          className="w-11 h-11 rounded-2xl bg-white/15 items-center justify-center border border-white/20"
        >
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mt-5 px-4 flex-row flex-wrap gap-2">
          <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <Text className="text-slate-400 text-xs font-semibold uppercase">Quick tip</Text>
            <Text className="text-slate-900 font-bold mt-1 leading-5">
              Pick a slot before peak hours fill up.
            </Text>
          </View>
          <View className="flex-1 min-w-[45%] bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <Text className="text-teal-800 text-xs font-semibold uppercase">Discover</Text>
            <TouchableOpacity onPress={() => router.push("/discover")} className="mt-2 flex-row items-center">
              <Text className="text-teal-900 font-bold flex-1">Browse directory</Text>
              <Ionicons name="arrow-forward" size={18} color="#0f766e" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 px-4 flex-row items-center justify-between">
          <Text className="text-slate-900 font-bold text-lg">Nearby on map</Text>
          <View className="flex-row items-center bg-white px-3 py-1 rounded-full border border-slate-100">
            <Ionicons name="navigate-outline" size={14} color="#0d9488" />
            <Text className="text-slate-600 text-xs font-semibold ml-1">Live</Text>
          </View>
        </View>

        <View className="h-[260px] mx-4 mt-3 rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm">
          <NearbyTurfs />
        </View>

        <Text className="text-slate-900 font-bold text-lg px-4 mt-8 mb-2">All venues</Text>

        {turfs.length > 0 ? (
          <FlatList
            data={turfs}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled
          />
        ) : (
          <View className="py-16 items-center px-8">
            <Text className="text-slate-500 text-center">
              No turfs yet — add documents to the{" "}
              <Text className="font-semibold text-slate-700">turfs</Text> collection in Firebase.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
