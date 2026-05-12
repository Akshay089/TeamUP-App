import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OwnerLayout() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <Slot />
    </SafeAreaView>
  );
}
