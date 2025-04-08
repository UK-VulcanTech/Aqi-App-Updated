import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PollutantsList = () => {
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
              </Text>
              <Text style={styles.pollutantValue}>49µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.blueBorder]}>
              <Text style={styles.pollutantLabel}>
                Particulate Matter (PM10)
              </Text>
              <Text style={styles.pollutantValue}>49µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.fuchsiaBorder]}>
              <Text style={styles.pollutantLabel}>Nitrogen Dioxide (NO2)</Text>
              <Text style={styles.pollutantValue}>49µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.greenBorder]}>
              <Text style={styles.pollutantLabel}>Sulpher Dioxide (SO2)</Text>
              <Text style={styles.pollutantValue}>49µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.orangeBorder]}>
              <Text style={styles.pollutantLabel}>Carbon Monoxide (CO)</Text>
              <Text style={styles.pollutantValue}>49µg/m³</Text>
            </View>

            <View style={[styles.pollutantCard, styles.redBorder]}>
              <Text style={styles.pollutantLabel}>Ozone (O3)</Text>
              <Text style={styles.pollutantValue}>49µg/m³</Text>
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
