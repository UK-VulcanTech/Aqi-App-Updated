// SensorDataForm.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useGetSensorLocations,
  useSubmitSensorReading,
} from '../../services/sensor.hooks';

// H1 function component
const H1 = ({children, style}) => {
  return <Text style={[styles.h1Text, style]}>{children}</Text>;
};

const SensorDataForm = () => {
  // States for form
  const [selectedLocation, setSelectedLocation] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sensorValue, setSensorValue] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get locations from API
  const {
    data: locationData,
    isLoading: locationsLoading,
    error: locationsError,
  } = useGetSensorLocations();
  console.log('🚀 ~ SensorDataForm ~ locationData:', locationData);

  useEffect(() => {
    console.log('LocationData updated:', locationData);
  }, [locationData]);

  // Submit mutation
  const {mutate: submitSensorReading, isLoading: isSubmitting} =
    useSubmitSensorReading();

  // Get AQI category for styling
  const getAQICategory = value => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return {text: 'Enter Value', color: '#94A3B8'};
    if (numValue <= 50) return {text: 'Good', color: '#10B981'};
    if (numValue <= 100) return {text: 'Moderate', color: '#FBBF24'};
    if (numValue <= 150) return {text: 'Poor', color: '#F97316'};
    if (numValue <= 500) return {text: 'Unhealthy', color: '#EF4444'};
    return {text: 'Hazardous', color: '#7F1D1D'};
  };

  // Process locations when data is loaded
  // Fix: Ensure proper handling of locationData format
  const locations = React.useMemo(() => {
    if (!locationData) return [];
    if (Array.isArray(locationData)) {
      // If locationData is already an array of strings
      if (locationData.length > 0 && typeof locationData[0] === 'string') {
        return locationData;
      }
      // If locationData is an array of objects with location property
      if (locationData.length > 0 && locationData[0].location) {
        return locationData.map(item => item.location);
      }
    }
    console.warn('Unexpected locationData format:', locationData);
    return [];
  }, [locationData]);

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedLocation || !sensorValue) {
      Alert.alert('Input Error', 'Please fill in all fields');
      return;
    }

    // Create data object for API
    const sensorData = {
      location: selectedLocation,
      sensor_value: parseFloat(sensorValue),
    };

    // Submit data to API
    submitSensorReading(sensorData, {
      onSuccess: () => {
        setSubmitSuccess(true);

        // Reset form after showing success message
        setTimeout(() => {
          setSelectedLocation('');
          setSensorValue('');
          setSubmitSuccess(false);
        }, 2000);
      },
      onError: error => {
        Alert.alert(
          'Submission Error',
          `Failed to submit sensor reading: ${error.message}`,
          [{text: 'OK'}],
        );
      },
    });
  };

  const aqiCategory = getAQICategory(sensorValue);

  // Get gradient colors based on AQI category
  const getGradientColors = () => {
    switch (aqiCategory.text) {
      case 'Good':
        return ['#FFFFFF', '#d7f8e8', '#a7f3d0'];
      case 'Moderate':
        return ['#FFFFFF', '#fef5d3', '#fde68a'];
      case 'Poor':
        return ['#FFFFFF', '#fed7aa', '#fdba74'];
      case 'Unhealthy':
        return ['#FFFFFF', '#fecaca', '#fca5a5'];
      case 'Hazardous':
        return ['#FFFFFF', '#ef9696', '#b91c1c'];
      default:
        return ['#FFFFFF', '#f1f5f9', '#e2e8f0'];
    }
  };

  // Render location item for the scrollable list
  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        selectedLocation === item && styles.selectedModalItem,
      ]}
      onPress={() => {
        setSelectedLocation(item);
        setDropdownVisible(false);
      }}>
      <Text
        style={[
          styles.modalItemText,
          selectedLocation === item && styles.selectedModalItemText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Debugging function to show current state
  const debugLocationData = () => {
    return JSON.stringify(
      {
        locationsLoading,
        locationsError: locationsError?.message,
        locationDataExists: !!locationData,
        locationDataType: locationData ? typeof locationData : 'undefined',
        isArray: locationData ? Array.isArray(locationData) : false,
        locationCount: locations?.length || 0,
      },
      null,
      2,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Dynamic Gradient Background */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradientBackground}
        locations={[0.0, 0.4, 0.9]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Heading Section */}
            <View style={styles.headingContainer}>
              <H1>Air Quality Sensor Data</H1>
              <Text style={styles.locationText}>Lahore, Pakistan • 2025</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Sensor Reading</Text>

              {/* Location Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TouchableOpacity
                  style={styles.dropdownField}
                  onPress={() => setDropdownVisible(true)}>
                  {locationsLoading ? (
                    <ActivityIndicator size="small" color="#3B82F6" />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.dropdownText,
                          !selectedLocation && styles.placeholderText,
                        ]}>
                        {selectedLocation || 'Select location'}
                      </Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </>
                  )}
                </TouchableOpacity>
                {locationsError && (
                  <Text style={styles.errorText}>
                    Error loading locations. Please try again.
                  </Text>
                )}
              </View>

              {/* Sensor Value Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Sensor Value (AQI)</Text>
                <TextInput
                  style={styles.textInput}
                  value={sensorValue}
                  onChangeText={setSensorValue}
                  placeholder="Enter sensor value"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              {/* AQI Category Display */}
              {sensorValue ? (
                <View style={styles.categoryBox}>
                  <Text style={styles.categoryLabel}>
                    Current AQI Category:
                  </Text>
                  <View style={styles.categoryDisplay}>
                    <View
                      style={[
                        styles.categoryIndicator,
                        {backgroundColor: aqiCategory.color},
                      ]}
                    />
                    <Text
                      style={[styles.categoryText, {color: aqiCategory.color}]}>
                      {aqiCategory.text}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!selectedLocation || !sensorValue || isSubmitting) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!selectedLocation || !sensorValue || isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {submitSuccess ? 'Success! ✓' : 'Submit Data'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Legend for AQI categories */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Air Quality Index Legend:</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendIndicator,
                      {backgroundColor: '#10B981'},
                    ]}
                  />
                  <Text style={styles.legendText}>0-50: Good</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendIndicator,
                      {backgroundColor: '#FBBF24'},
                    ]}
                  />
                  <Text style={styles.legendText}>51-100: Moderate</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendIndicator,
                      {backgroundColor: '#F97316'},
                    ]}
                  />
                  <Text style={styles.legendText}>101-150: Poor</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendIndicator,
                      {backgroundColor: '#EF4444'},
                    ]}
                  />
                  <Text style={styles.legendText}>151-500: Unhealthy</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendIndicator,
                      {backgroundColor: '#7F1D1D'},
                    ]}
                  />
                  <Text style={styles.legendText}>500+: Hazardous</Text>
                </View>
              </View>
            </View>

            <Text style={styles.footerNote}>
              Data will be processed and displayed on the dashboard in real-time
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Scrollable Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalContent}>
            {locationsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading locations...</Text>
              </View>
            ) : locations && locations.length > 0 ? (
              <FlatList
                data={locations}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => `location-${index}-${item}`}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.locationListContainer}
                ItemSeparatorComponent={() => (
                  <View style={styles.listSeparator} />
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={20}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {locationsError
                    ? `Failed to load locations: ${locationsError.message}`
                    : 'No locations available'}
                </Text>
                <Text style={[styles.emptyText, {marginTop: 10, fontSize: 10}]}>
                  Debug info: {debugLocationData()}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Add these new styles
const updatedStyles = StyleSheet.create({
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
});

// Merge the new styles with your existing styles
const styles = {
  ...StyleSheet.create({
    // Your existing styles here...
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    gradientBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    keyboardAvoidView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    headingContainer: {
      marginBottom: 24,
    },
    h1Text: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 4,
    },
    locationText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#3B82F6',
      marginBottom: 6,
    },
    headingSubtitle: {
      fontSize: 16,
      color: '#64748B',
      fontWeight: '400',
    },
    formCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    formTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#334155',
      marginBottom: 20,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: '#475569',
      marginBottom: 8,
    },
    dropdownField: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#F8FAFC',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#CBD5E1',
    },
    dropdownText: {
      fontSize: 16,
      color: '#334155',
    },
    placeholderText: {
      color: '#94A3B8',
    },
    dropdownArrow: {
      fontSize: 12,
      color: '#64748B',
    },
    textInput: {
      backgroundColor: '#F8FAFC',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#CBD5E1',
      fontSize: 16,
      color: '#334155',
    },
    categoryBox: {
      marginBottom: 24,
      backgroundColor: '#F8FAFC',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    categoryLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#64748B',
      marginBottom: 8,
    },
    categoryDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    categoryText: {
      fontSize: 16,
      fontWeight: '700',
    },
    submitButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#3B82F6',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonDisabled: {
      backgroundColor: '#94A3B8',
      shadowOpacity: 0,
      elevation: 0,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 12,
      overflow: 'hidden',
      maxHeight: Dimensions.get('window').height * 0.5, // Limit height to 50% of screen
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    locationListContainer: {
      paddingVertical: 4,
    },
    listSeparator: {
      height: 1,
      backgroundColor: '#E2E8F0',
    },
    modalItem: {
      padding: 16,
    },
    selectedModalItem: {
      backgroundColor: '#EFF6FF',
    },
    modalItemText: {
      fontSize: 16,
      color: '#334155',
    },
    selectedModalItemText: {
      color: '#3B82F6',
      fontWeight: '600',
    },
    legendContainer: {
      backgroundColor: '#F8FAFC',
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      marginBottom: 20,
    },
    legendTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#334155',
      marginBottom: 10,
    },
    legendItems: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginRight: 10,
      width: '45%',
    },
    legendIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendText: {
      fontSize: 12,
      color: '#64748B',
    },
    footerNote: {
      fontSize: 12,
      color: '#94A3B8',
      textAlign: 'center',
      fontStyle: 'italic',
    },
  }),
  ...updatedStyles,
};

export default SensorDataForm;
