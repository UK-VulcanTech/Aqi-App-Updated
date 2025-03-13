import React from 'react';
import {View, StyleSheet} from 'react-native';
import LahoreMap from './src/components/map/LahoreMap';
// import DummyMap from './src/components/map/DummyMap';
// import Login from './src/components/auth/Login';
// import Map from './src/components/Map';
// import DummyMap from './src/components/map/DummyMap';

function App() {
  return (
    <View style={styles.container}>
      {/* <Login /> */}
      {/* <DummyMap /> */}
      {/* <DummyMap /> */}
      <LahoreMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
