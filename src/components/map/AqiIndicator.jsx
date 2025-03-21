// AqiIndicator.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const AqiIndicator = ({currentLayer, onPress}) => {
  return (
    <TouchableOpacity style={styles.aqiIndicator} onPress={onPress}>
      <Text style={styles.aqiText}>AQI</Text>
      <Text style={styles.aqiValue}>
        {currentLayer ? currentLayer.name.split(' ')[0] : 'PM2.5'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  aqiIndicator: {
    position: 'absolute',
    left: 20,
    bottom: 80,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  aqiText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  aqiValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default AqiIndicator;
