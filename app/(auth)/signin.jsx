import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Formik } from 'formik';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import wbimage2 from '../../assets/images/wbimage2.png';
import { auth, db } from "../../config/firebaseConfig";
import { useAuthStore } from '../../store/authStore';
import validationSchema from '../../utils/authSchema';


export default function signin() {
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
      const userDoc=await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        // Store user email in AsyncStorage 
      // ✅ Store in Zustand global state
        const userData = {
          uid: user.uid,
          email: user.email,
          fullName: userDoc.data().fullName || "Player"
        };
        setUser(userData);
        setIsGuest(false);
        
        await AsyncStorage.setItem("userEmail", values.email);
        await AsyncStorage.setItem("isGuest", "false");
        console.log("User data found:", user.uid);
        router.push("/home");
      } else {
        
        alert("User not found", "No user data found for this email.");
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
    <SafeAreaView className="bg-white">
      <ScrollView contentContainerStyle={{height:"100%"}} >
        <View className="justify-center items-center">
          
          <Text className="pt-10 text-4xl font-bold text-center text-[#239B2D] align-text-top ">
            Sign In
          </Text> 
           
          <View className="w-5/6">
              <Formik 
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSignIn}
              >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    // This is email input box
                    <View className="w-full ">
                      <Text className="text-[#239B2D] my-2 text-xl font-semibold mt-20 ">Email</Text>
                      <TextInput
                        className=" h-18 border-green-500 border-2  text-black text-lg text-bold rounded px-6"
                        placeholder="Enter email"
                        keyboardType="email-address"
                        onChangeText={handleChange("email")}
                        value={values.email}
                        onBlur={handleBlur("email")}
                      />

                      {touched.email && errors.email && (
                        <Text className="text-red-500 text-xs mb-2">
                          {errors.email}
                        </Text>
                      )}

                      <Text className="text-[#239B2D] my-1 text-xl font-semibold mt-15 ">Password</Text>
                      <TextInput
                        className=" h-18 border-2 border-green-500 text-black text-lg text-bold rounded px-6"
                        secureTextEntry
                        placeholder="Enter password"
                        onChangeText={handleChange("password")}
                        value={values.password}
                        onBlur={handleBlur("password")}
                      />

                      {touched.password && errors.password && (
                        <Text className="text-red-500 text-xs mb-2">
                          {errors.password}
                        </Text>
                      )}

                      <TouchableOpacity
                          className="bg-[#239B2D] rounded-xl py-3 mt-4"
                          onPress={handleSubmit}
                        >
                            <Text className="text-white text-center text-lg font-semibold">Sign in</Text>
                      </TouchableOpacity>
                      
                          <TouchableOpacity onPress={()=>router.push("/signup")} className="flex flex-row items-center justify-center mt-4"> 
                                <Text className="text-[#239B2D]  font-semibold">Don't have an account?</Text> 
                                <Text className="text-base font-semibold underline text-[#239B2D]  p-1">
                                    Sign up
                                </Text>
                          </TouchableOpacity>
                       <Image source={wbimage2} className="w-screen h-80 mt-30 my-20 self-center"/>
                   
                    </View>
                  )}
                 
              </Formik>

          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}