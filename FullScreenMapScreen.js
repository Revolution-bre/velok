import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { parseXML } from './xmlParser';



const FullScreenMapScreen = () => {
    const mapRef = useRef(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [stations, setStations] = useState([]); // State for fetched stations

    const centerMapOnUser = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        const userLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005, // Closer zoom
            longitudeDelta: 0.005, // Closer zoom
        };
    
        setUserLocation(userLoc);
    
        if (mapRef.current) {
            mapRef.current.animateToRegion(userLoc, 1000);
        }
    };
    

      
    useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              console.error('Permission to access location was denied');
              return;
          }
  
          let location = await Location.getCurrentPositionAsync({});
          const userLoc = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
          };
          setUserLocation(userLoc);
  
          // Check if mapRef.current is not null
          if (mapRef.current) {
              mapRef.current.animateToRegion(userLoc, 1000);
          }
      })();
  }, []);
  

  const fetchRoute = async (destination) => {
    if (!userLocation) return;

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=`;

    try {
        const response = await axios.get(directionsUrl);
        const points = response.data.routes[0].overview_polyline.points;
        const routePoints = decode(points);
        const distance = response.data.routes[0].legs[0].distance.text;
        setRouteCoordinates(routePoints);
        setSelectedStation(prevStation => ({ ...prevStation, distance }));
    } catch (error) {
        console.error(error);
    }
};


  const onMarkerPress = (station) => {
    // Keep the entire station object including additional details
    setSelectedStation(station);
    fetchRoute({ latitude: station.latitude, longitude: station.longitude });
};






    useEffect(() => {
        fetch('https://webservice.velok.lu/stationproche.aspx?latitude=49.494&longitude=5.977')
            .then((response) => response.text())
            .then((xml) => {
                const data = parseXML(xml);
                setStations(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });


    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>Station Number: {item.nstation}</Text>
            <Text style={styles.detail}>Station Name: {item.nom}</Text>
            {/* Render other fields similarly */}
        </View>
    );



    return (
        <View style={styles.container}>
<MapView
    ref={mapRef}
    style={styles.map}
    initialRegion={{
        latitude: 49.4989,
        longitude: 5.9806,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }}
>
    {/* Map Markers for Stations */}
    {stations.map((station, index) => {
        const latitude = parseFloat(station.latitude);
        const longitude = parseFloat(station.longitude);

        // Check if latitude and longitude are valid numbers
        if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
                <Marker
                    key={index}
                    coordinate={{ latitude, longitude }}
                    title={station.nom}
                    onPress={() => onMarkerPress(station)}
                />
            );
        }
    })}

    {userLocation && (
        <Circle
            center={userLocation}
            radius={30}
            fillColor="rgba(30, 144, 255, 0.3)" // Semi-transparent blue
            strokeColor="rgba(30, 144, 255, 0.8)" // Blue border
        />
    )}

    {routeCoordinates.length > 0 && (
        <Polyline
            coordinates={routeCoordinates}
            strokeColor="#ffa500" // orange
            strokeWidth={3}
        />
    )}
</MapView>

{selectedStation && (
    <Modal
        animationType="slide"
        transparent={true}
        visible={selectedStation != null}
        onRequestClose={() => setSelectedStation(null)}
    >
        <View style={styles.modalView}>
            <Text style={styles.stationName}>{selectedStation.nom}</Text>
            <Text>Status: {selectedStation.active === "1" ? "Active" : "Inactive"}</Text>
            <Image source={{ uri: selectedStation.urlphoto }} style={styles.stationImage} />
            <Text>EBikes Available: {selectedStation.ebikes}</Text>
            <Text>Free Places: {selectedStation.libres}</Text>
            <Text>Distance: {selectedStation.distance ? selectedStation.distance : 'Calculating...'}</Text>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedStation(null)}
            >
                <Text>Close</Text>
            </TouchableOpacity>
        </View>
    </Modal>
)}


            <TouchableOpacity
            style={styles.locateButton}
            onPress={centerMapOnUser}
            >
            <Text style={styles.locateButtonText}>Locate Me</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    modalView: {
        marginTop: 550,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
        maxHeight: '50%' // Set a maximum height for the modal
    },
    
    stationName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    stationImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15
    },
    locateButton: {
        position: 'absolute', // Position over the map
        bottom: 20, // 20 pixels from the bottom
        right: 20, // 20 pixels from the right
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 2,
      },
      locateButtonText: {
        color: 'black',
      }
      
});

function decode(encoded) {
  var points = [];
  var index = 0, len = encoded.length;
  var lat = 0, lng = 0;

  while (index < len) {
      var b, shift = 0, result = 0;
      do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);

      var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);

      var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
  }

  return points;
}



export default FullScreenMapScreen;
