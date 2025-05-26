import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useQuery } from '@tanstack/react-query'

import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'
import { getSports } from '@/lib/sports'
import { getSportsCentersBySport } from '@/lib/sportsCenter'
import { getReservationsByUser } from '@/lib/reservations'
import { useAuth } from '@/lib/auth'
import SportTable from '@/components/pages/SportTable'
import ReservationsTable from '@/components/pages/ReservationsTable'
import ReservationPopup from '@/components/pages/ReservationsPopup'

export default function HomeScreen() {
  const { user } = useAuth()
  const [selectedSport, setSelectedSport] = useState("football")
  const [error, setError] = useState<string | null>(null)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null)
  
  // Fetch sports data
  const { 
    data: sports, 
    isLoading: sportsLoading 
  } = useQuery({
    queryKey: ['sports'],
    queryFn: getSports
  })
  
  // Fetch sports centers based on selected sport
  const { 
    data: sportsCenters, 
    isLoading: centerLoading,
    error: centerError
  } = useQuery({
    queryKey: ['sportsCenters', selectedSport],
    queryFn: () => getSportsCentersBySport(selectedSport)
  })

  // Handle errors from the sports centers query
  useEffect(() => {
    if (centerError) {
      console.error("Query error:", centerError);
      setError(`Failed to load sports centers: ${(centerError as Error).message}`);
    }
  }, [centerError]);
  
  const { 
    data: userReservations, 
    isLoading: reservationsLoading 
  } = useQuery({
    queryKey: ['reservations', user?.id],
    queryFn: () => getReservationsByUser(user?.id)
  })

  // Transform data for the sport table - safely handle non-array data
  const sportsTableData = Array.isArray(sportsCenters) 
    ? sportsCenters.map((center) => ({
        id: center.id,
        "Sports Center": center.name,
        "Location": center.location,
        "Opening Time": center.openingTime,
        "Attendance": center.attendance.toString(),
      })) 
    : [];
  
  // Handle sports center selection
  const handleSelectCenter = (centerId: number) => {
    setSelectedCenterId(centerId);
  }

  // Wait for the selected center ID to be set before showing the popup
  useEffect(() => {
    if (selectedCenterId !== null) {
      setIsPopupVisible(true);
    }
  }, [selectedCenterId])
  
  // Close the popup
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedCenterId(null);
  };
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="title" style={styles.header}>Sports Centers</ThemedText>
        
        {/* Sport Selector */}
        <View style={styles.selectorContainer}>
          <ThemedText style={styles.label}>Sports Centers List</ThemedText>
          <View style={styles.pickerContainer}>
            <ThemedText style={styles.pickerLabel}>Select Sport:</ThemedText>
            {sportsLoading ? (
              <ActivityIndicator size="small" color="#0a7ea4" />
            ) : (
              <Picker
                selectedValue={selectedSport}
                onValueChange={(value) => setSelectedSport(value)}
                style={styles.picker}
                dropdownIconColor="#0a7ea4"
              >
                {sports?.map((sport) => (
                  <Picker.Item key={sport.id} label={sport.name} value={sport.name} />
                ))}
              </Picker>
            )}
          </View>
        </View>
        
        {/* Show errors if any */}
        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}
        
        {/* Sport Centers Table */}
        {centerLoading ? (
          <ActivityIndicator size="large" color="#0a7ea4" style={styles.loader} />
        ) : (
          <>
            <ThemedText style={styles.tableHint}>Tap on a sports center to make a reservation</ThemedText>
            <SportTable 
              data={sportsTableData} 
              onSelectCenter={handleSelectCenter}
            />
          </>
        )}
        
        {/* Reservations Section */}
        <ThemedText type="subtitle" style={styles.subHeader}>Reservations</ThemedText>
        {reservationsLoading ? (
          <ActivityIndicator size="large" color="#0a7ea4" style={styles.loader} />
        ) : (
          <ReservationsTable reservations={userReservations || []} />
        )}
        
        {/* Reservation Popup */}
        <ReservationPopup 
          isVisible={isPopupVisible}
          onClose={handleClosePopup}
          sportsCenterId={selectedCenterId ?? 0}
        />
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  subHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 4,
  },
  pickerLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  picker: {
    width: 150,
    height: 40,
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#b71c1c',
  },
  tableHint: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
})