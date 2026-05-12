import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REMINDERS_KEY = "teamup_pref_booking_reminders";

export default function Settings() {
  const router = useRouter();
  const [reminders, setReminders] = useState(true);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(REMINDERS_KEY);
      if (v === "false") setReminders(false);
    })();
  }, []);

  const toggleReminders = async (value) => {
    setReminders(value);
    await AsyncStorage.setItem(REMINDERS_KEY, value ? "true" : "false");
    if (Platform.OS === "ios") Haptics.selectionAsync();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 border-b border-slate-200 bg-white">
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} className="p-1">
            <Ionicons name="chevron-back" size={26} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-slate-900 ml-2">Settings</Text>
        </View>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            Notifications
          </Text>
          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 pr-4">
                <Text className="text-slate-900 font-semibold">Booking reminders</Text>
                <Text className="text-slate-500 text-sm mt-1">
                  Preference stored on this device. Push delivery can be wired to FCM later.
                </Text>
              </View>
              <Switch
                value={reminders}
                onValueChange={toggleReminders}
                trackColor={{ false: "#e2e8f0", true: "#99f6e4" }}
                thumbColor={reminders ? "#0d9488" : "#f4f4f5"}
              />
            </View>
          </View>

          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-2 ml-1">
            About
          </Text>
          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4">
            <Text className="text-slate-700 leading-6">
              TeamUP helps players find and book turfs with live availability. Venue data comes from
              your Firebase project; maps use your configured Google APIs.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
