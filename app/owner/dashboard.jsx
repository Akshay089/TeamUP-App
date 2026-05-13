import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { collection, getDocs, query, where } from "firebase/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

function TurfCard({ turf, router, onDelete })  {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: "/owner/turf-details", params: { turfId: turf.id } })}
      className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 mb-4 active:bg-slate-50"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-slate-900 font-bold text-lg">{turf.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text className="text-slate-500 text-sm ml-1">{turf.location}</Text>
          </View>
        </View>
        <View className="bg-teal-50 rounded-xl px-3 py-1">
          <Text className="text-teal-700 font-bold text-sm">₹{turf.price}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <Ionicons name="clock-outline" size={14} color="#94a3b8" />
        <Text className="text-slate-500 text-xs">{turf.openTime} - {turf.closeTime}</Text>
        <Text className="text-slate-300 ml-2">•</Text>
        <Ionicons name="image-outline" size={14} color="#94a3b8" />
        <Text className="text-slate-500 text-xs">{turf.images?.length ?? 0} images</Text>
      </View>

      <View className="flex-row gap-2 mt-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/owner/edit-turf", params: { turfId: turf.id } })}
          className="flex-1 flex-row items-center justify-center bg-slate-100 rounded-2xl py-2"
        >
          <Ionicons name="pencil" size={14} color="#475569" />
          <Text className="text-slate-700 font-semibold ml-1 text-xs">Edit</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity activeOpacity={0.8} className="flex-1 flex-row items-center justify-center bg-red-50 rounded-2xl py-2">
          <Ionicons name="trash" size={14} color="#dc2626" />
          <Text className="text-red-700 font-semibold ml-1 text-xs">Delete</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
  activeOpacity={0.8}
  onPress={() => onDelete(turf.id)}
  className="flex-1 flex-row items-center justify-center bg-red-50 rounded-2xl py-2"
>
  <Ionicons name="trash" size={14} color="#dc2626" />
  <Text className="text-red-700 font-semibold ml-1 text-xs">
    Delete
  </Text>
</TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function OwnerDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const ownerId = user?.uid;

  const loadOwnerTurfs = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const q = query(collection(db, "turfs"), where("ownerId", "==", ownerId));
      const snapshot = await getDocs(q);
      const list = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bTime - aTime;
        });
      setTurfs(list);
    } catch (error) {
      console.error("Error loading owner turfs:", error);
      Alert.alert("Load failed", "Unable to load your turf listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    loadOwnerTurfs();
  }, [loadOwnerTurfs]);

  const handleDeleteTurf = async (turfId) => {
  Alert.alert(
    "Delete Turf",
    "Are you sure you want to delete this turf?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "turfs", turfId));

            setTurfs((prev) => prev.filter((item) => item.id !== turfId));

            Alert.alert("Success", "Turf deleted successfully.");
          } catch (error) {
            console.error("Delete turf error:", error);

            Alert.alert(
              "Delete Failed",
              "Unable to delete turf. Please try again."
            );
          }
        },
      },
    ]
  );
};

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-5 pt-5 pb-4 bg-white border-b border-slate-200">
        <Text className="text-slate-900 text-2xl font-bold">Owner dashboard</Text>
        <Text className="text-slate-500 mt-1">Manage your turf listings and venue details.</Text>
      </View>

      <View className="px-5 mt-4">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/owner/create-turf")}
          className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl px-4 py-4 flex-row items-center justify-between shadow-sm"
        >
          <View className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
            <Text className="text-black text-base font-semibold">Add new turf</Text>
            <Text className="text-black text-sm mt-1">Create your turf listing</Text>
          </View>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-5 mt-6 flex-1">
        <Text className="text-slate-900 font-semibold text-lg mb-3">Your listings ({turfs.length})</Text>
        {loading ? (
          <Text className="text-slate-500">Loading your turfs...</Text>
        ) : turfs.length > 0 ? (
          <FlatList
            data={turfs}
            keyExtractor={(item) => item.id}
            // renderItem={({ item }) => <TurfCard turf={item} router={router} />}
            renderItem={({ item }) => (
  <TurfCard
    turf={item}
    router={router}
    onDelete={handleDeleteTurf}
  />
)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        ) : (
          <View className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
            <View className="items-center">
              <Ionicons name="briefcase-outline" size={48} color="#cbd5e1" />
              <Text className="text-slate-900 font-semibold text-lg mt-4">No turfs yet</Text>
              <Text className="text-slate-500 text-center mt-2">Create your first turf listing and start sharing venue details with players.</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/owner/create-turf")}
                className="mt-6 bg-teal-600 rounded-2xl py-3 px-6 flex-row items-center"
              >
                <Ionicons name="add-circle" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Create first turf</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

