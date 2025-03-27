import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';

const UserDashboard = () => {
  const navigation = useNavigation();

  const [location, setLocation] = useState('Lahore-Punjab, Pakistan');
  const [sensor, setSensor] = useState('GAIA A12, MQ-135');
  const [gaiaReading, setGaiaReading] = useState('50-300 μg/m³');
  const [mqReading, setMqReading] = useState('50-300 μg/m³');

  const goBack = () => {
    navigation.goBack();
  };

  const goToSensorRecords = () => {
    navigation.navigate('sensor');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeftSection}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/icons/profile.png')} // You'll need to add your profile image
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>06- 03 March, 2025</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sensor Readings Input Fields</Text>

          {/* Location Field */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                placeholderTextColor="#FF5757"
              />
            </View>
          </View>

          {/* Assign Sensor Field */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Assign Sensor</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.sensorPrefix}>(🔴)</Text>
              <TextInput
                value={sensor}
                onChangeText={setSensor}
                style={styles.input}
                placeholderTextColor="#FF5757"
              />
            </View>
          </View>

          {/* Sensor Readings */}
          <View style={styles.inputSection}>
            <Text style={styles.sensorReadingLabel}>Input Sensor Reading</Text>

            <Text style={styles.sensorSubLabel}>GAIA A12</Text>
            <TextInput
              value={gaiaReading}
              onChangeText={setGaiaReading}
              style={styles.readingInput}
              placeholderTextColor="#777"
            />

            <Text style={styles.sensorSubLabel}>MQ-135</Text>
            <TextInput
              value={mqReading}
              onChangeText={setMqReading}
              style={styles.readingInput}
              placeholderTextColor="#777"
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText} onPress={goToSensorRecords}>
          Submit
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd', // Placeholder color if image doesn't load
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  dateContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  sensorReadingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center', // Center-aligned this text
  },
  sensorSubLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
  },
  locationIcon: {
    fontSize: 16,
    color: '#ff5757',
    marginRight: 8,
  },
  sensorPrefix: {
    fontSize: 14,
    color: '#ff5757',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#666',
  },
  readingInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#666',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#10B981',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserDashboard;
