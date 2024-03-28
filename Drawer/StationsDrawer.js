import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StationsDrawer = ({ route }) => {
  const { currentLocation, stations } = route.params;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };
  

  const sortedStations = stations.map(station => ({
    ...station,
    distance: calculateDistance(currentLocation.latitude, currentLocation.longitude, station.latitude, station.longitude),
  })).sort((a, b) => a.distance - b.distance).slice(0, 4); // Sort by distance and take the first 4

  return (
    <View style={styles.container}>
      {sortedStations.map((station, index) => (
        <Text key={index} style={styles.text}>
          {station.nom} - {station.distance.toFixed(2)} km
        </Text>
      ))}
    </View>
  );
};

export default StationsDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
