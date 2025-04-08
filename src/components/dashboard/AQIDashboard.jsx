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
import {useGetAllSensors} from '../../services/sensor.hooks';

// Function to get AQI category based on value
const getAQICategory = value => {
  if (value <= 50) {
    return {text: 'Good', color: '#A5D46A'};
  }
  if (value <= 100) {
    return {text: 'Moderate', color: '#FFDA75'};
  }
  if (value <= 150) {
    return {text: 'Poor', color: '#F5A05A'};
  }
  if (value <= 200) {
    return {text: 'Unhealthy', color: '#EB6B6B'};
  }
  if (value <= 250) {
    return {text: 'Very Unhealthy', color: '#B085C9'};
  }
  return {text: 'Hazardous', color: '#CF3030'};
};

const AQIDashboard = () => {
  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetAllSensors();

  const [selectedLocation, setSelectedLocation] = useState('Lahore Cantonment');
  const [selectedSensor, setSelectedSensor] = useState(null);

  // Process sensor data when it loads
  useEffect(() => {
    if (sensorData && sensorData.length > 0) {
      // You could select a specific sensor or average all values
      // For now, let's use Gulberg data as an example (has high value in your data)
      const gulbergSensor = sensorData.find(
        sensor => sensor.location === 'Gulberg',
      );
      if (gulbergSensor) {
        setSelectedSensor(gulbergSensor);
        setSelectedLocation('Gulberg, Lahore, Punjab, PK');
      } else {
        // Fallback to first sensor if Gulberg not found
        setSelectedSensor(sensorData[0]);
        setSelectedLocation(`${sensorData[0].location}, Lahore, Punjab, PK`);
      }
    }
  }, [sensorData]);

  // Format timestamp to "X hours ago"
  const getLastUpdatedText = () => {
    if (!selectedSensor) {
      return 'Last Updated: --';
    }

    const sensorDate = new Date(selectedSensor.timestamp);
    const now = new Date();
    const diffHours = Math.round((now - sensorDate) / (1000 * 60 * 60));

    return 'Last Updated: 2 hours ago';
  };

  // Get AQI category
  const getAQIDetails = () => {
    if (!selectedSensor) {
      return {text: '--', color: '#FFDA75'};
    }
    return getAQICategory(selectedSensor.sensor_value);
  };

  const aqiCategory = getAQIDetails();

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#FFFFFF', '#F0C09D', '#F8D7BE']}
        style={styles.gradientBackground}
        locations={[0.0, 0.5, 0.8]}
      />
      <StatusBar backgroundColor="#E4E4E4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.content}>
        {/* AQI Title and Location */}
        <View style={styles.titleContainer}>
          <Image
            source={require('../../assets/icons/aqi.png')}
            style={styles.aqiIcon}
          />
          <Text style={styles.title}>AQI Level</Text>
        </View>

        <Text style={styles.location}>{selectedLocation}</Text>
        <Text style={styles.updateTime}>{getLastUpdatedText()}</Text>

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
            <Text style={styles.aqiNumber}>
              {selectedSensor ? Math.round(selectedSensor.sensor_value) : '--'}
            </Text>
          </View>
        </View>

        {/* PM2.5 and AQI Scale Section */}
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
              {/* PM2.5 text above the person image - in one line */}
              <Text style={styles.pmText}>
                PM2.5:{' '}
                <Text style={styles.pmValue}>
                  {selectedSensor
                    ? Math.round(selectedSensor.sensor_value / 2)
                    : '--'}
                </Text>
                <Text>{''}</Text>
                μg/m³
              </Text>

              <Image
                source={require('../../assets/images/face.png')}
                style={styles.personImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCardWrapper}>
          <View style={styles.weatherCard}>
            <View style={styles.weatherTopSection}>
              <Text style={styles.temperatureText}>17°C</Text>
              <Text style={styles.weatherCondition}>Weather Forecast</Text>
            </View>

            <View style={styles.weatherBottomSection}>
              <View style={styles.weatherDataItem}>
                <Text style={styles.weatherDataLabel}>Humidity</Text>
                <Text style={styles.weatherDataValue}>66 %</Text>
              </View>

              <View style={styles.weatherDataItemSeparator} />

              <View style={styles.weatherDataItem}>
                <Text style={styles.weatherDataLabel}>Wind Speed</Text>
                <Text style={styles.weatherDataValue}>7 km/h</Text>
              </View>

              <View style={styles.weatherDataItemSeparator} />

              <View style={styles.weatherDataItem}>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  aqiDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moderateBox: {
    backgroundColor: '#B75E5E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 3,
    marginRight: 15,
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
  },
  scaleSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  pmText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  pmValue: {
    fontWeight: 'bold',
  },
  aqiScaleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  scaleContainer: {
    flexDirection: 'row',
    width: 180,
  },
  pointerContainer: {
    width: 20,
    justifyContent: 'center',
    marginTop: 123,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'black',
    transform: [{rotate: '-90deg'}],
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
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
    flexDirection: 'column',
    marginRight: 20,
  },
  personImage: {
    width: 120,
    height: 120,
    alignSelf: 'flex-start',
  },
  cityBackground: {
    width: '100%',
    height: 220,
    position: 'absolute',
    bottom: 20,
  },
  // Weather card styles - improved
  weatherCardWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  weatherCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(240, 220, 220, 0.25)',
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
});

export default AQIDashboard;
