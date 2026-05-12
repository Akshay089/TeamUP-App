import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 border-b border-slate-200 bg-white">
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} className="p-1">
            <Ionicons name="chevron-back" size={26} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-slate-900 ml-2">Notifications</Text>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-white border border-slate-100 items-center justify-center shadow-sm">
            <Ionicons name="notifications-outline" size={40} color="#0d9488" />
          </View>
          <Text className="text-slate-900 font-bold text-xl mt-6 text-center">
            {"You're all caught up"}
          </Text>
          <Text className="text-slate-500 text-center mt-3 leading-6">
            Booking confirmations and reminders will appear here when you enable push messaging in
            a future update. For now, check the Bookings tab for upcoming sessions.
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
