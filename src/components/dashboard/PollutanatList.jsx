import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  useGetAllSensors,
  useGetLatestMeanSensorValues,
} from '../../services/sensors/sensor.hooks';

// Custom components for pollutant subscripts
const PM25Text = () => (
  <View style={styles.subscriptContainer}>
    <Text style={styles.pollutantBaseText}>PM</Text>
    <Text style={styles.subscriptText}>2.5</Text>
  </View>
);

const PM10Text = () => (
  <View style={styles.subscriptContainer}>
    <Text style={styles.pollutantBaseText}>PM</Text>
    <Text style={styles.subscriptText}>10</Text>
  </View>
);

const NO2Text = () => (
  <View style={styles.subscriptContainer}>
    <Text style={styles.pollutantBaseText}>NO</Text>
    <Text style={styles.subscriptText}>2</Text>
  </View>
);

const SO2Text = () => (
  <View style={styles.subscriptContainer}>
    <Text style={styles.pollutantBaseText}>SO</Text>
    <Text style={styles.subscriptText}>2</Text>
  </View>
);

const O3Text = () => (
  <View style={styles.subscriptContainer}>
    <Text style={styles.pollutantBaseText}>O</Text>
    <Text style={styles.subscriptText}>3</Text>
  </View>
);

const PollutantsList = () => {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [pm25Data, setPm25Data] = useState(null);

  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetAllSensors();

  // Add the sensorMeanData hook to get PM2.5 data
  const {
    data: sensorMeanData,
    isLoading: sensorMeanLoading,
    error: sensorMeanError,
  } = useGetLatestMeanSensorValues();

  // Process sensor location data
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

  // Process PM2.5 data from sensorMeanData
  useEffect(() => {
    if (sensorMeanData && !sensorMeanData.error && sensorMeanData.overall) {
      setPm25Data({
        value: sensorMeanData.overall.latest_hour_mean,
      });
      console.log(
        'PM2.5 value set from sensorMeanData:',
        sensorMeanData.overall.latest_hour_mean,
      );
    }
  }, [sensorMeanData]);

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

  const getAQIDetails = () => {
    // Use PM2.5 value from sensorMeanData if available
    if (pm25Data) {
      return getAQICategory(pm25Data.value);
    }
    // Fallback to selectedSensor value if PM2.5 data not available
    if (selectedSensor) {
      return getAQICategory(selectedSensor.sensor_value);
    }
    // Loading state
    return {text: 'Loading...', color: '#FFDA75'};
  };

  const aqiCategory = getAQIDetails();

  // Display loading state when data is being fetched
  const isLoading = sensorsLoading || sensorMeanLoading;
  const hasError = sensorsError || sensorMeanError;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Air Pollutants</Text>
          </View>

          {isLoading && (
            <Text style={styles.loadingText}>Loading pollutant data...</Text>
          )}

          {hasError && (
            <Text style={styles.errorText}>Error loading pollutant data</Text>
          )}

          <View style={styles.pollutantsContainer}>
            <View style={[styles.pollutantCard, styles.amberBorder]}>
              <View style={styles.pollutantLabelContainer}>
                <Text style={styles.pollutantLabelText}>
                  Particulate Matter
                </Text>
                <View style={styles.labelParenGroup}>
                  <Text style={styles.pollutantLabelText}>(</Text>
                  <PM25Text />
                  <Text style={styles.pollutantLabelText}>)</Text>
                </View>
              </View>
              <Text style={styles.pollutantValue}>
                <Text style={[styles.aqiValue, {color: aqiCategory.color}]}>
                  {pm25Data
                    ? Math.round(pm25Data.value)
                    : selectedSensor
                    ? Math.round(selectedSensor.sensor_value)
                    : '--'}{' '}
                  µg/m³
                </Text>{' '}
              </Text>
            </View>

            <View style={[styles.pollutantCard, styles.blueBorder]}>
              <View style={styles.pollutantLabelContainer}>
                <Text style={styles.pollutantLabelText}>
                  Particulate Matter
                </Text>
                <View style={styles.labelParenGroup}>
                  <Text style={styles.pollutantLabelText}>(</Text>
                  <PM10Text />
                  <Text style={styles.pollutantLabelText}>)</Text>
                </View>
              </View>
              <Text style={styles.pollutantValue}>Coming soon</Text>
            </View>

            <View style={[styles.pollutantCard, styles.fuchsiaBorder]}>
              <View style={styles.pollutantLabelContainer}>
                <Text style={styles.pollutantLabelText}>Nitrogen Dioxide</Text>
                <View style={styles.labelParenGroup}>
                  <Text style={styles.pollutantLabelText}>(</Text>
                  <NO2Text />
                  <Text style={styles.pollutantLabelText}>)</Text>
                </View>
              </View>
              <Text style={styles.pollutantValue}>Coming soon</Text>
            </View>

            <View style={[styles.pollutantCard, styles.greenBorder]}>
              <View style={styles.pollutantLabelContainer}>
                <Text style={styles.pollutantLabelText}>Sulpher Dioxide</Text>
                <View style={styles.labelParenGroup}>
                  <Text style={styles.pollutantLabelText}>(</Text>
                  <SO2Text />
                  <Text style={styles.pollutantLabelText}>)</Text>
                </View>
              </View>
              <Text style={styles.pollutantValue}>Coming soon</Text>
            </View>

            <View style={[styles.pollutantCard, styles.orangeBorder]}>
              <View style={styles.pollutantLabelContainer}>
                <Text style={styles.pollutantLabelText}>Carbon Monoxide</Text>
                <View style={styles.labelParenGroup}>
                  <Text style={styles.pollutantLabelText}>(CO)</Text>
                </View>
              </View>
              <Text style={styles.pollutantValue}>Coming soon</Text>
            </View>

            <View style={[styles.pollutantCard, styles.redBorder]}>
              <View style={styles.pollutantLabelContainer}>
                <Text style={styles.pollutantLabelText}>Ozone</Text>
                <View style={styles.labelParenGroup}>
                  <Text style={styles.pollutantLabelText}>(</Text>
                  <O3Text />
                  <Text style={styles.pollutantLabelText}>)</Text>
                </View>
              </View>
              <Text style={styles.pollutantValue}>Coming soon</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f7',
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  headerSection: {
    paddingVertical: 12,
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#31343D',
  },
  pollutantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  pollutantCard: {
    flexDirection: 'column',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
    height: 110,
    borderLeftWidth: 6,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    margin: 4,
    marginBottom: 12,
  },
  pollutantLabelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelParenGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollutantLabelText: {
    fontSize: 13,
    color: '#31343D',
    fontWeight: '500',
  },
  subscriptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pollutantBaseText: {
    fontSize: 13,
    color: '#31343D',
    fontWeight: '500',
  },
  subscriptText: {
    fontSize: 10,
    color: '#31343D',
    lineHeight: 10,
    marginBottom: 1.5,
    fontWeight: '500',
  },
  pollutantValue: {
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#31343D',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  amberBorder: {
    borderLeftColor: '#FCD34D',
  },
  blueBorder: {
    borderLeftColor: '#93C5FD',
  },
  fuchsiaBorder: {
    borderLeftColor: '#D946EF',
  },
  greenBorder: {
    borderLeftColor: '#86EFAC',
  },
  orangeBorder: {
    borderLeftColor: '#FDBA74',
  },
  redBorder: {
    borderLeftColor: '#FCA5A5',
  },
  aqiValue: {
    fontWeight: 'bold',
  },
});

export default PollutantsList;
