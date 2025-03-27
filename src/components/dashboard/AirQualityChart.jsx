import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const AirQualityChart = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('PM 10');
  const [timeRange] = useState('7 Days');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sample data for the chart
  const airQualityData = [
    {date: '03/04/2025', day: 'Mon', value: 145},
    {date: '04/04/2025', day: 'Tue', value: 190},
    {date: '05/04/2025', day: 'Wed', value: 203},
    {date: '06/04/2025', day: 'Thu', value: 245},
    {date: '07/04/2025', day: 'Fri', value: 165},
    {date: '08/04/2025', day: 'Sat', value: 210},
    {date: '09/04/2025', day: 'Sun', value: 200},
  ];

  // Format data similar to original
  const chartData = airQualityData.map(item => ({
    name: `${item.date}\n${item.day}`,
    value: item.value,
    fill: item.value >= 150 ? '#F97316' : '#FACC15', // orange-400 : yellow-400
  }));

  const pollutants = ['AQI', 'PM 2.5', 'PM 10', 'CO', 'SO2', 'NO2', 'O3'];
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.borderTop}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Historical Air Quality Data</Text>
            <Text style={styles.subtitle}>Air Quality Index in Lahore</Text>
          </View>

          <View style={styles.controlsContainer}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>{timeRange}</Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setDropdownOpen(!dropdownOpen)}>
                  <Text style={styles.buttonText}>{selectedPollutant}</Text>
                  {/* Placeholder for your chevron icon */}
                  <View style={styles.iconPlaceholder} />
                </TouchableOpacity>

                {dropdownOpen && (
                  <View style={styles.dropdown}>
                    {pollutants.map(pollutant => (
                      <TouchableOpacity
                        key={pollutant}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedPollutant(pollutant);
                          setDropdownOpen(false);
                        }}>
                        {selectedPollutant === pollutant && (
                          <View style={styles.iconPlaceholder} />
                        )}
                        <Text
                          style={[
                            styles.dropdownText,
                            selectedPollutant === pollutant &&
                              styles.selectedDropdownText,
                            selectedPollutant !== pollutant &&
                              styles.nonSelectedDropdownText,
                          ]}>
                          {pollutant}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.chartCard}>
            <TouchableOpacity style={styles.locationButton}>
              {/* Placeholder for your location icon */}
              <View style={styles.locationIconPlaceholder} />
              <Text style={styles.locationText}>Lahore, Punjab, PK</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chartContainer}>
                {/* Using an approach better suited for React Native */}
                <View
                  style={{height: 300, width: Math.max(screenWidth - 40, 600)}}>
                  <BarChart
                    data={{
                      labels: airQualityData.map(item => ''), // Empty labels as we'll render custom ones
                      datasets: [
                        {
                          data: airQualityData.map(item => item.value),
                        },
                      ],
                    }}
                    width={Math.max(screenWidth - 40, 600)}
                    height={230} // Reduced height to make room for diagonal labels
                    yAxisSuffix=""
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1, index) => {
                        if (index === undefined || index >= chartData.length) {
                          return `rgba(249, 115, 22, ${opacity})`;
                        }
                        const value = airQualityData[index].value;
                        return value >= 150
                          ? `rgba(249, 115, 22, ${opacity})` // orange
                          : `rgba(250, 204, 21, ${opacity})`; // yellow
                      },
                      labelColor: (opacity = 1) =>
                        `rgba(107, 114, 128, ${opacity})`,
                      barPercentage: 0.8,
                    }}
                    style={styles.chart}
                    fromZero
                    withInnerLines={false}
                    segments={6}
                    hidePointsAtIndex={[]}
                    getDotProps={(value, index) => {
                      return {
                        r: '0',
                        strokeWidth: '0',
                        stroke: 'transparent',
                      };
                    }}
                  />

                  {/* Adding custom date labels with diagonal orientation */}
                  <View style={styles.customLabelsContainer}>
                    {airQualityData.map((item, index) => (
                      <View key={index} style={styles.customLabel}>
                        <Text style={styles.dateLabel}>
                          {item.date}/{item.day}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
  },
  subtitle: {
    fontSize: 18,
    color: '#7D7D7D',
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1F2937', // gray-800
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 40,
    width: 140,
    backgroundColor: '#1F2937', // gray-800
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedDropdownText: {
    color: '#60A5FA', // blue-400
  },
  nonSelectedDropdownText: {
    marginLeft: 24,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 24,
    marginHorizontal: 'auto',
    width: '100%',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB', // theme-border
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  locationIconPlaceholder: {
    width: 18,
    height: 18,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  locationText: {
    fontSize: 14,
    color: '#3B82F6', // blue-500
  },
  chartContainer: {
    minHeight: 300,
    position: 'relative',
  },
  chart: {
    marginVertical: 12,
    borderRadius: 16,
  },
  customLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 30,
    height: 60, // Added height to accommodate rotated labels
  },
  customLabel: {
    alignItems: 'center',
    transform: [{rotate: '-45deg'}],
    marginTop: -10, // Adjust to position labels in the right spot
  },
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'left',
  },
};

export default AirQualityChart;
