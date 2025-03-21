// LocationButton.js
import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const LocationButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.locationButton} onPress={onPress}>
      <Image
        source={require('../../assets/icons/current-location.png')}
        style={{width: 60, height: 60}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#222',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 10,
  },
});

export default LocationButton;
