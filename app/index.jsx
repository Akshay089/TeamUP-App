import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/images/teamup.png";

const perks = [
  { icon: "flash-outline", label: "Live slots", sub: "See availability instantly" },
  { icon: "shield-checkmark-outline", label: "Secure checkout", sub: "Razorpay-ready flow" },
  { icon: "map-outline", label: "Nearby venues", sub: "Map + curated directory" },
];

export default function Index() {
  const router = useRouter();
  const setIsGuest = useAuthStore((s) => s.setIsGuest);

  const handleGuestUser = async () => {
    if (await AsyncStorage.getItem("userEmail")) {
      alert(
        "You are already logged in as a user. Please logout to continue as a guest."
      );
      return;
    }
    await AsyncStorage.setItem("isGuest", "true");
    setIsGuest(true);
    router.push("/home");
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#134e4a", "#0d9488"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 pt-4 pb-8">
          <View className="items-center mt-2">
            <Image source={logo} className="w-72 h-72" resizeMode="contain" />
            <Text className="text-white text-3xl font-bold text-center tracking-tight">
              Book turfs like a pro
            </Text>
            <Text className="text-teal-100/90 text-center mt-3 text-base leading-6 px-2">
              One place for discovery, live booking, and your upcoming games — built for teams that
              move fast.
            </Text>
          </View>

          <View className="mt-8 gap-3">
            {perks.map((p) => (
              <View
                key={p.label}
                className="flex-row items-center bg-white/10 rounded-2xl px-4 py-3 border border-white/10"
              >
                <View className="w-10 h-10 rounded-xl bg-white/15 items-center justify-center">
                  <Ionicons name={p.icon} size={22} color="#ecfdf5" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">{p.label}</Text>
                  <Text className="text-teal-100/80 text-sm mt-0.5">{p.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-auto gap-3 pt-6">
            <PrimaryButton label="Create account" onPress={() => router.push("/(auth)/signup")} />
            <TouchableOpacity
              onPress={handleGuestUser}
              activeOpacity={0.92}
              className="rounded-2xl py-3.5 px-5 items-center border-2 border-white/85 bg-white/10"
            >
              <Text className="text-white font-semibold text-base">Continue as guest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signin")}
              className="py-3 items-center active:opacity-80"
            >
              <Text className="text-white/90 font-semibold">
                Already have an account?{" "}
                <Text className="underline text-teal-100">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
