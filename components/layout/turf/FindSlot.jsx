import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import RazorpayCheckout from "react-native-razorpay";
import { db } from "../../../config/firebaseConfig";
import { useAuthStore } from "../../../store/authStore";
import { guestFormSchema } from "../../../utils/guestFormSchema";

const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;

function slotTimesFromProp(slots) {
  if (!slots || (typeof slots === 'object' && !Array.isArray(slots))) return [];
  if (Array.isArray(slots)) {
    const doc = slots[0];
    return doc && Array.isArray(doc.slot) ? doc.slot : [];
  }
  if (typeof slots === "object" && Array.isArray(slots.slot)) return slots.slot;
  return [];
}

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
  const authUser = useAuthStore((s) => s.user);
  const slotTimes = slotTimesFromProp(slots);

  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Check booked slots for the selected date
  useEffect(() => {
    const checkBookedSlots = async () => {
      try {
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        // Query only by turf (no composite index needed), then filter by date in JS
        const q = query(
          collection(db, "bookings"),
          where("turf", "==", turf)
        );
        const snapshot = await getDocs(q);
        // Filter by date in JavaScript to avoid composite index requirement
        const booked = snapshot.docs
          .filter(doc => doc.data().date.split('T')[0] === dateStr)
          .map(doc => `${doc.data().slot.start}-${doc.data().slot.end}`); // Convert to string for comparison
        setBookedSlots(booked);
      } catch (error) {
        console.log("Error checking booked slots:", error);
      }
    };
    checkBookedSlots();
  }, [date, turf]);

  const handlePress = () => {
    setSlotsVisible(!slotsVisible);
  };

  // ✅ Razorpay Checkout function
  const startPayment = async (payerName, payerEmail, payerPhone) => {
    const options = {
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
      theme: { color: "#0d9488" },
    };

    try {
      const data = await RazorpayCheckout.open(options);

      // ✅ Payment Success → Save booking in Firestore
      await addDoc(collection(db, "bookings"), {
        name: payerName,
        turfTitle: name,
        email: payerEmail,
        phoneNumber: payerPhone,
        slot: `${selectedSlot.start}-${selectedSlot.end}`, // Save as string for consistency
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
      const payerName =
        authUser?.fullName || userEmail.split("@")[0] || "TeamUP Player";
      startPayment(payerName, userEmail, "9999999999");
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
            className="bg-teal-600 p-3 my-3 mx-3 rounded-3xl mt-5 shadow-sm"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>

        {selectedSlot != null && (
          <View className="flex-1">
            <TouchableOpacity
              onPress={handleBooking}
              className="bg-teal-600 p-3 my-3 mx-3 rounded-3xl mt-5 shadow-sm"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {slotsVisible && (
        <View className="flex-row flex-wrap justify-center p-4 mt-2">
          {slotTimes.length === 0 ? (
            <Text className="text-slate-500 text-center px-4">
              No time slots loaded yet. Check Firebase `slots` for this venue.
            </Text>
          ) : (
            slotTimes.map((slotObj, index) => {
              const slotString = `${slotObj.start}-${slotObj.end}`;
              const isBooked = bookedSlots.includes(slotString);
              const isSelected = selectedSlot && selectedSlot.start === slotObj.start && selectedSlot.end === slotObj.end;
              return (
                <TouchableOpacity
                  key={`${slotString}-${index}`}
                  onPress={() => !isBooked && setSelectedSlot(slotObj)}
                  disabled={isBooked}
                  className={`px-5 py-3.5 m-2 rounded-2xl ${
                    isBooked 
                      ? "bg-red-500" 
                      : isSelected 
                      ? "bg-teal-600" 
                      : "bg-teal-400"
                  } ${isBooked ? "opacity-50" : ""}`}
                >
                  <Text className={`text-base font-semibold ${
                    isBooked ? "text-white line-through" : "text-white"
                  }`}>
                    {slotObj.start} - {slotObj.end}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
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
        <View className="flex-1 bg-black/50 px-3 pb-6 justify-end">
          <View className="bg-white rounded-3xl px-5 pt-4 pb-6 shadow-xl">
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
                  <View className="w-full">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-slate-900 text-xl font-bold">Guest checkout</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={12}>
                        <Ionicons name="close-circle" size={28} color="#94a3b8" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-slate-500 text-sm mb-5">
                      We need these details to confirm your booking with the venue.
                    </Text>

                    <Text className="text-slate-700 font-semibold mb-2">Full name</Text>
                    <TextInput
                      className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 text-base mb-1"
                      placeholder="Your name"
                      placeholderTextColor="#94a3b8"
                      onChangeText={handleChange("fullName")}
                      value={values.fullName}
                      onBlur={handleBlur("fullName")}
                    />
                    {touched.fullName && errors.fullName && (
                      <Text className="text-red-500 text-xs mb-3">{errors.fullName}</Text>
                    )}

                    <Text className="text-slate-700 font-semibold mb-2">Phone</Text>
                    <TextInput
                      className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 text-base mb-1"
                      placeholder="Mobile number"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      onChangeText={handleChange("phoneNumber")}
                      value={values.phoneNumber}
                      onBlur={handleBlur("phoneNumber")}
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text className="text-red-500 text-xs mb-3">{errors.phoneNumber}</Text>
                    )}

                    <TouchableOpacity
                      onPress={handleSubmit}
                      className="bg-teal-600 rounded-2xl py-3.5 mt-4 items-center shadow-sm"
                    >
                      <Text className="text-white font-semibold text-base">Continue to pay</Text>
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
