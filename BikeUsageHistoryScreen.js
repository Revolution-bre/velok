import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import NavigationBar from './NavigationBar'; // Make sure this path is correct

const BikeUsageHistoryScreen = ({ route, navigation }) => {
  const { bikeUsageHistory } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Date: {item.date}</Text>
      <Text style={styles.detail}>Duration: {item.duration} mins</Text>
      <Text style={styles.detail}>Returned: {item.returnedOnTime ? 'On Time' : `Late by ${item.lateBy} mins`}</Text>
    </View>
  
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={bikeUsageHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <NavigationBar navigation={navigation} currentRoute="BikeUsageHistory" />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  detail: {
    fontSize: 14,
  },
});

export default BikeUsageHistoryScreen;
