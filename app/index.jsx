import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/teamup.png";

export default function Index() {
  const router=useRouter();
  return (
    <SafeAreaView className="bg-[#003427]">
      <ScrollView contentContainerStyle={{height:"100%"}} >
        <View className="m-2 flex justify-center items-center">
          
          <Image source={logo} style={{width:350,height:350}}/>
          
          <View className="w-3/4">
              {/* <Text className=" flex justify-center text-light-background ">
                  GEAR UP THE GAME!!!
              </Text> */}
              <TouchableOpacity onPress={()=>router.push("/signup")} className="p-2 my-2 bg-white rounded-lg border-white">
                <Text className="text-xl font-semibold text-center text-green-600">
                  Sign up
                </Text>
              </TouchableOpacity>
              
              {/* Here we push home which is not allowed to do this in this way */}
              <TouchableOpacity onPress={()=>router.push("/home")} className="p-2 my-2 bg-green-600 rounded-lg border-white"> 
                <Text className="text-xl font-semibold text-center text-white">
                  Guest User
                </Text>
              </TouchableOpacity>
          </View>
          
          
          {/* If user want to login/signin,following is the code */}
          <View>
            <Text className="text-center text-base font-semibold my-4 text-green-500">
                <View className="border-b-2 border-white p-2 mb-1 w-24"/>or{""}
                 <View className="border-b-2 border-white p-2 mb-1 w-24"/>
            </Text>
          </View>
          
          
          <Text className="text-white font-semibold">Already a User? </Text>          
          <TouchableOpacity onPress={()=>router.push("/signin")} className="flex flex-row items-center"> 
                <Text className="text-base font-semibold underline text-white p-1">
                    Sign in
                </Text>
          </TouchableOpacity>
          <View>
           
          </View>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
