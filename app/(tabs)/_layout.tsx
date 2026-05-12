import { Tabs } from 'expo-router';
import { Camera, Map, Store } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#e23744', 
      headerShown: false, 
      tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 }
    }}> 
      <Tabs.Screen 
        name="market" 
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Store color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="sell" 
        options={{ title: 'Sell', tabBarIcon: ({ color }) => <Camera color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ title: 'Radar', tabBarIcon: ({ color }) => <Map color={color} size={24} /> }} 
      />
    </Tabs>
  );
}
