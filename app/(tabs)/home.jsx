import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/logo.jpg";
// import { turfs } from "../../store/turfs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import NearbyTurfs from '../../components/NearbyTurfs'; // adjust path if needed
import { db } from "../../config/firebaseConfig";
import { useAuthStore } from "../../store/authStore";




// #00BE76
export default function Home() {
  // useEffect(()=>{
  //   uploadData();
  // },[])
  const router = useRouter();
  const [turfs, setTurfs] = useState([]);

  // ✅ Pull user from Zustand instead of AsyncStorage
  const user = useAuthStore((state) => state.user);
  const userName = user?.fullName?.split(" ")[0] || "Player";

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/turf/${item.name}`)}>
      <Image
        resizeMode="cover"
        source={{ uri: item.image }}
        className="w-screen h-80 mb-5 my-20 self-center mt-0 rounded-lg"
      />
      <View className="flex-row">
        <Text className=" text-black text-xl font-bold mb-2">{item.name}</Text>
        <Text className="text-black text-lg font-bold ml-48 mr-0 mx-28 ">
          {item.rating}
        </Text>
        <MaterialIcons name="star" size={24} color="#facc15" />
      </View>
      <Text className="text-black text-base mb-0">{item.location}</Text>
      <Text className="text-[#00BE76] text-xl font-semibold mb-10">
        {item.price}
      </Text>
    </TouchableOpacity>
  );

  const getTurfs = async () => {
    try {
      const q = query(collection(db, "turfs"));
      const res = await getDocs(q);

      const turfList = [];
      res.forEach((doc) => {
        turfList.push({ id: doc.id, ...doc.data() });
      });

      setTurfs(turfList);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    }
  };

  useEffect(() => {
    getTurfs();
  }, []);

  return (
    
    <SafeAreaView className="bg-white">
      
      <LinearGradient
        colors={["#003427", "#239B2D"]} // Change colors as you want
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-20 flex flex-row items-center border-b-2 border-[#003427]"
      >
        <Image source={Logo} className="h-14 ml-2 w-14 rounded-2xl" />
        <Text className="ml-4 font-bold text-xl text-white">
          Hello {userName}!
        </Text>
      </LinearGradient>
      <View>

      </View>
     {/* NearbyTurfs fixed height container */}
     <ScrollView>

      <View style={{ height: 260,marginTop:9,backgroundColor:'#FFFFFF' }}>
        <View style={{marginTop:1 ,flexDirection:'row'}}>
          <Text className="ml-3 font-semibold mb-2 text-2xl ">📍</Text>
          <Text className=" font-semibold  text-1xl mt-2">Your NearBy Turfs</Text>

        </View>
        <NearbyTurfs />
      </View>

        {turfs.length > 0 ? (
          <FlatList
            data={turfs}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id} // ✅ unique key from Firestore
            nestedScrollEnabled={true} // <-- Important
            scrollEnabled={false} 
            contentContainerStyle={{ padding: 8 }}
          />
        ) : (    
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            {/* <ActivityIndicator
              animating
              size="large"
              color="#239B2D"
              className="mt-96 pt-96 justify-items-center "
            /> */}
            {/* ✅ Show nearby turfs first */}
          </View>
        )}
     </ScrollView>
    </SafeAreaView>
  );
}













// import { MaterialIcons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Logo from "../../assets/images/logo.jpg";
// // import { turfs } from "../../store/turfs";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { collection, getDocs, query } from "firebase/firestore";
// import { ScrollView } from "react-native-gesture-handler";
// import { db } from "../../config/firebaseConfig";
// import { useAuthStore } from "../../store/authStore";
// import NearbyTurfs from './../../components/NearbyTurfs';


// // #00BE76
// export default function Home() {
//   // useEffect(()=>{
//   //   uploadData();
//   // },[])
//   const router = useRouter();
//   const [turfs, setTurfs] = useState([]);

//   // ✅ Pull user from Zustand instead of AsyncStorage
//   const user = useAuthStore((state) => state.user);
//   const userName = user?.fullName?.split(" ")[0] || "Player";

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => router.push(`/turf/${item.name}`)}>
//       <Image
//         resizeMode="cover"
//         source={{ uri: item.image }}
//         className="w-screen h-80 mb-5 my-20 self-center mt-0 rounded-lg"
//       />
//       <View className="flex-row">
//         <Text className=" text-black text-xl font-bold mb-2">{item.name}</Text>
//         <Text className="text-black text-lg font-bold ml-48 mr-0 mx-28 ">
//           {item.rating}
//         </Text>
//         <MaterialIcons name="star" size={24} color="#facc15" />
//       </View>
//       <Text className="text-black text-base mb-0">{item.location}</Text>
//       <Text className="text-[#00BE76] text-xl font-semibold mb-10">
//         {item.price}
//       </Text>
//     </TouchableOpacity>
//   );

//   const getTurfs = async () => {
//     try {
//       const q = query(collection(db, "turfs"));
//       const res = await getDocs(q);

//       const turfList = [];
//       res.forEach((doc) => {
//         turfList.push({ id: doc.id, ...doc.data() });
//       });

//       setTurfs(turfList);
//     } catch (error) {
//       console.error("Error fetching turfs:", error);
//     }
//   };

//   useEffect(() => {
//     getTurfs();
//   }, []);

//   return (
//     <SafeAreaView className="bg-white">
//       <LinearGradient
//         colors={["#003427", "#239B2D"]} // Change colors as you want
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         className="h-20 flex flex-row items-center border-b-2 border-[#003427]"
//       >
//         <Image source={Logo} className="h-14 ml-2 w-14 rounded-2xl" />
//         <Text className="ml-4 font-bold text-xl text-white">
//           Hello {userName}!
//         </Text>
//       </LinearGradient>
//      <ScrollView>

//       <View style={{ height: 260,marginTop:9,backgroundColor:'#FFFFFF' }}>
//         <View style={{marginTop:1 ,flexDirection:'row'}}>
//           <Text className="ml-3 font-semibold mb-2 text-2xl ">📍</Text>
//           <Text className=" font-semibold  text-1xl mt-2">Your NearBy Turfs</Text>

//         </View>
//          <NearbyTurfs /> 
//       </View>

//         {turfs.length > 0 ? (
//           <FlatList
//             data={turfs}
//             renderItem={renderItem}
//             showsVerticalScrollIndicator={false}
//             keyExtractor={(item) => item.id} // ✅ unique key from Firestore
//             nestedScrollEnabled={true} // <-- Important
//             scrollEnabled={false} 
//             contentContainerStyle={{ padding: 8 }}
//           />
//         ) : (    
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               height: 200,
//             }}
//           >
//             {/* <ActivityIndicator
//               animating
//               size="large"
//               color="#239B2D"
//               className="mt-96 pt-96 justify-items-center "
//             /> */}
//             {/* ✅ Show nearby turfs first */}
//           </View>
//         )}
//      </ScrollView>
//     </SafeAreaView>
//   );
// }
