import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // naoooo esqueceee de install react-native-vector-icons
import { parseXML } from '../xmlParser'; 

const communes = [
    { name: 'Bettembourg', url: 'https://bettembourg.lu', image: require('./communes/Bettembourg.png') },
    { name: 'Differdange', url: 'https://differdange.lu', image: require('./communes/Differdange.png') },
    { name: 'Dudelange', url: 'https://www.dudelange.lu', image: require('./communes/Dudelange.png') },
    { name: 'Esch-sur-Alzette', url: 'https://esch.lu', image: require('./communes/Esch.png') },
    { name: 'Kayl', url: 'https://www.kayl.lu', image: require('./communes/Kayl.png') },
    { name: 'Mondercange', url: 'https://www.mondercange.lu', image: require('./communes/Mondercange.png') },
    { name: 'Rumelange', url: 'https://rumelange.lu', image: require('./communes/Rumelange.png') },
    { name: 'Sanem', url: 'https://www.suessem.lu/fr/', image: require('./communes/Sanem.svg.png') },
    { name: 'Schifflange', url: 'https://schifflange.lu', image: require('./communes/Schifflange.png') },
  ];
  

const CommunesDrawer = () => {
  const [communeData, setCommuneData] = useState([]);

  useEffect(() => {
    fetch('https://webservice.velok.lu/station.aspx')
      .then(response => response.text())
      .then(xml => {
        const data = parseXML(xml);
        const updatedCommunes = communes.map(commune => {
          const stationsInCommune = data.filter(station => station.nomcommune === commune.name);
          const activeStationsCount = stationsInCommune.filter(station => station.active === '1').length;
          return { ...commune, totalStations: stationsInCommune.length, activeStations: activeStationsCount };
        });
        setCommuneData(updatedCommunes);
      })
      .catch(error => console.error('Communes stations error', error));
  }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => Linking.openURL(item.url)}>
      <View style={styles.itemContent}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.stationInfo}>Stations: {item.totalStations}, Active: {item.activeStations}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#000" />
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={communeData}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default CommunesDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'left', 
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
  },
  stationInfo: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginLeft: 85, // Adjusted based on layout to not span full width
  },
});
