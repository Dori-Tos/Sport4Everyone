import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'

import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const columns = ["Date", "Duration", "Sports Center", "Sport Field", "Price"]

type ReservationsTableProps = {
  reservations: Array<any>
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map(column => (
        <ThemedText key={column} style={styles.headerCell}>{column}</ThemedText>
      ))}
    </View>
  )

  const renderRow = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <ThemedText style={styles.cell}>{formatDate(item.date)}</ThemedText>
      <ThemedText style={styles.cell}>{item.duration} hour(s)</ThemedText>
      <ThemedText style={styles.cell}>{item.sportsCenter?.name || "N/A"}</ThemedText>
      <ThemedText style={styles.cell}>{item.sportField?.name || "N/A"}</ThemedText>
      <ThemedText style={styles.cell}>{item.price}€</ThemedText>
    </View>
  )

  return (
    <ThemedView style={styles.container}>
      {reservations.length > 0 ? (
        <View style={styles.table}>
          {renderHeader()}
          <FlatList
            data={reservations}
            renderItem={renderRow}
            keyExtractor={(item, index) => `reservation-${item.id || index}`}
            scrollEnabled={false} // Use parent ScrollView for scrolling
          />
        </View>
      ) : (
        <ThemedView style={styles.noDataContainer}>
          <ThemedText style={styles.noDataText}>No reservations found.</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  noDataContainer: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  noDataText: {
    color: '#888',
  },
})