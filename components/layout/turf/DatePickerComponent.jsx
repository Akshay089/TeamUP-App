import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function DatePickerComponent({date,setDate}) {
  const [show, setShow] = useState(false);
  
  const onChange = (event, selectedDate) => {
    setShow(false); // close the picker in both cases
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate); // only update on confirm
    }
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  return (
    <View className="flex flex-row mt-4 items-center ml-1">
      <Ionicons name="calendar" size={27} color="#239B2D" />
      <Text className="text-black font-semibold text-base ml-2">
        Select Booking Date :
      </Text>

      <TouchableOpacity
        onPress={() => setShow(true)}
        className="bg-green-600 rounded-full px-3 py-1 ml-9"
      >
        <Text className="text-white font-semibold">
          {date.toDateString()}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={today}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
}
