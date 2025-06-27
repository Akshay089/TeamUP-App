import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function FindSlot({date,selectedNumber,slots,selectedSlot,setSelectedSlot}) {
    const [slotsVisible,setSlotsVisible]=useState(false);
  
    const handlePress=()=>{
        setSlotsVisible(!slotsVisible)
    };
  return (
    <View className="flex">
        <View className={`flex ${selectedSlot != null && "flex-row"}`}>
          <View className={`${selectedSlot !=null && "flex-1"}`}>

            <TouchableOpacity onPress={handlePress}
                className="bg-[#239B2D] p-2 my-3 mx-3 rounded-3xl mt-5">
                <Text className="text-white text-center text-xl  font-semibold ">Find Slots</Text>
            </TouchableOpacity>

          </View>
          {selectedSlot !=null && (
            <View className="flex-1">
              <TouchableOpacity onPress={handlePress}
                className="bg-[#239B2D] p-2 my-3 mx-3 rounded-3xl mt-5">
                <Text className="text-white text-center text-xl  font-semibold ">Book Slot</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {slotsVisible && (
        <View className="flex-row flex-wrap justify-center p-4 mt-2">
          {slots.length > 0 && slots[0].slot.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSlot(time)}
                  className={`bg-[#239B2D]  px-5 py-4 m-2 rounded-3xl ${selectedSlot && selectedSlot != time ? "opacity-50":""}`}
                  // disabled={selectedSlot==time || selectedSlot==null ? false:true}
                  
                >
                    <Text className="text-white text-lg font-semibold">{time}</Text>
                </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
