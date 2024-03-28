import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { parseRideHistoryXML } from './rideHistoryParser';

import { Dimensions } from 'react-native'; // Import Dimensions

const HistoryScreen = () => {
  const [rideHistory, setRideHistory] = useState([]);
  // Add a state for toggling the view
  const [isGridView, setIsGridView] = useState(false);


  // Get the screen width
  const screenWidth = Dimensions.get('window').width;

  // Calculate the card width for grid view
  const cardWidth = (screenWidth / 2) - 20; 

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await fetch('https://webservice.velok.lu/historique.aspx?guid=97014F71-6135-4A7F-9503-1FBD8677E21F');
        const xmlText = await response.text();

        const history = parseRideHistoryXML(xmlText);
        setRideHistory(history);
      } catch (error) {
        console.error('Error fetching ride history:', error);
      }
    };

    fetchRideHistory();
  }, []);

  // Function to toggle the view mode
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rides History</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
        <Text>{isGridView ? 'List View' : 'Grid View'}</Text>
      </TouchableOpacity>
      <View style={isGridView ? styles.grid : styles.list}>
        {rideHistory.map((ride, index) => (
        <View key={index} style={[styles.card, isGridView && { width: cardWidth }]}>
        <Text style={styles.label}>Start Date and Time:</Text>
        <Text style={styles.info}>{ride.datedebut}</Text>
        <Text style={styles.label}>End Date and Time:</Text>
        <Text style={styles.info}>{ride.datefin}</Text>
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.info}>{ride.duree}</Text>
        <Text style={styles.label}>Bike Number:</Text>
        <Text style={styles.info}>{ride.velo}</Text>
        <Text style={styles.label}>Start Station:</Text>
        <Text style={styles.info}>{ride.stationdebut}</Text>
        <Text style={styles.label}>End Station:</Text>
        <Text style={styles.info}>{ride.stationfin}</Text>
      </View>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7DBB9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // For list view, you might want to have a full width minus some margin
    // If this is not required, remove the following line
    width: Dimensions.get('window').width - 20,
  },
  toggleButton: {
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  list: {
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 2, // Adjust as needed for spacing
  },
  info: {
    marginBottom: 5, // Adjust as needed for spacing between entries
  },
});

export default HistoryScreen;
