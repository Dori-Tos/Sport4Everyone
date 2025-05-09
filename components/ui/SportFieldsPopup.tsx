import React, { useState } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, FlatList, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMutation } from '@tanstack/react-query'

import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useAuth } from '@/lib/auth'
import { addReservation } from '@/lib/reservations'
import { SportFieldsItem } from '@/components/typing/Items'

type SportFieldsPopupProps = {
  data: Array<SportFieldsItem>
  centerName: string | undefined
  centerId: number | undefined
  onClose: () => void
}

export default function SportFieldsPopup({ data, centerName, centerId, onClose }: SportFieldsPopupProps) {
  const { user } = useAuth()
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000)) // +1 hour
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null)
  const [selectedFieldPrice, setSelectedFieldPrice] = useState<number>(0)

  // Mutation for adding a reservation
  const { mutate: saveReservation, isPending } = useMutation({
    mutationFn: addReservation,
    onSuccess: () => {
      onClose()
    }
  })

  // Calculate duration in hours between start and end time
  const calculateDuration = () => {
    const durationMs = endTime.getTime() - startTime.getTime()
    return Math.max(1, Math.round(durationMs / (1000 * 60 * 60)))
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString()
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) setDate(selectedDate)
  }

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios')
    if (selectedTime) setStartTime(selectedTime)
  }

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios')
    if (selectedTime) setEndTime(selectedTime)
  }

  const handleSaveReservation = () => {
    if (!user?.id || !centerId || !selectedFieldId) return
    
    // Combine date and time
    const startDateTime = new Date(date)
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes())
    
    saveReservation({
      userID: user.id,
      sportsCenterID: centerId,
      sportFieldID: selectedFieldId,
      startDateTime: startDateTime.toISOString(),
      duration: calculateDuration(),
      price: selectedFieldPrice * calculateDuration(),
    })
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Sport Fields for {centerName}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.closeButton}>Close</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Reservation</ThemedText>
          
          {/* Date and Time Selection */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Select Date:</ThemedText>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText>{formatDate(date)}</ThemedText>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <ThemedText style={styles.label}>Start Time:</ThemedText>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowStartTimePicker(true)}
              >
                <ThemedText>{formatTime(startTime)}</ThemedText>
              </TouchableOpacity>
              
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={handleStartTimeChange}
                />
              )}
            </View>
            
            <View style={styles.timeInput}>
              <ThemedText style={styles.label}>End Time:</ThemedText>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <ThemedText>{formatTime(endTime)}</ThemedText>
              </TouchableOpacity>
              
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={handleEndTimeChange}
                />
              )}
            </View>
          </View>

          {/* Sport Fields List */}
          <View style={styles.fieldsContainer}>
            <View style={styles.tableHeader}>
              <View style={styles.radioCol}></View>
              <ThemedText style={styles.nameCol}>Field Name</ThemedText>
              <ThemedText style={styles.priceCol}>Price</ThemedText>
            </View>
            
            {data.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.tableRow}
                    onPress={() => {
                      setSelectedFieldId(item.id)
                      setSelectedFieldPrice(parseFloat(item.price))
                    }}
                  >
                    <View style={styles.radioCol}>
                      <View style={styles.radioOuter}>
                        {selectedFieldId === item.id && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    <ThemedText style={styles.nameCol}>{item.name}</ThemedText>
                    <ThemedText style={styles.priceCol}>{item.price}€/h</ThemedText>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <ThemedText style={styles.noFieldsText}>No sport fields available.</ThemedText>
            )}
          </View>

          {/* Reservation Summary */}
          {selectedFieldId !== null && (
            <View style={styles.summary}>
              <ThemedText type="defaultSemiBold">Reservation Summary</ThemedText>
              <ThemedText>Date: {formatDate(date)}</ThemedText>
              <ThemedText>Time: {formatTime(startTime)} to {formatTime(endTime)}</ThemedText>
              <ThemedText>Duration: {calculateDuration()} hour(s)</ThemedText>
              <ThemedText>Total Price: {(selectedFieldPrice * calculateDuration()).toFixed(2)}€</ThemedText>
            </View>
          )}

          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!user?.id || !centerId || !selectedFieldId || isPending) && styles.disabledButton
            ]}
            onPress={handleSaveReservation}
            disabled={!user?.id || !centerId || !selectedFieldId || isPending}
          >
            <ThemedText style={styles.saveButtonText}>
              {isPending ? 'Saving...' : 'Save Reservation'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    color: 'red',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInput: {
    width: '48%',
  },
  fieldsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
    maxHeight: 150,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  radioCol: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#0a7ea4',
  },
  nameCol: {
    width: '60%',
  },
  priceCol: {
    width: '30%',
    textAlign: 'right',
  },
  noFieldsText: {
    padding: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#888',
  },
  summary: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})