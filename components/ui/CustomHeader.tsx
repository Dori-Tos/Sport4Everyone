import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CustomHeader() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <TouchableOpacity onPress={() => navigation.navigate('account')}>
        <IconSymbol name="person.fill" size={28} color={Colors[colorScheme ?? 'light'].tint} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>{route.name}</Text>
      <View style={styles.placeholder} />
    </View>
  );
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  placeholder: {
    width: 28, // Same width as the IconSymbol to balance the layout
  },
});