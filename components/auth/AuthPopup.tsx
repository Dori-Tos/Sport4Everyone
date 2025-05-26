import React, { useState } from 'react'
import { View } from 'react-native'
import LoginPopup from './LoginPopup'
import RegisterPopup from './RegisterPopup'
import { ThemedView } from '@/components/ui/ThemedView'

export default function AuthPopup() {
  const [showLogin, setShowLogin] = useState(true)
  
  return (
    <ThemedView 
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
    >
      <View style={{ width: '90%', maxWidth: 400, borderRadius: 8, overflow: 'hidden' }}>
        {showLogin ? (
          <LoginPopup 
            onSwitchToSignUp={() => setShowLogin(false)} 
          />
        ) : (
          <RegisterPopup 
            onSwitchToLogin={() => setShowLogin(true)} 
          />
        )}
      </View>
    </ThemedView>
  )
}