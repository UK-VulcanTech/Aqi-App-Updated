import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useGetLatestMeanAQIValues} from '../../services/sensor.hooks';

// Define AQI color constants - Same as AQIDashboard
const AQI_COLORS = {
  GOOD: '#00A652',
  SATISFACTORY: '#A3C853',
  MODERATE: '#FFF200',
  SENSITIVE: '#F7941D',
  UNHEALTHY: '#EF4444',
  VERY_UNHEALTHY: '#9333EA',
  HAZARDOUS: '#FF3333',
};

// Health advisories data in both English and Urdu
const healthAdvisoriesData = {
  english: [
    {
      id: 1,
      aqi_content: '0-50',
      content:
        'Air quality is Good to Satisfactory. (in terms of health advisory).',
    },
    {
      id: 7,
      aqi_content: '51-100',
      content:
        'Air quality is Good to Satisfactory. (in terms of health advisory).',
    },
    {
      id: 2,
      aqi_content: '101-150',
      content:
        'General Public- Consider AQI to plan outdoor activities.  Vulnerable Groups- Keep a regular check on your health vitals e.g. oxygen levels, blood pressure etc.  In case of respiratory problem etc., consult your doctor/family physician.  Eat healthy diet to naturally boost your immunity.  Avoid smoking or any related activity.  Reduce prolonged or heavy outdoor exertion.  Make the emergency equipment such as nebulizers available at home as first aid measure.',
    },
    {
      id: 3,
      aqi_content: '151-200',
      content:
        'General Public- Reduce prolonged or heavy outdoor exertion.  Vulnerable Groups- Check AQI level before outdoor workout/exercise.  Wear face masks during outdoor activities.  Restrict children from playing outdoors.  Avoid unnecessary traveling, residing, and visits in the areas having unhealthy AQI.  Elderly people should minimize outdoor exposure.  Consider doors and windows closed to reduce outdoor air intake.  Avoid prolonged or heavy outdoor exertion.  Patients of COPD & CVD should select the face masks in consultation with their physician.',
    },
    {
      id: 4,
      aqi_content: '201-300',
      content:
        'General Public- Wear face masks during outdoor activities.  Reduce prolonged or heavy outdoor exertion.  Vulnerable Groups- Regularly check AQI and health vitals.  Spend maximum time at home.  Use N95 mask when going outside is unavoidable.  Restrict prolonged or heavy outdoor exertion.  Bar children from unnecessary outdoor visits/activities.  Patients of COPD & CVD should select the face masks in consultation with their physician.',
    },
    {
      id: 5,
      aqi_content: '301-400',
      content:
        'General Public- Limit outdoor activities on days with poor air quality.  Limit outdoor exercise activities and shift to indoor gyms or home-based workouts to protect your health.  Vulnerable Groups- Stay indoor.  Use N95 or equivalent mask and pollution protective glasses/goggles when going outside is unavoidable.  Regularly check AQI and health vitals.  Patients of COPD & CVD should select the face masks in consultation with their physician.',
    },
    {
      id: 6,
      aqi_content: '401-500',
      content:
        'General Public- Stay indoor.  Use N95 or equivalent mask and pollution protective glasses/goggles when going outside is unavoidable.  Regularly check AQI and health vitals.  Vulnerable Groups- Stay at home.  Use air purifiers or equivalent.  Frequently check health vitals.',
    },
    {
      id: 8,
      aqi_content: 'aqi_content',
      content: 'content',
    },
  ],
  urdu: [
    {
      id: 1,
      aqi_content: '0-50',
      content:
        'ہوا کا معیار اچھا سے تسلی بخش ہے۔ اس سطح پر کوئی خاص صحت کی ہدایات نہیں ہیں۔',
    },
    {
      id: 7,
      aqi_content: '51-100',
      content:
        'ہوا کا معیار اچھا سے تسلی بخش ہے۔ اس سطح پر کوئی خاص صحت کی ہدایات نہیں ہیں۔',
    },
    {
      id: 2,
      aqi_content: '101-150',
      content:
        ' کمزور افراداپنی صحت کا باقاعدہ معائنہ کرتے رہیں جیسے خون میں آکسیجن کی سطح اور بلڈ پریشر و غیره  سانس کے مسائل کی صورت میں اپنے ڈاکٹر / فیملی فزیشن سے رجوع کریں۔  قوت مدافعت کو بڑھانے کے لیے صحت بخش غذا کھائیں.  تمباکو نوشی یا ایسی کسی بھی سرگرمی سے پرہیز کریں۔  گھر سے باہر طویل یا بھاری مشقت کو محدود کریں۔  ہنگامی آلات جیسے کہ نیبولائزر کو ابتدائی طبی امداد کے لیے گھر پر دستیاب رکھیں۔عام لوگائیر کوالٹی انڈیکس کو مد نظر رکھ کر بی بیرونی سرگرمیوں کی منصوبہ بندی کریں',
    },
    {
      id: 3,
      aqi_content: '151-200',
      content:
        ' کمزور افرادباہر ورزش سے پہلے ائیر کوالٹی انڈیکس دیکھ لیں۔  بیرونی سرگرمیوں کے دوران چہرے پر ماسک پہنیں۔  بچوں کو باہر کھیلنے سے روکیں۔  غير صحت مند ائیر کوالٹی والے علاقوں میں غیر ضروری سفر، رہائش اور دوروں سے گریز کریں۔  بوڑھے افراد باہر نکلنے سے پرہیز کریں۔  بیرونی ہوا کے اندراج کو کم کرنے کے لیے دروازے اور کھڑکیوں کو بند رکھیں۔  گھر سے باہر طویل یا بھاری مشقت سے پرہیز کریں۔  COPD اور CVD کے مریض اپنے معالج کے مشورے سے چہرے کے ماسک کا انتخاب کریں۔  عام لوگ گھر سے باہر طویل یا بهاری بیرونی مشقت کو محدود کریں۔',
    },
    {
      id: 4,
      aqi_content: '201-250',
      content:
        ' کمزور افرادباقاعدگی سے ائیر کوالٹی انڈیکساور صحت کا باقاعدگی سے معائنہ کریں۔  زیادہ سے زیادہ وقت گھر پر گزاریں۔  جب باہر جانا ناگزیر ہو تو N95 ماسک کا استعمال کریں۔  طویل یا بهاری بیرونی مشقت کو محدود رکھیں۔  بچوں کو غیر ضروری طور پر باہر جانے اور بیرونی سرگرمیوں سے روکیں۔  COPD اور CVD کے مریض اپنے معالج کے مشورے سے ماسک کا انتخاب کریں  عام لوگبیرونی سرگرمیوں کے دوران چہرے پر ماسک پہنیں۔  گھر سے باہر طویل یا بھاری مشقت کو محدود کریں۔',
    },
    {
      id: 5,
      aqi_content: '251-300',
      content:
        ' کمزور افرادگهر کے اندر رہیں۔ جب باہر جانا ناگزیر ہو تو N95 یا اس کے مساوی ماسک اور آلودگی سے حفاظتی چشمے/گوگلز پہنیں۔ باقاعدگی سے ائیر کوالٹی انڈیکس اور صحت کا معائنہ کریں۔ COPD اور CVD کے مریض اپنے معالج کے مشورے سے چہرے کے ماسک کا انتخاب کریں۔',
    },
    {
      id: 6,
      aqi_content: '300',
      content:
        ' کمزور افرادگهر سے باہر نہ نکلیں۔  Air Purifier یا اس جیسے آلات کا استعمال کریں.  صحت کے اہم معاملات جیسے بلڈ پریشر ، آکسیجن لیول وغیرہ کا بار بار معائنہ کریں  عام لوگگهر سے باہر نہ نکلیں۔  باہر نکلتے وقت N95 یا اس کے مساوی ماسک اور آلودگی سے بچاؤ کے کے لیے لیے حفاظتی چشمے کا استعمال لازمی طور پر کریں۔  باقاعدگی سے ائیر کوالٹی انڈیکس اور صحت کا معائنہ کرتے رہیں۔',
    },
    {
      id: 8,
      aqi_content: 'aqi_content',
      content: 'مواد',
    },
  ],
};

const {width} = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

// Updated function to match AQIDashboard's getAQICategory function
const getAQICategory = value => {
  if (value <= 50) {
    return {
      text: 'Good',
      urduText: 'اچھا',
      color: AQI_COLORS.GOOD,
      gradientColors: ['#FFFFFF', '#E8F5E8', '#F2F9F2'],
    };
  }
  if (value <= 100) {
    return {
      text: 'Satisfactory',
      urduText: 'تسلی بخش',
      color: AQI_COLORS.SATISFACTORY,
      gradientColors: ['#FFFFFF', '#F1F7E8', '#F7FAF2'],
    };
  }
  if (value <= 150) {
    return {
      text: 'Moderate',
      urduText: 'معتدل',
      color: AQI_COLORS.MODERATE,
      gradientColors: ['#FFFFFF', '#FFFDE8', '#FFFEF2'],
    };
  }
  if (value <= 200) {
    return {
      text: 'Unhealthy for sensitive group',
      urduText: 'حساس افراد کے لیے غیر صحت مند',
      color: AQI_COLORS.SENSITIVE,
      gradientColors: ['#FFFFFF', '#FBF0E8', '#FCF5F0'],
    };
  }
  if (value <= 300) {
    return {
      text: 'Unhealthy',
      urduText: 'غیر صحت مند',
      color: AQI_COLORS.UNHEALTHY,
      gradientColors: ['#FFFFFF', '#F9E8E8', '#FCF2F2'],
    };
  }
  if (value <= 400) {
    return {
      text: 'Very Unhealthy',
      urduText: 'بہت غیر صحت مند',
      color: AQI_COLORS.VERY_UNHEALTHY,
      gradientColors: ['#FFFFFF', '#EFE8F5', '#F5F2F9'],
    };
  }
  return {
    text: 'Hazardous',
    urduText: 'خطرناک',
    color: AQI_COLORS.HAZARDOUS,
    gradientColors: ['#FFFFFF', '#F5E0E0', '#F9EBEB'],
  };
};

const HealthAdvisory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [language, setLanguage] = useState('english'); // 'english' or 'urdu'
  const scrollViewRef = useRef(null);
  const [aqiData, setAqiData] = useState(null);
  const [healthAdvice, setHealthAdvice] = useState([]);

  // Use the latest mean AQI values hook - Keeping original API call
  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetLatestMeanAQIValues();

  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Process sensor data when it loads - Keeping original processing
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
      const currentAdvisories =
        language === 'english'
          ? healthAdvisoriesData.english
          : healthAdvisoriesData.urdu;

      // Find the appropriate advisory based on AQI value
      const matchingAdvisory = currentAdvisories.find(advisory => {
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
          language === 'english'
            ? 'No specific health recommendations available for the current AQI level'
            : 'موجودہ AQI لیول کے لیے کوئی مخصوص صحت کی سفارشات دستیاب نہیں ہیں',
        ]);
      }
    }
  }, [aqiData, language]);

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

  // Get AQI category based on current AQI value - Using the updated function
  const getAQIDetails = () => {
    if (!aqiData) {
      return {
        text: language === 'english' ? 'Loading...' : 'لوڈ ہو رہا ہے...',
        urduText: 'لوڈ ہو رہا ہے...',
        color: AQI_COLORS.SATISFACTORY,
        gradientColors: ['#FFFFFF', '#F1F7E8', '#F7FAF2'],
      };
    }
    return getAQICategory(aqiData.overall_value);
  };

  const aqiCategory = getAQIDetails();

  // Format timestamp to show days, hours, or minutes ago
  const getLastUpdatedText = () => {
    const timestamp = aqiData?.timestamp || null;

    if (!timestamp) {
      return language === 'english' ? 'Last Updated: --' : 'آخری اپڈیٹ: --';
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
    if (language === 'english') {
      if (diffDays > 0) {
        return `Last Updated: ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `Last Updated: ${diffHours} hour${
          diffHours !== 1 ? 's' : ''
        } ago`;
      } else if (diffMinutes > 0) {
        return `Last Updated: ${diffMinutes} minute${
          diffMinutes !== 1 ? 's' : ''
        } ago`;
      } else {
        return 'Last Updated: Just now';
      }
    } else {
      if (diffDays > 0) {
        return `آخری اپڈیٹ: ${diffDays} دن پہلے`;
      } else if (diffHours > 0) {
        return `آخری اپڈیٹ: ${diffHours} گھنٹے پہلے`;
      } else if (diffMinutes > 0) {
        return `آخری اپڈیٹ: ${diffMinutes} منٹ پہلے`;
      } else {
        return 'آخری اپڈیٹ: ابھی ابھی';
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {language === 'english' ? 'Health Advisory' : 'صحت کا مشورہ'}
      </Text>

      {/* Language Toggle Button */}
      <View style={styles.languageToggleContainer}>
        <TouchableOpacity
          style={[
            styles.languageTab,
            language === 'english' && styles.activeLanguageTab,
          ]}
          onPress={() => setLanguage('english')}>
          <Text
            style={[
              styles.languageTabText,
              language === 'english' && styles.activeLanguageTabText,
            ]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageTab,
            language === 'urdu' && styles.activeLanguageTab,
          ]}
          onPress={() => setLanguage('urdu')}>
          <Text
            style={[
              styles.languageTabText,
              language === 'urdu' && styles.activeLanguageTabText,
            ]}>
            اردو
          </Text>
        </TouchableOpacity>
      </View>

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
                  <Text>
                    <Text style={styles.redText}>
                      {language === 'english' ? 'Important! ' : 'اہم! '}
                    </Text>
                    <Text style={styles.whiteText}>
                      {language === 'english'
                        ? 'Average Air Quality and the Corresponding Health Advisory'
                        : 'اوسط فضائی معیار اور اس کے مطابق صحت سے متعلق تنبیہ'}
                    </Text>
                  </Text>
                </Animated.Text>
              </View>

              <View style={styles.aqiCircleContainer}>
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
                      aqiCategory.text === 'Hazardous' ? {fontSize: 10} : null,
                    ]}>
                    {language === 'english'
                      ? aqiCategory.text
                      : aqiCategory.urduText}
                  </Text>
                </Animated.View>
              </View>

              <View style={styles.updateTimeContainer}>
                <Text style={styles.updateTime}>{getLastUpdatedText()}</Text>
              </View>

              <View style={styles.healthAdviceContainer}>
                <Animated.View style={[{opacity: fadeAnim}]}>
                  <Text
                    style={[
                      styles.alertHeading,
                      language === 'urdu' && styles.urduText,
                    ]}>
                    {/* {language === 'english'
                      ? 'Current Air Quality Advisory'
                      : 'موجودہ ہوا کی کیفیت کا مشورہ'} */}
                  </Text>
                  <ScrollView style={styles.adviceScrollView}>
                    {sensorsLoading ? (
                      <Text
                        style={[
                          styles.alertText,
                          language === 'urdu' && styles.urduText,
                        ]}>
                        {language === 'english'
                          ? 'Loading health recommendations...'
                          : 'صحت کی سفارشات لوڈ ہو رہی ہیں...'}
                      </Text>
                    ) : sensorsError ? (
                      <Text
                        style={[
                          styles.alertText,
                          styles.errorText,
                          language === 'urdu' && styles.urduText,
                        ]}>
                        {language === 'english'
                          ? 'Error loading data'
                          : 'ڈیٹا لوڈ کرنے میں خرابی'}
                      </Text>
                    ) : (
                      healthAdvice.map((recommendation, index) => (
                        <View
                          key={index}
                          style={[
                            styles.bulletContainer,
                            language === 'urdu' && styles.urduBulletContainer,
                          ]}>
                          <Text style={styles.bullet}>•</Text>
                          <Text
                            style={[
                              styles.alertText,
                              language === 'urdu' && styles.urduText,
                            ]}>
                            {recommendation}
                          </Text>
                        </View>
                      ))
                    )}
                  </ScrollView>
                </Animated.View>
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
  heading: {
    fontSize: 25,
    fontWeight: '600',
    color: '#495159',
    padding: 20,
  },
  // Language toggle styles
  languageToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  languageTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#F3F4F6',
  },
  activeLanguageTab: {
    backgroundColor: '#495159',
  },
  languageTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495159',
  },
  activeLanguageTabText: {
    color: 'white',
  },
  // Urdu specific styles
  urduText: {
    fontFamily: 'UrduFont', // This would need to be configured in your app
    textAlign: 'right',
  },
  urduTitle: {
    fontFamily: 'UrduFont',
    textAlign: 'center',
  },
  urduBulletContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  // Top card container
  topCardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  healthAlertContainer: {
    height: 460,
    borderRadius: 12,
    backgroundColor: '#2A2F34',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyleLighter: {
    borderRadius: 12,
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  alertHeaderContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  alertTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  aqiCircleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  aqiCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
  updateTimeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  healthAdviceContainer: {
    width: '100%',
    flex: 1,
  },
  adviceScrollView: {
    height: 300,
  },
  alertHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15, // Increased spacing below each bullet point
  },
  urduBulletContainer: {
    flexDirection: 'row-reverse',
  },
  bullet: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8, // Equal spacing on both sides
    lineHeight: 20,
  },
  alertText: {
    color: 'white',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
    marginBottom: 5, // Add space below text
  },
  redText: {
    color: 'red',
    fontWeight: 'bold',
  },
  whiteText: {
    color: 'white',
  },
  errorText: {
    color: '#FF6B6B',
  },
});

export default HealthAdvisory;
