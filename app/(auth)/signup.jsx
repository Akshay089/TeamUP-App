import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Formik } from 'formik';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import wbimage2 from '../../assets/images/wbimage2.png';
// import app from "../../config/firebaseConfig"; // adjust the path as needed
// import { auth } from "../../config/firebaseConfig"; // use this!
import validationSchema from '../../utils/authSchema';
import { app } from './../../config/firebaseConfig';


export default function signup() {
  const router=useRouter();
  const db = getFirestore(app); // link Firestore to the app
  // const auth = getAuth(app);


const handleSignUp = async (values) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, //  use pre-initialized auth
      values.email,
      values.password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: values.email,
      createdAt: new Date(),
    });

    console.log("Signup successful:", user.email);

    await AsyncStorage.setItem("userEmail", values.email);
    await AsyncStorage.setItem("isGuest", "false");

    router.push("/home");
  } catch (error) {
    console.log("SignUp error", error);
  }

};

  return (
    <SafeAreaView className="bg-white">
      <ScrollView contentContainerStyle={{height:"100%"}} >
        <View className="justify-center items-center">
          
          <Text className="pt-10 text-4xl font-bold text-center text-[#239B2D] align-text-top ">
            Sign Up
          </Text> 
           
          <View className="w-5/6">
              <Formik 
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSignUp}
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
                            <Text className="text-white text-center text-lg font-semibold">Signup</Text>
                      </TouchableOpacity>
                      
                          <TouchableOpacity onPress={()=>router.push("/signin")} className="flex flex-row items-center justify-center mt-4"> 
                                <Text className="text-[#239B2D]  font-semibold">Already a User? </Text> 
                                <Text className="text-base font-semibold underline text-[#239B2D]  p-1">
                                    Sign in
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

