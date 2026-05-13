import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

function MenuItem({
  icon,
  title,
  subtitle,
  danger,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white rounded-2xl px-4 py-4 mb-3 flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View
        className={`w-12 h-12 rounded-2xl items-center justify-center ${
          danger ? "bg-red-50" : "bg-slate-100"
        }`}
      >
        <Ionicons
          name={icon}
          size={22}
          color={danger ? "#dc2626" : "#0f172a"}
        />
      </View>

      <View className="flex-1 ml-4">
        <Text
          className={`font-bold text-base ${
            danger ? "text-red-600" : "text-slate-900"
          }`}
        >
          {title}
        </Text>

        <Text className="text-slate-500 text-sm mt-1">
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#94a3b8"
      />
    </TouchableOpacity>
  );
}

export default function OwnerProfile() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);

              router.replace("/signin");
            } catch (error) {
              Alert.alert(
                "Logout Failed",
                "Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#0f766e", "#14b8a6"]}
          className="px-5 pt-5 pb-10 rounded-b-[35px]"
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="white"
            />
          </TouchableOpacity>

          {/* PROFILE */}
          <View className="items-center mt-6">
            <View className="w-28 h-28 rounded-full bg-white/20 items-center justify-center">
              <Ionicons
                name="person"
                size={54}
                color="white"
              />
            </View>

            <Text className="text-white text-2xl font-extrabold mt-5">
              {user?.name || "Owner"}
            </Text>

            <Text className="text-white/80 mt-2">
              {user?.email}
            </Text>

            <View className="bg-white/20 px-4 py-2 rounded-full mt-4">
              <Text className="text-white font-semibold">
                Turf Owner
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* MENU */}
        <View className="px-5 mt-6">
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal details"
            onPress={() =>
              router.push("/owner/edit-owner-profile")
            }
          />

          <MenuItem
            icon="business-outline"
            title="Business Details"
            subtitle="Manage your turf business information"
          />

          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage app notifications"
          />

          <MenuItem
            icon="card-outline"
            title="Payments & Earnings"
            subtitle="View payouts and transactions"
          />

          <MenuItem
            icon="settings-outline"
            title="Settings"
            subtitle="Manage app preferences"
          />

          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help regarding your account"
          />

          <MenuItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Logout from your account"
            danger
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}