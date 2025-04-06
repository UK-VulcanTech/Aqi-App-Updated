import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AQIDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#FFFFFF', '#F0C09D', '#F8D7BE']}
        style={styles.gradientBackground}
        locations={[0.0, 0.5, 0.8]}
      />
      <StatusBar backgroundColor="#E4E4E4" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        {/* <Image
          source={require('../../assets/icons/home.png')}
          style={styles.homeIcon}
        />
        <Text style={styles.headerText}>Dashboard</Text> */}
      </View>

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

        <Text style={styles.location}>Lahore Cantonment, Punjab, PK</Text>
        <Text style={styles.updateTime}>Last Updated: 2 hours ago</Text>

        {/* AQI Display - Centered */}
        <View style={styles.aqiCenterContainer}>
          <View style={styles.aqiDisplayContainer}>
            <View style={styles.moderateBox}>
              <Text style={styles.moderateText}>Moderate</Text>
            </View>
            <Text style={styles.aqiNumber}>175</Text>
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
                PM2.5: <Text style={styles.pmValue}>68</Text> μg/m³
              </Text>

              <Image
                source={require('../../assets/images/face.png')}
                style={styles.personImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      {/* City Skyline Background */}
      <Image
        source={require('../../assets/images/Lahore.png')}
        style={styles.cityBackground}
        // resizeMode="stretch"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: 'transparent',
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
  },
  pmTextContainer: {
    marginRight: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  pmText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20, // Keep some margin below the text
  },
  pmValue: {
    fontWeight: 'bold',
  },
  pmUnit: {
    fontSize: 14,
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
    height: 180,
    position: 'absolute',
    bottom: 0,
  },
});

export default AQIDashboard;
