import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Header from '../components/dashboard/Header';

// H1 function component
const H1 = ({children, style}) => {
  return <Text style={[styles.h1Text, style]}>{children}</Text>;
};

const PollutedTehsilsScreen = () => {
  const tehsilData = [
    {
      id: '01',
      name: 'Shalimar',
      aqi: 178,
      status: 'Unhealthy',
    },
    {
      id: '02',
      name: 'Lahore City',
      aqi: 165,
      status: 'Unhealthy',
    },
    {
      id: '03',
      name: 'Model Town',
      aqi: 163,
      status: 'Unhealthy',
    },
    {
      id: '04',
      name: 'Raiwind',
      aqi: 144,
      status: 'Poor',
    },
    {
      id: '05',
      name: 'Lahore Cantt',
      aqi: 138,
      status: 'Poor',
    },
  ];

  const getAqiColor = aqi => {
    if (aqi <= 50) {
      return '#10B981'; // Green for good
    } else if (aqi <= 150) {
      return '#F59E0B'; // Yellow/amber for moderate
    } else {
      return '#EF4444'; // Red for unhealthy
    }
  };

  const getAqiStatus = aqi => {
    if (aqi <= 50) {
      return 'Good';
    } else if (aqi <= 100) {
      return 'Moderate';
    } else if (aqi <= 150) {
      return 'Poor';
    } else if (aqi <= 200) {
      return 'Unhealthy';
    } else if (aqi <= 300) {
      return 'VeryUnhealthy';
    } else {
      return 'Hazardous';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header /> */}
      <ScrollView>
        <View style={styles.content}>
          {/* Heading Section */}
          <View style={styles.headingContainer}>
            <H1>Most Polluted Tehsils in Lahore 2025</H1>
            <Text style={styles.headingSubtitle}>
              Analyze the real-time most air polluted tehsils in the city
            </Text>
          </View>

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
                AQI
              </Text>
              <Text
                style={[styles.headerText, styles.statusColumn]}
                numberOfLines={1}>
                Status
              </Text>
            </View>

            {/* Table Rows */}
            <View style={styles.tableRows}>
              {tehsilData.map(tehsil => (
                <View key={tehsil.id} style={styles.tableRow}>
                  <Text
                    style={[styles.rankText, styles.rankColumn]}
                    numberOfLines={1}>
                    {tehsil.id}.
                  </Text>
                  <Text
                    style={[styles.nameText, styles.tehsilColumn]}
                    numberOfLines={1}>
                    {tehsil.name}
                  </Text>
                  <Text
                    style={[
                      styles.aqiValueText,
                      styles.aqiColumn,
                      {color: getAqiColor(tehsil.aqi)},
                    ]}
                    numberOfLines={1}>
                    {tehsil.aqi}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      styles.statusColumn,
                      {color: getAqiColor(tehsil.aqi)},
                    ]}
                    numberOfLines={1}>
                    {tehsil.status || getAqiStatus(tehsil.aqi)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headingContainer: {
    marginBottom: 16,
  },
  h1Text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  headingSubtitle: {
    fontSize: 16,
    color: '#7D7D7D',
    fontWeight: '500',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 14,
    ellipsizeMode: 'tail',
  },
  tableRows: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#2A2F34',
    marginBottom: 8,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankColumn: {
    width: '18%',
    paddingLeft: 12,
    paddingRight: 4,
    textAlign: 'left',
  },
  tehsilColumn: {
    width: '32%',
    paddingHorizontal: 4,
    textAlign: 'left',
    ellipsizeMode: 'tail',
  },
  aqiColumn: {
    width: '15%',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  statusColumn: {
    width: '25%',
    paddingHorizontal: 4,
    textAlign: 'left',
    ellipsizeMode: 'tail',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'left',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  aqiValueText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default PollutedTehsilsScreen;
