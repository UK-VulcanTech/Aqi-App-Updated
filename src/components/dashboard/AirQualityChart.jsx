import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

// import {useGetAllSensors} from '../../services/sensor.hooks';
import {useGetSensorDataLastSevenDays} from '../../services/sensor.hooks';

const AirQualityChart = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('PM 10');
  const [timeRange, setTimeRange] = useState('7 Days');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [barData, setBarData] = useState([]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 120;

  const {data: sensorData} = useGetSensorDataLastSevenDays();
  console.log('🚀 ~ AirQualityChart ~ sensorData:', sensorData);

  const getValueColor = (value, pollutant) => {
    return '#FEBA17';
  };

  const getSubsetData = (data, type) => {
    if (type === '24 Hours') {
      return data.filter((_, index) => index % 4 === 0);
    } else if (type === '30 Days') {
      return data.filter((_, index) => index % 3 === 0);
    }
    return data;
  };

  const generatePollutantData = (pollutant, range) => {
    let data = [];
    if (range === '24 Hours') {
      data = Array.from({length: 24}, (_, i) => {
        const value = Math.floor(Math.random() * 60) + 120;
        return {
          label: `${i}:00`,
          value: value,
          date: '04/07',
          color: getValueColor(value, pollutant),
        };
      });
    } else if (range === '7 Days') {
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      data = Array.from({length: 7}, (_, i) => {
        const value = Math.floor(Math.random() * 60) + 120;
        return {
          label: dayLabels[i],
          value: value,
          date: `04/${i + 1}`,
          color: getValueColor(value, pollutant),
        };
      });
    } else {
      data = Array.from({length: 30}, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - 29 + i);
        const value = Math.floor(Math.random() * 60) + 120;
        return {
          label: `${day.getDate()}`,
          value: value,
          date: `${day.getMonth() + 1}/${day.getDate()}`,
          color: getValueColor(value, pollutant),
        };
      });
    }
    return data;
  };

  const pollutantData = {
    AQI: {
      '24 Hours': generatePollutantData('AQI', '24 Hours'),
      '7 Days': generatePollutantData('AQI', '7 Days'),
      '30 Days': generatePollutantData('AQI', '30 Days'),
    },
    'PM 2.5': {
      '24 Hours': generatePollutantData('PM 2.5', '24 Hours'),
      '7 Days': generatePollutantData('PM 2.5', '7 Days'),
      '30 Days': generatePollutantData('PM 2.5', '30 Days'),
    },
    'PM 10': {
      '24 Hours': generatePollutantData('PM 10', '24 Hours'),
      '7 Days': generatePollutantData('PM 10', '7 Days'),
      '30 Days': generatePollutantData('PM 10', '30 Days'),
    },
    CO: {
      '24 Hours': generatePollutantData('CO', '24 Hours'),
      '7 Days': generatePollutantData('CO', '7 Days'),
      '30 Days': generatePollutantData('CO', '30 Days'),
    },
    SO2: {
      '24 Hours': generatePollutantData('SO2', '24 Hours'),
      '7 Days': generatePollutantData('SO2', '7 Days'),
      '30 Days': generatePollutantData('SO2', '30 Days'),
    },
    NO2: {
      '24 Hours': generatePollutantData('NO2', '24 Hours'),
      '7 Days': generatePollutantData('NO2', '7 Days'),
      '30 Days': generatePollutantData('NO2', '30 Days'),
    },
    O3: {
      '24 Hours': generatePollutantData('O3', '24 Hours'),
      '7 Days': generatePollutantData('O3', '7 Days'),
      '30 Days': generatePollutantData('O3', '30 Days'),
    },
  };

  const pollutants = ['AQI', 'PM 2.5', 'PM 10', 'CO', 'SO2', 'NO2', 'O3'];
  const timeRanges = ['24 Hours', '7 Days', '30 Days'];

  useEffect(() => {
    const fullData = pollutantData[selectedPollutant][timeRange];
    const displayData =
      timeRange === '7 Days' ? fullData : getSubsetData(fullData, timeRange);
    setBarData(displayData);
  }, [selectedPollutant, timeRange]);

  useEffect(() => {
    const initialData = pollutantData['PM 10']['7 Days'];
    setBarData(initialData);
  }, []);

  const barChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => 'rgba(254, 186, 23, 1)', // Always fully opaque
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    barPercentage: timeRange === '7 Days' ? 0.85 : 0.6,
    barRadius: 4,
    propsForLabels: {
      fontSize: 0,
    },
    formatYLabel: () => '',
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Air Quality Statistics</Text>

          <View style={styles.timeRangeContainer}>
            {timeRanges.map(range => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.timeRangeButton,
                  timeRange === range && styles.activeTimeRangeButton,
                ]}
                onPress={() => setTimeRange(range)}>
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === range && styles.activeTimeRangeText,
                  ]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.controlsRow}>
            <View style={styles.pollutantContainer}>
              <TouchableOpacity
                style={styles.pollutantButton}
                onPress={() => setDropdownOpen(!dropdownOpen)}>
                <Text style={styles.pollutantButtonText}>
                  {selectedPollutant}
                </Text>
                <Image
                  source={require('../../assets/icons/chevron-down.png')}
                  style={styles.downIcon}
                />
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
                      <Text
                        style={[
                          styles.dropdownText,
                          selectedPollutant === pollutant &&
                            styles.selectedDropdownText,
                        ]}>
                        {pollutant}
                      </Text>
                      {selectedPollutant === pollutant && (
                        <View style={styles.selectedIndicator} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.yAxisContainer}>
              <View style={styles.customYAxisLabels}>
                <Text style={styles.yAxisLabelTop}>500</Text>
                <Text style={styles.yAxisLabel240}>240</Text>
                <Text style={styles.yAxisLabel120}>120</Text>
                <Text style={styles.yAxisLabel60}>60</Text>
                <Text style={styles.yAxisLabel0}>0</Text>
              </View>
            </View>

            <View style={styles.chartWrapper}>
              {barData.length > 0 && (
                <View style={{height: 230, paddingBottom: 20}}>
                  <BarChart
                    data={{
                      labels: barData.map(item => item.label),
                      datasets: [
                        {
                          data: barData.map(item => item.value),
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
                    segments={5}
                    showValuesOnTopOfBars={true}
                    withHorizontalLabels={false}
                    yAxisLabel=""
                    withVerticalLines={false}
                  />
                </View>
              )}

              <View style={styles.dateLabelsContainer}>
                {barData.map((item, index) => {
                  const sectionWidth = chartWidth / barData.length;
                  const xPos = sectionWidth * index + sectionWidth / 2;

                  return (
                    <View
                      key={index}
                      style={[styles.dateLabelContainer, {left: xPos - 15}]}>
                      <Text style={styles.dateLabel}>{item.label}</Text>
                      {timeRange !== '24 Hours' && (
                        <Text style={styles.dateSubLabel}>{item.date}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>
                  {Math.min(...barData.map(item => item.value))}
                </Text>
              </View>
              <View style={styles.statSeparator} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>
                  {Math.max(...barData.map(item => item.value))}
                </Text>
              </View>
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
    backgroundColor: '#F3F4F6',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 50,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'left',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  activeTimeRangeButton: {
    backgroundColor: '#1B56FD',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTimeRangeText: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  pollutantContainer: {
    position: 'relative',
  },
  pollutantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B56FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pollutantButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  downIcon: {
    width: 5,
    height: 5,
    tintColor: '#FFFFFF',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 40,
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectedDropdownText: {
    color: '#1B56FD',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1B56FD',
  },
  chartContainer: {
    height: 280,
    flexDirection: 'row',
    marginBottom: 16,
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
    top: 50,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel120: {
    position: 'absolute',
    top: 100,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel60: {
    position: 'absolute',
    top: 150,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel0: {
    position: 'absolute',
    top: 200,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 0,
    marginLeft: 0,
  },
  chartWrapper: {
    height: 280,
    position: 'relative',
    flex: 1,
  },
  dateLabelsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  dateLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 30,
  },
  dateLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  dateSubLabel: {
    marginTop: 2,
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B56FD',
  },
  statSeparator: {
    height: 24,
    width: 1,
    backgroundColor: '#E5E7EB',
  },
});

export default AirQualityChart;
