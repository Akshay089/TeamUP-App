import { useRouter } from "expo-router";
import { Formik } from 'formik';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import wbimage2 from '../../assets/images/wbimage2.png';
import validationSchema from '../../utils/authSchema';

export default function signin() {
  const handleSignIn=()=>{};
  const router=useRouter();
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

