import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';



// Import of the intro screens
import WelcomeScreen from './Intro/WelcomeScreen';
import IntroCarousel from './Intro/IntroCarousel';
import LoginScreen from './Intro/LoginScreen';

// Screens
import MainScreen from './MainScreen';
import FullScreenMapScreen from './FullScreenMapScreen';
import BikeUsageHistoryScreen from './BikeUsageHistoryScreen';
import HistoryScreen from './HistoryScreen';

// Drawer Screens
import StationsDrawer from './Drawer/StationsDrawer';
import InscriptionDrawer from './Drawer/InscriptionDrawer';
import IncidentsDrawer from './Drawer/Incidents';
import ContactDrawer from './Drawer/Contact';
import CommunesDrawer from './Drawer/Communes';
import PartenaireDrawer from './Drawer/Partenaires';
import CGUDrawer from './Drawer/CGU';
import AproposDrawer from './Drawer/àpropos';

import CustomDrawerContent from './Drawer/CustomDrawerContent';
import { parseRideHistoryXML } from './rideHistoryParser'; // Import the parser function

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack navigator for the intro flow
const IntroStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="IntroCarousel" component={IntroCarousel} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
  </Stack.Navigator>
);

const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
    <Stack.Screen name="FullScreenMap" component={FullScreenMapScreen} />
    <Stack.Screen name="BikeUsageHistory" component={BikeUsageHistoryScreen} />
    <Stack.Screen name='Stations' component={StationsDrawer} />
    <Stack.Screen name="History" component={HistoryScreen} />
    {/* Add other stack screens here as needed */}
  </Stack.Navigator>
);

const App = () => {
  const [userStats, setUserStats] = useState({
    totalRides: 0,
    totalRidingTime: 0, // In minutes
    averageRideDuration: 0, // In minutes
  });

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await fetch('https://webservice.velok.lu/historique.aspx?guid=97014F71-6135-4A7F-9503-1FBD8677E21F');
        const xmlText = await response.text();
        const rideHistory = parseRideHistoryXML(xmlText);
  
        const totalRides = rideHistory.length;
        const totalRidingTimeInSeconds = rideHistory.reduce((acc, ride) => {
          const [hours, minutes, seconds] = ride.duree.split(':').map(Number);
          return acc + (hours * 3600 + minutes * 60 + seconds);
        }, 0);
 
        // Convert total riding time to hours
        const totalRidingTimeInHours = totalRidingTimeInSeconds / 3600;
        const hours = Math.floor(totalRidingTimeInHours);
        const minutes = Math.round((totalRidingTimeInHours - hours) * 60);

        const averageRideDuration = totalRides > 0 ? (totalRidingTimeInSeconds / totalRides) / 60 : 0; // Still in minutes for readability
  
        setUserStats({
          totalRides,
          totalRidingTime: `${hours}h ${minutes}m`, // Displayed as "Xh Ym"
          averageRideDuration,
        });
      } catch (error) {
        console.error('Error fetching ride history:', error);
      }
    };
  
    fetchRideHistory();
  }, []);




  
  useEffect(() => {
    // Temporarily bypass the first launch check and always set isFirstLaunch to true
    setIsFirstLaunch(true);
  }, []);
  

  return (

    <NavigationContainer>
      {/* Show the intro screens followed by the main app with the drawer navigator */}
      <IntroStackNavigator />
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={MainStackNavigator} />
        {/* Define other Drawer Screens here as you already have */}
        <Drawer.Screen name='Stations' component={StationsDrawer}/>
        <Drawer.Screen name='Inscription' component={InscriptionDrawer}/>
        <Drawer.Screen name='Incidents' component={IncidentsDrawer}/>
        <Drawer.Screen name='Contact' component={ContactDrawer}/>
        <Drawer.Screen name='Communes' component={CommunesDrawer}/>
        <Drawer.Screen name='Partenaires' component={PartenaireDrawer}/>
        <Drawer.Screen name='CGU' component={CGUDrawer}/>
        <Drawer.Screen name='À propos' component={AproposDrawer}/>
      </Drawer.Navigator>
    </NavigationContainer>

  );
};

export default App;





