import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import Header from '../components/dashboard/Header';
import AQIDashboard from '../components/dashboard/AQIDashboard';
import HealthAdvisory from '../components/dashboard/HealthAdvisory';
import AirQualityChart from '../components/dashboard/AirQualityChart';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dashboardWrapper}>
          <AQIDashboard />
        </View>
        <View style={styles.advisoryWrapper}>
          <HealthAdvisory />
        </View>
        <View style={styles.advisoryWrapper}>
          <AirQualityChart />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  dashboardWrapper: {
    height: 620,
  },
  advisoryWrapper: {
    // No specific height needed, will take its natural height
  },
});

export default HomeScreen;
