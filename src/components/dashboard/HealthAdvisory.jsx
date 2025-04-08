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

const {width} = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

const HealthAdvisory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const textScrollAnim = useRef(new Animated.Value(width)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health Advisory</Text>
      <View style={styles.border}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}>
          {/* First Card - Original Cigarette Card (unchanged) */}
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

                  <View>
                    <View style={styles.cigaretteContainer}>
                      <View style={styles.cigaretteTextContainer}>
                        <Text style={styles.cigaretteText}>
                          <Text style={styles.redNumberText}>01 </Text>
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
                      "Inhaling the air here is equivalent to smoking 01
                      cigarette daily in terms of health impact."
                    </Animated.Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>

          {/* Second Card - Enhanced Health Disclaimer */}
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

                  {/* Enhanced warning icon */}
                  <View style={styles.warningIconContainer}>
                    <Animated.View style={{transform: [{scale: pulseAnim}]}}>
                      <Image
                        source={require('../../assets/icons/warning.png')}
                        style={styles.warningIcon}
                      />
                    </Animated.View>
                  </View>

                  {/* Enhanced bullet points */}
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

                  {/* Enhanced scrolling text */}
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

        {/* Enhanced Carousel Indicators */}
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
});

export default HealthAdvisory;
