import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQ = [
  {
    q: "How do I book a slot?",
    a: "Open a turf, pick a date and duration, tap Find Slots, choose a time, then complete payment.",
  },
  {
    q: "Can I browse without an account?",
    a: "Yes — use Guest mode from the welcome screen. You’ll enter contact details at checkout.",
  },
  {
    q: "Where do I see upcoming games?",
    a: "Use the Bookings tab after signing in. Only future bookings are listed.",
  },
];

export default function Help() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 border-b border-slate-200 bg-white">
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} className="p-1">
            <Ionicons name="chevron-back" size={26} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-slate-900 ml-2">Help & FAQ</Text>
        </View>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-6">
            <Text className="text-teal-900 font-semibold text-base">Need a human?</Text>
            <Text className="text-teal-800/90 mt-1">
              Email support@teamup.app — we typically reply within one business day.
            </Text>
          </View>
          {FAQ.map((item, i) => (
            <View
              key={i}
              className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm"
            >
              <Text className="text-slate-900 font-semibold text-base">{item.q}</Text>
              <Text className="text-slate-600 mt-2 leading-6">{item.a}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
