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

// Define AQI color constants
const AQI_COLORS = {
  GOOD: '#00A652',
  SATISFACTORY: '#A3C853',
  MODERATE: '#FFF200',
  SENSITIVE: '#F7941D',
  UNHEALTHY: '#EF4444',
  VERY_UNHEALTHY: '#9333EA',
  HAZARDOUS: '#FF3333',
};

// Function to get AQI category based on value with consistent colors
const getAQICategory = value => {
  if (value <= 50) {
    return {
      text: 'Good',
      color: AQI_COLORS.GOOD,
      gradientColors: ['#FFFFFF', '#E8F5E8', '#F2F9F2'],
    };
  }
  if (value <= 100) {
    return {
      text: 'Satisfactory',
      color: AQI_COLORS.SATISFACTORY,
      gradientColors: ['#FFFFFF', '#F1F7E8', '#F7FAF2'],
    };
  }
  if (value <= 150) {
    return {
      text: 'Moderate',
      color: AQI_COLORS.MODERATE,
      gradientColors: ['#FFFFFF', '#FFFDE8', '#FFFEF2'],
    };
  }
  if (value <= 200) {
    return {
      text: 'Unhealthy for sensitive group',
      color: AQI_COLORS.SENSITIVE,
      gradientColors: ['#FFFFFF', '#FBF0E8', '#FCF5F0'],
    };
  }
  if (value <= 300) {
    return {
      text: 'Unhealthy',
      color: AQI_COLORS.UNHEALTHY,
      gradientColors: ['#FFFFFF', '#F9E8E8', '#FCF2F2'],
    };
  }
  if (value <= 400) {
    return {
      text: 'Very Unhealthy',
      color: AQI_COLORS.VERY_UNHEALTHY,
      gradientColors: ['#FFFFFF', '#EFE8F5', '#F5F2F9'],
    };
  }
  return {
    text: 'Hazardous',
    color: AQI_COLORS.HAZARDOUS,
    gradientColors: ['#FFFFFF', '#F5E0E0', '#F9EBEB'],
  };
};

// Custom component for PM2.5 with subscript
const PM25Text = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      <Text style={{fontSize: 13, color: '#444'}}>PM</Text>
      <Text
        style={{
          fontSize: 10,
          color: '#444',
          lineHeight: 10,
          marginBottom: 1.5,
        }}>
        2.5
      </Text>
    </View>
  );
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
        color: AQI_COLORS.SATISFACTORY, // Default to Satisfactory color
        gradientColors: ['#FFFFFF', '#F1F7E8', '#F7FAF2'],
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
            <View style={styles.aqiValueContainer}>
              <Text
                style={[
                  styles.aqiNumber,
                  {color: aqiCategory.color}, // Use the same color as the category box
                ]}>
                {aqiData ? aqiData.overall_value : '--'}
              </Text>
              {/* PM2.5 text with subscript below AQI value */}
              <View style={styles.pmContainer}>
                <PM25Text />
                <Text style={styles.pmText}>: </Text>
                <Text style={styles.pmValue}>
                  {pm25Data ? Math.round(pm25Data.value) : '--'}
                </Text>
                <Text style={styles.pmText}> μg/m³</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AQI Scale Section */}
        <View style={styles.scaleSection}>
          <View style={styles.aqiScaleContainer}>
            <View style={styles.scaleContainer}>
              <View style={styles.levelsContainer}>
                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.goodColor]}>
                    <Text style={styles.colorBarNumber}>0-50</Text>
                  </View>
                  <Text style={styles.scaleText}>Good</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.satisfactoryColor]}>
                    <Text style={styles.colorBarNumber}>51-100</Text>
                  </View>
                  <Text style={styles.scaleText}>Satisfactory</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.moderateColor]}>
                    <Text style={styles.colorBarNumber}>101-150</Text>
                  </View>
                  <Text style={styles.scaleText}>Moderate</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.sensitiveColor]}>
                    <Text style={styles.colorBarNumber}>151-200</Text>
                  </View>
                  <Text style={styles.scaleText}>
                    Unhealthy for sensitive group
                  </Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.unhealthyColor]}>
                    <Text style={styles.colorBarNumber}>201-300</Text>
                  </View>
                  <Text style={styles.scaleText}>Unhealthy</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.veryUnhealthyColor]}>
                    <Text style={styles.colorBarNumber}>301-400</Text>
                  </View>
                  <Text style={styles.scaleText}>Very Unhealthy</Text>
                </View>

                <View style={styles.scaleRow}>
                  <View style={[styles.colorBar, styles.hazardousColor]}>
                    <Text style={styles.colorBarNumber}>401-500</Text>
                  </View>
                  <Text style={styles.scaleText}>Hazardous</Text>
                </View>
              </View>
            </View>

            {/* Person with mask - right side */}
            <View style={styles.personContainer}>
              <Image
                source={
                  aqiCategory.text === 'Good'
                    ? require('../../assets/images/Good.png')
                    : aqiCategory.text === 'Satisfactory'
                    ? require('../../assets/images/Moderate.png')
                    : aqiCategory.text === 'Moderate'
                    ? require('../../assets/images/Poor.png')
                    : aqiCategory.text === 'Unhealthy for sensitive group'
                    ? require('../../assets/images/Unhealthy.png')
                    : aqiCategory.text === 'Unhealthy'
                    ? require('../../assets/images/VeryUnhealthy.png')
                    : aqiCategory.text === 'Very Unhealthy'
                    ? require('../../assets/images/Hazardous.png')
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
              // Adjust weather card background to match category
              {
                backgroundColor: `rgba(${
                  aqiCategory.color === AQI_COLORS.GOOD
                    ? '230, 240, 230'
                    : aqiCategory.color === AQI_COLORS.SATISFACTORY
                    ? '240, 245, 230'
                    : aqiCategory.color === AQI_COLORS.MODERATE
                    ? '245, 245, 230'
                    : aqiCategory.color === AQI_COLORS.SENSITIVE
                    ? '245, 235, 225'
                    : aqiCategory.color === AQI_COLORS.UNHEALTHY
                    ? '245, 225, 225'
                    : aqiCategory.color === AQI_COLORS.VERY_UNHEALTHY
                    ? '235, 225, 240'
                    : '240, 220, 220'
                }, 0.15)`,
              },
            ]}>
            <View style={styles.weatherTopSection}>
              <Text style={styles.temperatureText}>Coming Soon</Text>
              <Text style={styles.weatherCondition}>Weather</Text>
            </View>

            <View style={styles.weatherBottomSection}>
              <View style={styles.weatherDataItem}>
                <Image
                  source={require('../../assets/icons/humidity.png')}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherDataLabel}>Humidity</Text>
                <Text style={styles.weatherDataValue}>coming soon</Text>
              </View>

              <View style={styles.weatherDataItemSeparator} />

              <View style={styles.weatherDataItem}>
                <Image
                  source={require('../../assets/icons/wind.png')}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherDataLabel}>Wind Speed</Text>
                <Text style={styles.weatherDataValue}>coming soon</Text>
              </View>

              <View style={styles.weatherDataItemSeparator} />

              <View style={styles.weatherDataItem}>
                <Image
                  source={require('../../assets/icons/uv.png')}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherDataLabel}>UV Index</Text>
                <Text style={styles.weatherDataValue}>coming soon</Text>
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
    backgroundColor: '#FFFFFF', // Add a fallback background color
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Make sure gradient is behind content
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
  },
  aqiValueContainer: {
    flexDirection: 'column',
    marginLeft: 50,
    alignItems: 'flex-end',
  },
  moderateBox: {
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
    textAlign: 'right',
  },
  pmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  pmText: {
    fontSize: 13,
    color: '#444',
  },
  pmValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444',
  },
  scaleSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  aqiScaleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  scaleContainer: {
    width: 200,
  },
  levelsContainer: {
    flex: 1,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 2,
  },
  colorBar: {
    width: 60,
    height: 30,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBarNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  goodColor: {
    backgroundColor: AQI_COLORS.GOOD,
  },
  satisfactoryColor: {
    backgroundColor: AQI_COLORS.SATISFACTORY,
  },
  moderateColor: {
    backgroundColor: AQI_COLORS.MODERATE,
  },
  sensitiveColor: {
    backgroundColor: AQI_COLORS.SENSITIVE,
  },
  unhealthyColor: {
    backgroundColor: AQI_COLORS.UNHEALTHY,
  },
  veryUnhealthyColor: {
    backgroundColor: AQI_COLORS.VERY_UNHEALTHY,
  },
  hazardousColor: {
    backgroundColor: AQI_COLORS.HAZARDOUS,
  },
  scaleText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
    color: '#333',
    ellipsizeMode: 'tail',
    numberOfLines: 1,
  },
  personContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
    marginTop: 120, // Positioned to keep the character lower down
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
    backgroundColor: 'rgba(240, 220, 220, 0.15)',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
