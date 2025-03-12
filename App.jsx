import React from 'react';
import {View, StyleSheet} from 'react-native';
// import Login from './src/components/auth/Login';
// import Map from './src/components/Map';
import DummyMap from './src/components/map/DummyMap';

function App() {
  return (
    <View style={styles.container}>
      {/* <Login /> */}
      <DummyMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
