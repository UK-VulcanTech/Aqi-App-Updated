import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

const Profile = ({navigation, route}) => {
  // Example user data - would typically come from props or API
  const [userData, setUserData] = useState({
    fullName: 'Ahmad Ali',
    email: 'ahmad.ali123@gmail.com',
    password: '••••••••••', // Masked for display purposes
    cnic: '3520103420488',
    assignedSensors: 'MQ135, GAIA A12',
  });

  const handleEdit = () => {
    // Navigate to edit screen or show edit modal
    Alert.alert('Edit Profile', 'Navigate to edit profile screen');
  };

  const handleRemove = () => {
    Alert.alert('Remove User', 'Are you sure you want to remove this user?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: () => console.log('User removed'),
        style: 'destructive',
      },
    ]);
  };

  const currentDate = '05,March,2025';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.headerText}>Profile</Text>
          <View style={styles.headerLine} />

          <Text style={styles.dateText}>{currentDate}</Text>

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              {/* Profile image would go here */}
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() =>
                  Alert.alert('Upload Image', 'Upload a profile picture')
                }>
                <Text style={styles.addImageButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userData.fullName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Password</Text>
              <Text style={styles.infoValue}>{userData.password}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CNIC Number</Text>
              <Text style={styles.infoValue}>{userData.cnic}</Text>
            </View>

            <View style={styles.infoRow}>
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
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flex: 1,
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
  dateText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'right',
    marginBottom: 16,
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
  infoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },
  infoValue: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  editButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
