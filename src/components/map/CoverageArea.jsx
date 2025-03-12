// src/components/map/CoverageArea.jsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {LeafletView} from 'react-native-leaflet-view';

function CoverageArea() {
  // Define the map configuration
  const mapOptions = {
    centerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    zoom: 13,
  };

  // Define your circle overlay
  const circleOverlay = {
    id: 'circleOverlay',
    shape: 'circle',
    center: [51.505, -0.09],
    radius: 1000,
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.2,
  };

  return (
    <View style={styles.container}>
      <LeafletView
        mapOptions={mapOptions}
        overlays={[circleOverlay]}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default CoverageArea;
