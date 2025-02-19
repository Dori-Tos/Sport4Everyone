import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { getSports, type Sport } from '@/lib/sports';

export default function HomeScreen() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');

  useEffect(() => {
    async function fetchSports() {
      const sportsData = await getSports();
      setSports(sportsData);
    }
    fetchSports();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <View style={styles.row}>
          <ThemedText type="subtitle">Select a Sport</ThemedText>
          <Picker
            selectedValue={selectedSport}
            onValueChange={(itemValue) => setSelectedSport(itemValue)}
            style={styles.picker}
          >
            {sports.map((sport) => (
              <Picker.Item key={sport.id} label={sport.name} value={sport.id} />
            ))}
          </Picker>
        </View>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sport Fields</ThemedText>
        {/* <FlatList
          data={sports.find(sport => sport.id === selectedSport)?.fields || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <ThemedText>{item.name}</ThemedText>
              <ThemedText>{item.location}</ThemedText>
            </View>
          )}
        /> */}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  picker: {
    height: 50,
    width: '70%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});