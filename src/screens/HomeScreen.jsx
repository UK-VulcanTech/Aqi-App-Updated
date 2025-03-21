import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [location, setLocation] = useState('Lahore-Punjab, Pakistan');
  const [sensor, setSensor] = useState('GAIA A12, MQ-135');
  const [gaiaReading, setGaiaReading] = useState('50-300 μg/m³');
  const [mqReading, setMqReading] = useState('50-300 μg/m³');

  const gotoHistory = () => {
    navigation.navigate('Ranking');
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={styles.headerLine} />

        <View style={styles.historyButtonContainer}>
          <TouchableOpacity style={styles.historyButton} onPress={gotoHistory}>
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerInfoColumn}>
            <Text style={styles.infoText}>Sensor Readings Input Fields</Text>
            <Text style={styles.dateText}>06- 03 March, 2025</Text>
          </View>

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

          <View style={styles.inputSection}>
            <Text style={styles.label}>Assign Sensor</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                value={sensor}
                onChangeText={setSensor}
                style={styles.input}
                placeholderTextColor="#FF5757"
              />
              <TouchableOpacity style={styles.dropdownButton}>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>
              Input Sensor Reading <Text style={styles.required}>*</Text>
            </Text>

            <Text style={styles.sensorSubLabel}>GAIA A12</Text>
            <TextInput
              value={gaiaReading}
              onChangeText={setGaiaReading}
              style={styles.input}
              placeholderTextColor="#777"
            />

            <Text style={[styles.sensorSubLabel]}>MQ-135</Text>
            <TextInput
              value={mqReading}
              onChangeText={setMqReading}
              style={styles.input}
              placeholderTextColor="#777"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    paddingVertical: 24,
    flex: 1,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 32,
    color: '#333',
    marginBottom: 10,
  },
  headerLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    marginBottom: 16,
  },
  historyButtonContainer: {
    alignItems: 'flex-end',
    paddingRight: 16,
    marginBottom: 10,
  },
  historyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  historyButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    width: '100%',
    paddingHorizontal: 16,
  },
  headerInfoColumn: {
    marginBottom: 20,
  },
  infoText: {
    color: '#777777',
    fontSize: 16,
    marginBottom: 4,
  },
  dateText: {
    color: '#777777',
    fontSize: 16,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
    fontSize: 16,
  },
  required: {
    color: 'red',
  },
  sensorSubLabel: {
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    paddingLeft: 15,
  },
  locationIcon: {
    color: '#878787',
    marginRight: 5,
  },
  input: {
    padding: 14,
    paddingLeft: 5,
    width: '90%',
    color: '#878787',
    fontSize: 16,
  },
  dropdownButton: {
    backgroundColor: '#10B981',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dropdownIcon: {
    color: 'white',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    // paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 50,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default HomeScreen;
