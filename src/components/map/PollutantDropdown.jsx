// PollutantDropdown.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const PollutantDropdown = ({show, layers, onSelect}) => {
  if (!show) return null;

  return (
    <View style={styles.pollutantDropdown}>
      <ScrollView>
        {layers.map((layer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.pollutantDropdownItem}
            onPress={() => onSelect(layer)}>
            <Text style={styles.pollutantDropdownText}>{layer.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pollutantDropdown: {
    position: 'absolute',
    top: 120,
    right: 15,
    width: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 5,
    maxHeight: 250,
    zIndex: 10,
  },
  pollutantDropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pollutantDropdownText: {
    color: 'white',
    fontSize: 14,
  },
});

export default PollutantDropdown;
