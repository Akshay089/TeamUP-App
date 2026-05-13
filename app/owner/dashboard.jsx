// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// // import { collection, getDocs, query, where } from "firebase/firestore";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { useCallback, useEffect, useState } from "react";
// import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { db } from "../../config/firebaseConfig";
// import { useAuthStore } from "../../store/authStore";

// function TurfCard({ turf, router, onDelete })  {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={() => router.push({ pathname: "/owner/turf-details", params: { turfId: turf.id } })}
//       className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 mb-4 active:bg-slate-50"
//     >
//       <View className="flex-row justify-between items-start mb-3">
//         <View className="flex-1">
//           <Text className="text-slate-900 font-bold text-lg">{turf.name}</Text>
//           <View className="flex-row items-center mt-1">
//             <Ionicons name="location-outline" size={14} color="#64748b" />
//             <Text className="text-slate-500 text-sm ml-1">{turf.location}</Text>
//           </View>
//         </View>
//         <View className="bg-teal-50 rounded-xl px-3 py-1">
//           <Text className="text-teal-700 font-bold text-sm">₹{turf.price}</Text>
//         </View>
//       </View>

//       <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-slate-100">
//         <Ionicons name="clock-outline" size={14} color="#94a3b8" />
//         <Text className="text-slate-500 text-xs">{turf.openTime} - {turf.closeTime}</Text>
//         <Text className="text-slate-300 ml-2">•</Text>
//         <Ionicons name="image-outline" size={14} color="#94a3b8" />
//         <Text className="text-slate-500 text-xs">{turf.images?.length ?? 0} images</Text>
//       </View>

//       <View className="flex-row gap-2 mt-4">
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => router.push({ pathname: "/owner/edit-turf", params: { turfId: turf.id } })}
//           className="flex-1 flex-row items-center justify-center bg-slate-100 rounded-2xl py-2"
//         >
//           <Ionicons name="pencil" size={14} color="#475569" />
//           <Text className="text-slate-700 font-semibold ml-1 text-xs">Edit</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity activeOpacity={0.8} className="flex-1 flex-row items-center justify-center bg-red-50 rounded-2xl py-2">
//           <Ionicons name="trash" size={14} color="#dc2626" />
//           <Text className="text-red-700 font-semibold ml-1 text-xs">Delete</Text>
//         </TouchableOpacity> */}
//         <TouchableOpacity
//   activeOpacity={0.8}
//   onPress={() => onDelete(turf.id)}
//   className="flex-1 flex-row items-center justify-center bg-red-50 rounded-2xl py-2"
// >
//   <Ionicons name="trash" size={14} color="#dc2626" />
//   <Text className="text-red-700 font-semibold ml-1 text-xs">
//     Delete
//   </Text>
// </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// }

// export default function OwnerDashboard() {
//   const router = useRouter();
//   const user = useAuthStore((state) => state.user);
//   const [turfs, setTurfs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const ownerId = user?.uid;

//   const loadOwnerTurfs = useCallback(async () => {
//     if (!ownerId) return;
//     setLoading(true);
//     try {
//       const q = query(collection(db, "turfs"), where("ownerId", "==", ownerId));
//       const snapshot = await getDocs(q);
//       const list = snapshot.docs
//         .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
//         .sort((a, b) => {
//           const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
//           const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
//           return bTime - aTime;
//         });
//       setTurfs(list);
//     } catch (error) {
//       console.error("Error loading owner turfs:", error);
//       Alert.alert("Load failed", "Unable to load your turf listings. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [ownerId]);

//   useEffect(() => {
//     loadOwnerTurfs();
//   }, [loadOwnerTurfs]);

//   const handleDeleteTurf = async (turfId) => {
//   Alert.alert(
//     "Delete Turf",
//     "Are you sure you want to delete this turf?",
//     [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await deleteDoc(doc(db, "turfs", turfId));

//             setTurfs((prev) => prev.filter((item) => item.id !== turfId));

//             Alert.alert("Success", "Turf deleted successfully.");
//           } catch (error) {
//             console.error("Delete turf error:", error);

//             Alert.alert(
//               "Delete Failed",
//               "Unable to delete turf. Please try again."
//             );
//           }
//         },
//       },
//     ]
//   );
// };

//   return (
//     <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
//       <View className="px-5 pt-5 pb-4 bg-white border-b border-slate-200">
//         <Text className="text-slate-900 text-2xl font-bold">Owner dashboard</Text>
//         <Text className="text-slate-500 mt-1">Manage your turf listings and venue details.</Text>
//       </View>

//       <View className="px-5 mt-4">
//         <TouchableOpacity
//           activeOpacity={0.85}
//           onPress={() => router.push("/owner/create-turf")}
//           className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl px-4 py-4 flex-row items-center justify-between shadow-sm"
//         >
//           <View className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
//             <Text className="text-black text-base font-semibold">Add new turf</Text>
//             <Text className="text-black text-sm mt-1">Create your turf listing</Text>
//           </View>
//           <Ionicons name="add-circle-outline" size={28} color="white" />
//         </TouchableOpacity>
//       </View>

//       <View className="px-5 mt-6 flex-1">
//         <Text className="text-slate-900 font-semibold text-lg mb-3">Your listings ({turfs.length})</Text>
//         {loading ? (
//           <Text className="text-slate-500">Loading your turfs...</Text>
//         ) : turfs.length > 0 ? (
//           <FlatList
//             data={turfs}
//             keyExtractor={(item) => item.id}
//             // renderItem={({ item }) => <TurfCard turf={item} router={router} />}
//             renderItem={({ item }) => (
//   <TurfCard
//     turf={item}
//     router={router}
//     onDelete={handleDeleteTurf}
//   />
// )}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 120 }}
//           />
//         ) : (
//           <View className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
//             <View className="items-center">
//               <Ionicons name="briefcase-outline" size={48} color="#cbd5e1" />
//               <Text className="text-slate-900 font-semibold text-lg mt-4">No turfs yet</Text>
//               <Text className="text-slate-500 text-center mt-2">Create your first turf listing and start sharing venue details with players.</Text>
//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 onPress={() => router.push("/owner/create-turf")}
//                 className="mt-6 bg-teal-600 rounded-2xl py-3 px-6 flex-row items-center"
//               >
//                 <Ionicons name="add-circle" size={18} color="white" />
//                 <Text className="text-white font-semibold ml-2">Create first turf</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

//Following code just enhance the UI(Use Chatgpt to enhance the UI) and add delete functionality to the turf card in owner dashboard. Please do not remove any code.

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

function TurfCard({ turf, router, onDelete }) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() =>
        router.push({
          pathname: "/owner/turf-details",
          params: { turfId: turf.id },
        })
      }
      className="mb-5"
    >
      <View
        className="bg-white rounded-[30px] overflow-hidden border border-slate-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 5,
        }}
      >
        {/* IMAGE */}
        <View className="relative">
          <Image
            source={{
              uri:
                turf.images?.[0] ||
                "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop",
            }}
            className="w-full h-52"
            resizeMode="cover"
          />

          {/* OVERLAY */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            className="absolute bottom-0 left-0 right-0 h-28"
          />

          {/* PRICE */}
          <View className="absolute top-4 right-4 bg-white/95 px-4 py-2 rounded-2xl">
            <Text className="text-teal-700 font-extrabold text-base">
              ₹{turf.price}
            </Text>
          </View>

          {/* STATUS */}
          <View className="absolute top-4 left-4 bg-emerald-500 px-3 py-1 rounded-full flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-white mr-2" />
            <Text className="text-white text-xs font-bold">ACTIVE</Text>
          </View>

          {/* BOTTOM INFO */}
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-white text-2xl font-bold">
              {turf.name}
            </Text>

            <View className="flex-row items-center mt-1">
              <Ionicons
                name="location-outline"
                size={14}
                color="white"
              />
              <Text className="text-white/90 ml-1 text-sm">
                {turf.location}
              </Text>
            </View>
          </View>
        </View>

        {/* BODY */}
        <View className="p-5">
          {/* INFO CHIPS */}
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-slate-100 rounded-2xl px-4 py-3 flex-row items-center">
              <Ionicons
                name="time-outline"
                size={16}
                color="#475569"
              />
              <Text className="text-slate-700 ml-2 text-xs font-medium">
                {turf.openTime} - {turf.closeTime}
              </Text>
            </View>

            <View className="bg-teal-50 rounded-2xl px-4 py-3 flex-row items-center">
              <Ionicons
                name="images-outline"
                size={16}
                color="#0f766e"
              />
              <Text className="text-teal-700 ml-2 text-xs font-semibold">
                {turf.images?.length ?? 0} Images
              </Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View className="flex-row mt-5 gap-3">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/owner/edit-turf",
                  params: { turfId: turf.id },
                })
              }
              className="flex-1"
            >
              <LinearGradient
                colors={["#0f172a", "#1e293b"]}
                className="rounded-2xl py-4 flex-row items-center justify-center"
              >
                <Ionicons name="pencil" size={16} color="white" />
                <Text className="text-white font-bold ml-2">
                  Edit Turf
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onDelete(turf.id)}
              className="flex-1 bg-red-50 rounded-2xl py-4 flex-row items-center justify-center border border-red-100"
            >
              <Ionicons name="trash-outline" size={16} color="#dc2626" />
              <Text className="text-red-600 font-bold ml-2">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OwnerDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const ownerId = user?.uid;

  const loadOwnerTurfs = useCallback(async () => {
    if (!ownerId) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "turfs"),
        where("ownerId", "==", ownerId)
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : 0;

          const bTime = b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : 0;

          return bTime - aTime;
        });

      setTurfs(list);
    } catch (error) {
      console.error("Error loading owner turfs:", error);

      Alert.alert(
        "Load Failed",
        "Unable to load your turf listings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ownerId]);

  useEffect(() => {
    loadOwnerTurfs();
  }, [loadOwnerTurfs]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOwnerTurfs();
  };

  const handleDeleteTurf = async (turfId) => {
    Alert.alert(
      "Delete Turf",
      "Are you sure you want to permanently delete this turf?",
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

              setTurfs((prev) =>
                prev.filter((item) => item.id !== turfId)
              );

              Alert.alert(
                "Success",
                "Turf deleted successfully."
              );
            } catch (error) {
              console.error("Delete turf error:", error);

              Alert.alert(
                "Delete Failed",
                "Unable to delete turf."
              );
            }
          },
        },
      ]
    );
  };

  const totalImages = turfs.reduce(
    (acc, turf) => acc + (turf.images?.length || 0),
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={["#0f766e", "#14b8a6"]}
        className="px-6 pt-5 pb-10 rounded-b-[40px]"
      >
        {/* TOP */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/80 text-sm">
              Welcome back 👋
            </Text>

            <Text className="text-white text-3xl font-extrabold mt-1">
              Owner Dashboard
            </Text>
          </View>

        <TouchableOpacity
  activeOpacity={0.85}
  onPress={() => router.push("/owner/owner-profile")}
  className="w-14 h-14 rounded-full bg-white/20 items-center justify-center"
>
  <Ionicons
    name="person-outline"
    size={28}
    color="white"
  />
</TouchableOpacity>
        </View>

        {/* SUBTEXT */}
        <Text className="text-white/80 mt-3 leading-6">
          Manage your turfs, listings, bookings and venue
          experience professionally.
        </Text>

        {/* STATS */}
        <View className="flex-row mt-7 gap-3">
          <View className="flex-1 bg-white/15 rounded-3xl p-4">
            <Text className="text-white/70 text-xs">
              Total Turfs
            </Text>

            <Text className="text-white text-2xl font-extrabold mt-1">
              {turfs.length}
            </Text>
          </View>

          <View className="flex-1 bg-white/15 rounded-3xl p-4">
            <Text className="text-white/70 text-xs">
              Active
            </Text>

            <Text className="text-white text-2xl font-extrabold mt-1">
              {turfs.length}
            </Text>
          </View>

          <View className="flex-1 bg-white/15 rounded-3xl p-4">
            <Text className="text-white/70 text-xs">
              Images
            </Text>

            <Text className="text-white text-2xl font-extrabold mt-1">
              {totalImages}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* BODY */}
      <View className="flex-1 px-5 mt-6">
        {/* ADD TURF CTA */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => router.push("/owner/create-turf")}
        >
          <LinearGradient
            colors={["#111827", "#1f2937"]}
            className="rounded-[35px] overflow-hidden p-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-2xl font-extrabold">
                  Add New Turf
                </Text>

                <Text className="text-slate-300 mt-2 leading-5">
                  Create premium turf listings and grow your
                  sports business professionally.
                </Text>
              </View>

              <View className="w-16 h-16 rounded-3xl bg-white/10 items-center justify-center ml-4">
                <Ionicons
                  name="add-outline"
                  size={34}
                  color="white"
                />
              </View>
            </View>
          </LinearGradient>

        </TouchableOpacity>

        {/* LIST HEADER */}
        <View className="flex-row items-center justify-between mt-8 mb-4">
          <View>
            <Text className="text-slate-900 text-2xl font-extrabold">
              Your Listings
            </Text>

            <Text className="text-slate-500 mt-1">
              Manage all your turfs here
            </Text>
          </View>

          <View className="bg-teal-100 px-4 py-2 rounded-full">
            <Text className="text-teal-700 font-bold">
              {turfs.length} Total
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0f766e" />

            <Text className="text-slate-500 mt-4">
              Loading your turfs...
            </Text>
          </View>
        ) : turfs.length > 0 ? (
          <FlatList
            data={turfs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#0f766e"
              />
            }
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            renderItem={({ item }) => (
              <TurfCard
                turf={item}
                router={router}
                onDelete={handleDeleteTurf}
              />
            )}
          />
        ) : (
          <View
            className="bg-white rounded-[35px] p-10 items-center border border-slate-100 mt-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            <View className="w-28 h-28 rounded-full bg-slate-100 items-center justify-center">
              <Ionicons
                name="business-outline"
                size={54}
                color="#94a3b8"
              />
            </View>

            <Text className="text-slate-900 text-2xl font-extrabold mt-6">
              No Turfs Yet
            </Text>

            <Text className="text-slate-500 text-center leading-6 mt-3">
              Start by creating your first premium turf listing
              and showcase your sports venue professionally.
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/owner/create-turf")}
              className="mt-8 w-full"
            >
              <LinearGradient
                colors={["#0f766e", "#14b8a6"]}
                className="rounded-2xl py-4 flex-row items-center justify-center"
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color="white"
                />

                <Text className="text-white font-bold ml-2 text-base">
                  Create Your First Turf
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}