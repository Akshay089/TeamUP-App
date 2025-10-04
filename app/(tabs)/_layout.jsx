


import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();
export const SwipableTabs = withLayoutContext(Navigator);

export default function TabRoot() {
  return (
    <SwipableTabs
      screenOptions={{
        swipeEnabled: true, // 👈 enable swipe
        tabBarShowIcon: true,
        tabBarActiveTintColor: "green",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0, // 👈 move tab bar to bottom
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "green", // active indicator
          height: 0, // hide underline if you want only icons/labels
        },
      }}
    >
      <SwipableTabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <SwipableTabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="calendar" color={color} />
          ),
        }}
      />
      <SwipableTabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </SwipableTabs>
  );
}




// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Tabs } from "expo-router";
// export default function TabRoot() {
//   return (
//     <Tabs  screenOptions={{ tabBarActiveTintColor: 'green',SwipableTabs: true}}>
//         <Tabs.Screen name="home" 
        // options={{
        //     title: "Home",
        //     headerShown:false,
        //     tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color}/>,
        //     tabBarLabelStyle: {
        //       fontWeight: 'bold', // Make label bold
        //     },

        //  }}/>
//         <Tabs.Screen name="bookings"
//         options={{
//             title:"Bookings",
//             headerShown:false,
//             tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={color} />,  
//             tabBarLabelStyle: {
//               fontWeight: 'bold', // Make label bold
//             },  
//           }}/>
//         <Tabs.Screen name="profile" 
//         options={{
//           title:"Profile",
//           headerShown:false,
//           tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,    
//           tabBarLabelStyle: {
//             fontWeight: 'bold', // Make label bold
//           },  
//         }}/>
        
//     </Tabs>
//   );
// }
