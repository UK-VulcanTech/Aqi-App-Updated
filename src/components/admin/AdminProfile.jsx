import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const AdminProfile = ({navigation}) => {
  // Example user data
  const userData = {
    fullName: 'Ahmad Ali',
    email: 'ahmad.ali123@gmail.com',
    password: '•••••••••',
    cnic: '3520103420488',
    assignedSensors: 'MQ135, GAIA A12',
  };

  const handleEdit = () => {
    // Navigate to edit screen
    navigation.navigate('EditAdminProfile');
  };

  const handleRemove = () => {
    // Handle user removal
    console.log('User removed');
  };

  const handleImageUpload = () => {
    // Image upload logic would go here
  };

  const currentDate = '06- 03 March, 2025';

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
            <Text style={styles.headerTitle}>Profile</Text>
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
              <Image
                source={require('../../assets/icons/profile.png')}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleImageUpload}>
                <Text style={styles.addImageButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userData.fullName}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Password</Text>
              <Text style={styles.infoValue}>{userData.password}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>CNIC Number</Text>
              <Text style={styles.infoValue}>{userData.cnic}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Assign Sensor</Text>
              <Text style={styles.infoValue}>{userData.assignedSensors}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemove}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
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
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#00c853',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#d50000',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminProfile;
