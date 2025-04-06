import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Get screen dimensions
const {height} = Dimensions.get('window');

const AdminDashboard = () => {
  const navigation = useNavigation();

  // Sample user data
  const usersData = Array(20)
    .fill()
    .map((_, i) => ({
      id: '703703',
      name: 'Ahmad Ali',
      sensorName: 'MQ135',
    }));

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Number of rows per page shown in the design
  const totalPages = Math.ceil(usersData.length / rowsPerPage);

  // Get data for the current page
  const paginatedData = usersData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const goBack = () => {
    navigation.goBack();
  };

  const createUser = () => {
    navigation.navigate('CreateUser');
  };

  // Function to navigate to user profile
  const navigateToProfile = userId => {
    navigation.navigate('AdminProfile', {userId});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeftSection}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerText}>Dashboard</Text>
              <Text style={styles.headerSubText}>Admin</Text>
            </View>
          </View>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../../assets/icons/profile.png')}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateBorder} />
          <Text style={styles.dateText}>06- 03 March, 2025</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        <View style={styles.card}>
          {/* User Count and New User Button section */}
          <View style={styles.userInfoSection}>
            <View>
              <Text style={styles.userCountLabel}>Total Numbers of Users</Text>
              <Text style={styles.userCount}>06</Text>
            </View>
            <TouchableOpacity style={styles.newUserButton} onPress={createUser}>
              <Text style={styles.newUserButtonText}>+ New User</Text>
            </TouchableOpacity>
          </View>

          {/* Filter and Search */}
          <View style={styles.filterSection}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Add filter</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Search by name"
                style={styles.searchInput}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Table Section */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={styles.nameColumn}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.headerCell}>
                  Name
                </Text>
              </View>
              <View style={styles.idColumn}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.headerCell}>
                  ID Number
                </Text>
              </View>
              <View style={styles.sensorColumn}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.headerCell}>
                  Sensor Name
                </Text>
              </View>
            </View>

            {/* Table Body - Each row is now clickable */}
            <View style={styles.tableBody}>
              {paginatedData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tableRow}
                  onPress={() => navigateToProfile(item.id)}
                  activeOpacity={0.7}>
                  <View style={styles.nameColumn}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                  </View>
                  <View style={styles.idColumn}>
                    <Text style={styles.tableCell}>{item.id}</Text>
                  </View>
                  <View style={styles.sensorColumn}>
                    <Text style={styles.tableCell}>{item.sensorName}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Simple arrow pagination - restored to original style */}
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>
              {(currentPage - 1) * rowsPerPage + 1} -
              {Math.min(currentPage * rowsPerPage, usersData.length)} of{' '}
              {usersData.length}
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                onPress={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                style={currentPage === 1 ? styles.disabledButton : null}>
                <Text
                  style={[
                    styles.paginationArrow,
                    currentPage === 1 ? styles.disabledText : null,
                  ]}>
                  ◀
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                style={
                  currentPage === totalPages ? styles.disabledButton : null
                }>
                <Text
                  style={[
                    styles.paginationArrow,
                    currentPage === totalPages ? styles.disabledText : null,
                  ]}>
                  ▶
                </Text>
              </TouchableOpacity>
            </View>
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
  headerContainer: {
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerSubText: {
    fontSize: 14,
    color: '#666',
  },
  profileImageContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ddd',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  dateContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  dateBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 50, // Extra padding at bottom
    minHeight: height * 0.7, // Ensure content is scrollable
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  userInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userCountLabel: {
    fontSize: 16,
    color: '#666',
  },
  userCount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  newUserButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  newUserButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  filterSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#888',
    marginRight: 4,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#888',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    color: '#888',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  tableContainer: {
    marginTop: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F7F4',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  nameColumn: {
    width: '30%',
    paddingHorizontal: 8,
  },
  idColumn: {
    width: '35%',
    paddingHorizontal: 8,
  },
  sensorColumn: {
    width: '40%',
    paddingHorizontal: 8,
  },
  tableBody: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#444',
  },
  // Original simple pagination styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 20,
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  paginationArrow: {
    fontSize: 16,
    color: '#10B981',
    paddingHorizontal: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ccc',
  },
});

export default AdminDashboard;
