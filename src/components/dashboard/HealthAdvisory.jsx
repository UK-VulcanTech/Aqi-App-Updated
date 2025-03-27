import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';

const HealthAdvisory = () => {
  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <View style={styles.gradientContainer}>
          <ImageBackground
            source={require('../../assets/images/smoke.jpg')}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}>
            <View style={styles.contentContainer}>
              <Animated.Text style={[styles.titleText, {opacity: fadeAnim}]}>
                Wellness Tips for Everyday Living in{' '}
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

                <Animated.Text style={[styles.quoteText, {opacity: fadeAnim}]}>
                  "Inhaling the air here is equivalent to smoking 01 cigarette
                  daily in terms of health impact."
                </Animated.Text>
              </View>
            </View>
          </ImageBackground>
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
  border: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
  },
  gradientContainer: {
    height: 300,
    borderRadius: 12,
    backgroundColor: '#2A2F34', // Fallback if LinearGradient isn't used
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
  contentContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 16,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  redText: {
    color: '#EF4444',
  },
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
    marginTop: 4, // Adjust this value as needed for alignment
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
});

export default HealthAdvisory;
