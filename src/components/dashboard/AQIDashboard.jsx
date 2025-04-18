import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useGetAllSensors,
  useGetLatestMeanAQIValues,
  useGetLatestMeanSensorValues,
} from '../../services/sensor.hooks';

// Function to get AQI category based on value
const getAQICategory = value => {
  if (value <= 50) {
    return {
      text: 'Good',
      color: '#A5D46A',
      gradientColors: ['#FFFFFF', '#E8F5D8', '#F2F9E8'],
    };
  }
  if (value <= 100) {
    return {
      text: 'Moderate',
      color: '#FFDA75',
      gradientColors: ['#FFFFFF', '#FFF6D8', '#FFFAEB'],
    };
  }
  if (value <= 150) {
    return {
      text: 'Poor',
      color: '#F5A05A',
      gradientColors: ['#FFFFFF', '#FBE8D8', '#FDEFDE'],
    };
  }
  if (value <= 200) {
    return {
      text: 'Unhealthy',
      color: '#EB6B6B',
      gradientColors: ['#FFFFFF', '#F9D8D8', '#FCE9E9'],
    };
  }
  if (value <= 250) {
    return {
      text: 'Very Unhealthy',
      color: '#B085C9',
      gradientColors: ['#FFFFFF', '#EBE0F2', '#F4ECF7'],
    };
  }
  return {
    text: 'Hazardous',
    color: '#CF3030',
    gradientColors: ['#FFFFFF', '#F5D8D8', '#F9E6E6'],
  };
};

const AQIDashboard = () => {
  // Get AQI data
  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetLatestMeanAQIValues();

  // Get PM2.5 data
  const {
    data: sensorMeanData,
    isLoading: sensorMeanLoading,
    error: sensorMeanError,
  } = useGetLatestMeanSensorValues();

  console.log('🚀 ~ AQIDashboard ~ sensorMeanData:', sensorMeanData);

  const {
    data: sensorLocations,
    isLoading: locationsLoading,
    error: locationsError,
  } = useGetAllSensors();

  // Hardcode the location as "Lahore"
  const [selectedLocation] = useState('Lahore');
  const [aqiData, setAqiData] = useState(null);
  const [pm25Data, setPm25Data] = useState(null);

  // Process AQI data from sensorData
  useEffect(() => {
    if (sensorData && !sensorData.error && sensorData.overall) {
      setAqiData({
        overall_value: Math.round(sensorData.overall.latest_hour_mean),
        timestamp: sensorData.latest_date,
      });
    }
  }, [sensorData]);

  // Process PM2.5 data from sensorMeanData
  useEffect(() => {
    if (sensorMeanData && !sensorMeanData.error && sensorMeanData.overall) {
      // For PM2.5, we're using the sensorMeanData but accessing the overall latest_hour_mean
      setPm25Data({
        value: Math.round(sensorMeanData.overall.latest_hour_mean),
        timestamp: sensorMeanData.latest_date,
      });
    }
  }, [sensorMeanData]);

  // Format timestamp to show days, hours, or minutes ago
  const getLastUpdatedText = () => {
    // Use PM2.5 data timestamp if available, otherwise use AQI data timestamp
    const timestamp = pm25Data?.timestamp || aqiData?.timestamp || null;

    if (!timestamp) {
      return 'Last Updated: --';
    }

    const sensorDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - sensorDate;

    // Calculate time units
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format based on the largest time unit
    if (diffDays > 0) {
      return `Last Updated: ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `Last Updated: ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `Last Updated: ${diffMinutes} minute${
        diffMinutes !== 1 ? 's' : ''
      } ago`;
    } else {
      return 'Last Updated: Just now';
    }
  };

  // Get AQI category
  const getAQIDetails = () => {
    if (!aqiData) {
      return {
        text: '--',
        color: '#FFDA75',
        gradientColors: ['#FFFFFF', '#F0C09D', '#F8D7BE'],
      };
    }
    return getAQICategory(aqiData.overall_value);
  };

  const aqiCategory = getAQIDetails();

  return (
    <SafeAreaView style={styles.container}>
      {/* Dynamic Gradient Background based on AQI category */}
      <LinearGradient
        colors={aqiCategory.gradientColors}
        style={styles.gradientBackground}
        locations={[0.0, 0.5, 0.8]}
      />
      <StatusBar backgroundColor="#E4E4E4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.content}>
        {/* AQI Title and Location */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>AQI Level</Text>
        </View>

        <Text style={styles.location}>{selectedLocation}</Text>
        <Text style={styles.updateTime}>{getLastUpdatedText()}</Text>

        {/* Loading indicators */}
        {(sensorsLoading || sensorMeanLoading || locationsLoading) && (
          <Text style={styles.loadingText}>Loading data...</Text>
        )}

        {/* Error messages */}
        {(sensorsError || sensorMeanError || locationsError) && (
          <Text style={styles.errorText}>Error loading data</Text>
        )}

        {/* AQI Display - Centered */}
        <View style={styles.aqiCenterContainer}>
          <View style={styles.aqiDisplayContainer}>
            <View
              style={[
                styles.moderateBox,
                {backgroundColor: aqiCategory.color},
              ]}>
              <Text style={styles.moderateText}>{aqiCategory.text}</Text>
            </View>
            <Text
              style={[
                styles.aqiNumber,
                // Optionally adjust text color to match category
                {
                  color:
                    aqiCategory.color === '#A5D46A'
                      ? '#568B35'
                      : aqiCategory.color === '#FFDA75'
                      ? '#B38F1D'
                      : aqiCategory.color === '#F5A05A'
                      ? '#A85714'
                      : aqiCategory.color === '#EB6B6B'
                      ? '#8B2323'
                      : aqiCategory.color === '#B085C9'
                      ? '#69397A'
                      : '#8B1A1A',
                },
              ]}>
              {aqiData ? aqiData.overall_value : '--'}
            </Text>
          </View>
        </View>

        {/* Rest of the component remains the same */}
        <View style={styles.scaleSection}>
          <View style={styles.aqiScaleContainer}>
            <View style={styles.scaleContainer}>
              <View style={styles.pointerContainer}>
                <View style={styles.pointer} />
              </View>

              <View style={styles.levelsContainer}>
                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.goodColor]}>
                    <Text style={styles.colorBarNumber}>50</Text>
                  </View>
                  <Text style={styles.scaleText}>Good</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.moderateColor]}>
                    <Text style={styles.colorBarNumber}>100</Text>
                  </View>
                  <Text style={styles.scaleText}>Moderate</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.poorColor]}>
                    <Text style={styles.colorBarNumber}>150</Text>
                  </View>
                  <Text style={styles.scaleText}>Poor</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.unhealthyColor]}>
                    <Text style={styles.colorBarNumber}>200</Text>
                  </View>
                  <Text style={styles.scaleText}>Unhealthy</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.veryUnhealthyColor]}>
                    <Text style={styles.colorBarNumber}>250</Text>
                  </View>
                  <Text style={styles.scaleText}>Very Unhealthy</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.hazardousColor]}>
                    <Text style={styles.colorBarNumber}>300+</Text>
                  </View>
                  <Text style={styles.scaleText}>Hazardous</Text>
                </View>
              </View>
            </View>

            {/* PM2.5 text and Person with mask - right side */}
            <View style={styles.personContainer}>
              {/* PM2.5 text above the person image - aligned to right */}
              <Text style={styles.pmText}>
                PM2.5:{' '}
                <Text style={styles.pmValue}>
                  {pm25Data ? Math.round(pm25Data.value) : '--'}
                </Text>{' '}
                μg/m³
              </Text>

              <Image
                source={
                  aqiCategory.text === 'Good'
                    ? require('../../assets/images/Good.png')
                    : aqiCategory.text === 'Moderate'
                    ? require('../../assets/images/Moderate.png')
                    : aqiCategory.text === 'Poor'
                    ? require('../../assets/images/Poor.png')
                    : aqiCategory.text === 'Unhealthy'
                    ? require('../../assets/images/Unhealthy.png')
                    : aqiCategory.text === 'Very Unhealthy'
                    ? require('../../assets/images/VeryUnhealthy.png')
                    : require('../../assets/images/Hazardous.png')
                }
                style={styles.personImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCardWrapper}>
          <View
            style={[
              styles.weatherCard,
              // Optionally adjust weather card background to match category
              {
                backgroundColor: `rgba(${
                  aqiCategory.color === '#A5D46A'
                    ? '230, 240, 220'
                    : aqiCategory.color === '#FFDA75'
                    ? '240, 235, 220'
                    : aqiCategory.color === '#F5A05A'
                    ? '240, 230, 220'
                    : aqiCategory.color === '#EB6B6B'
                    ? '240, 220, 220'
                    : aqiCategory.color === '#B085C9'
                    ? '235, 220, 240'
                    : '240, 215, 215'
                }, 0.15)`,
              },
            ]}>
            <View style={styles.weatherTopSection}>
              <Text style={styles.temperatureText}>17°C</Text>
              <Text style={styles.weatherCondition}>Weather</Text>
            </View>

            <View style={styles.weatherBottomSection}>
              <View style={styles.weatherDataItem}>
                <Image
                  source={require('../../assets/icons/humidity.png')}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherDataLabel}>Humidity</Text>
                <Text style={styles.weatherDataValue}>66 %</Text>
              </View>

              <View style={styles.weatherDataItemSeparator} />

              <View style={styles.weatherDataItem}>
                <Image
                  source={require('../../assets/icons/wind.png')}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherDataLabel}>Wind Speed</Text>
                <Text style={styles.weatherDataValue}>7 km/h</Text>
              </View>

              <View style={styles.weatherDataItemSeparator} />

              <View style={styles.weatherDataItem}>
                <Image
                  source={require('../../assets/icons/uv.png')}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherDataLabel}>UV Index</Text>
                <Text style={styles.weatherDataValue}>2</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* City Skyline Background */}
      <Image
        source={require('../../assets/images/Lahore.png')}
        style={styles.cityBackground}
      />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 180, // Add padding at bottom to make space for skyline
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aqiIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444',
  },
  location: {
    fontSize: 16,
    color: '#ff5252',
    marginTop: 5,
  },
  updateTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
    fontStyle: 'italic',
  },
  aqiCenterContainer: {
    marginTop: 20,
    marginRight: 20,
  },
  aqiDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 's', // Space between category box and number
  },
  moderateBox: {
    backgroundColor: '#B75E5E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  moderateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  aqiNumber: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#8B2323',
    textAlign: 'right',
    marginLeft: 50, // Reduced gap to a more reasonable spacing
  },
  scaleSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  pmText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 20,
    textAlign: 'right', // Align text to right
  },
  pmValue: {
    fontWeight: 'bold',
  },
  aqiScaleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between', // Creates space between scale and person
  },
  scaleContainer: {
    flexDirection: 'row',
    width: 160, // Reduce width to create more space for PM2.5
  },
  pointerContainer: {
    width: 5,
    justifyContent: 'center',
    marginTop: 12,
  },
  pointer: {
    // Pointer styles if needed
  },
  levelsContainer: {
    flex: 1,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  colorBar: {
    width: 50,
    height: 30,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBarNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  goodColor: {
    backgroundColor: '#A5D46A',
  },
  moderateColor: {
    backgroundColor: '#FFDA75',
  },
  poorColor: {
    backgroundColor: '#F5A05A',
  },
  unhealthyColor: {
    backgroundColor: '#EB6B6B',
  },
  veryUnhealthyColor: {
    backgroundColor: '#B085C9',
  },
  hazardousColor: {
    backgroundColor: '#CF3030',
  },
  scaleText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  personContainer: {
    alignItems: 'flex-end', // Align content to right
    marginLeft: 20, // Add space between scale and person container
  },
  personImage: {
    width: 120,
    height: 120,
  },
  cityBackground: {
    width: '100%',
    height: 220,
    position: 'absolute',
    bottom: 20,
  },
  weatherCardWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  weatherCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(240, 220, 220, 0.15)', // Changed from 0.25 to 0.15
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  weatherTopSection: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperatureText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
  },
  weatherCondition: {
    color: '#444',
    fontSize: 16,
    textAlign: 'right',
  },
  weatherBottomSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherDataItem: {
    flex: 1,
    alignItems: 'center',
  },
  weatherDataItemSeparator: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  weatherDataLabel: {
    color: '#555',
    fontSize: 12,
    marginBottom: 4,
  },
  weatherDataValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AQIDashboard;
