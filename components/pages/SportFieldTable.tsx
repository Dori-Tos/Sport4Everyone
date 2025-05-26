import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Picker } from '@react-native-picker/picker'
import { TextInput } from '@/components/ui/TextInput'
import { addSportField, removeSportField } from '@/lib/sportFields'
import { getSport } from '@/lib/sports'

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SportFieldTable({ 
  sportCenters, 
  sportFieldsByCenter, 
  sports,
  onDataChange 
}) {
  // State for collapsible sections
  const [expandedCenterId, setExpandedCenterId] = useState(null)
  const [isAddingFormVisible, setIsAddingFormVisible] = useState(false)
  const [sportNameMapping, setSportNameMapping] = useState({})

  useEffect(() => {
    // Create mapping directly from the sports prop
    const mapping = {};
    
    if (sports && sports.length > 0) {
      // Assuming each sport has id and name properties
      sports.forEach(sport => {
        if (sport && sport.id !== undefined) {
          mapping[sport.id] = sport.name;
        }
      });

      setSportNameMapping(mapping);
    }
  }, [sports]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sportsCenterId: sportCenters.length > 0 ? sportCenters[0].id : '',
    pricePerHour: '',
    sportIds: []
  })

  // Toggle center expansion
  const toggleCenterExpansion = (centerId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCenterId(expandedCenterId === centerId ? null : centerId)
  }

  // Toggle add form visibility
  const toggleAddForm = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAddingFormVisible(!isAddingFormVisible)
    
    // Reset form when opening
    if (!isAddingFormVisible) {
      setFormData({
        name: '',
        sportsCenterId: sportCenters.length > 0 ? sportCenters[0].id : '',
        pricePerHour: '',
        sportIds: []
      })
    }
  }

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle sport selection toggle
  const toggleSportSelection = (sportId) => {
    setFormData(prev => {
      const sportIndex = prev.sportIds.indexOf(sportId)
      
      if (sportIndex > -1) {
        // Remove sport if already selected
        const newSportIds = [...prev.sportIds]
        newSportIds.splice(sportIndex, 1)
        return { ...prev, sportIds: newSportIds }
      } else {
        // Add sport if not selected
        return { ...prev, sportIds: [...prev.sportIds, sportId] }
      }
    })
  }

  // Check if a sport is selected
  const isSportSelected = (sportId) => {
    return formData.sportIds.includes(sportId)
  }

  // Update the handleSubmit function to properly format data before submission

  // Handle submit form
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.sportsCenterId || !formData.pricePerHour || formData.sportIds.length === 0) {
        Alert.alert('Error', 'Please fill in all required fields and select at least one sport')
        return
      }

      // Parse price to ensure it's a valid number
      const priceValue = parseFloat(formData.pricePerHour)

      if (isNaN(priceValue)) {
        Alert.alert('Error', 'Please enter a valid price')
        return
      }

      // Prepare data with correct field names for the API
      const fieldData = {
        name: formData.name,
        price: priceValue,        // Changed from pricePerHour to price to match expected schema
        sports: formData.sportIds // Changed from sportIds to sports to match expected schema
      }
      console.log('Submitting field data:', fieldData, 'to center:', formData.sportsCenterId)

      await addSportField(fieldData, formData.sportsCenterId)
      toggleAddForm() // Close the form
      onDataChange() // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Failed to save sport field')
      console.error(error)
    }
  }

  // Handle field deletion
  const handleDelete = async (fieldId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this sport field?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeSportField(fieldId)
              onDataChange()
            } catch (error) {
              Alert.alert('Error', 'Failed to delete sport field')
              console.error(error)
            }
          }
        },
      ]
    )
  }

  const getFieldSportsNames = (sportIds) => {
    if (!sportIds || sportIds.length === 0) return 'None';

    // Ensure we're working with an array
    const idsArray = Array.isArray(sportIds) ? sportIds : [sportIds];

    // Map IDs to names, handling the case where IDs are objects
    const sportNames = idsArray
      .filter(id => id) // Filter out null/undefined values
      .map(id => {
        // Handle case where id is an object with an 'id' property
        const sportId = typeof id === 'object' && id !== null ? id.id : id;
        return sportNameMapping[sportId] || `Sport ${sportId}`;
      })
      .filter(name => name); // Filter out any empty names
    
    return sportNames.length > 0 ? sportNames.join(', ') : 'None';
  };
  
  
  return (
    <ThemedView style={styles.container}>
      {/* Add Field Button */}
      <Button 
        onPress={toggleAddForm} 
        style={styles.addButton}
        variant="primary"
      >
        {isAddingFormVisible ? 'Cancel' : 'Add New Sport Field'}
      </Button>
      
      {/* Add Field Form */}
      {isAddingFormVisible && (
        <Card style={styles.formCard}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            Add New Sport Field
          </ThemedText>
          
          {/* Field Name */}
          <TextInput
            label="Field Name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Enter field name"
            style={styles.formInput}
          />
          
          {/* Price Per Hour */}
          <TextInput
            label="Price Per Hour (€)"
            value={formData.pricePerHour}
            onChangeText={(text) => handleInputChange('pricePerHour', text)}
            placeholder="0.00"
            keyboardType="numeric"
            style={styles.formInput}
          />
          
          {/* Sports Center Selection */}
          <View style={styles.formField}>
            <ThemedText style={styles.formLabel}>Sports Center:</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.sportsCenterId}
                onValueChange={(value) => handleInputChange('sportsCenterId', value)}
              >
                {sportCenters.map(center => (
                  <Picker.Item key={center.id} label={center.name} value={center.id} />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Sports Multi-Selection */}
          <View style={styles.formField}>
            <ThemedText style={styles.formLabel}>
              Available Sports: <ThemedText style={styles.formHint}>(select at least one)</ThemedText>
            </ThemedText>
            
            <ScrollView 
              style={styles.sportSelectionContainer} 
              nestedScrollEnabled={true}
              contentContainerStyle={styles.sportSelectionContent}
            >
              {sports.map(sport => (
                <TouchableOpacity
                  key={sport.id}
                  style={[
                    styles.sportOption,
                    isSportSelected(sport.id) && styles.selectedSport
                  ]}
                  onPress={() => toggleSportSelection(sport.id)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={isSportSelected(sport.id) ? styles.selectedSportText : {}}>
                    {sport.name}
                  </ThemedText>
                  {isSportSelected(sport.id) && (
                    <Ionicons name="checkmark-circle" size={16} color="#4a90e2" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Submit Button */}
          <Button 
            onPress={handleSubmit} 
            style={styles.submitButton}
            variant="primary"
          >
            Create Field
          </Button>
        </Card>
      )}
      
      {/* Centers and Fields List */}
      <ThemedText type="subtitle" style={styles.listTitle}>
        Your Sports Centers & Fields
      </ThemedText>
      
      {sportCenters.length === 0 ? (
        <ThemedText style={styles.emptyMessage}>
          No sports centers found. Please add sports centers first.
        </ThemedText>
      ) : (
        sportCenters.map(center => (
          <Card key={center.id} style={styles.centerCard}>
            {/* Center Header - Clickable to expand/collapse */}
            <TouchableOpacity 
              style={styles.centerHeader}
              onPress={() => toggleCenterExpansion(center.id)}
              activeOpacity={0.7}
            >
              <View style={styles.centerInfo}>
                <ThemedText type="subtitle">{center.name}</ThemedText>
                <ThemedText style={styles.centerDetails}>
                  {(sportFieldsByCenter[center.id] || []).length} fields
                </ThemedText>
              </View>
              <Ionicons 
                name={expandedCenterId === center.id ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color="#4a90e2" 
              />
            </TouchableOpacity>
            
            {/* Center Fields - Collapsible */}
            {expandedCenterId === center.id && (
              <View style={styles.fieldsContainer}>
                {sportFieldsByCenter[center.id]?.length > 0 ? (
                  sportFieldsByCenter[center.id].map(field => (
                    <View key={field.id} style={styles.fieldItem}>
                      <View style={styles.fieldInfo}>
                        <ThemedText style={styles.fieldName}>{field.name}</ThemedText>
                        <ThemedText style={styles.fieldPrice}>
                          {/* Change $ to € and ensure we're accessing the correct property */}
                          {field.price || field.pricePerHour ? `€${field.price || field.pricePerHour} per hour` : 'Price not available'}
                        </ThemedText>
                        <ThemedText style={styles.fieldSports}>
                          Sports: {
                            (() => {
                              // Access sports data with fallbacks
                              const fieldSports = field.sports || field.sportIds;
                              if (!fieldSports) return 'None'
                              return getFieldSportsNames(fieldSports);
                            })()
                          }
                        </ThemedText>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(field.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <ThemedText style={styles.emptyFields}>
                    No fields found in this center.
                  </ThemedText>
                )}
              </View>
            )}
          </Card>
        ))
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    marginBottom: 16,
  },
  formCard: {
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    marginBottom: 16,
  },
  formInput: {
    marginBottom: 12,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  formHint: {
    fontStyle: 'italic',
    opacity: 0.7,
    fontSize: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  sportSelectionContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  sportSelectionContent: {
    padding: 4,
  },
  sportOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedSport: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  selectedSportText: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  submitButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  listTitle: {
    marginVertical: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  centerCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  centerInfo: {
    flex: 1,
  },
  centerDetails: {
    marginTop: 4,
    opacity: 0.7,
  },
  fieldsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontWeight: '500',
    fontSize: 16,
  },
  fieldPrice: {
    marginTop: 4,
    fontWeight: '500',
    color: '#4a90e2',
  },
  fieldSports: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
  },
  emptyFields: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 16,
  }
})