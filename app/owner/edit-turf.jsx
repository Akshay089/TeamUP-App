import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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

export default function EditTurf() {
  const router = useRouter();
  const { turfId } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(-1);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const docRef = doc(db, "turfs", turfId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const turfData = docSnap.data();
          setTurf(turfData);
          setImages(turfData.images || []);
        }
      } catch (error) {
        console.error("Error fetching turf:", error);
      } finally {
        setLoading(false);
      }
    };

    if (turfId) fetchTurf();
  }, [turfId]);

  const handleUpdateTurf = async (values) => {
    if (images.length < 1) {
      Alert.alert("Add images", "Please add at least one image for your turf.");
      return;
    }

    const updatedTurf = {
      name: values.name,
      description: values.description,
      location: values.location,
      googleMapsLink: values.googleMapsLink || "",
      openTime: values.openTime,
      closeTime: values.closeTime,
      price: values.price,
      amenities: values.amenities,
      images,
      updatedAt: serverTimestamp(),
    };

    try {
      setSubmitting(true);
      const docRef = doc(db, "turfs", turfId);
      await updateDoc(docRef, updatedTurf);
      Alert.alert("Updated", "Your turf has been updated successfully.");
      router.push({ pathname: "/owner/turf-details", params: { turfId } });
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Update failed", "Unable to save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImage = async (index) => {
    setUploadingIndex(index);
    const uploadedUrl = await pickAndUploadImage(`turf-${turfId}-${Date.now()}`);
    if (uploadedUrl) {
      const newImages = [...images];
      newImages[index] = uploadedUrl;
      setImages(newImages);
    }
    setUploadingIndex(-1);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">Loading turf details...</Text>
      </SafeAreaView>
    );
  }

  if (!turf) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-900 font-semibold">Turf not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-5 pb-4 bg-white border-b border-slate-200 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} hitSlop={12} className="mr-3">
              <Ionicons name="chevron-back" size={28} color="#0f172a" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-slate-900 text-2xl font-bold">Edit turf</Text>
              <Text className="text-slate-500 mt-1">Update details and images</Text>
            </View>
          </View>

          <View className="px-5 mt-6">
            <Formik
              initialValues={{
                name: turf.name,
                description: turf.description || "",
                location: turf.location,
                googleMapsLink: turf.googleMapsLink || "",
                openTime: turf.openTime,
                closeTime: turf.closeTime,
                price: String(turf.price),
                amenities: turf.amenities || [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateTurf}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <View>
                  <Text className="text-slate-700 font-bold text-lg mb-3">Turf images</Text>
                  <View className="flex-row gap-3 flex-wrap mb-6">
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
                              name={uploadingIndex === index ? "sync" : "image-outline"}
                              size={24}
                              color="#94a3b8"
                            />
                            <Text className="text-slate-500 text-xs mt-2 font-semibold">
                              {uploadingIndex === index ? "Uploading" : "Add"}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text className="text-slate-700 font-semibold mb-2">Turf name</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base mb-4"
                    placeholder="Turf name"
                    placeholderTextColor="#94a3b8"
                    onChangeText={handleChange("name")}
                    value={values.name}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name ? <Text className="text-red-500 text-xs mb-3">{errors.name}</Text> : null}

                  <Text className="text-slate-700 font-semibold mb-2">Description</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base h-24 mb-4"
                    placeholder="Describe your turf"
                    placeholderTextColor="#94a3b8"
                    multiline
                    onChangeText={handleChange("description")}
                    value={values.description}
                    onBlur={handleBlur("description")}
                  />

                  <Text className="text-slate-700 font-semibold mb-2">Location</Text>
                  <TextInput
                    className="border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-slate-900 text-base mb-4"
                    placeholder="Address"
                    placeholderTextColor="#94a3b8"
                    onChangeText={handleChange("location")}
                    value={values.location}
                    onBlur={handleBlur("location")}
                  />
                  {touched.location && errors.location ? <Text className="text-red-500 text-xs mb-3">{errors.location}</Text> : null}

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
                    </View>
                  </View>

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

                  <Text className="text-slate-700 font-semibold mb-3">Amenities</Text>
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

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSubmit}
                    className={`rounded-3xl py-4 ${submitting ? "bg-slate-400" : "bg-teal-600"}`}
                    disabled={submitting}
                  >
                    <Text className="text-white text-center text-base font-semibold">{submitting ? "Saving..." : "Save changes"}</Text>
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
