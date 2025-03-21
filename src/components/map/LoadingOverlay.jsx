// LoadingOverlay.js
import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const LoadingOverlay = ({loading, message}) => {
  if (!loading) return null;

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 15,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
});

export default LoadingOverlay;
