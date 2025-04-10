import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useGetAllSensors} from '../../services/sensor.hooks';

const PollutantsList = () => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const {
    data: sensorData,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useGetAllSensors();

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
    if (!selectedSensor) {
      return {text: 'Loading...', color: '#FFDA75'};
    }
    return getAQICategory(selectedSensor.sensor_value);
  };

  const aqiCategory = getAQIDetails();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Air Pollutants</Text>
          </View>

          <View style={styles.pollutantsContainer}>
            <View style={[styles.pollutantCard, styles.amberBorder]}>
              <Text style={styles.pollutantLabel}>
                Particulate Matter (PM2.5)
                {/* {selectedSensor?.sensor_value} */}
              </Text>
              <Text style={styles.pollutantValue}>
                <Text style={[styles.aqiValue, {color: aqiCategory.color}]}>
                  {Math.round(selectedSensor?.sensor_value)} µg/m³
                </Text>{' '}
              </Text>
            </View>

            <View style={[styles.pollutantCard, styles.blueBorder]}>
              <Text style={styles.pollutantLabel}>
                Particulate Matter (PM10)
              </Text>
              <Text style={styles.pollutantValue}>283 µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.fuchsiaBorder]}>
              <Text style={styles.pollutantLabel}>Nitrogen Dioxide (NO2)</Text>
              <Text style={styles.pollutantValue}>107 µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.greenBorder]}>
              <Text style={styles.pollutantLabel}>Sulpher Dioxide (SO2)</Text>
              <Text style={styles.pollutantValue}>49 µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.orangeBorder]}>
              <Text style={styles.pollutantLabel}>Carbon Monoxide (CO)</Text>
              <Text style={styles.pollutantValue}>5 µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.redBorder]}>
              <Text style={styles.pollutantLabel}>Ozone (O3)</Text>
              <Text style={styles.pollutantValue}>19 µg/m³</Text>
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
  pollutantLabel: {
    fontSize: 13,
    color: '#31343D',
    textAlign: 'center',
    fontWeight: '500',
  },
  pollutantValue: {
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#31343D',
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
});

export default PollutantsList;
