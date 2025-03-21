// PollutionInfoCard.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PollutionInfoCard = ({show, markerData, onTabSelect, selectedTab}) => {
  if (!show || !markerData) return null;

  return (
    <View style={styles.pollutionInfoCardContainer}>
      <View style={styles.pollutionInfoCard}>
        <Text style={styles.pollutionInfoSource}>{markerData.source}</Text>
        <Text style={styles.pollutionInfoType}>{markerData.type}</Text>
        <Text style={styles.pollutionInfoValue}>{markerData.value}</Text>
        <View style={styles.pollutionInfoStatus}>
          <Text style={styles.pollutionInfoStatusText}>
            {markerData.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pollutionInfoCardContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pollutionInfoCard: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
  pollutionInfoSource: {
    color: 'rgba(255, 0, 0, 0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  pollutionInfoType: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  pollutionInfoValue: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pollutionInfoStatus: {
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
  },
  pollutionInfoStatusText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default PollutionInfoCard;
