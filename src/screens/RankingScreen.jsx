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
import {useNavigation} from '@react-navigation/native';

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

const ReankingScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const navigation = useNavigation();

  const goToDashboard = () => {
    navigation.navigate('Home');
  };

  const data = [
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
    {
      time: '30:00',
      sensorName: 'MQ135',
      sensorReading: 55,
      date: '10-03-2025',
    },
  ];

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>History</Text>
        <View style={styles.headerLine} />

        <View style={styles.content}>
          <View style={styles.dashboardButtonContainer}>
            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={goToDashboard}>
              <Text style={styles.dashboardButtonText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>Sensor Reading Records</Text>
            <Text style={styles.infoText}>06 March 2025</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Time</Text>
                <Text style={styles.headerCell}>Sensor Name</Text>
                <Text style={styles.headerCell}>Sensor Reading(AQI)</Text>
                <Text style={styles.headerCell}>Date</Text>
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
                    <Text style={styles.tableCell}>{`${item.time} min`}</Text>
                    <Text style={styles.tableCell}>{item.sensorName}</Text>
                    <Text
                      style={
                        styles.tableCell
                      }>{`${item.sensorReading} µg/m³`}</Text>
                    <Text style={styles.tableCell}>{item.date}</Text>
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
  dashboardButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  dashboardButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dashboardButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  headerInfo: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  infoText: {
    color: '#878787',
    fontSize: 16,
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

export default ReankingScreen;
