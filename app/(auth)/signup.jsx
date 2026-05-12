import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Formik } from "formik";
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
import wbimage2 from "../../assets/images/wbimage2.png";
import { auth, db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";

const signUpValidationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().required("Email is required").email("Invalid email format"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  role: Yup.string().oneOf(["player", "owner"]).required("Please select a profile type"),
});

export default function SignUp() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setIsGuest = useAuthStore((s) => s.setIsGuest);

  const handleSignUp = async (values) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        createdAt: new Date(),
      });

      await AsyncStorage.setItem("userEmail", values.email);
      await AsyncStorage.setItem("isGuest", "false");
      await AsyncStorage.setItem("userRole", values.role);
      setUser({ uid: user.uid, email: values.email, fullName: values.fullName, role: values.role });
      setIsGuest(false);
      console.log("Signup successful:", user.email);

      if (values.role === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.log("SignUp error", error);
      let message = "An unexpected error occurred. Please try again later.";
      if (error.code === "auth/email-already-in-use") {
        message = "This email address is already in use. Please use a different email.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid. Please enter a valid email.";
      } else if (error.code === "auth/weak-password") {
        message = "The password is too weak. Please use a stronger password.";
      }
      Alert.alert("Signup Failed!", message, [{ text: "OK" }]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center px-4 pt-2 pb-4" hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
            <Text className="text-slate-700 font-semibold ml-1">Back</Text>
          </TouchableOpacity>

          <View className="px-5">
            <Text className="text-3xl font-bold text-slate-900">Create your TeamUP account</Text>
            <Text className="text-slate-500 mt-2 text-base leading-6">
              Choose the right profile and unlock booking or turf management features.
            </Text>

            <View className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mt-8">
              <Formik
                initialValues={{ fullName: "", email: "", password: "", role: "player" }}
                validationSchema={signUpValidationSchema}
                onSubmit={handleSignUp}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                  <View>
                    <Text className="text-slate-700 font-semibold mb-2">Full name</Text>
                    <TextInput
                      className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 text-base"
                      placeholder="Alex Morgan"
                      placeholderTextColor="#94a3b8"
                      onChangeText={handleChange("fullName")}
                      value={values.fullName}
                      onBlur={handleBlur("fullName")}
                    />
                    {touched.fullName && errors.fullName ? <Text className="text-red-500 text-xs mt-1">{errors.fullName}</Text> : null}

                    <Text className="text-slate-700 font-semibold mb-2 mt-5">Email</Text>
                    <TextInput
                      className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 text-base"
                      placeholder="you@company.com"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={handleChange("email")}
                      value={values.email}
                      onBlur={handleBlur("email")}
                    />
                    {touched.email && errors.email ? <Text className="text-red-500 text-xs mt-1">{errors.email}</Text> : null}

                    <Text className="text-slate-700 font-semibold mb-2 mt-5">Password</Text>
                    <TextInput
                      className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 text-base"
                      placeholder="At least 6 characters"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      value={values.password}
                      onBlur={handleBlur("password")}
                    />
                    {touched.password && errors.password ? <Text className="text-red-500 text-xs mt-1">{errors.password}</Text> : null}

                    <Text className="text-slate-700 font-semibold mb-3 mt-5">Choose your profile</Text>
                    <View className="flex-row gap-3">
                      {[
                        { key: "player", title: "Player", subtitle: "Book turfs, join matches" },
                        { key: "owner", title: "Owner", subtitle: "Manage your turf listings" },
                      ].map((option) => (
                        <TouchableOpacity
                          key={option.key}
                          activeOpacity={0.8}
                          onPress={() => setFieldValue("role", option.key)}
                          className={`flex-1 rounded-3xl border p-4 ${values.role === option.key ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          <Text className={`text-base font-semibold ${values.role === option.key ? "text-teal-800" : "text-slate-800"}`}>{option.title}</Text>
                          <Text className="text-slate-500 text-sm mt-1">{option.subtitle}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {touched.role && errors.role ? <Text className="text-red-500 text-xs mt-2">{errors.role}</Text> : null}

                    <TouchableOpacity className="bg-teal-600 rounded-2xl py-3.5 mt-6 shadow-sm" onPress={handleSubmit}>
                      <Text className="text-white text-center text-base font-semibold">Create account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/(auth)/signin")} className="flex-row flex-wrap justify-center mt-5">
                      <Text className="text-slate-600">Already onboard? </Text>
                      <Text className="text-teal-700 font-semibold">Sign in</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>

            <Image source={wbimage2} className="w-full h-52 mt-8 rounded-3xl" resizeMode="cover" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

