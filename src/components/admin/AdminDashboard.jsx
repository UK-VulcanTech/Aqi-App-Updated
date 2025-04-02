import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AdminDashboard = () => {
  const navigation = useNavigation();

  // Sample user data
  const usersData = Array(20)
    .fill()
    .map((_, i) => ({
      id: '703703',
      name: 'Ahmad Ali',
      email: 'michelle.riv@gmail.com',
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Fixed at the top */}
      <View style={styles.header}>
        <View style={styles.headerLeftSection}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backIcon}
            />
            s
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

      {/* Main content - Scrollable */}
      <ScrollView style={styles.mainScrollView}>
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
                placeholder="Search by name or email"
                style={styles.searchInput}
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Table Section - Keep horizontal scrolling */}
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.nameColumn]}>Name</Text>
                <Text style={[styles.headerCell, styles.idColumn]}>
                  ID Number
                </Text>
                <Text style={[styles.headerCell, styles.emailColumn]}>
                  Email Address
                </Text>
                <Text style={[styles.headerCell, styles.sensorColumn]}>
                  Sensor Name
                </Text>
              </View>

              {/* Table Body - Scrollable */}
              <ScrollView style={styles.tableBody}>
                {paginatedData.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.nameCell, styles.nameColumn]}>
                      <Image
                        source={require('../../assets/icons/profile.png')}
                        style={styles.userAvatar}
                      />
                      <Text style={styles.nameText}>{item.name}</Text>
                    </View>
                    <Text style={[styles.tableCell, styles.idColumn]}>
                      {item.id}
                    </Text>
                    <Text style={[styles.tableCell, styles.emailColumn]}>
                      {item.email}
                    </Text>
                    <Text style={[styles.tableCell, styles.sensorColumn]}>
                      {item.sensorName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Pagination - Exactly as in the original code */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}>
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>

            <View style={styles.paginationPages}>
              <Text style={styles.paginationText}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}>
              <Text style={styles.paginationButtonText}>Next</Text>
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
    position: 'relative', // To position the border correctly
  },
  dateBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e0e0e0', // Light gray border color
  },
  dateText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4, // Small margin to separate from the border
  },
  mainScrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
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
    width: 600, // Fixed width to prevent excess space
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F7F4',
    padding: 8,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    paddingHorizontal: 4,
  },
  nameColumn: {
    width: 150, // Fixed width
  },
  idColumn: {
    width: 100, // Fixed width
  },
  emailColumn: {
    width: 220, // Fixed width
  },
  sensorColumn: {
    width: 130, // Fixed width
  },
  tableBody: {
    maxHeight: 350,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 8,
  },
  nameCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  nameText: {
    fontSize: 14,
    color: '#444',
  },
  tableCell: {
    fontSize: 14,
    color: '#444',
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlignVertical: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  paginationButton: {
    backgroundColor: '#0EA959',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  paginationPages: {
    paddingHorizontal: 16,
  },
  paginationText: {
    color: '#4B5563',
  },
});

export default AdminDashboard;
