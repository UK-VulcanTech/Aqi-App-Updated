import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

const SensorRecords = () => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  // Sample sensor reading data
  const sensorData = [
    {
      id: 1,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '30:00 min',
    },
    {
      id: 2,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '30:00 min',
    },
    {
      id: 3,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '27:48 min',
    },
    {
      id: 4,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '25:00 min',
    },
    {
      id: 5,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '16:47 min',
    },
    {
      id: 6,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '12:20 min',
    },
    {
      id: 7,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '10:15 min',
    },
    {
      id: 8,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '08:30 min',
    },
    {
      id: 9,
      sensorName: 'GAIA A12,\nMQ-135',
      reading: '55μg/m³, 65μg/m³',
      date: '10-03-2025',
      time: '05:10 min',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalItems = sensorData.length;

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get data for the current page
  const paginatedData = sensorData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Functions to handle pagination
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeftSection}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>History</Text>
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/icons/profile.png')}
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.headerBorder} />

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>03 March, 2025</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sensor Readings Records</Text>

          <ScrollView>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.headerCellTime} />
                <Text style={styles.headerCellName}>Sensor Name</Text>
                <Text style={styles.headerCellReading}>Sensor Reading</Text>
                <Text style={styles.headerCellDate}>Date</Text>
              </View>

              {/* Table Body */}
              {paginatedData.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}>
                  <View style={styles.timeCell}>
                    <Text style={styles.editIcon}>✎</Text>
                    <Text style={styles.timeText}>{item.time || ''}</Text>
                  </View>
                  <Text style={styles.nameCell}>{item.sensorName}</Text>
                  <Text style={styles.readingCell}>{item.reading}</Text>
                  <Text style={styles.dateCell}>{item.date}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Pagination - moved up right below the table */}
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>
              {(currentPage - 1) * itemsPerPage + 1} -
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                onPress={goToPreviousPage}
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
                onPress={goToNextPage}
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
      </View>
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
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    backgroundColor: '#f0f0f0',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  tableContainer: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EBEBF2',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCellTime: {
    width: '18%',
    color: '#10B981',
    fontWeight: '600',
    fontSize: 12,
  },
  headerCellName: {
    width: '25%',
    color: '#10B981',
    fontWeight: '600',
    fontSize: 11, // Slightly reduce font size
    textAlign: 'left',
    paddingLeft: 5,
  },
  headerCellReading: {
    width: '33%',
    color: '#10B981',
    fontWeight: '600',
    fontSize: 11, // Slightly reduce font size
    textAlign: 'left',
    paddingLeft: 15,
  },
  headerCellDate: {
    width: '24%',
    color: '#10B981',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    // Ensure text stays on one line
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBF2',
  },
  evenRow: {
    backgroundColor: '#F9FAFB',
  },
  oddRow: {
    backgroundColor: 'white',
  },
  timeCell: {
    width: '18%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  nameCell: {
    width: '25%',
    fontSize: 12,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'center',
    paddingLeft: 5,
  },
  readingCell: {
    width: '33%',
    fontSize: 12,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'center',
    paddingLeft: 15,
    marginLeft: 5,
  },
  dateCell: {
    width: '24%',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    alignSelf: 'center',
  },
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

export default SensorRecords;
