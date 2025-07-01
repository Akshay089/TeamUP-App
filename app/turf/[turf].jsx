import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePickerComponent from '../../components/layout/turf/DatePickerComponent';
import FindSlot from '../../components/layout/turf/FindSlot';
import HoursPickerComponent from '../../components/layout/turf/HoursPickerComponent';
import { db } from "../../config/firebaseConfig";



export default function Turf(){
  const amenityIcons = {
    Parking: { name: "car", family: "FontAwesome5" },
    Showers: { name: "shower", family: "FontAwesome5" },
    Lighting: { name: "bulb", family: "Ionicons" },
    Washroom: { name: "restroom", family: "FontAwesome5" },
    "Drinking Water": { name: "water", family: "Ionicons" },
    Seating: { name: "chair", family: "MaterialIcons" },
    "First Aid": { name: "medkit", family: "Ionicons" },
    WiFi: { name: "wifi", family: "Ionicons" },
    AC: { name: "snow", family: "Ionicons" },
    Lockers: { name: "lock-closed", family: "Ionicons" },
    "Changing Room": { name: "shirt", family: "Ionicons" },
    Refreshments: { name: "cafe", family: "Ionicons" },
    Music: { name: "musical-notes", family: "Ionicons" },
    "CCTV Surveillance": { name: "videocam", family: "Ionicons" },
    Scoreboard: { name: "stats-chart", family: "Ionicons" },
    "Pro Shop": { name: "store", family: "MaterialIcons" },
    Café: { name: "cafe", family: "Ionicons" },
    Cafe: { name: "cafe", family: "Ionicons" },
  };

  const renderAmenityIcon = (amenity) => {
    const icon = amenityIcons[amenity];
    if (!icon) return null;

    const { name, family } = icon;
    switch (family) {
      case 'Ionicons':
        return <Ionicons name={name} size={14} color="white" className="mr-1" />;
      case 'FontAwesome5':
        return <FontAwesome5 name={name} size={14} color="white" className="mr-1" />;
      case 'MaterialIcons':
        return <MaterialIcons name={name} size={14} color="white" className="mr-1" />;
      default:
        return null;
    }
  };
  const {turf}=useLocalSearchParams();
  const flatListRef=useRef(null);
  const windowWidth=Dimensions.get("window").width;//It gives an exact width of images which are in the firestore
  
  const [turfData,setTurfData]=useState({});
  const [currentIndex,setCurrentIndex]=useState(0);
  const [carouselData,setCarouselData]=useState({});
  const [slotsData,setSlotsData]=useState({});
   const [date, setDate] = useState(new Date());
   const [selectedNumber, setSelectedNumber] = useState(1);
   const [selectedSlot, setSelectedSlot] = useState(null);


  const handleNextImage=()=>{
     const carouselLength=carouselData[0]?.images.length;
     if(currentIndex < carouselLength-1){
      const nextIndex =currentIndex+1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({index:nextIndex,animated:true});
     }

     if(currentIndex == carouselLength -1){
      const nextIndex =0;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({index:nextIndex,animated:true});
     }
  };
  const handlePrevImage=()=>{
     const carouselLength=carouselData[0]?.images.length;
     if(currentIndex>0){
      const prevIndex =currentIndex-1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({index:prevIndex,animated:true});
     }

     if(currentIndex == 0){
      const prevIndex = carouselLength-1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({index:prevIndex,animated:true});
     }
  };

  const carouselItem=({item})=>{
    return(
      <View style={{width:windowWidth-2}} className="h-64 relative">
       

        <View style={{position:"absolute",top:"42%",backgroundColor: "rgba(255,255,255,0.5)",borderRadius:25,padding: 8,zIndex:10,right:"6%"}}>
            <Ionicons onPress={handleNextImage}  name="arrow-forward" size={24} color="black" />
        </View>

        <View style={{position:"absolute",top:"42%",backgroundColor: "rgba(255,255,255,0.5)",borderRadius:25,padding: 8,zIndex:10,left:"2.5%"}}>
            <Ionicons onPress={handlePrevImage}  name="arrow-back" size={24} color="black" />
        </View>

        <View style={{position:"absolute",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"row",left:"50%",transform:[{translateX:-50}],zIndex:10,bottom:15}}>

          {
            carouselData[0].images.map((_,i)=>(
              <View key={i} className={`bg-white h-2 w-2 ${i==currentIndex && "h-3.5 w-3.5"}  p-1 ml-5 mx-1 justify-items-center rounded-full`}/>
            ))
          }
        </View>


      {/* here we can also add the opacity:0.5 */}
      
        <Image source={{uri:item}} style={{backgroundColor:"black",marginRight:20,marginLeft:5,borderRadius:25}} className="h-64 "/>     
        
    
      </View>
    );
  }

  
  const getTurfData=async()=>{
    try {
          const turfQuery = query(collection(db, "turfs"),where("name","==",turf) );
          const turfSnapshot = await getDocs(turfQuery);

          if(turfSnapshot.empty){
            console.log("No matching turf found");
            return;
          }

          for(const doc of turfSnapshot.docs){
              const turfData=doc.data();
              setTurfData(turfData);

              const carouselQuery=query(collection(db,"carouselImages"),where("res_id","==",doc.ref));
              const carouselSnapshot = await getDocs(carouselQuery);//Snapshot means collecting data from the fired query
              if(carouselSnapshot.empty){
                  console.log("No matching Carousel found");
                  return;
              }  
                const carousel=[];
                carouselSnapshot.forEach((carouselDoc)=>{     
                    carousel.push(carouselDoc.data());
                })
                setCarouselData(carousel);

              const slotsQuery=query(collection(db,"slots"),where("ref_id","==",doc.ref));
              const slotsSnapshot = await getDocs(slotsQuery);
              
              if(slotsSnapshot.empty){
                  console.log("No matching Slots found");
                  return;
              }  
                const slots=[];
                slotsSnapshot.forEach((slotDoc)=>{
                    slots.push(slotDoc.data());
                })
                setSlotsData(slots[0]?.slot);
                // await getTurfData();
            }//End of for loop
     }//End of try...
    catch (error) {
       console.error("Error fetching turfs:", error);
    }
 };//end of getTurfs()
// console.log(slotsData[0]?.slot);
 useEffect(() => {
  let turfUnsubscribe = null;
  let carouselUnsubscribe = null;
  let slotsUnsubscribe = null;

  const turfQuery = query(collection(db, "turfs"), where("name", "==", turf));
  turfUnsubscribe = onSnapshot(turfQuery, (turfSnapshot) => {
    if (turfSnapshot.empty) {
      console.log("No matching turf found");
      setTurfData({});
      setCarouselData({});
      setSlotsData({});
      return;
    }
    for (const doc of turfSnapshot.docs) {
      const turfData = doc.data();
      setTurfData(turfData);
      // console.log("Turf doc.ref.path:", doc.ref.path); // Log turf doc ref path

      // Listen for carousel images in real-time
      const carouselQuery = query(collection(db, "carouselImages"), where("res_id", "==", doc.ref));
      if (carouselUnsubscribe) carouselUnsubscribe();
      carouselUnsubscribe = onSnapshot(carouselQuery, (carouselSnapshot) => {
        if (carouselSnapshot.empty) {
          setCarouselData({});
        } else {
          const carousel = [];
          carouselSnapshot.forEach((carouselDoc) => {
            const data = carouselDoc.data();
            // if (data.res_id && data.res_id.path) {
            //   console.log("Carousel res_id path:", data.res_id.path);
            // } else {
            //   console.log("Carousel res_id:", data.res_id);
            // }
            // console.log("Carousel images:", data.images);
            carousel.push(data);
          });
          setCarouselData(carousel);
        }
      });

      // Listen for slots in real-time
      const slotsQuery = query(collection(db, "slots"), where("ref_id", "==", doc.ref));
      if (slotsUnsubscribe) slotsUnsubscribe();
      slotsUnsubscribe = onSnapshot(slotsQuery, (slotsSnapshot) => {
        if (slotsSnapshot.empty) {
          setSlotsData({});
        } else {
          const slots = [];
          slotsSnapshot.forEach((slotDoc) => {
            slots.push(slotDoc.data());
          });
          setSlotsData(slots);
        }
      });
    }
  });

  return () => {
    if (turfUnsubscribe) turfUnsubscribe();
    if (carouselUnsubscribe) carouselUnsubscribe();
    if (slotsUnsubscribe) slotsUnsubscribe();
  };
}, [turf]);
 


  return (
    <SafeAreaView>
        <View className="flex border-b-2 border-[#003427]">
            <Text className=" text-[#239B2D] text-2xl font-bold ml-3 mb-4 mt-3 ">{turf}</Text>
        </View>
         

        <View className="h-64 max-w-[98%] mx-2 mt-6 ml-2 rounded-[25px]">
            <FlatList
                ref={flatListRef}
                data={carouselData[0]?.images}
                renderItem={carouselItem}
                horizontal
                scrollEnabled={false}
                style={{borderRadius:25}}
                showsHorizontalScrollIndicator={false}
            />
        </View>
   
      <View className="flex flex-row ml-2 mt-4">
        <Ionicons
            name="location-sharp"
            size={28}
            color="#239B2D"
        />
        <Text className="max-w-[75%] text-black mt-1 font-medium">
          {turfData?.location}|{"        "}
        </Text>
        <Text className="text-black text-lg font-bold ml-47.5 mr-0 mx-28 ">{turfData?.rating}</Text>
         <MaterialIcons  name="star" size={24} color="#facc15" />
      </View>

      <View className="mt-2 px-4">
        <View className="flex-row flex-wrap gap-2 ml-1 mt-1">
          <Text className="text-black font-bold mb-1">Amenities :</Text>
          {/* <Ionicons name={icons[item]} size={16} color="white" className="mr-1" /> */}
          {turfData?.amenities?.map((item, index) => (
            <View key={index} className="bg-[#239B2D] px-3 py-1 rounded-full flex-row items-center space-x-1">
              {renderAmenityIcon(item)}
              <Text className="text-white text-sm">{item}</Text>
            </View>
          ))}
        </View>
        <View className="border-2 rounded-xl border-[#239B2D] mt-5">
          
          <DatePickerComponent date={date} setDate={setDate}/>
          
          <HoursPickerComponent selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber}/>
        </View>
      </View>
      <View>
        <FindSlot 
          name={turfData?.name}
          location={turfData?.location}
          price={turfData?.price}
          turf={turf}
          date={date}
          selectedNumber={selectedNumber}
          slots={slotsData} 
          selectedSlot={selectedSlot} 
          setSelectedSlot={setSelectedSlot}
        />
    
      </View>
          
    </SafeAreaView>
  );
}