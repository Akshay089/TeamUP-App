import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from 'formik';
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { db } from "../../../config/firebaseConfig";
import { guestFormSchema } from "../../../utils/guestFormSchema";

export default function FindSlot({name,location,price,turf,date,selectedNumber,slots,selectedSlot,setSelectedSlot}) {
    const router = useRouter();

    const [slotsVisible,setSlotsVisible]=useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    const handlePress=()=>{
        setSlotsVisible(!slotsVisible)
    };

    const handleBooking=async()=>{
      const userEmail= await AsyncStorage.getItem("userEmail");
      const guestStatus = await AsyncStorage.getItem("isGuest");
      if(userEmail){
            try {
            await addDoc(collection(db, "bookings"), {
              name: name,
              email: userEmail,
              slot: selectedSlot,
              date: date.toISOString(),
              selectedNumber: selectedNumber,
              location: location,
              price: price,
              turf: turf,
            });
            alert("Booking successfully Done!");
          } 
          catch (error) {
            console.log(error);
          }
      }
      else if(guestStatus === "true"){
        setModalVisible(true);
        setFormVisible(true);
      }
      else{
        alert("Please login to book a slot");
      }
    }

  const handleFormSubmit = async (values, { resetForm }) => {
    if (!values.fullName || !values.phoneNumber) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      await addDoc(collection(db, "bookings"), {
        name: values.fullName,
        slot: selectedSlot,
        date: date.toISOString(),
        selectedNumber,
        location,
        price,
        turf,
        phoneNumber: values.phoneNumber,
      });
      alert("Booking successfully Done!");
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
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
              <TouchableOpacity onPress={handleBooking}
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

      <Modal visible={modalVisible} transparent={true} animationType="slide"style={{flex: 1, justifyContent: 'flex-end', margin: 0,borderTopLeftRadius: 20, borderTopRightRadius: 20}} >
        <View className="flex-1 bg-[#00000080] p-4 justify-end" >
          <View className="bg-[#00000080] mx-4 rounded-t-lg p-4 pb-2">
            {         
              formVisible && (
              <Formik 
                initialValues={{ fullName: '', phoneNumber: '' }}
                validationSchema={guestFormSchema}
                validateOnMount={true}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={handleFormSubmit}
              >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    // This is email input box
                    <View className="w-full ">
                      <View>
                        <Ionicons name="close-sharp" size={24} color="white" onPress={() => setModalVisible(false)} className="absolute right-4 top-4" />
                      </View>
                      <Text className="text-[#239B2D] my-2 text-xl font-semibold mt-20 ">Name</Text>
                      <TextInput
                        className=" h-18 border-green-500 border-2  text-white text-lg text-bold rounded px-6"
                        placeholder="Enter Full Name"
                        onChangeText={handleChange("fullName")}
                        value={values.fullName}
                        onBlur={handleBlur("fullName")}
                      />

                      {touched.fullName && errors.fullName && (
                        <Text className="text-red-500 text-xs mb-2">
                          {errors.fullName}
                        </Text>
                      )}

                      <Text className="text-[#239B2D] my-1 text-xl font-semibold mt-15 ">Phone Number</Text>
                      <TextInput
                        className=" h-18 border-2 border-green-500 text-white text-lg text-bold rounded px-6"
                        placeholder="Enter Phone Number"
                        keyboardType="phone-pad"
                        onChangeText={handleChange("phoneNumber")}
                        value={values.phoneNumber}
                        onBlur={handleBlur("phoneNumber")}
                      />

                      {touched.phoneNumber && errors.phoneNumber && (
                        <Text className="text-red-500 text-xs mb-2">
                          {errors.phoneNumber}
                        </Text>
                      )}
                      
                          <TouchableOpacity onPress={handleSubmit} className="flex flex-row items-center justify-center mt-4"> 
                                <Text className="text-base font-semibold underline text-[#239B2D]  p-1">
                                    Submit
                                </Text>
                          </TouchableOpacity>
                          
                    </View>
                  )}
              </Formik>
              )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
