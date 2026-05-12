import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function Discover() {
  const router = useRouter();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const res = await getDocs(query(collection(db, "turfs")));
      const list = [];
      res.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
      setTurfs(list);
    } catch (e) {
      console.error("Discover fetch:", e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return turfs;
    return turfs.filter((t) => {
      const hay = `${t.name ?? ""} ${t.location ?? ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [turfs, q]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0d9488" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <LinearGradient
        colors={["#0f766e", "#0d9488", "#14b8a6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 pb-8 pt-2 rounded-b-[28px]"
      >
        <Text className="text-white text-2xl font-bold tracking-tight">
          Discover turfs
        </Text>
        <Text className="text-teal-100 mt-1 text-base">
          Search by name or area — book in a few taps
        </Text>
        <View className="mt-5 flex-row items-center bg-white/95 rounded-2xl px-4 py-3 shadow-sm">
          <Ionicons name="search" size={22} color="#64748b" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900 py-0"
            placeholder="Try North turf, cricket, 5-a-side…"
            placeholderTextColor="#94a3b8"
            value={q}
            onChangeText={setQ}
          />
          {q.length > 0 && (
            <TouchableOpacity onPress={() => setQ("")} hitSlop={12}>
              <Ionicons name="close-circle" size={22} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 112 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor="#0d9488"
          />
        }
        ListEmptyComponent={
          <View className="py-16 px-6 items-center">
            <Ionicons name="map-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-600 text-center mt-4 font-semibold text-lg">
              No venues match your search
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Clear the search or pull to refresh the directory.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/turf/${item.name}`)}
            className="bg-white rounded-3xl mb-4 overflow-hidden border border-slate-100 shadow-sm shadow-slate-200/80"
          >
            <Image
              source={{
                uri: item.image || "https://via.placeholder.com/600x360.png?text=Turf",
              }}
              className="w-full h-44"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-start gap-3">
                <Text className="text-slate-900 font-bold text-lg flex-shrink">{item.name}</Text>
                <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full">
                  <MaterialIcons name="star" size={16} color="#f59e0b" />
                  <Text className="text-amber-800 font-semibold ml-1">{item.rating ?? "—"}</Text>
                </View>
              </View>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text className="text-slate-500 ml-1 flex-1" numberOfLines={2}>
                  {item.location}
                </Text>
              </View>
              <Text className="text-teal-600 font-bold text-lg mt-3">{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
