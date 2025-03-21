// RemoveLayerButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const RemoveLayerButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.removeLayerButton} onPress={onPress}>
      <Text style={styles.removeLayerButtonText}>Remove Layer</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  removeLayerButton: {
    position: 'absolute',
    top: 120,
    right: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 8,
  },
  removeLayerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RemoveLayerButton;
