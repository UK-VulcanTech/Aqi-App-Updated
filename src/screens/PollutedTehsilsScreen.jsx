import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';

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
      standardValue: '12x above Standard',
    },
    {
      id: '02',
      name: 'Lahore City',
      aqi: 165,
      status: 'Unhealthy',
      standardValue: '11x above Standard',
    },
    {
      id: '03',
      name: 'Model Town',
      aqi: 163,
      status: 'Unhealthy',
      standardValue: '11x above Standard',
    },
    {
      id: '04',
      name: 'Raiwind',
      aqi: 144,
      status: 'Poor',
      standardValue: '10x above Standard',
    },
    {
      id: '05',
      name: 'Lahore Cantt',
      aqi: 138,
      status: 'Poor',
      standardValue: '9x above Standard',
    },
  ];

  const getStatusColor = status => {
    return status === 'Unhealthy' ? '#EF4444' : '#F59E0B'; // red-500 : amber-500
  };

  // Calculate the width for progress bar in pixels instead of percentage
  const calculateWidth = aqi => {
    // The base width is 96, as defined in progressBackground
    const maxWidth = 96;
    return (aqi / 200) * maxWidth;
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <View style={[styles.headerCell, {width: 80}]}>
                  <Text style={styles.headerText}>Rank</Text>
                </View>
                <View style={[styles.headerCell, {width: 120}]}>
                  <Text style={styles.headerText}>Tehsil</Text>
                </View>
                <View style={[styles.headerCell, {width: 130}]}>
                  <Text style={styles.headerText}>AQI</Text>
                </View>
                <View style={[styles.headerCell, {width: 120}]}>
                  <Text style={styles.headerText}>AQI Status</Text>
                </View>
                <View style={[styles.headerCell, {width: 160}]}>
                  <Text style={styles.headerText}>Standard Value</Text>
                </View>
              </View>

              {/* Table Rows */}
              <View style={styles.tableRows}>
                {tehsilData.map(tehsil => (
                  <View key={tehsil.id} style={styles.tableRow}>
                    <View style={[styles.cell, {width: 80}]}>
                      <Text style={styles.rankText}>{tehsil.id}.</Text>
                    </View>
                    <View style={[styles.cell, {width: 120}]}>
                      <Text style={styles.nameText}>{tehsil.name}</Text>
                    </View>
                    <View style={[styles.cell, {width: 130}]}>
                      <View style={styles.aqiContainer}>
                        <Text style={styles.aqiText}>{tehsil.aqi}</Text>
                        <View style={styles.progressBackground}>
                          <View
                            style={[
                              styles.progressBar,
                              {
                                width: calculateWidth(tehsil.aqi),
                                backgroundColor: getStatusColor(tehsil.status),
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={[styles.cell, {width: 120}]}>
                      <Text
                        style={[
                          styles.statusText,
                          {color: getStatusColor(tehsil.status)},
                        ]}>
                        {tehsil.status}
                      </Text>
                    </View>
                    <View style={[styles.cell, {width: 160}]}>
                      <Text
                        style={[
                          styles.standardText,
                          {color: getStatusColor(tehsil.status)},
                        ]}>
                        {tehsil.standardValue}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
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
    minWidth: screenWidth - 32,
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
  },
  headerCell: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRows: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginBottom: 8, // Fixed the syntax error here
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  rankText: {
    color: '#374151',
    fontSize: 14,
  },
  nameText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  aqiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aqiText: {
    color: '#374151',
    fontSize: 12,
    marginRight: 8,
  },
  progressBackground: {
    width: 96,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
  },
  standardText: {
    fontSize: 14,
  },
});

export default PollutedTehsilsScreen;
