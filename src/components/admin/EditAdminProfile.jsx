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

const EditAdminProfile = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    cnicNumber: '',
    assignSensor: '',
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = () => {
    // Validate form if needed

    // Navigate to Profile page on submit
    navigation.navigate('AdminProfile');

    console.log(formData);
  };

  const handleImageUpload = () => {
    // Image upload logic would go here
  };

  const currentDate = '06-03 March, 2025';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit User</Text>
          </View>
          <Image
            source={require('../../assets/icons/profile.png')}
            style={styles.headerProfileImage}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              {profileImage ? (
                <Image source={profileImage} style={styles.profileImage} />
              ) : null}
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleImageUpload}>
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
                value={formData.fullName}
                onChangeText={text =>
                  setFormData({...formData, fullName: text})
                }
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={formData.email}
                onChangeText={text => setFormData({...formData, email: text})}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={text =>
                  setFormData({...formData, password: text})
                }
                secureTextEntry
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>CNIC Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CNIC Num"
                value={formData.cnicNumber}
                onChangeText={text =>
                  setFormData({...formData, cnicNumber: text})
                }
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Assign Sensor</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>
                  {formData.assignSensor || ''}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
            <Text style={styles.createButtonText}>Submit</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  dateContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#00c853',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditAdminProfile;
