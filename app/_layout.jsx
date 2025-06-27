import { Stack } from "expo-router";
import '../config/nativewind-setup';
import './globals.css';

export default function RootLayout() {
    return(
      <Stack screenOptions={{ 
            headerShown: false
          }} >

        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false
          }} 
        /> 
        
      </Stack>
    );
}
