import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const AnalyserScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Air Quality Analysis</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Basic content */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PM2.5 Analysis</Text>
          <Text style={styles.cardText}>
            This screen will show detailed analysis of the air quality data.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Historical Data</Text>
          <Text style={styles.cardText}>
            Chart showing historical pollution levels will appear here.
          </Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Chart Placeholder</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Recommendations</Text>
          <Text style={styles.cardText}>
            • Consider wearing a mask if air quality is poor
          </Text>
          <Text style={styles.cardText}>
            • Limit outdoor activities during peak pollution hours
          </Text>
          <Text style={styles.cardText}>
            • Use air purifiers indoors when needed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    color: '#FFD633',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 30,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    color: '#dddddd',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  placeholderText: {
    color: '#aaaaaa',
    fontSize: 16,
  },
});

export default AnalyserScreen;
