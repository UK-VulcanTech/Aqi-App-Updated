import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Pagination = ({currentPage, totalPages, onPageChange}) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationButtonDisabled,
        ]}
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
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
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}>
        <Text style={styles.paginationButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminDashboard = () => {
  const navigation = useNavigation();

  const createUser = () => {
    navigation.navigate('CreateUser');
  };

  // Sample user data
  const usersData = [
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
    {
      id: '703703',
      name: 'Enoch Mercy',
      email: 'michelle.riv@gmail.com',
      sensorName: 'MQ135',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  const totalPages = Math.ceil(usersData.length / rowsPerPage);

  // Get data for the current page
  const paginatedData = usersData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={styles.headerLine} />

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>Total Number of Users</Text>
            <Text style={styles.countText}>
              {usersData.length.toString().padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.dateButtonContainer}>
            <Text style={styles.infoText}>06 March 2025</Text>
            <TouchableOpacity style={styles.addButton} onPress={createUser}>
              <Text style={styles.addButtonText}>+ New User</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>ID Number</Text>
                <Text style={styles.headerCell}>Email Address</Text>
                <Text style={styles.headerCell}>Sensor Name</Text>
              </View>

              {/* Table Rows */}
              <ScrollView style={styles.tableBody}>
                {paginatedData.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.id}</Text>
                    <Text style={styles.tableCell}>{item.email}</Text>
                    <Text style={styles.tableCell}>{item.sensorName}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={newPage => setCurrentPage(newPage)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#4B5563',
    paddingVertical: 8,
  },
  headerLine: {
    width: '85%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
    marginBottom: 16,
  },
  content: {
    width: '95%',
    alignSelf: 'center',
  },
  headerInfo: {
    marginBottom: 12,
  },
  infoText: {
    color: '#878787',
    fontSize: 16,
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  tableContainer: {
    marginTop: 8,
    width: screenWidth * 1.2, // Make the table slightly wider than screen for horizontal scroll
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DCDCE4',
    padding: 12,
    borderRadius: 4,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0EA959',
    paddingHorizontal: 8,
    textAlign: 'left',
  },
  tableBody: {
    marginBottom: 12,
    maxHeight: 350, // Adjust based on your needs
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  evenRow: {
    backgroundColor: '#F9FAFB',
  },
  oddRow: {
    backgroundColor: 'white',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    paddingHorizontal: 8,
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
