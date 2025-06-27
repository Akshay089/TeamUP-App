import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function HoursPickerComponent({ selectedNumber, setSelectedNumber }) {
  const decrement = () => {
    if (selectedNumber > 1) {
      setSelectedNumber(selectedNumber - 1);
    }
  };

  const increment = () => {
    if(selectedNumber<10){
        setSelectedNumber(selectedNumber + 1);
    }
    else {
        Alert.alert(
        "Booking Limit !",
        "You can book a maximum of 10 hours.",
        [{ text: "OK", style: "default" }]
        );
    }
  };

  return (
    <View className="flex flex-row mt-5 space-y-2 bg-green-200 rounded-xl mb-4 ml-1">
      
      {/* Label Row */}
      <View className="flex flex-row items-center">
        <Ionicons name="hourglass-outline" size={27} color="#239B2D" />
        <Text className="text-black font-semibold text-base ml-2">
          Select Booking Hours :
        </Text>
      </View>

      {/* Button Row */}
      <View className="flex flex-row items-center space-x-2 ml-10">
        <TouchableOpacity onPress={decrement} className="border border-[#239B2D] rounded-lg px-3">
          <Text className="text-black font-bold text-2xl">-</Text>
        </TouchableOpacity>

        <Text className="px-4 py-1 text-white bg-[#239B2D] text-lg font-bold rounded-lg">
          {selectedNumber}
        </Text>

        <TouchableOpacity onPress={increment} className="border border-[#239B2D] rounded-lg px-3">
          <Text className="text-black font-bold text-2xl">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
