import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/logo.jpg";
// import { turfs } from "../../store/turfs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../config/firebaseConfig";

// #00BE76
export default function Home() {
  // useEffect(()=>{
  //   uploadData();
  // },[])
  const router=useRouter();
  const [turfs,setTurfs]=useState([]);
  const [userName, setUserName] = useState("Player");

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>router.push(`/turf/${item.name}`)}>
      <Image
        resizeMode="cover" 
        source={{uri:item.image}}
        className="w-screen h-80 mb-5 my-20 self-center mt-0 rounded-lg"
      />
      <View className="flex-row">
        <Text className=" text-black text-xl font-bold mb-2">{item.name}</Text>
        <Text className="text-black text-lg font-bold ml-48 mr-0 mx-28 ">{item.rating}</Text>
         <MaterialIcons  name="star" size={24} color="#facc15" />
      </View>
      <Text className="text-black text-base mb-0">{item.location}</Text>
      <Text className="text-[#00BE76] text-xl  font-semibold mb-10">{item.price}</Text>
    </TouchableOpacity>
  );  
  
  const getTurfs = async () => {
      try {
        const q = query(collection(db, "turfs"));
        const res = await getDocs(q);

        res.forEach((item) => {
          setTurfs((prev)=>[...prev,item.data()]);
        });
      } catch (error) {
        console.error("Error fetching turfs:", error);
      }
    };
  useEffect(() => {
      getTurfs();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      const isGuest = await AsyncStorage.getItem("isGuest");
      if (isGuest === "true" || !email) {
        setUserName("Player");
        return;
      }
      try {
        // Get user UID from email (Firestore users collection uses UID as doc id)
        // let's try to find the user by email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.fullName) {
            // Only use first name
            setUserName(userData.fullName.split(" ")[0]);
          } else {
            setUserName("Player");
          }
        } else {
          setUserName("Player");
        }
      } catch (error) {
        setUserName("Player");
      }
    };
    fetchUserName();
  }, []);



  return (
    <SafeAreaView className="bg-white">
      
      <View className="flex flex-row top-0 h-20 mb-0  justify-start border-b-2 border-[#003427]">
        <Image source={Logo} className="h-14 ml-2 mt-2 w-14 rounded-2xl"/>
        <Text className="ml-4 mt-6 font-bold text-xl text-[#003427]">
          Hello {userName}!
        </Text>
      
      </View>
      {
        turfs.length > 0 ?(
          <FlatList data={turfs}
            renderItem={renderItem} 
            showsVerticalScrollIndicator={false}   
            scrollEnabled={true} contentContainerStyle={{padding:8}}
            
          
          
          />) : (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <ActivityIndicator animating size="large" color="#239B2D" className="mt-96 pt-96 justify-items-center " />
        </View>)
      }
    </SafeAreaView>
  );
}


