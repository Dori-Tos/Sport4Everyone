import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { IconSymbol } from './IconSymbol'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemedText } from '@/components/ui/ThemedText'
import { router } from 'expo-router'

type CustomHeaderProps = {
  showProfileButton?: boolean
  showLogoutButton?: boolean
  onLogout?: () => void
}

export default function CustomHeader({ 
  showProfileButton = true, 
  showLogoutButton = false, 
  onLogout 
}: CustomHeaderProps) {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {showLogoutButton && (
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </TouchableOpacity>
      )}
      
      {showProfileButton && (
          <TouchableOpacity 
            onPress={() => router.push('/account')} // Updated to router.push
            style={styles.accountButton}
          >
            <IconSymbol name="person" size={28} color={Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  accountButton: {
    position: 'absolute',
    right: 16,
  },
  logoutButton: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 4,
    fontSize: 16,
  }
})