import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

const CustomDrawerContent = (props) => {
  const { userStats } = props;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfoSection}>
        <Text style={styles.greeting}>Hello, Brenda!</Text>

        <View style={styles.statsRow}>
          {/* Total Rides */}
          <View style={styles.statItem}>
            <MaterialIcons name="directions-bike" size={24} color="black" />
            <Text style={styles.statText}>Total Rides: {userStats.totalRides}</Text>
          </View>
          {/* Total Riding Time */}
          <View style={styles.statItem}>
            <MaterialIcons name="timer" size={24} color="black" />
            <Text style={styles.statText}>Riding Time: {userStats.totalRidingTime}</Text>
          </View>
          {/* Average Ride Duration */}
          <View style={styles.statItem}>
            <MaterialIcons name="timeline" size={24} color="black" />
            <Text style={styles.statText}>Avg Duration: {userStats.averageRideDuration.toFixed(2)} min</Text>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#8B4513', // Brown color
    // Adjust the height if needed to give more space
    minHeight: 200,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statsTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjust spacing between items
    marginTop: 30,
  },
  statItem: {
    alignItems: 'center',
    // Adjust the width or flex to give more space between items
    flex: 1,
  },
  statText: {
    marginTop: 5, // space between icon and text
    textAlign: 'center', // Ensure text is centered if it wraps
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
});

export default CustomDrawerContent;

