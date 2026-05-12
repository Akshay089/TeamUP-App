import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";
import { pickAndUploadImage } from "../../utils/imageUtils";

const amenitiesOptions = [
  "Parking",
  "Lighting",
  "Showers",
  "Changing rooms",
  "Water",
  "Wi-Fi",
  "Food court",
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Turf name is required"),
  location: Yup.string().required("Location is required"),
  googleMapsLink: Yup.string().url("Enter a valid URL").nullable(),
  openTime: Yup.string().required("Opening time is required"),
  closeTime: Yup.string().required("Closing time is required"),
  price: Yup.number().typeError("Enter a valid price").required("Price is required"),
});

export default function CreateTurf() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(-1);

  const handleAddImage = async (index) => {
    setUploadingIndex(index);
    const uploadedUrl = await pickAndUploadImage(`turf-${Date.now()}-${index}`);
    if (uploadedUrl) {
      const newImages = [...images];
      newImages[index] = uploadedUrl;
      setImages(newImages);
    }
    setUploadingIndex(-1);
  };

  const handleCreateTurf = async (values) => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in again to create a turf.");
      router.replace("/(auth)/signin");
      return;
    }

    if (images.length < 1) {
      Alert.alert("Add images", "Please add at least one image for your turf.");
      return;
    }

    const newTurf = {
      name: values.name,
      description: values.description,
      location: values.location,
      googleMapsLink: values.googleMapsLink || "",
      openTime: values.openTime,
      closeTime: values.closeTime,
      price: values.price,
      amenities: values.amenities,
      images: images.filter(Boolean),
      ownerId: user.uid,
      ownerName: user.fullName || "Owner",
      role: "owner",
      createdAt: serverTimestamp(),
      status: "active",
    };

    try {
      setSubmitting(true);
      await addDoc(collection(db, "turfs"), newTurf);
      Alert.alert("Success!", "Your turf has been published successfully.", [
        { text: "View", onPress: () => router.push("/owner/dashboard") },
      ]);
    } catch (error) {
      console.error("Create turf failed:", error);
      Alert.alert("Failed", "Unable to save turf. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-5 pb-4 bg-white border-b border-slate-200 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} hitSlop={12} className="mr-3">
              <Ionicons name="chevron-back" size={28} color="#0f172a" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-slate-900 text-2xl font-bold">Create turf listing</Text>
              <Text className="text-slate-500 mt-1">Add details, location, amenities and images.</Text>
            </View>
          </View>

          <View className="px-5 mt-6">
            <Formik
              initialValues={{
                name: "",
                description: "",
                location: "",
                googleMapsLink: "",
                openTime: "",
                closeTime: "",
                price: "",
                amenities: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleCreateTurf}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <View>
                  {/* Images Section */}
                  <View className="mb-6">
                    <Text className="text-slate-900 font-bold text-lg mb-1">Turf images</Text>
                    <Text className="text-slate-500 text-sm mb-4">Add 1–3 photos. Players see these first.</Text>
                    <View className="flex-row gap-3 flex-wrap">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleAddImage(index)}
                          activeOpacity={0.85}
                          className="w-[31%] aspect-square rounded-3xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 items-center justify-center"
                        >
                          {images[index] ? (
                            <Image source={{ uri: images[index] }} className="w-full h-full" resizeMode="cover" />
                          ) : (
                            <View className="items-center">
                              <Ionicons
                                name={uploadingIndex === index ? "sync" : "camera-outline"}
                                size={24}
                                color="#94a3b8"
                              />
                              <Text className="text-slate-500 text-xs mt-2 font-semibold">
                                {uploadingIndex === index ? "Uploading..." : "Photo"}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                    {images.filter(Boolean).length > 0 && (
                      <Text className="text-teal-600 text-xs font-semibold mt-3">{images.filter(Boolean).length} image(s) added</Text>
                    )}
                  </View>

                  {/* Turf name */}
                  <Text className="text-slate-700 font-semibold mb-2">Turf name</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base mb-4"
                    placeholder="E.g., GreenField Arena"
                    placeholderTextColor="#94a3b8"
                    onChangeText={handleChange("name")}
                    value={values.name}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name ? <Text className="text-red-500 text-xs mb-3">{errors.name}</Text> : null}

                  {/* Description */}
                  <Text className="text-slate-700 font-semibold mb-2">Description</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base h-24 mb-4"
                    placeholder="Highlight surface type, features, match readiness..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    onChangeText={handleChange("description")}
                    value={values.description}
                    onBlur={handleBlur("description")}
                  />

                  {/* Location */}
                  <Text className="text-slate-700 font-semibold mb-2">Location / Address</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base mb-4"
                    placeholder="Street address, landmark, city"
                    placeholderTextColor="#94a3b8"
                    onChangeText={handleChange("location")}
                    value={values.location}
                    onBlur={handleBlur("location")}
                  />
                  {touched.location && errors.location ? <Text className="text-red-500 text-xs mb-3">{errors.location}</Text> : null}

                  {/* Google Maps */}
                  <Text className="text-slate-700 font-semibold mb-2">Google Maps link</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base mb-4"
                    placeholder="https://maps.app.goo.gl/..."
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    onChangeText={handleChange("googleMapsLink")}
                    value={values.googleMapsLink}
                    onBlur={handleBlur("googleMapsLink")}
                  />
                  {touched.googleMapsLink && errors.googleMapsLink ? <Text className="text-red-500 text-xs mb-3">{errors.googleMapsLink}</Text> : null}

                  {/* Hours */}
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                      <Text className="text-slate-700 font-semibold mb-2">Open time</Text>
                      <TextInput
                        className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base"
                        placeholder="07:00 AM"
                        placeholderTextColor="#94a3b8"
                        onChangeText={handleChange("openTime")}
                        value={values.openTime}
                        onBlur={handleBlur("openTime")}
                      />
                      {touched.openTime && errors.openTime ? <Text className="text-red-500 text-xs mt-1">{errors.openTime}</Text> : null}
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-700 font-semibold mb-2">Close time</Text>
                      <TextInput
                        className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base"
                        placeholder="11:00 PM"
                        placeholderTextColor="#94a3b8"
                        onChangeText={handleChange("closeTime")}
                        value={values.closeTime}
                        onBlur={handleBlur("closeTime")}
                      />
                      {touched.closeTime && errors.closeTime ? <Text className="text-red-500 text-xs mt-1">{errors.closeTime}</Text> : null}
                    </View>
                  </View>

                  {/* Price */}
                  <Text className="text-slate-700 font-semibold mb-2">Price per hour</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base mb-4"
                    placeholder="₹1200"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    onChangeText={handleChange("price")}
                    value={values.price}
                    onBlur={handleBlur("price")}
                  />
                  {touched.price && errors.price ? <Text className="text-red-500 text-xs mb-4">{errors.price}</Text> : null}

                  {/* Amenities */}
                  <Text className="text-slate-700 font-semibold mb-3">Amenities available</Text>
                  <View className="flex-row flex-wrap gap-2 mb-6">
                    {amenitiesOptions.map((option) => {
                      const selected = values.amenities.includes(option);
                      return (
                        <TouchableOpacity
                          key={option}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (selected) {
                              setFieldValue("amenities", values.amenities.filter((item) => item !== option));
                            } else {
                              setFieldValue("amenities", [...values.amenities, option]);
                            }
                          }}
                          className={`rounded-full border px-4 py-2 ${selected ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          <Text className={`${selected ? "text-teal-700" : "text-slate-700"} font-semibold`}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Publish Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSubmit}
                    className={`rounded-3xl py-4 flex-row items-center justify-center ${submitting ? "bg-slate-400" : "bg-teal-600"}`}
                    disabled={submitting}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text className="text-white text-center text-base font-semibold ml-2">{submitting ? "Publishing..." : "Publish turf"}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
