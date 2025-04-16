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
import {useGetLatestMeanAQIValues} from '../../services/sensor.hooks';

// Health advisories data
const healthAdvisories = [
  {
    id: 1,
    aqi_content: '0-50',
    content:
      'In terms of performance assessment, exposure to this air results in Good to Moderate.',
  },
  {
    id: 8,
    aqi_content: 'aqi_content',
    content: 'content',
  },
  {
    id: 7,
    aqi_content: '51-100',
    content:
      'In terms of performance assessment, exposure to this air results in Good to Moderate.',
  },
  {
    id: 2,
    aqi_content: '101-150',
    content:
      ' Keep a regular check on your health vitals e.g. oxygen levels, blood pressure etc.  In case of respiratory problem etc. consult your doctor/family physician.  Eat healthy diet to naturally boost your immunity.  Avoid smoking or any related activity.  Reduce prolonged or heavy outdoor exertion.  Make the emergency equipment such as nebulizers available at home as first aid measure.',
  },
  {
    id: 3,
    aqi_content: '151-200',
    content:
      ' Check AQI level before outdoor workout/ exercise.  Wear face masks during outdoor activities.  Restrict children from playing outdoors.  Avoid unnecessary traveling, residing, and visits in the areas having unhealthy AQI.  Elderly people should minimize outdoor exposure.  Consider doors and windows closed to reduce outdoor air intake.  Avoid prolonged or heavy outdoor exertion.  Patients of COPD & CVD should select the face masks in consultation with their physician.',
  },
  {
    id: 4,
    aqi_content: '201-250',
    content:
      ' Regularly check AQI and health vitals.  Spend maximum time at home.  Use N95 mask when going outside is unavoidable.  Restrict prolonged or heavy outdoor exertion.  Bar children from unnecessary outdoor visits/activities.  Patients of COPD & CVD should select the face masks in consultation with their physician.',
  },
  {
    id: 5,
    aqi_content: '251-300',
    content:
      ' Stay indoors.  Use N95 or equivalent mask and pollution protective glasses/ goggles when going outside is unavoidable.  Regularly check AQI and health vitals.  Patients of COPD & CVD should select the face masks in consultation with their physician.',
  },
  {
    id: 6,
    aqi_content: '300',
    content:
      ' Stay at home.  Use air purifiers or equivalent.  Frequently check health vitals.',
  },
];

const {width} = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

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

const HealthAdvisory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [aqiData, setAqiData] = useState(null);
  const [cigarettesPerDay, setCigarettesPerDay] = useState('01');
  const [healthAdvice, setHealthAdvice] = useState([]);

  // Use the latest mean AQI values hook
  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetLatestMeanAQIValues();

  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const textScrollAnim = useRef(new Animated.Value(width)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Process sensor data when it loads
  useEffect(() => {
    if (sensorData && sensorData.overall) {
      // Use the overall AQI value from the data
      setAqiData({
        overall_value: Math.round(sensorData.overall.latest_hour_mean),
        pm25_value: Math.round(sensorData.overall.latest_hour_mean / 2),
        timestamp: sensorData.latest_date,
      });
    }
  }, [sensorData]);

  // Get appropriate health advisory content for current AQI from local data
  useEffect(() => {
    if (aqiData) {
      const aqi = aqiData.overall_value;

      // Find the appropriate advisory based on AQI value
      const matchingAdvisory = healthAdvisories.find(advisory => {
        // Skip the item with "aqi_content": "aqi_content"
        if (advisory.aqi_content === 'aqi_content') {
          return false;
        }

        // Handle specific case for 300+
        if (advisory.aqi_content === '300' && aqi >= 300) {
          return true;
        }

        const range = advisory.aqi_content.split('-');
        if (range.length === 2) {
          const min = parseInt(range[0]);
          const max = parseInt(range[1]);
          return aqi >= min && aqi <= max;
        }

        return false;
      });

      if (matchingAdvisory) {
        // Split content by double spaces which seem to separate the bullet points
        const content = matchingAdvisory.content;
        const bulletPoints = content
          .split(/  +/) // Split by two or more spaces
          .map(point => point.trim())
          .filter(point => point.length > 0);

        setHealthAdvice(bulletPoints.length > 0 ? bulletPoints : [content]);
      } else {
        // If no matching advisory is found, use a simple default message
        setHealthAdvice([
          'No specific health recommendations available for the current AQI level',
        ]);
      }
    }
  }, [aqiData]);

  // Calculate cigarettes per day based on AQI
  useEffect(() => {
    if (aqiData) {
      const aqi = aqiData.overall_value;
      let cigaretteEquivalent;

      if (aqi <= 50) {
        cigaretteEquivalent = '01';
      } else if (aqi <= 100) {
        cigaretteEquivalent = '02';
      } else if (aqi <= 200) {
        cigaretteEquivalent = '04';
      } else if (aqi <= 300) {
        cigaretteEquivalent = '06';
      } else {
        cigaretteEquivalent = '08';
      }

      setCigarettesPerDay(cigaretteEquivalent);
    }
  }, [aqiData]);

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

  // Get AQI category based on current AQI value
  const getAQIDetails = () => {
    if (!aqiData) {
      return {text: 'Loading...', color: '#FFDA75'};
    }
    return getAQICategory(aqiData.overall_value);
  };

  const aqiCategory = getAQIDetails();

  // Limit the number of displayed recommendations to avoid overflow
  const displayHealthRecommendations =
    healthAdvice.length > 0
      ? healthAdvice.slice(0, 3) // Show only first 3 recommendations
      : ['Loading health recommendations...'];

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
                      {aqiData ? Math.round(aqiData.overall_value) : '--'}
                    </Text>
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
                    {sensorsLoading ? (
                      <Text style={styles.alertText}>
                        Loading health recommendations...
                      </Text>
                    ) : (
                      displayHealthRecommendations.map(
                        (recommendation, index) => (
                          <View key={index} style={styles.miniBulletContainer}>
                            <Text style={styles.miniBullet}>•</Text>
                            <Text style={styles.alertText}>
                              {recommendation}
                            </Text>
                          </View>
                        ),
                      )
                    )}
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
          <View style={styles.cardContainer}>
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
                </View>
              </ImageBackground>
            </View>
          </View>

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
                    <Text>{''}</Text>
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

// Styles remain the same
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
    marginTop: 10,
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
