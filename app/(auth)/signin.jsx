import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Formik } from 'formik';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import wbimage2 from '../../assets/images/wbimage2.png';
import { auth, db } from "../../config/firebaseConfig";
import { useAuthStore } from '../../store/authStore';
import validationSchema from '../../utils/authSchema';


export default function SignIn() {
  const router=useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setIsGuest = useAuthStore((state) => state.setIsGuest);

  const handleSignIn = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role || "player";
        const userData = {
          uid: user.uid,
          email: user.email,
          fullName: userDoc.data().fullName || "Player",
          role,
        };
        setUser(userData);
        setIsGuest(false);

        await AsyncStorage.setItem("userEmail", values.email);
        await AsyncStorage.setItem("isGuest", "false");
        await AsyncStorage.setItem("userRole", role);
        console.log("User data found:", user.uid);

        if (role === "owner") {
          router.push("/owner/dashboard");
        } else {
          router.push("/home");
        }
      } else {
        Alert.alert(
          "Profile missing",
          "No user profile found for this account. Please sign up again or contact support."
        );
      }
      console.log("SignIn successful:", user.email);

    } catch (error) {
      console.log("SignIn error", error);
      let message= "An unexpected error occurred. Please try again later.";
      if (error.code === "invalid-credentials") {
        message = "The password is incorrect. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid. Please enter a valid email.";
      } else if (error.code === "auth/user-not-found") {
        message = "No user found with this email. Please sign up first.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }
      // Alert the user about the error     
      Alert.alert("SignIn Failed!", message, [{ text: "OK" }]);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center px-4 pt-2 pb-4"
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
            <Text className="text-slate-700 font-semibold ml-1">Back</Text>
          </TouchableOpacity>

          <View className="px-5">
            <Text className="text-3xl font-bold text-slate-900">Welcome back</Text>
            <Text className="text-slate-500 mt-2 text-base leading-6">
              Sign in to sync bookings, receipts, and venue updates across devices.
            </Text>

            <View className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mt-8">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSignIn}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
                    <Text className="text-slate-700 font-semibold mb-2">Work email</Text>
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
                    {touched.email && errors.email ? (
                      <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                    ) : null}

                    <Text className="text-slate-700 font-semibold mb-2 mt-5">Password</Text>
                    <TextInput
                      className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 text-base"
                      placeholder="••••••••"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      value={values.password}
                      onBlur={handleBlur("password")}
                    />
                    {touched.password && errors.password ? (
                      <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
                    ) : null}

                    <TouchableOpacity
                      className="bg-teal-600 rounded-2xl py-3.5 mt-6 shadow-sm"
                      onPress={handleSubmit}
                    >
                      <Text className="text-white text-center text-base font-semibold">
                        Sign in
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/(auth)/signup")}
                      className="flex-row flex-wrap justify-center mt-5"
                    >
                      <Text className="text-slate-600">Need an account? </Text>
                      <Text className="text-teal-700 font-semibold">Create one</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>

            {/* <Image
              source={wbimage2}
              className="w-60 h-52 mt-8 rounded-3xl"
              resizeMode="cover"
            /> */}
            {/* Container for centering and responsiveness */}
            <View className="w-full items-center mt-8">
  <Image
    source={wbimage2}
    className="w-full max-w-[380px] h-[260px]"
    resizeMode="contain"
  />
</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}