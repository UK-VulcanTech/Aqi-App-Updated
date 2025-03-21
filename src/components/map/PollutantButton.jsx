// PollutantButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const PollutantButton = ({currentLayer, onPress}) => {
  return (
    <TouchableOpacity style={styles.pollutantButton} onPress={onPress}>
      <Text style={styles.pollutantButtonText}>
        {currentLayer ? currentLayer.name : 'Select Pollutant'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pollutantButton: {
    position: 'absolute',
    top: 80,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 8,
  },
  pollutantButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PollutantButton;
