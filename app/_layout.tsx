import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { View, ActivityIndicator } from 'react-native'

import { useColorScheme } from '@/hooks/useColorScheme'
import AuthPopup from '@/components/auth/AuthPopup'
import { useAuth } from '@/lib/auth'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

// Create QueryClient outside of component to ensure it's only created once
const queryClient = new QueryClient()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppWithAuth />
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function AppWithAuth() {
  const { user, loading } = useAuth()
    
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    )
  }
  
  // Simplified auth check - just check if user exists and has an ID
  const isAuthenticated = Boolean(user?.id);
    
  // If not authenticated, only show the auth popup
  if (!isAuthenticated) {
    return <AuthPopup />;
  }
  
  // If authenticated, render the app content
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: 'Account' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}