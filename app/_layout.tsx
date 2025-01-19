import React, { useState } from 'react';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, Text, Button, Alert } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [modalVisible, setModalVisible] = useState(true);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleCloseActionSheet = () => {
    setActionSheetVisible(false);
  };

  const handleDeleteConfirm = () => {
    // Implement delete confirmation logic here
    Alert.alert('Delete Confirmed', 'The item has been deleted.');
    handleCloseActionSheet();
  };

  if (!loaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <GluestackUIProvider mode="light">
        <ThemeProvider value={DefaultTheme}>
          <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false, animation: 'none' }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="viewTask" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    </ActionSheetProvider>
  );
}
