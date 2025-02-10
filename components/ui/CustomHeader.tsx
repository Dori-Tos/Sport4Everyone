import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CustomHeader() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.accountButton}>
        <IconSymbol name="person" size={28} color={Colors[colorScheme ?? 'light'].tint} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  accountButton: {
    position: 'absolute',
    right: 16,
  },
});