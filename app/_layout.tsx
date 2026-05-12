import { Stack } from 'expo-router';
import React from 'react';
import { AppProvider } from '../components/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(tabs)" /> 
        <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
        {/* Naya Checkout Screen */}
        <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
      </Stack>
    </AppProvider>
  );
}
