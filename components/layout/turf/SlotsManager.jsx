import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SlotsManager({ slots, setSlots }) {
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");

  const addSlot = () => {
    if (!newSlotStart.trim() || !newSlotEnd.trim()) {
      Alert.alert("Invalid slot", "Please enter both start and end times");
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newSlotStart) || !timeRegex.test(newSlotEnd)) {
      Alert.alert("Invalid format", "Use HH:MM format (e.g., 07:00)");
      return;
    }

    // Check if slot already exists
    if (slots.some((s) => s.start === newSlotStart && s.end === newSlotEnd)) {
      Alert.alert("Duplicate slot", "This time slot already exists");
      return;
    }

    setSlots([...slots, { start: newSlotStart, end: newSlotEnd, booked: false }]);
    setNewSlotStart("");
    setNewSlotEnd("");
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  return (
    <View className="mb-6">
      <Text className="text-slate-700 font-semibold mb-3">Available time slots</Text>
      <Text className="text-slate-500 text-sm mb-4">Add hourly slots that players can book (e.g., 7:00 AM to 8:00 AM)</Text>

      <View className="flex-row gap-2 mb-4">
        <TextInput
          className="flex-1 border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900"
          placeholder="Start (07:00)"
          placeholderTextColor="#94a3b8"
          value={newSlotStart}
          onChangeText={setNewSlotStart}
        />
        <TextInput
          className="flex-1 border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900"
          placeholder="End (08:00)"
          placeholderTextColor="#94a3b8"
          value={newSlotEnd}
          onChangeText={setNewSlotEnd}
        />
        <TouchableOpacity
          onPress={addSlot}
          activeOpacity={0.8}
          className="bg-teal-600 rounded-2xl px-4 py-3 items-center justify-center"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {slots.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          {slots.map((slot, index) => (
            <View key={index} className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex-row items-center gap-2">
              <Text className="text-slate-900 font-semibold">{slot.start} – {slot.end}</Text>
              <TouchableOpacity onPress={() => removeSlot(index)} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className="bg-slate-50 rounded-2xl p-4 items-center border border-slate-200">
          <Ionicons name="time-outline" size={32} color="#cbd5e1" />
          <Text className="text-slate-500 text-sm mt-2">No slots added yet</Text>
        </View>
      )}
    </View>
  );
}
