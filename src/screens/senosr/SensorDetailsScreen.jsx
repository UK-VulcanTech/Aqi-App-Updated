import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import {
  // useSensorAnalyserStore,
  useSensorDetailStore,
} from '../../zustand/store/sensorDetailStore';
import LahoreMap from '../../components/map/LahoreMap';

// AQI color constants
const AQI_COLORS = {
  GOOD: '#00A652',
  SATISFACTORY: '#A3C853',
  MODERATE: '#FFF200',
  SENSITIVE: '#F7941D',
  UNHEALTHY: '#EF4444',
  VERY_UNHEALTHY: '#9333EA',
  HAZARDOUS: '#FF3333',
};

// Analyser data
const analyserData = {
  COMPANY_NAME: 'Met One Instruments, Inc.',
  INSTRUMENT_NAME: 'BAM 1020 Particulate Monitor',
  INSTRUMENT_HEADER: 'BAM: Beta Attenuation Monitor',
  INSTRUMENT_DESC:
    'The Met One Instruments BAM 1020 beta attenuation mass monitor automatically measures and records ambient particulate mass concentration levels using the principle of beta ray attenuation. This method provides a simple determination of the ambient concentration of particulate matter in mg/m3 or μg/m3. A small 14C (carbon 14) element inside of the BAM 1020 provides a constant source of beta rays. The beta rays traverse a path through which glass fiber filter tape is passed before being detected with a scintillation detector. At the cycle the beta ray count (I0) across clean filter tape is recorded. Then, an external pump pulls a known volume of PM-laden air through the filter tape thereby trapping the PM on the filter tape. At the end of the measurement cycle the beta ray count (I3) is re-measured across PM-laden filter tape. The ratio of I0 to I3 is used to determine the mass density of collected PM on the filter tape.',
};

// Health advisory data
const healthAdvisoryData = {
  GOOD_TO_SATISFACTORY:
    'Air quality is considered satisfactory, and air pollution poses little or no risk.',
  MODERATE:
    'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.',
  POOR: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
  UNHEALTHY:
    'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
  VERY_UNHEALTHY:
    'Health warnings of emergency conditions. The entire population is more likely to be affected.',
  HAZARDOUS:
    'Health alert: everyone may experience more serious health effects.',
  SEVERE:
    'Health warnings of emergency conditions. The entire population is at risk of serious health effects.',
};

const SensorDetailsScreen = () => {
  // Get sensor detail with a default object to prevent null errors
  const sensorDetail = useSensorDetailStore(state => state.sensorDetail) || {
    id: null,
    value: 0,
    latitude: 31.5204,
    longitude: 74.3587,
    location: 'Lahore',
    pollutant: 'PM2.5',
    status: '',
    timestamp: '',
  };

  const [healthAdvisory, setHealthAdvisory] = useState('');
  const [advisoryLevel, setAdvisoryLevel] = useState('');

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);
  const scaleAnim = new Animated.Value(0.9);

  // Function to get color for AQI value
  const getColorForAQI = (aqi = 0) => {
    // Ensure aqi is a number
    const value = Number(aqi) || 0;

    if (value <= 50) {
      return {
        textColor: '#006633',
        bgColor: AQI_COLORS.GOOD,
        status: 'Good',
      };
    }
    if (value <= 100) {
      return {
        textColor: '#4C7520',
        bgColor: AQI_COLORS.SATISFACTORY,
        status: 'Satisfactory',
      };
    }
    if (value <= 150) {
      return {
        textColor: '#665C00',
        bgColor: AQI_COLORS.MODERATE,
        status: 'Moderate',
      };
    }
    if (value <= 200) {
      return {
        textColor: '#8C3D00',
        bgColor: AQI_COLORS.SENSITIVE,
        status: 'Poor',
      };
    }
    if (value <= 300) {
      return {
        textColor: '#7E0000',
        bgColor: AQI_COLORS.UNHEALTHY,
        status: 'Unhealthy',
      };
    }
    if (value <= 400) {
      return {
        textColor: '#4A0072',
        bgColor: AQI_COLORS.VERY_UNHEALTHY,
        status: 'Very Unhealthy',
      };
    }
    return {
      textColor: '#660000',
      bgColor: AQI_COLORS.HAZARDOUS,
      status: 'Hazardous',
    };
  };

  useEffect(() => {
    // Make sure sensorDetail exists before processing
    if (sensorDetail) {
      const getAdvisoryKey = () => {
        const value = Number(sensorDetail.value) || 0;
        if (value <= 100) {
          return 'GOOD_TO_SATISFACTORY';
        } else if (value <= 150) {
          return 'MODERATE';
        } else if (value <= 200) {
          return 'POOR';
        } else if (value <= 300) {
          return 'UNHEALTHY';
        } else if (value <= 400) {
          return 'VERY_UNHEALTHY';
        } else if (value <= 500) {
          return 'HAZARDOUS';
        } else {
          return 'SEVERE';
        }
      };

      const key = getAdvisoryKey();
      setHealthAdvisory(healthAdvisoryData[key] || 'Information not available');
      setAdvisoryLevel(key.split('_').join(' '));

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sensorDetail]);

  // Use null check when getting aqiInfo
  const aqiInfo = getColorForAQI(sensorDetail?.value);

  // Check if we have sensor detail data before rendering
  if (!sensorDetail) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text style={{fontSize: 18, color: '#666'}}>
          No sensor data available
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <LahoreMap
            lat={sensorDetail.latitude}
            lng={sensorDetail.longitude}
            location={sensorDetail.location}
          />
        </View>

        {/* Main Content */}
        <View style={styles.contentCard}>
          {/* Header */}
          <View style={styles.header}>
            <Animated.Text
              style={[styles.title, {transform: [{translateX: slideAnim}]}]}>
              Analyser Details
            </Animated.Text>

            {/* AQI Badge */}
            <Animated.View
              style={[
                styles.aqiBadge,
                {
                  backgroundColor: aqiInfo.bgColor,
                  transform: [{scale: scaleAnim}],
                },
              ]}>
              <Text style={styles.aqiBadgeText}>
                AQI: {sensorDetail.value || 0}
              </Text>
            </Animated.View>
          </View>

          {/* Location Info */}
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>
              {sensorDetail.location || 'Unknown location'}
            </Text>
            {sensorDetail.timestamp && (
              <Text style={styles.timestampText}>
                Last Updated: {sensorDetail.timestamp}
              </Text>
            )}
          </View>

          {/* Pollutant Type */}
          <View style={styles.pollutantSection}>
            <Text style={styles.sectionTitle}>Pollutant</Text>
            <Text style={styles.pollutantText}>
              {sensorDetail.pollutant || 'PM2.5'}
            </Text>
          </View>

          {/* Health Advisory */}
          <TouchableOpacity
            activeOpacity={0.95}
            style={[
              styles.advisoryCard,
              {
                backgroundColor: `${aqiInfo.bgColor}40`, // Adding alpha for transparency
                borderLeftColor: aqiInfo.textColor,
              },
            ]}>
            <View style={styles.advisoryHeader}>
              <Image
                source={require('../../assets/icons/warning.png')}
                style={styles.advisoryIcon}
              />
              <Text style={styles.advisoryTitle}>
                Health Advisory: {advisoryLevel}
              </Text>
            </View>
            <Text style={styles.advisoryText}>{healthAdvisory}</Text>
          </TouchableOpacity>

          {/* Additional Sensor Data */}
          <View style={styles.sensorDataGrid}>
            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Latitude</Text>
              <Text style={styles.dataValue}>
                {sensorDetail.latitude || 'N/A'}
              </Text>
            </View>
            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Longitude</Text>
              <Text style={styles.dataValue}>
                {sensorDetail.longitude || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Status Section */}
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View
              style={[styles.statusBadge, {backgroundColor: aqiInfo.bgColor}]}>
              <Text style={styles.statusText}>
                {sensorDetail.status || aqiInfo.status}
              </Text>
            </View>
          </View>
        </View>

        {/* EPA Breakpoints section */}
        <View style={styles.breakpointsSection}>
          {/* <EPABreakpoints /> */}
        </View>

        {/* Content section */}
        <View style={styles.infoCard}>
          <Text style={styles.companyName}>{analyserData.COMPANY_NAME}</Text>
          <Text style={styles.instrumentName}>
            {analyserData.INSTRUMENT_NAME}
          </Text>
          <Text style={styles.instrumentHeader}>
            {analyserData.INSTRUMENT_HEADER}
          </Text>
          <Text style={styles.instrumentDesc}>
            {analyserData.INSTRUMENT_DESC}
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

// Rest of the code remains the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f6',
  },
  animatedContainer: {
    padding: 16,
    maxWidth: Dimensions.get('window').width,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 24,
    height: 200, // Set appropriate height
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  aqiBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  aqiBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 18,
    color: '#555',
  },
  timestampText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  pollutantSection: {
    marginBottom: 24,
  },
  pollutantText: {
    fontSize: 18,
    color: '#555',
  },
  advisoryCard: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 24,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  advisoryIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  advisoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  advisoryText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  sensorDataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dataBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dataLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusSection: {
    marginBottom: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  breakpointsSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  breakpointsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  breakpointsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  breakpointsText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
  breakpointsTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  breakpointsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  breakpointsHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
  breakpointsCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  colorCell: {
    flex: 1,
    height: 30,
    margin: 5,
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instrumentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285F4',
    marginBottom: 4,
  },
  instrumentHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  instrumentDesc: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default SensorDetailsScreen;
