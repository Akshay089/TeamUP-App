import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";
export default function TabRoot() {
  return (
    <Tabs  screenOptions={{ tabBarActiveTintColor: 'green'}}>
        <Tabs.Screen name="home" 
        options={{
            title: "Home",
            headerShown:false,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color}/>,
            tabBarLabelStyle: {
              fontWeight: 'bold', // Make label bold
            },

         }}/>
        <Tabs.Screen name="bookings"
        options={{
            title:"Bookings",
            headerShown:false,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={color} />,  
            tabBarLabelStyle: {
              fontWeight: 'bold', // Make label bold
            },  
          }}/>
        <Tabs.Screen name="profile" 
        options={{
          title:"Profile",
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,    
          tabBarLabelStyle: {
            fontWeight: 'bold', // Make label bold
          },  
        }}/>
        
    </Tabs>
  );
}
