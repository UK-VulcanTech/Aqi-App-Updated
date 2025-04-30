import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import {BarChart, LineChart} from 'react-native-chart-kit';

// import {useGetAllSensors} from '../../services/sensor.hooks';
import {useGetSensorDataLastSevenDays} from '../../services/sensors/sensor.hooks';

const AirQualityChart = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('PM 2.5');
  const [timeRange, setTimeRange] = useState('7 Days');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [barData, setBarData] = useState([]);
  const [chartType, setChartType] = useState('bar'); // Default chart type: 'bar' or 'line'

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 120;

  const {data: sensorData} = useGetSensorDataLastSevenDays();

  // Extract just the overall_mean values for each date
  const overallMeansByDate = sensorData?.daily_means
    ? Object.entries(sensorData.daily_means).reduce((result, [date, data]) => {
        result[date] = data.overall_mean;
        return result;
      }, {})
    : {};

  console.log(
    '🚀 ~ AirQualityChart ~ Daily Overall Mean AQI:',
    overallMeansByDate,
  );

  // Custom rounding function to round up to next integer
  const roundUp = value => {
    return Math.ceil(value);
  };

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

  const processPM25Data = () => {
    if (!sensorData || !sensorData.daily_means) {
      return [];
    }

    // Sort dates in ascending order to show properly on chart
    const sortedDates = Object.keys(sensorData.daily_means).sort();

    return sortedDates.slice(-7).map(date => {
      // Use overall_mean for PM 2.5 data
      const value = sensorData.daily_means[date].overall_mean || 0;

      // Round up the value to next integer
      const roundedValue = roundUp(value);

      const dateObj = new Date(date);
      const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        dateObj.getDay()
      ];

      return {
        label: dayLabel,
        value: roundedValue,
        color: getValueColor(roundedValue, 'PM 2.5'),
      };
    });
  };

  const generatePollutantData = (pollutant, range) => {
    let data = [];
    if (range === '24 Hours') {
      data = Array.from({length: 24}, (_, i) => {
        const value = Math.floor(Math.random() * 60) + 120;
        return {
          label: `${i}:00`,
          value: roundUp(value),
          color: getValueColor(value, pollutant),
        };
      });
    } else if (range === '7 Days') {
      // For PM 2.5, use actual data from API if available
      if (pollutant === 'PM 2.5' && sensorData?.daily_means) {
        return processPM25Data();
      } else {
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = Array.from({length: 7}, (_, i) => {
          const value = Math.floor(Math.random() * 60) + 120;
          return {
            label: dayLabels[i],
            value: roundUp(value),
            color: getValueColor(value, pollutant),
          };
        });
      }
    } else {
      data = Array.from({length: 30}, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - 29 + i);
        const value = Math.floor(Math.random() * 60) + 120;
        return {
          label: `${day.getDate()}`,
          value: roundUp(value),
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
  const chartTypes = ['bar', 'line'];

  useEffect(() => {
    // For PM 2.5 and 7 Days, refresh data when sensorData changes
    if (
      selectedPollutant === 'PM 2.5' &&
      timeRange === '7 Days' &&
      sensorData?.daily_means
    ) {
      setBarData(processPM25Data());
    } else {
      // Use existing pollutant data for other cases
      const fullData = pollutantData[selectedPollutant][timeRange];
      const displayData =
        timeRange === '7 Days' ? fullData : getSubsetData(fullData, timeRange);
      setBarData(displayData);
    }
  }, [selectedPollutant, timeRange, sensorData]);

  useEffect(() => {
    // Initialize with PM 2.5 data
    if (sensorData?.daily_means) {
      setBarData(processPM25Data());
    } else {
      setBarData(pollutantData['PM 2.5']['7 Days']);
    }
  }, []);

  const barChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => 'rgba(254, 186, 23, 1)', // Always fully opaque
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    barPercentage: timeRange === '7 Days' ? 0.75 : 0.6,
    barRadius: 4,
    propsForLabels: {
      fontSize: 0,
    },
    formatYLabel: () => '',
  };

  const lineChartConfig = {
    ...barChartConfig,
    strokeWidth: 3,
    useShadowColorFromDataset: false,
    color: () => 'rgba(254, 186, 23, 1)',
  };

  // Calculate statistics
  const minValue =
    barData.length > 0 ? Math.min(...barData.map(item => item.value)) : 0;
  const maxValue =
    barData.length > 0 ? Math.max(...barData.map(item => item.value)) : 0;
  const avgValue =
    barData.length > 0
      ? Math.round(
          barData.reduce((sum, item) => sum + item.value, 0) / barData.length,
        )
      : 0;

  // Render the appropriate chart based on chartType
  const renderChart = (data, config) => {
    if (chartType === 'bar') {
      return (
        <BarChart
          data={{
            labels: data.map(item => item.label),
            datasets: [
              {
                data: data.map(item => item.value),
              },
            ],
          }}
          width={chartWidth}
          height={200}
          yAxisSuffix=""
          chartConfig={{
            ...config,
            paddingTop: 0,
            yAxisLabelWidth: 35,
          }}
          style={styles.chart}
          fromZero={true}
          withInnerLines={false}
          segments={5}
          showValuesOnTopOfBars={true}
          withHorizontalLabels={false}
          yAxisLabel=""
          withVerticalLines={false}
        />
      );
    } else {
      return (
        <LineChart
          data={{
            labels: data.map(item => item.label),
            datasets: [
              {
                data: data.map(item => item.value),
                color: (opacity = 1) => 'rgba(254, 186, 23, 1)',
                strokeWidth: 3,
              },
            ],
          }}
          width={chartWidth}
          height={200}
          chartConfig={{
            ...config,
            paddingTop: 0,
            yAxisLabelWidth: 35,
          }}
          style={styles.chart}
          bezier
          fromZero
          withInnerLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={true}
          hidePointsAtIndex={[]}
          withDots={true}
          withShadow={false}
        />
      );
    }
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

          {/* Chart Type Selector */}
          <View style={styles.chartTypeContainer}>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === 'bar' && styles.activeChartTypeButton,
              ]}
              onPress={() => setChartType('bar')}>
              <Text
                style={[
                  styles.chartTypeText,
                  chartType === 'bar' && styles.activeChartTypeText,
                ]}>
                Bar Chart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === 'line' && styles.activeChartTypeButton,
              ]}
              onPress={() => setChartType('line')}>
              <Text
                style={[
                  styles.chartTypeText,
                  chartType === 'line' && styles.activeChartTypeText,
                ]}>
                Line Chart
              </Text>
            </TouchableOpacity>
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

          {/* Chart */}
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
                <View style={{height: 200, paddingBottom: 20}}>
                  {renderChart(barData, barChartConfig)}
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
                <Text style={[styles.statValue, styles.minStatValue]}>
                  {minValue}
                </Text>
              </View>
              <View style={styles.statSeparator} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg</Text>
                <Text style={[styles.statValue, styles.avgStatValue]}>
                  {avgValue}
                </Text>
              </View>
              <View style={styles.statSeparator} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={[styles.statValue, styles.maxStatValue]}>
                  {maxValue}
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
    paddingVertical: 8,
    paddingBottom: 30,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    paddingTop: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'left',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  activeTimeRangeButton: {
    backgroundColor: '#696',
  },
  timeRangeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  activeTimeRangeText: {
    color: '#FFFFFF',
  },
  // Chart type selector styles
  chartTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    // marginLeft: 8,
    gap: 40,
  },
  chartTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  activeChartTypeButton: {
    backgroundColor: '#4CAF50',
  },
  chartTypeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  activeChartTypeText: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollutantContainer: {
    position: 'relative',
  },
  pollutantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#696969',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pollutantButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
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
    top: 34,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 13,
    color: '#4B5563',
  },
  selectedDropdownText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  chartContainer: {
    height: 240,
    flexDirection: 'row',
    marginBottom: 12,
  },
  yAxisContainer: {
    height: 220,
    width: 40,
    position: 'relative',
    alignItems: 'flex-end',
  },
  customYAxisLabels: {
    position: 'relative',
    width: 40,
    height: 220,
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
    top: 45,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel120: {
    position: 'absolute',
    top: 90,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel60: {
    position: 'absolute',
    top: 135,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  yAxisLabel0: {
    position: 'absolute',
    top: 180,
    right: 10,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  chart: {
    marginVertical: 6,
    borderRadius: 16,
    paddingRight: 0,
    marginLeft: 0,
  },
  chartWrapper: {
    height: 240,
    position: 'relative',
    flex: 1,
  },
  dateLabelsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
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
  statsContainer: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
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
  },
  minStatValue: {
    color: '#FEBA17', // Yellow for min
  },
  maxStatValue: {
    color: '#FF4D4F', // Red for max
  },
  avgStatValue: {
    color: '#FEBA17', // Green for avg
  },
  statSeparator: {
    height: 24,
    width: 1,
    backgroundColor: '#E5E7EB',
  },
});

export default AirQualityChart;
