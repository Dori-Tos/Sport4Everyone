import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { SportsCenterItem } from '../typing/Items';

type SportTableProps = {
  data: Array<SportsCenterItem>;
  onSelectCenter: (centerId: number) => void;
};

export default function SportTable({ data, onSelectCenter }: SportTableProps) {
  if (!data || data.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.noDataText}>No data available</ThemedText>
      </ThemedView>
    );
  }

  // Extract headers from the first item
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  
  // Debug function to handle center selection
  const handleCenterPress = (item: SportsCenterItem) => {
    if (onSelectCenter) {
      onSelectCenter(item.id);
    } else {
      console.warn('onSelectCenter prop is not defined');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Table Header */}
          <View style={styles.headerRow}>
            {headers.map((header, index) => (
              <ThemedView key={index} style={styles.headerCell}>
                <ThemedText style={styles.headerText}>{header}</ThemedText>
              </ThemedView>
            ))}
          </View>
          
          {/* Table Rows */}
          {data.map((sportsCenter) => (
            <TouchableOpacity 
              key={sportsCenter.id} 
              style={styles.dataRow}
              onPress={() => onSelectCenter(sportsCenter.id)}
              activeOpacity={0.7}
            >
              {headers.map((header, colIndex) => (
                <ThemedView key={colIndex} style={styles.dataCell}>
                  <ThemedText>{sportsCenter[header]}</ThemedText>
                </ThemedView>
              ))}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  headerCell: {
    padding: 10,
    width: 120,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontWeight: 'bold',
  },
  dataRow: {
    flexDirection: 'row',
  },
  dataCell: {
    padding: 10,
    width: 120,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  noDataText: {
    padding: 16,
    textAlign: 'center',
  },
});