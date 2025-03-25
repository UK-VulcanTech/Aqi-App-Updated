import React from 'react';
import {StyleSheet} from 'react-native';
import Header from '../components/dashboard/Header';
import AQIDashboard from '../components/dashboard/AQIDashboard';

const HomeScreen = () => {
  return (
    <>
      <Header />
      <AQIDashboard />
    </>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
