import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

const { width } = Dimensions.get("window");

export default function TurfDetails() {
  const router = useRouter();
  const { turfId } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const [turf, setTurf] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const docRef = doc(db, "turfs", turfId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTurf({ id: docSnap.id, ...docSnap.data() });

          // Fetch slots for this turf
          const slotsQuery = query(collection(db, "slots"), where("turfId", "==", turfId));
          const slotsSnapshot = await getDocs(slotsQuery);
          if (!slotsSnapshot.empty) {
            const slotsData = slotsSnapshot.docs[0].data();
            setSlots(slotsData.slot || []);
          }
        }
      } catch (error) {
        console.error("Error fetching turf:", error);
      } finally {
        setLoading(false);
      }
    };

    if (turfId) fetchTurf();
  }, [turfId]);

  const isOwner = user?.uid === turf?.ownerId;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">Loading turf details...</Text>
      </SafeAreaView>
    );
  }

  if (!turf) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-900 font-semibold">Turf not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={28} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-slate-900 font-bold text-lg">Turf details</Text>
          <View className="w-7" />
        </View>

        {/* Image Carousel */}
        {turf.images && turf.images.length > 0 && (
          <View>
            <View className="mx-4 rounded-3xl overflow-hidden bg-slate-200 h-64 mb-3">
              <Image
                source={{ uri: turf.images[activeImageIndex] }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
            <View className="flex-row justify-center gap-2 px-4">
              {turf.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === activeImageIndex ? "bg-teal-600" : "bg-slate-300"
                  }`}
                />
              ))}
            </View>
          </View>
        )}

        {/* Turf Info Card */}
        <View className="mx-4 mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-slate-900 font-bold text-2xl">{turf.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text className="text-slate-500 ml-1">{turf.location}</Text>
              </View>
            </View>
            <View className="bg-teal-50 rounded-2xl px-4 py-2">
              <Text className="text-teal-700 font-bold text-lg">₹{turf.price}</Text>
              <Text className="text-teal-600 text-xs font-semibold">per hour</Text>
            </View>
          </View>

          {turf.description && (
            <View className="mt-4 pt-4 border-t border-slate-100">
              <Text className="text-slate-500 leading-6">{turf.description}</Text>
            </View>
          )}
        </View>

        {/* Hours Card */}
        <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <Text className="text-slate-900 font-bold text-lg mb-4">Operating hours</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-slate-500 text-sm">Opens</Text>
              <Text className="text-slate-900 font-semibold text-lg mt-1">{turf.openTime}</Text>
            </View>
            <View className="w-px bg-slate-200" />
            <View>
              <Text className="text-slate-500 text-sm">Closes</Text>
              <Text className="text-slate-900 font-semibold text-lg mt-1">{turf.closeTime}</Text>
            </View>
          </View>
        </View>

        {/* Amenities Card */}
        {turf.amenities && turf.amenities.length > 0 && (
          <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <Text className="text-slate-900 font-bold text-lg mb-4">Amenities</Text>
            <View className="flex-row flex-wrap gap-2">
              {turf.amenities.map((amenity, index) => (
                <View key={index} className="bg-teal-50 rounded-full px-4 py-2">
                  <Text className="text-teal-700 font-semibold text-sm">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location Card */}
        {turf.googleMapsLink && (
          <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <TouchableOpacity activeOpacity={0.85}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-blue-100 items-center justify-center">
                  <Ionicons name="map" size={24} color="#3b82f6" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-slate-900 font-semibold">View on Google Maps</Text>
                  <Text className="text-blue-600 text-xs mt-1">Get directions</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Slots Card */}
        {slots.length > 0 && (
          <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <Text className="text-slate-900 font-bold text-lg mb-4">Available slots</Text>
            <View className="flex-row flex-wrap gap-2">
              {slots.map((slot, index) => (
                <View key={index} className="bg-teal-50 rounded-full px-4 py-2">
                  <Text className="text-teal-700 font-semibold text-sm">{slot.start} – {slot.end}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Owner Section */}
        {isOwner && (
          <View className="mx-4 mt-6">
            <View className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-5 flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: "/owner/edit-turf", params: { turfId } })}
                className="flex-1 bg-white/20 rounded-2xl py-3 items-center"
              >
                <Ionicons name="pencil" size={20} color="white" />
                <Text className="text-white font-semibold mt-1">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} className="flex-1 bg-white/20 rounded-2xl py-3 items-center">
                <Ionicons name="settings" size={20} color="white" />
                <Text className="text-white font-semibold mt-1">Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
