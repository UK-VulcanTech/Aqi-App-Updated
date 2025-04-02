import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const AirQualityChart = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('PM 10');
  const [timeRange] = useState('7 Days');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrollViewRef = useRef(null);

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

  const pollutants = ['AQI', 'PM 2.5', 'PM 10', 'CO', 'SO2', 'NO2', 'O3'];
  const screenWidth = Dimensions.get('window').width;

  // Calculate chart width based on number of bars with spacing
  const barWidth = 40;
  const barSpacing = 40;
  const chartWidth = Math.max(
    screenWidth - 40,
    airQualityData.length * (barWidth + barSpacing),
  );

  // Chart config for bar chart
  // Modify the barChartConfig object by adding a barPercentage and barRadius property
  const barChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1, index) => {
      if (index === undefined || index >= airQualityData.length) {
        return `rgba(249, 115, 22, ${opacity})`;
      }
      const value = airQualityData[index].value;
      return value >= 150
        ? `rgba(249, 115, 22, ${opacity})` // orange
        : `rgba(250, 204, 21, ${opacity})`; // yellow
    },
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    barPercentage: 0.7, // Reduce from 0.6 to create more space
    barRadius: 4, // Optional: add rounded corners to bars
    propsForLabels: {
      fontSize: 0, // Hide default labels
    },
    formatYLabel: () => '', // Hide Y axis labels since we're using custom ones
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.borderTop}>
          {/* <View style={styles.headerContainer}>
            <Text style={styles.title}>Historical Air Quality Data</Text>
            <Text style={styles.subtitle}>Air Quality Index in Lahore</Text>
          </View> */}

          <View style={styles.controlsContainer}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>{timeRange}</Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setDropdownOpen(!dropdownOpen)}>
                  <View style={styles.pollutantButton}>
                    <Text style={styles.buttonText}>{selectedPollutant}</Text>
                    <Image
                      source={require('../../assets/icons/chevron-down.png')}
                      style={styles.downIcon}
                    />
                  </View>

                  {/* <View style={styles.iconPlaceholder} /> */}
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
              <View style={styles.locationIconPlaceholder} />
              <Text style={styles.locationText}>Lahore, Punjab, PK</Text>
            </TouchableOpacity>

            <View style={styles.chartContainer}>
              {/* Y-axis fixed on the left with custom labels */}
              <View style={styles.yAxisContainer}>
                <View style={styles.customYAxisLabels}>
                  <Text style={styles.yAxisLabelTop}>500+</Text>
                  <Text style={styles.yAxisLabel240}>240</Text>
                  <Text style={styles.yAxisLabel120}>120</Text>
                  <Text style={styles.yAxisLabel60}>60</Text>
                  <Text style={styles.yAxisLabel0}>0</Text>
                </View>
              </View>

              {/* Scrollable chart area */}
              <ScrollView
                horizontal={true}
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.chartWrapper}>
                  <BarChart
                    data={{
                      labels: airQualityData.map(() => ''),
                      datasets: [
                        {
                          data: airQualityData.map(item => item.value),
                        },
                      ],
                    }}
                    width={chartWidth}
                    height={230}
                    yAxisSuffix=""
                    chartConfig={barChartConfig}
                    style={styles.chart}
                    fromZero={true}
                    withInnerLines={false}
                    segments={6}
                    showValuesOnTopOfBars={true}
                    withHorizontalLabels={false}
                    yAxisLabel=""
                    withVerticalLines={false}
                  />

                  {/* Date labels container */}
                  <View style={styles.dateLabelsContainer}>
                    {airQualityData.map((item, index) => {
                      const totalBarWidth = barWidth + barSpacing;
                      const xPos = totalBarWidth * index + barWidth / 2;

                      return (
                        <View
                          key={index}
                          style={[
                            styles.dateLabelContainer,
                            {left: xPos - 35}, // Widened to fit combined date and day
                          ]}>
                          <Text style={styles.dateLabel}>
                            {item.date}, {item.day}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
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
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1F2937',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  pollutantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    backgroundColor: '#1F2937',
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
    color: '#60A5FA',
  },
  nonSelectedDropdownText: {
    marginLeft: 24,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 24,
    width: '100%',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#3B82F6',
  },
  chartContainer: {
    height: 300,
    flexDirection: 'row',
    position: 'relative',
  },
  yAxisContainer: {
    height: 250,
    width: 40,
    position: 'relative',
    alignItems: 'flex-end',
  },
  customYAxisLabels: {
    position: 'relative',
    width: 40,
    height: 250,
  },
  yAxisLabelTop: {
    position: 'absolute',
    top: 0,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel240: {
    position: 'absolute',
    top: 46,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel120: {
    position: 'absolute',
    top: 92,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel60: {
    position: 'absolute',
    top: 138,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel0: {
    position: 'absolute',
    top: 184,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  chart: {
    marginVertical: 12,
    borderRadius: 16,
    paddingRight: 20,
    marginLeft: 20, // Added left margin to the bars
  },
  scrollViewContent: {
    paddingRight: 20,
  },
  chartWrapper: {
    height: 300,
    position: 'relative',
  },
  dateLabelsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15, // Adjusted to match the chart margin
    right: 0,
    height: 40,
  },
  dateLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 70, // Widened to accommodate date and day
  },
  dateLabel: {
    fontSize: 10,
    color: '#6B7280',
    transform: [{rotate: '-60deg'}],
    textAlign: 'center',
    width: 100, // Give enough width for the combined date and day
  },
});

export default AirQualityChart;
