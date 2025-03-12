// src/components/map/DistrictBoundaries.jsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {LeafletView} from 'react-native-leaflet-view';

function DistrictBoundaries() {
  // Define the map configuration
  const mapOptions = {
    centerPosition: {
      lat: 51.51,
      lng: -0.1,
    },
    zoom: 13,
  };

  // Define your polygon overlay
  const polygonOverlay = {
    id: 'polygonOverlay',
    shape: 'polygon',
    positions: [
      [51.51, -0.12],
      [51.52, -0.11],
      [51.52, -0.09],
      [51.51, -0.08],
      [51.51, -0.12],
    ],
    color: 'purple',
    fillColor: 'purple',
    fillOpacity: 0.2,
    weight: 2,
  };

  return (
    <View style={styles.container}>
      <LeafletView
        mapOptions={mapOptions}
        overlays={[polygonOverlay]}
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

export default DistrictBoundaries;
