import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

function MenuRow({ icon, label, subtitle, onPress, danger }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`flex-row items-center py-4 px-4 ${danger ? "bg-red-50" : ""}`}
    >
      <View
        className={`w-11 h-11 rounded-2xl items-center justify-center ${
          danger ? "bg-red-100" : "bg-slate-100"
        }`}
      >
        <Ionicons name={icon} size={22} color={danger ? "#dc2626" : "#0f172a"} />
      </View>
      <View className="ml-3 flex-1">
        <Text className={`font-semibold text-base ${danger ? "text-red-700" : "text-slate-900"}`}>
          {label}
        </Text>
        {subtitle ? <Text className="text-slate-500 text-sm mt-0.5">{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

export default function Profile() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [guestFlag, setGuestFlag] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const setIsGuestStore = useAuthStore((s) => s.setIsGuest);

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("userEmail");
      const g = await AsyncStorage.getItem("isGuest");
      const role = await AsyncStorage.getItem("userRole");
      setUserEmail(email);
      setGuestFlag(g === "true");
      setUserRole(user?.role || role || null);
    })();
  }, [user]);

  const roleLabel = userRole === "owner" ? "Turf owner" : "Player";
  const displayName = user?.fullName || (guestFlag ? "Guest player" : "TeamUP member");
  const subtitle = userEmail
    ? `${roleLabel} · ${userEmail}`
    : guestFlag
    ? "Browsing as guest — sign in to sync bookings"
    : null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("isGuest");
      await AsyncStorage.removeItem("userRole");
      logoutStore();
      setUserEmail(null);
      setGuestFlag(false);
      Alert.alert("Signed out", "You have been logged out.");
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-4 pb-6">
          <Text className="text-slate-900 text-2xl font-bold">Profile</Text>
          <Text className="text-slate-500 mt-1">Account & preferences</Text>
        </View>

        <View className="mx-4 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          <View className="p-5 flex-row items-center border-b border-slate-100">
            <View className="w-16 h-16 rounded-3xl bg-teal-100 items-center justify-center">
              <Ionicons name="person" size={36} color="#0f766e" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-slate-900 font-bold text-xl">{displayName}</Text>
              {subtitle ? (
                <Text className="text-slate-500 mt-1" numberOfLines={2}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          {!userEmail && !guestFlag ? (
            <View className="p-5">
              <Text className="text-slate-600 mb-4">
                Sign in to sync bookings across devices and unlock receipts.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
                className="bg-teal-600 rounded-2xl py-3.5 items-center"
              >
                <Text className="text-white font-semibold text-base">Sign up free</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signin")}
                className="mt-3 py-3 items-center"
              >
                <Text className="text-teal-700 font-semibold">I already have an account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <MenuRow
                icon="notifications-outline"
                label="Notifications"
                subtitle="Alerts & reminders hub"
                onPress={() => router.push("/notifications")}
              />
              <MenuRow
                icon="settings-outline"
                label="Settings"
                subtitle="Preferences on this device"
                onPress={() => router.push("/settings")}
              />
              <MenuRow
                icon="help-circle-outline"
                label="Help & FAQ"
                subtitle="Booking tips & support"
                onPress={() => router.push("/help")}
              />
              {userRole === "owner" ? (
                <MenuRow
                  icon="business-outline"
                  label="Manage turfs"
                  subtitle="Create and update your listings"
                  onPress={() => router.push("/owner/dashboard")}
                />
              ) : null}
              {guestFlag && !userEmail ? (
                <MenuRow
                  icon="exit-outline"
                  label="Exit guest mode"
                  subtitle="Return to the welcome screen"
                  onPress={async () => {
                    await AsyncStorage.removeItem("isGuest");
                    setGuestFlag(false);
                    setIsGuestStore(false);
                    router.replace("/");
                  }}
                />
              ) : null}
              {userEmail ? (
                <MenuRow icon="log-out-outline" label="Sign out" onPress={handleLogout} danger />
              ) : null}
            </>
          )}
        </View>

        <Text className="text-xs text-center text-slate-400 px-8 leading-5">
          TeamUP · Venue availability syncs from Firebase. Payments run through Razorpay when configured.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
