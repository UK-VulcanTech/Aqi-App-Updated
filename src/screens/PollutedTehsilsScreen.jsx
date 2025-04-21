import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import Header from '../components/dashboard/Header';

// H1 function component
const H1 = ({children, style}) => {
  return <Text style={[styles.h1Text, style]}>{children}</Text>;
};

const PollutedTehsilsScreen = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('AQI');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // List of pollutants for dropdown
  const pollutants = ['AQI', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'];

  // Updated sample data to represent all categories
  const tehsilData = [
    {
      id: '01',
      name: 'Shalimar',
      aqi: 520,
      pm25: 550,
      pm10: 530,
      no2: 520,
      so2: 540,
      co: 510,
      o3: 530,
    },
    {
      id: '02',
      name: 'Lahore City',
      aqi: 320,
      pm25: 290,
      pm10: 280,
      no2: 310,
      so2: 270,
      co: 300,
      o3: 330,
    },
    {
      id: '03',
      name: 'Model Town',
      aqi: 180,
      pm25: 170,
      pm10: 190,
      no2: 175,
      so2: 185,
      co: 165,
      o3: 195,
    },
    {
      id: '04',
      name: 'Raiwind',
      aqi: 120,
      pm25: 135,
      pm10: 110,
      no2: 90,
      so2: 120,
      co: 100,
      o3: 130,
    },
    {
      id: '05',
      name: 'Lahore Cantt',
      aqi: 35,
      pm25: 30,
      pm10: 40,
      no2: 25,
      so2: 20,
      co: 45,
      o3: 40,
    },
  ];

  // Sort data based on selected pollutant
  const getSortedData = () => {
    const key = selectedPollutant.toLowerCase().replace('.', '');
    return [...tehsilData].sort((a, b) => b[key] - a[key]);
  };

  const sortedData = getSortedData();

  // Updated pollution status and color based on pollutant value
  const getPollutantStatus = (pollutant, value) => {
    let status, color;

    if (value <= 50) {
      status = 'Good';
      color = '#10B981'; // Green
    } else if (value <= 100) {
      status = 'Moderate';
      color = '#FBBF24'; // Amber/Yellow
    } else if (value <= 150) {
      status = 'Poor';
      color = '#F97316'; // Orange
    } else if (value <= 500) {
      status = 'Unhealthy';
      color = '#EF4444'; // Red
    } else {
      status = 'Hazardous';
      color = '#7F1D1D'; // Very Dark Red
    }

    return {status, color};
  };

  // Get current value based on selected pollutant
  const getCurrentValue = item => {
    const key = selectedPollutant.toLowerCase().replace('.', '');
    return item[key];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Heading Section */}
          <View style={styles.headingContainer}>
            <H1>Lahore Air Quality Rankings</H1>
            <Text style={styles.locationText}>Lahore, Pakistan</Text>
            <Text style={styles.headingSubtitle}>
              {/* Real-time air quality data from all tehsils */}
            </Text>
          </View>

          {/* Table Header Section */}
          <View style={styles.tableHeaderSection}>
            <Text style={styles.tableTitle}>Rankings</Text>

            {/* Pollutant Selector Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Pollutant:</Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => setDropdownVisible(true)}>
                <Text style={styles.dropdownText}>{selectedPollutant}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dropdown Modal */}
          <Modal
            visible={dropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setDropdownVisible(false)}>
              <View style={styles.modalContent}>
                {pollutants.map(pollutant => (
                  <TouchableOpacity
                    key={pollutant}
                    style={[
                      styles.modalItem,
                      selectedPollutant === pollutant &&
                        styles.selectedModalItem,
                    ]}
                    onPress={() => {
                      setSelectedPollutant(pollutant);
                      setDropdownVisible(false);
                    }}>
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedPollutant === pollutant &&
                          styles.selectedModalItemText,
                      ]}>
                      {pollutant}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Table Container */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text
                style={[styles.headerText, styles.rankColumn]}
                numberOfLines={1}>
                Rank
              </Text>
              <Text
                style={[styles.headerText, styles.tehsilColumn]}
                numberOfLines={1}>
                Tehsil
              </Text>
              <Text
                style={[styles.headerText, styles.aqiColumn]}
                numberOfLines={1}>
                {selectedPollutant}
              </Text>
              <Text
                style={[styles.headerText, styles.statusColumn]}
                numberOfLines={1}>
                Status
              </Text>
            </View>

            {/* Table Rows */}
            <View style={styles.tableRows}>
              {sortedData.map((tehsil, index) => {
                const currentValue = getCurrentValue(tehsil);
                const {status: statusText, color: statusColor} =
                  getPollutantStatus(selectedPollutant, currentValue);

                return (
                  <View
                    key={tehsil.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                      index === sortedData.length - 1 && styles.lastRow,
                    ]}>
                    <Text
                      style={[styles.rankText, styles.rankColumn]}
                      numberOfLines={1}>
                      {(index + 1).toString().padStart(2, '0')}
                    </Text>
                    <Text
                      style={[styles.nameText, styles.tehsilColumn]}
                      numberOfLines={1}>
                      {tehsil.name}
                    </Text>
                    <View style={[styles.aqiColumn, styles.valueContainer]}>
                      <Text style={styles.aqiValueWrapper}>
                        <Text
                          style={[styles.aqiValueText, {color: statusColor}]}>
                          {currentValue}
                        </Text>
                        {/* <Text style={styles.unitText}> µg/m³</Text> */}
                      </Text>
                    </View>
                    <View style={[styles.statusColumn, styles.statusContainer]}>
                      <View
                        style={[
                          styles.statusIndicator,
                          {backgroundColor: statusColor},
                        ]}
                      />
                      <Text
                        style={[styles.statusText, {color: statusColor}]}
                        numberOfLines={1}>
                        {statusText}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Legend for color indicators */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Air Quality Index Legend:</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendIndicator, {backgroundColor: '#10B981'}]}
                />
                <Text style={styles.legendText}>0-50: Good</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendIndicator, {backgroundColor: '#FBBF24'}]}
                />
                <Text style={styles.legendText}>51-100: Moderate</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendIndicator, {backgroundColor: '#F97316'}]}
                />
                <Text style={styles.legendText}>101-150: Poor</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendIndicator, {backgroundColor: '#EF4444'}]}
                />
                <Text style={styles.legendText}>151-500: Unhealthy</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendIndicator, {backgroundColor: '#7F1D1D'}]}
                />
                <Text style={styles.legendText}>500+: Hazardous</Text>
              </View>
            </View>
          </View>

          <Text style={styles.footerNote}>
            Data updated hourly • Last update: 08 Apr 2025, 09:45 AM
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headingContainer: {
    marginBottom: 20,
  },
  h1Text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 6,
  },
  headingSubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
    // marginTop: 4,
    marginBottom: -25,
  },
  tableHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginRight: 8,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  selectedModalItem: {
    backgroundColor: '#EFF6FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#334155',
  },
  selectedModalItemText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerText: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 14,
    ellipsizeMode: 'tail',
  },
  tableRows: {
    // No margin or padding to ensure rows are merged
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  oddRow: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rankColumn: {
    width: '15%',
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center',
  },
  tehsilColumn: {
    width: '35%',
    paddingHorizontal: 8,
    textAlign: 'left',
    ellipsizeMode: 'tail',
  },
  aqiColumn: {
    width: '20%',
    paddingHorizontal: 4,
  },
  valueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiValueWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  aqiValueText: {
    fontSize: 15,
    fontWeight: '700',
  },
  unitText: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: '400',
  },
  statusColumn: {
    width: '30%',
    paddingHorizontal: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  rankText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  nameText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  legendContainer: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 10,
    width: '45%',
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default PollutedTehsilsScreen;
