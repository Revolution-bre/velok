import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, handlePress, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Animated } from 'react-native';



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



import FullScreenMapScreen from './FullScreenMapScreen';


import NavigationBar from './NavigationBar'; 
import * as Notifications from 'expo-notifications';

import { Alert } from 'react-native';

import { parseBikeStatusXML } from './bikeStatusXmlParser';

import { parseXML } from './xmlParser'; 

import { Audio } from 'expo-av';

import MapView, { Marker } from 'react-native-maps';




export default function App() {
  const [greeting, setGreeting] = useState('');
  const [city, setCity] = useState('Loading...');
  const [temperature, setTemperature] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [showMap, setShowMap] = useState(false);
  const Stack = createStackNavigator();
  const navigation = useNavigation();



  // const [timer, setTimer] = useState(7200); // Initialize timer to 2 hours in seconds
  const [timer, setTimer] = useState(60); // Initialize timer to 2 minute in seconds
  const [isOverdue, setIsOverdue] = useState(false); // State to track if the timer is in overdue time


  
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [bikeUsageHistory, setBikeUsageHistory] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [previousStatus, setPreviousStatus] = useState(null);
  const [activeStations, setActiveStations] = useState(0);
  const [freeSpots, setFreeSpots] = useState(0);
  const [eBikes, setEBikes] = useState(0);

  const [stationData, setStationData] = useState([]);


  useEffect(() => {
    setGreeting(getGreeting());
  }, []);


  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
  
        try {
          let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
          if (reverseGeocode.length > 0) {
            setCity(reverseGeocode[0].city);
          } else {
            setCity('Not Found');
          }
        } catch (error) {
          console.error('Error during reverse geocoding:', error);
        }
  
        fetchWeather();
      } catch (error) {
        console.error('Error fetching location or weather:', error);
      }
    };
  
    fetchLocationAndWeather();
  }, []);
  

  

  const handleMapPress = () => {
    navigation.navigate('FullScreenMap');
  };

  const fetchWeather = async () => {
    const url = "https://weather.visualcrossing.com/...";
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      const currentWeather = data.currentConditions;
      const tempInCelsius = convertFahrenheitToCelsius(currentWeather.temp);
      setTemperature(`${Math.round(tempInCelsius)}°C`);
      setWeatherCondition(currentWeather.conditions);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  
  const convertFahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`;
  };

  // Request notification permissions on component mount
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.error('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token); // This is your device's push token
      // You might want to send the token to your backend to keep it for later use
    })();
  }, []);
  
  


useEffect(() => {
  fetch('https://webservice.velok.lu/stationproche.aspx?latitude=49.494&longitude=5.977')
    .then(response => response.text())
    .then(xml => {
      const data = parseXML(xml);
      setStationData(data); 
      const activeStationsCount = data.filter(station => station.active === '1').length;
      const totalFreeSpots = data.reduce((acc, station) => acc + parseInt(station.libres, 10), 0);
      const totalEBikes = data.reduce((acc, station) => acc + parseInt(station.ebikes, 10), 0);

      setActiveStations(activeStationsCount);
      setFreeSpots(totalFreeSpots);
      setEBikes(totalEBikes);
    })
    .catch(error => console.error('Error:', error));
}, []);

const handleNavigateToStationsDrawer = () => {
  navigation.navigate('Stations', {
    currentLocation: currentLocation, // Assuming this is stored in your state
    stations: stationData,
  });
};


useEffect(() => {
  // Function to fetch bike status
  const fetchBikeStatus = async () => {
    try {
      const response = await fetch('http://webservice.velok.lu/AbonneStatus.aspx?guid=97014F71-6135-4A7F-9503-1FBD8677E21F');
      const xmlText = await response.text();
  
      const status = parseBikeStatusXML(xmlText);
  
      if (status !== null) {
        handleBikeStatusChange(status);
      } else {
        console.error('Error parsing bike status');
      }
    } catch (error) {
      console.error('Error fetching bike status:', error);
    }
  };
  
  // Call fetchBikeStatus every X seconds
  const statusInterval = setInterval(fetchBikeStatus, 10000); // Adjust interval as needed

  return () => clearInterval(statusInterval);
}, []);



const handleBikeStatusChange = (status) => {
  setPreviousStatus(prevStatus => {
    if (status === 1 && prevStatus !== 1) { // Bike just lent
      setTimer(60); // 1 minute in seconds
      setIsTimerActive(true);
      scheduleNotification(); // Schedule the notification when the timer starts
      this.bikeOutTime = new Date(); // Record the time when the bike was taken
    } else if (status === 2 && prevStatus !== 2) { // Bike returned
      setIsTimerActive(false);
      const duration = Math.round((new Date() - this.bikeOutTime) / 1000 / 60);
      recordBikeUsage(duration, timer >= 0);
    }
    return status; // Update previous status
  });
};


// Timer logic modified to allow negative counting
  // Timer logic with notification scheduling
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isTimerActive, timer]);
  
  

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's almost up!",
        body: "It's almost time to put the bike back.",
        sound: true,
      },
      trigger: {
        seconds: 30,
      },
    });
  };
  





  useEffect(() => {
    // Set isOverdue to true when the timer hits 0 or goes below, indicating the start of the overdue period
    if (timer <= 0 && !isOverdue) {
      setIsOverdue(true);
    }
  }, [timer, isOverdue]);






const formatTimer = () => {
  let absTimer = Math.abs(timer);
  const hours = Math.floor(absTimer / 3600);
  const minutes = Math.floor((absTimer % 3600) / 60);
  const seconds = absTimer % 60;
  const sign = timer < 0 ? "-" : "";

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return `${sign}${formattedTime}${isOverdue ? ' (Overdue Time)' : ''}`;
};


Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playThroughEarpieceAndroid: false,
});


const playSound = async () => {
  const sound = new Audio.Sound();
  try {
    await sound.loadAsync(require('./audios/yelling.mp3'));
    await sound.setIsLoopingAsync(true); // Loop the sound
    await sound.playAsync();
    setTimeout(() => {
      sound.stopAsync(); // Stop the sound after 1 minute
    }, 60000); // 60000 ms = 1 minute
  } catch (error) {
    console.error('Error playing sound', error);
  }
};




// Add this inside your handle functions to record bike usage
const recordBikeUsage = (duration, returnedOnTime) => {
  setBikeUsageHistory(prevHistory => [
    ...prevHistory,
    {
      id: prevHistory.length + 1,
      date: new Date().toLocaleDateString(),
      duration,
      returnedOnTime,
      lateBy: returnedOnTime ? 0 : Math.abs(duration - 120) // Assuming 120 minutes (2 hours) is the limit
    }
  ]);
};




  return (

    <SafeAreaView style={styles.body}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
    
    
            <View style={styles.header}>
              <View style={styles.shadow}>
                <Image 
                  style={styles.headerImg}
                  source={require('./assets/Velok-logo.png')}
                />
              </View>
            </View>

          <Text style={styles.greeting}>{greeting}</Text>


      <View style={styles.container}>
      {/* Weather Box */}
      <View style={styles.weatherBox}>
        <View style={styles.weatherTop}>
          <Image source={require('./assets/sunny.png')} style={styles.weatherIcon} />
          <View>
            <Text style={styles.temperature}>{temperature}</Text>
            <Text style={styles.weatherDescription}>{weatherCondition}</Text>
          </View>
        </View>
        <View style={styles.weatherMiddle}>
          <Image source={require('./assets/navigation-2.png')} style={styles.navigationIcon} />
            <Text>{city}</Text>
        </View>
        <View style={styles.weatherBottom}>
          <Text>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* Stations Box */}
      <View style={styles.stationsBox}>
        <View style={styles.stationTop}>
          <Text style={styles.stationTopText}>Places Libres: {freeSpots}</Text>
        </View>
        <View style={styles.stationTop}>
          <Text style={styles.stationTopText}>Stations Active: {activeStations}</Text>
        </View>
        <View style={styles.stationTop}>
          <Text style={styles.stationTopText}>e-Bikes available: {eBikes}</Text>
        </View>
        <View style={styles.stationBottom}>
          <Text style={styles.stationBottomText}>Etat du Parc</Text>
        </View>
      </View>
    </View>




    <Stack.Navigator initialRouteName="Main">
  {/* Other screens */}
  <Stack.Screen name="FullScreenMap" component={FullScreenMapScreen} options={{ headerShown: false }} />
</Stack.Navigator>

<TouchableOpacity onPress={handleNavigateToStationsDrawer}>
  <Text>Go to Stations Drawer</Text>
</TouchableOpacity>

<View style={styles.miniMapContainer}>
  <MapView
    style={styles.miniMap}
    initialRegion={{
      latitude: currentLocation ? currentLocation.latitude : 49.496376,
      longitude: currentLocation ? currentLocation.longitude : 5.9746123,
      latitudeDelta: 0.010, // Smaller delta values for closer zoom
      longitudeDelta: 0.010,
    }}
    scrollEnabled={false}
    zoomEnabled={false}
    pitchEnabled={false}
    rotateEnabled={false}
  >
    <Marker coordinate={{ latitude: 49.494626, longitude: 5.977421 }} title="Rue du Canal" />
    <Marker coordinate={{ latitude: 49.492417, longitude: 5.977324 }} title="Place de la Résistance" />
    <Marker coordinate={{ latitude: 49.493295, longitude: 5.979856 }} title="Rue Xavier Brasseur" />
    <Marker coordinate={{ latitude: 49.49380, longitude: 5.97153 }} title="Route de Belval" />
    <Marker coordinate={{ latitude: 49.495946, longitude: 5.981643 }} title="Rue Saint Vincent" />
    <Marker coordinate={{ latitude: 49.494730, longitude: 5.982760 }} title="Avenue de la Gare" />
    <Marker coordinate={{ latitude: 49.497134, longitude: 5.980382 }} title="Place des Remparts" />
    <Marker coordinate={{ latitude: 49.489706, longitude: 5.975533 }} title="Conservatoire de Musique" />
    <Marker coordinate={{ latitude: 49.493985, longitude: 5.984716 }} title="Gare CFL Esch-sur-Alzette" />
    <Marker coordinate={{ latitude: 49.497750, longitude: 5.982150 }} title="Église Saint Joseph" />
  </MapView>
  <TouchableOpacity
    style={StyleSheet.absoluteFill} // Position the touchable to cover the entire map area
    onPress={handleMapPress}
    activeOpacity={1} // Keep the button fully opaque
  />
</View>







        {/* New Timer and Buttons */}




<View style={styles.blurBackground}>

<Text style={styles.select1}>Usage Timer:</Text>
<AnimatedCircularProgress
    size={120}
    width={15}
    fill={Math.max(0, (Math.abs(timer) / 60) * 100)} // Adjusted for one minute
    tintColor={timer >= 0 ? "#a52a2a" : "#ff7f50"} // Change color if timer is negative
    onAnimationComplete={() => console.log('onAnimationComplete')}
    backgroundColor="#3d5875"
  >
    {() => (
      <Text style={{ fontSize: 18, color: '#000' }}> {/* Assuming a basic text style */}
        {formatTimer()}
      </Text>
    )}
  </AnimatedCircularProgress>

      </View>

    




  <TouchableOpacity style={styles.history} onPress={() => navigation.navigate('BikeUsageHistory', { bikeUsageHistory })}>
    <Text>View Bike Usage History</Text>
  </TouchableOpacity>



        
  </ScrollView>

    <NavigationBar navigation={navigation} currentRoute="Main" />
  </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#dbb076',
    justifyContent: 'flex-start', // Aligns children to the start of the container
    alignItems: 'center', // Center children horizontally
  },
  header: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerImg: {
    width: 150, 
    height: 70,
  },
  greeting: {
    textAlign: 'center',
    fontSize: 19,
    marginBottom: 35,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%', // Ensure the container takes the full width
    marginBottom: 25, 
  },
  weatherBox: {
    width: 180,
    backgroundColor: '#F7DBB9',
    borderRadius: 20,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    padding: 20,
    marginRight: 5,
    height: 210,


  },
    weatherTop: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    weatherIcon: {
      width: 70, // Adjusted to scale with the size of the weather box
      height: 70, // Ensure the image aspect ratio is correct
      resizeMode: 'contain',
    },
    temperature: { 
      fontSize: 18,
      textAlign: 'center',
    },
    weatherDescription: {
      fontSize: 16,
      textAlign: 'center',
    },
    history: {
      fontSize: 16,
      textAlign: 'center',
      backgroundColor: 'white',
      marginBottom: 40,

    },
    weatherMiddle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 15,
      backgroundColor: 'white',
      borderRadius: 15,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      marginVertical: 5,
    },
    navigationIcon: {
      width: 20, 
      height: 20,
      resizeMode: 'contain',
      marginRight: 5,
    },
    weatherBottom: {
      backgroundColor: '#ff9500',
      borderRadius: 20,
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    select: {
      fontSize: 19,
      marginTop: 20, 
      textAlign: 'center',
      marginBottom: 20, 
      backgroundColor: 'white',
      borderRadius: 150,
      
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      
    },
    select1: {
      fontSize: 19,
      textAlign: 'center',
      marginBottom: 30,
      backgroundColor: 'white',
      borderRadius: 70,
      paddingHorizontal: 20,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      
    },
    stationsBox: {
      width: 180,
      height: 210,
      backgroundColor: '#F7DBB9',
      borderRadius: 20,
      elevation: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      alignItems: 'center',
      marginLeft: 5,

    },

    stationTop: {
      backgroundColor: '#ff9500',
      borderRadius: 20,
      marginTop: 20,
      padding: 5,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    stationTopText: {
      fontSize: 18,
      color: 'white',
    },
    stationTopLabel: {
      fontSize: 16,
      color: 'white',
    },
    stationMiddle: {
      backgroundColor: '#ff9500',
      borderRadius: 20,
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    stationMiddleText: {
      fontSize: 18,
      color: 'white',
    },
    stationMiddleLabel: {
      fontSize: 16,
      color: 'white',
    },
    stationBottom: {
      backgroundColor: '#ff9500',
      borderRadius: 20,
      position: 'absolute',
      bottom: 0,
      paddingHorizontal: 32,
      paddingVertical: 10,
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    stationBottomText: {
      fontSize: 16,
      color: 'black',
    },
    linkImage: {
      width: 200, 
      height: 200, 

      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,

    },
    backgroundImage: {
      paddingHorizontal: 50, 
      flex: 1, // Ensures the ImageBackground fills its container
      marginTop: 30,
      elevation: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      paddingHorizontal: 60,
      
    },
    linkContainer: {

      alignItems: 'center', 
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20, // Add some padding at the bottom to ensure the content is scrollable
    },


    timerText: {
      fontSize: 20,
      color: '#000',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      marginVertical: 20, 
    },
    button: {
      backgroundColor: '#ff9500',
      paddingVertical: 8, 
      paddingHorizontal: 15, 
      borderRadius: 20,
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      marginHorizontal: 5, 
    },
    buttonText: {
      color: 'white',
      fontSize: 14, 
    },
    blurBackground: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
      padding: 40,
      marginBottom: 20, 
      elevation: 20,
      backgroundColor: '#F7DBB9',
      borderRadius: 20,
      elevation: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      marginHorizontal: 30
    },
    miniMapContainer: {
      height: 200, // Set the desired height for the mini-map
      width: '90%', // Adjust the width as needed, '90%' is just an example
      borderRadius: 15, // Optional: if you want rounded corners
      overflow: 'hidden', // Needed to apply borderRadius to the MapView
      alignSelf: 'center', // Center the mini-map container within its parent
    },
    
    miniMap: {
      height: '100%', // Make the map fill the container's height
      width: '100%', // Make the map fill the container's width
    },
    
    

    

  }
);



