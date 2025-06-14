import React, { useEffect, useMemo, useState } from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'
import { addReservation } from '@/lib/reservations'
import { getSportsCenter } from '@/lib/sportsCenter'
import { useAuth } from '@/lib/auth'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { getSportFieldsBySportsCenter } from '@/lib/sportFields'
import { IconSymbol } from '../ui/IconSymbol'
import { set } from 'zod'

type ReservationPopupProps = {
  isVisible: boolean
  onClose: () => void
  sportsCenterId: number
}

export default function ReservationPopup({ isVisible, onClose, sportsCenterId }: ReservationPopupProps) {
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const queryClient = useQueryClient();
  
  // Form state
  const [selectedCenterId, setSelectedCenterId] = useState<number>(sportsCenterId);
  const [sportFieldId, setSportFieldId] = useState<number>(-1);
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(1); // hours
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sportsCenterId) {
      setSelectedCenterId(sportsCenterId)
    }
  }, [sportsCenterId]);

  // Fetch sports center details when a center is selected
  const { data: selectedCenter, isLoading: centerDetailsLoading } = useQuery({
    queryKey: ['getSportsCenter'],
    queryFn: () => selectedCenterId ? getSportsCenter(selectedCenterId) : null,
    enabled: !!selectedCenterId,
  })

  const { data: selectedSportFields, isLoading: sportFieldsLoading } = useQuery({
    queryKey: ['GetSportFields'],
    queryFn: () => selectedCenterId ? getSportFieldsBySportsCenter(selectedCenterId) : null,
    enabled: !!selectedCenterId,
  })

  // When estimated is called, it will calculate the estimated price based on the selected sport field and duration
  useEffect(() => {    
    if (!selectedSportFields || sportFieldId === -1) {
      setEstimatedPrice(0)
      return;
    }
  
    const fieldIdNumber = Number(sportFieldId)
    const selectedField = selectedSportFields.find(field => Number(field.id) === fieldIdNumber)
    
    const fieldPrice = selectedField?.price || 0
    
    const calculatedPrice = fieldPrice * duration
    
    setEstimatedPrice(calculatedPrice)
  }, [sportFieldId, duration, selectedSportFields])

  const { mutate: createReservation, isPending } = useMutation({
    mutationFn: addReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetReservations'] })
      onClose()
    },
    onError: (error) => {
      setError(`Failed to create reservation: ${error.message}`)
    }
  })

  // Handle form submission
  const handleSubmit = () => {
    if (!user?.id || !selectedCenterId || sportFieldId === -1) {
      setError('Please complete all required fields');
      return;
    }

    const startDateTime = date.toISOString();

    createReservation({
      userID: user.id,
      sportsCenterID: selectedCenterId,
      sportFieldID: sportFieldId,
      startDateTime,
      duration,
      price: estimatedPrice,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <IconSymbol name="xmark" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
          
          <ThemedText type="title" style={styles.title}>New Reservation</ThemedText>
          
          {/* Sports Center Info */}
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Sports Center:</ThemedText>
            {centerDetailsLoading ? (
              <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
            ) : (
              <ThemedText style={styles.centerName}>
                {selectedCenter?.name || "Loading..."}
              </ThemedText>
            )}
          </ThemedView>
          
          {/* Sport Field Selector */}
          {selectedCenterId && (
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Sport Field:</ThemedText>
              {centerDetailsLoading ? (
                <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={sportFieldId}
                    onValueChange={(value) => setSportFieldId(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a sport field" value={-1} /> 
                    {selectedSportFields?.map((field) => (
                      <Picker.Item key={field.id} label={field.name} value={field.id} />
                    ))}
                  </Picker>
                </View>
              )}
            </ThemedView>
          )}
          
          {/* Date Selector */}
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Date & Time:</ThemedText>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText>
                {date.toLocaleString()}
              </ThemedText>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </ThemedView>
          
          {/* Duration Selector */}
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Duration (hours):</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={duration}
                onValueChange={setDuration}
                style={styles.picker}
              >
                {[1, 2, 3, 4].map((hours) => (
                  <Picker.Item key={hours} label={`${hours} hour${hours > 1 ? 's' : ''}`} value={hours} />
                ))}
              </Picker>
            </View>
          </ThemedView>
          
          {/* Price Estimate */}
          {sportFieldId && (
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Estimated Price:</ThemedText>
              <ThemedText style={styles.price}>
                ${estimatedPrice.toFixed(2)}
              </ThemedText>
            </ThemedView>
          )}
          
          {/* Error Message */}
          {error && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          )}
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isPending}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.submitButton,
                (!selectedCenterId || sportFieldId === -1) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!selectedCenterId || sportFieldId === -1 || isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Book Now</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  centerName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  errorText: {
    color: '#b71c1c',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    minWidth: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
  },
});