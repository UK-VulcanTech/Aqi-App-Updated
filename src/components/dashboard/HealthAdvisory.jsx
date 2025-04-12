import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useGetAllSensors} from '../../services/sensor.hooks';

const {width} = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

// Function to get AQI category based on value (same as in AQIDashboard)
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

const HealthAdvisory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [cigarettesPerDay, setCigarettesPerDay] = useState('01');

  // Use the same API hook as AQIDashboard
  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetAllSensors();

  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const textScrollAnim = useRef(new Animated.Value(width)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Process sensor data when it loads (similar to AQIDashboard)
  useEffect(() => {
    if (sensorData && sensorData.length > 0) {
      // Using Gulberg data as in the AQIDashboard example
      const gulbergSensor = sensorData.find(
        sensor => sensor.location === 'Gulberg',
      );
      if (gulbergSensor) {
        setSelectedSensor(gulbergSensor);
      } else {
        // Fallback to first sensor if Gulberg not found
        setSelectedSensor(sensorData[0]);
      }
    }
  }, [sensorData]);

  // Calculate cigarettes per day based on AQI
  useEffect(() => {
    if (selectedSensor) {
      // A simple estimation: divide AQI by 100 and round to get cigarette equivalence
      // This is just an example formula - replace with actual conversion if available
      const aqi = selectedSensor.sensor_value;
      let cigaretteEquivalent;

      if (aqi <= 50) {
        cigaretteEquivalent = '01';
      } else if (aqi <= 100) {
        cigaretteEquivalent = '01';
      } else if (aqi <= 200) {
        cigaretteEquivalent = '01';
      } else if (aqi <= 300) {
        cigaretteEquivalent = '01';
      } else {
        cigaretteEquivalent = '01';
      }

      setCigarettesPerDay(cigaretteEquivalent);
    }
  }, [selectedSensor]);

  useEffect(() => {
    // Create animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Text scrolling animation
    Animated.loop(
      Animated.timing(textScrollAnim, {
        toValue: -800, // Adjust based on text length
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    // Pulsing animation for bullets
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / cardWidth);
    setActiveIndex(index);
  };

  const scrollToCard = index => {
    scrollViewRef.current?.scrollTo({
      x: index * cardWidth,
      animated: true,
    });
    setActiveIndex(index);
  };

  // Get AQI category based on current sensor value
  const getAQIDetails = () => {
    if (!selectedSensor) {
      return {text: 'Loading...', color: '#FFDA75'};
    }
    return getAQICategory(selectedSensor.sensor_value);
  };

  const aqiCategory = getAQIDetails();

  // Generate health recommendations based on AQI level
  const getHealthRecommendations = () => {
    if (!selectedSensor) return [];

    const aqi = selectedSensor.sensor_value;

    if (aqi <= 50) {
      return [
        'Air quality is good - perfect for outdoor activities',
        'No specific precautions needed',
        'Enjoy outdoor activities as normal',
      ];
    } else if (aqi <= 100) {
      return [
        'Sensitive individuals should limit prolonged outdoor activity',
        'Consider reducing intense outdoor activities',
        'Keep windows closed during peak pollution hours',
      ];
    } else if (aqi <= 150) {
      return [
        'Sensitive groups should limit outdoor activity',
        'Consider wearing masks when going outdoors',
        'Keep windows closed, use air purifiers if available',
      ];
    } else if (aqi <= 200) {
      return [
        'Sensitive groups should avoid outdoor activity',
        'Use N95 masks when going outdoors',
        'Keep windows closed, use air purifiers',
      ];
    } else if (aqi <= 300) {
      return [
        'Everyone should avoid outdoor activities',
        'Wear N95 masks when outside is essential',
        'Keep windows sealed, use air purifiers on high',
      ];
    } else {
      return [
        'Evacuate area if possible or stay indoors completely',
        'Wear N95 masks even indoors if no air purification',
        'Run air purifiers at maximum, seal all openings',
      ];
    }
  };

  const healthRecommendations = getHealthRecommendations();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health Advisory</Text>

      {/* Health Alert card at the top */}
      <View style={styles.topCardContainer}>
        <View style={styles.healthAlertContainer}>
          <ImageBackground
            source={require('../../assets/images/smoke.jpg')}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyleLighter}>
            <View style={styles.contentContainer}>
              <View style={styles.alertHeaderContainer}>
                <Animated.Text
                  style={[styles.alertTitleText, {opacity: fadeAnim}]}>
                  <Text style={styles.redText}>HEALTH ALERT</Text>
                </Animated.Text>
              </View>

              <View style={styles.alertContentRow}>
                <View style={styles.alertLeftColumn}>
                  <Animated.View
                    style={[
                      styles.aqiCircle,
                      {
                        opacity: fadeAnim,
                        transform: [{scale: pulseAnim}],
                        borderColor: aqiCategory.color,
                        backgroundColor: `${aqiCategory.color}20`,
                      },
                    ]}>
                    <Text style={[styles.aqiValue, {color: aqiCategory.color}]}>
                      {selectedSensor
                        ? Math.round(selectedSensor.sensor_value)
                        : '--'}
                    </Text>
                    {/* <Text style={styles.aqiLabel}>{aqiCategory.text}</Text> */}
                    <Text
                      style={[
                        styles.aqiLabel,
                        aqiCategory.text === 'Hazardous'
                          ? {fontSize: 10}
                          : null,
                      ]}>
                      {aqiCategory.text}
                    </Text>
                  </Animated.View>
                </View>

                <View style={styles.alertRightColumn}>
                  <Animated.View style={[{opacity: fadeAnim}]}>
                    <Text style={styles.alertHeading}>Current Air Quality</Text>
                    {healthRecommendations.map((recommendation, index) => (
                      <View key={index} style={styles.miniBulletContainer}>
                        <Text style={styles.miniBullet}>•</Text>
                        <Text style={styles.alertText}>{recommendation}</Text>
                      </View>
                    ))}
                  </Animated.View>
                </View>
              </View>

              <View style={styles.scrollingAlertContainer}>
                <Animated.Text
                  style={[
                    styles.scrollingAlertText,
                    {transform: [{translateX: textScrollAnim}]},
                  ]}>
                  Health alert issued for Lahore • AQI levels may worsen in
                  evening hours • Check your health app for updates • Stay
                  hydrated • Limit strenuous outdoor activities
                </Animated.Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>

      <View style={styles.border}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}>
          {/* First Card - Cigarette Card with dynamic data */}
          {/* <View style={styles.cardContainer}>
            <View style={styles.gradientContainer}>
              <ImageBackground
                source={require('../../assets/images/smoke.jpg')}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}>
                <View style={styles.contentContainer}>
                  <Animated.Text
                    style={[styles.titleText, {opacity: fadeAnim}]}>
                    Wellness Tips for Everyday Living in
                    <Text style={styles.emptySpace}>{''}</Text>
                    <Text style={styles.redText}>Lahore</Text>
                  </Animated.Text>

                  <View>
                    <View style={styles.cigaretteContainer}>
                      <View style={styles.cigaretteTextContainer}>
                        <Text style={styles.cigaretteText}>
                          <Text style={styles.redNumberText}>
                            {cigarettesPerDay}{' '}
                          </Text>
                          Cigarettes per day
                        </Text>
                        <Image
                          source={require('../../assets/icons/cross.png')}
                          style={styles.crossIcon}
                        />
                      </View>
                    </View>

                    <Animated.View
                      style={[
                        styles.animationContainer,
                        {
                          opacity: fadeAnim,
                          transform: [{translateX: slideAnim}],
                        },
                      ]}>
                      <Image
                        source={require('../../assets/images/SmokingGIF.gif')}
                        style={styles.smokingGif}
                      />
                    </Animated.View>

                    <Animated.Text
                      style={[styles.quoteText, {opacity: fadeAnim}]}>
                      "Inhaling the air here is equivalent to smoking{' '}
                      {cigarettesPerDay} cigarette
                      {cigarettesPerDay !== '01' ? 's' : ''} daily in terms of
                      health impact."
                    </Animated.Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View> */}

          {/* Second Card - Health Disclaimer */}
          <View style={styles.cardContainer}>
            <View style={styles.gradientContainer}>
              <ImageBackground
                source={require('../../assets/images/smoke.jpg')}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyleLighter}>
                <View style={styles.contentContainer}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>
                      <Text style={styles.redText}>IMPORTANT</Text>{' '}
                      <Text style={styles.whiteText}>Health Disclaimer</Text>
                    </Text>
                  </View>

                  {/* Warning icon */}
                  <View style={styles.warningIconContainer}>
                    <Animated.View style={{transform: [{scale: pulseAnim}]}}>
                      <Image
                        source={require('../../assets/icons/warning.png')}
                        style={styles.warningIcon}
                      />
                    </Animated.View>
                  </View>

                  {/* Bullet points */}
                  <View style={styles.bulletPointsContainer}>
                    <View style={styles.bulletLine}>
                      <View style={styles.bulletIconContainer}>
                        <Text style={styles.bulletPoint}>•</Text>
                      </View>
                      <Text style={styles.bulletText}>
                        Stay hydrated and minimize outdoor exposure during high
                        pollution alerts
                      </Text>
                    </View>

                    <View style={styles.bulletLine}>
                      <View style={styles.bulletIconContainer}>
                        <Text style={styles.bulletPoint}>•</Text>
                      </View>
                      <Text style={styles.bulletText}>
                        Use N95 masks when AQI exceeds 150 for respiratory
                        protection
                      </Text>
                    </View>

                    <View style={styles.bulletLine}>
                      <View style={styles.bulletIconContainer}>
                        <Text style={styles.bulletPoint}>•</Text>
                      </View>
                      <Text style={styles.bulletText}>
                        Consult healthcare provider if experiencing persistent
                        respiratory symptoms
                      </Text>
                    </View>
                  </View>

                  {/* Scrolling text */}
                  <View style={styles.scrollingTextContainer}>
                    <Animated.Text
                      style={[
                        styles.scrollingText,
                        {transform: [{translateX: textScrollAnim}]},
                      ]}>
                      Information provided is for awareness only • Not a
                      substitute for medical advice • Air quality affects
                      individuals differently • Monitor local pollution levels
                      daily • Air purifiers recommended for indoor use
                    </Animated.Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        </ScrollView>

        {/* Carousel Indicators */}
        <View style={styles.indicatorContainer}>
          {[0, 1].map(index => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                activeIndex === index && styles.activeIndicator,
              ]}
              onPress={() => scrollToCard(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 25,
    fontWeight: 600,
    color: '#495159',
    padding: 20,
  },
  // Top card container (for the standalone card above carousel)
  topCardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  healthAlertContainer: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#2A2F34', // Slightly lighter background
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  alertHeaderContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  alertTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  alertContentRow: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  alertLeftColumn: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertRightColumn: {
    flex: 0.65,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  alertHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
    marginTop: 20,
    marginLeft: -20,
  },
  miniBulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  miniBullet: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
    lineHeight: 20,
  },
  alertText: {
    color: 'white',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  scrollingAlertContainer: {
    height: 24,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 5,
  },
  scrollingAlertText: {
    color: 'white',
    fontSize: 11,
    position: 'absolute',
    fontWeight: '500',
    width: 800, // Make sure this is wide enough for all text
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: cardWidth,
  },
  gradientContainer: {
    height: 300,
    borderRadius: 12,
    backgroundColor: '#2A2F34',
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    borderRadius: 12,
    opacity: 0.3,
  },
  backgroundImageStyleLighter: {
    borderRadius: 12,
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 16,
  },
  emptySpace: {
    // Empty space placeholder
  },
  // Header styling for second card
  headerContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 8,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  whiteText: {
    color: 'white',
  },
  redText: {
    color: '#EF4444',
  },
  // Original card styles (unchanged)
  cigaretteContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cigaretteTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cigaretteText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '500',
  },
  redNumberText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  crossIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
    marginTop: 4,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  smokingGif: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  quoteText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  // Enhanced disclaimer card styles
  warningIconContainer: {
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  warningIcon: {
    width: 30,
    height: 30,
    tintColor: '#EF4444',
  },
  bulletPointsContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  bulletLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    width: '100%',
  },
  bulletIconContainer: {
    width: 24,
    alignItems: 'center',
    paddingTop: 0,
  },
  bulletPoint: {
    color: '#EF4444',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  bulletText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
  scrollingTextContainer: {
    height: 30,
    width: '100%',
    overflow: 'hidden',
    marginTop: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  scrollingText: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    fontWeight: '500',
    width: 800, // Make sure this is wide enough for all text
  },
  // Enhanced carousel indicators
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(196, 196, 196, 0.5)',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#EF4444',
    width: 16,
  },
  // AQI card styles
  aqiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aqiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  aqiLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});

export default HealthAdvisory;
