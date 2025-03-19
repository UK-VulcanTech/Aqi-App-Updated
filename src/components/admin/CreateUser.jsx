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
  Alert,
  Image,
} from 'react-native';

const sensorOptions = [
  {label: 'MQ135', value: 'MQ135'},
  {label: 'GAIA A12', value: 'GAIA A12'},
];

const CreateUser = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cnic: '',
    assignSensor: '',
  });

  const [errors, setErrors] = useState({});
  const [showSensorOptions, setShowSensorOptions] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validate name
    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (formData.name.length > 20) {
      newErrors.name = 'Name must not exceed 20 characters';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (formData.password.length > 30) {
      newErrors.password = 'Password must not exceed 30 characters';
      isValid = false;
    }

    // Validate CNIC
    if (!formData.cnic) {
      newErrors.cnic = 'CNIC is required';
      isValid = false;
    } else if (formData.cnic.length !== 14) {
      newErrors.cnic = 'CNIC must be exactly 14 characters';
      isValid = false;
    }

    // Validate sensor selection
    if (!formData.assignSensor) {
      newErrors.assignSensor = 'Please select a sensor';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});

    // Clear error when typing
    if (errors[field]) {
      setErrors({...errors, [field]: null});
    }
  };

  const selectSensor = value => {
    handleInputChange('assignSensor', value);
    setShowSensorOptions(false);
  };

  const handleUploadImage = () => {
    // Image upload logic would go here
    Alert.alert(
      'Upload Image',
      'Image upload functionality would be implemented here',
    );
  };

  const handleSubmit = () => {
    navigation.navigate('Profile');
    if (validateForm()) {
      console.log('Form data:', formData);
    }
  };

  const currentDate = '05.March,2025';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.headerText}>Create new user</Text>
          <View style={styles.headerLine} />

          <View style={styles.userHeader}>
            <Text style={styles.addUserText}>Add user</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              {profileImage ? (
                <Image source={profileImage} style={styles.profileImage} />
              ) : null}
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleUploadImage}>
                <Text style={styles.addImageButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                onChangeText={text => handleInputChange('name', text)}
                value={formData.name}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                onChangeText={text => handleInputChange('email', text)}
                value={formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => handleInputChange('password', text)}
                value={formData.password}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>CNIC Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CNIC Num"
                onChangeText={text => handleInputChange('cnic', text)}
                value={formData.cnic}
                keyboardType="number-pad"
                maxLength={14}
              />
              {errors.cnic && (
                <Text style={styles.errorText}>{errors.cnic}</Text>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Assign Sensor</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowSensorOptions(!showSensorOptions)}>
                <Text
                  style={
                    formData.assignSensor
                      ? styles.dropdownSelectedText
                      : styles.dropdownPlaceholder
                  }>
                  {formData.assignSensor || ''}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {showSensorOptions && (
                <View style={styles.dropdownOptions}>
                  {sensorOptions.map(sensor => (
                    <TouchableOpacity
                      key={sensor.value}
                      style={styles.dropdownItem}
                      onPress={() => selectSensor(sensor.value)}>
                      <Text style={styles.dropdownItemText}>
                        {sensor.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {errors.assignSensor && (
                <Text style={styles.errorText}>{errors.assignSensor}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    width: '100%',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
    paddingVertical: 8,
  },
  headerLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  addUserText: {
    fontSize: 14,
    color: '#4B5563',
  },
  dateText: {
    fontSize: 14,
    color: '#4B5563',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  addImageButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#333',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
  },
  dropdownButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownSelectedText: {
    color: '#000',
  },
  dropdownArrow: {
    color: '#9CA3AF',
  },
  dropdownOptions: {
    marginTop: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateUser;
