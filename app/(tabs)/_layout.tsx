import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/ui/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import CustomHeader from '@/components/ui/CustomHeader'
import { useAuth } from '@/lib/auth'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { user } = useAuth()
  const isAdmin = user?.administrator == true
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        header: () => <CustomHeader showProfileButton={true} />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="people" color={color} />,
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="sportFields"
          options={{
            title: 'Sport Fields',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="sportscourt" color={color} />,
          }}
        />
      )}
    </Tabs>
  )
}