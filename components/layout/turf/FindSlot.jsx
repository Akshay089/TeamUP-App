
const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;


import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from 'formik';
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import RazorpayCheckout from 'react-native-razorpay';
import { db } from "../../../config/firebaseConfig";
import { guestFormSchema } from "../../../utils/guestFormSchema";

export default function FindSlot({
  name,
  location,
  price,         // ✅ Price passed directly from Turf page (turfData.price)
  turf,
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot
}) {
  const router = useRouter();

  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handlePress = () => {
    setSlotsVisible(!slotsVisible);
  };

  // ✅ Razorpay Checkout function
  const startPayment = async (payerName, payerEmail, payerPhone) => {
    var options = {
      description: "TeamUP Turf Slot Booking",
      image: "./assets/images/logo.png", // replace with TeamUP logo if available
      currency: "INR",
      key: RAZORPAY_KEY_ID, // from .env
      amount: Number(price) * 100, // ✅ price comes from props (turfData.price), converted to paise
      name: "TeamUP",
      prefill: {
        email: payerEmail || "guest@teamup.com",
        contact: payerPhone || "9999999999",
        name: payerName,
      },
      theme: { color: "#239B2D" },
    };

    try {
      const data = await RazorpayCheckout.open(options);

      // ✅ Payment Success → Save booking in Firestore
      await addDoc(collection(db, "bookings"), {
        name: payerName,
        email: payerEmail,
        phoneNumber: payerPhone,
        slot: selectedSlot,
        date: date.toISOString(),
        selectedNumber,
        location,
        price, // ✅ Save the exact price shown on turf screen
        turf,
        paymentId: data.razorpay_payment_id, // store payment id for reference
      });

      alert("🎉 Booking & Payment Successful!");
      setModalVisible(false);
    } catch (error) {
      console.log("Razorpay Error:", error);
      alert(`Payment Failed: ${error?.description || error?.error || error?.message || "Unknown error"}`);
    }
  };

  // ✅ Called when user clicks "Book Slot"
  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");

    if (userEmail) {
      // Logged-in user → Directly open Razorpay
      startPayment(name, userEmail, "9999999999");
    } else if (guestStatus === "true") {
      // Guest → open form for name & phone
      setModalVisible(true);
      setFormVisible(true);
    } else {
      alert("Please login to book a slot");
    }
  };

  // ✅ Guest form submit → call Razorpay after details entered
  const handleFormSubmit = async (values, { resetForm }) => {
    if (!values.fullName || !values.phoneNumber) {
      alert("Please fill all required fields");
      return;
    }

    startPayment(values.fullName, null, values.phoneNumber);
    resetForm();
  };

  return (
    <View className="flex">
      <View className={`flex ${selectedSlot != null && "flex-row"}`}>
        <View className={`${selectedSlot != null && "flex-1"}`}>
          <TouchableOpacity
            onPress={handlePress}
            className="bg-[#239B2D] p-2 my-3 mx-3 rounded-3xl mt-5"
          >
            <Text className="text-white text-center text-xl font-semibold">
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>

        {selectedSlot != null && (
          <View className="flex-1">
            <TouchableOpacity
              onPress={handleBooking}
              className="bg-[#239B2D] p-2 my-3 mx-3 rounded-3xl mt-5"
            >
              <Text className="text-white text-center text-xl font-semibold">
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {slotsVisible && (
        <View className="flex-row flex-wrap justify-center p-4 mt-2">
          {slots.length > 0 &&
            slots[0].slot.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSlot(time)}
                className={`bg-[#239B2D] px-5 py-4 m-2 rounded-3xl ${
                  selectedSlot && selectedSlot != time ? "opacity-50" : ""
                }`}
              >
                <Text className="text-white text-lg font-semibold">{time}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}

      {/* ✅ Guest form modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        style={{
          flex: 1,
          justifyContent: "flex-end",
          margin: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View className="flex-1 bg-[#00000080] p-4 justify-end">
          <View className="bg-[#00000080] mx-4 rounded-t-lg p-4 pb-2">
            {formVisible && (
              <Formik
                initialValues={{ fullName: "", phoneNumber: "" }}
                validationSchema={guestFormSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View className="w-full ">
                    <View>
                      <Ionicons
                        name="close-sharp"
                        size={24}
                        color="white"
                        onPress={() => setModalVisible(false)}
                        className="absolute right-4 top-4"
                      />
                    </View>

                    <Text className="text-[#239B2D] my-2 text-xl font-semibold mt-20 ">
                      Name
                    </Text>
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

                    <Text className="text-[#239B2D] my-1 text-xl font-semibold mt-15 ">
                      Phone Number
                    </Text>
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

                    <TouchableOpacity
                      onPress={handleSubmit}
                      className="flex flex-row items-center justify-center mt-4"
                    >
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
}
