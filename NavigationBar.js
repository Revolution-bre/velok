import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';



const NavigationBar = ({ navigation, currentRoute }) => {
    const navigate = (route, params) => {
        navigation.navigate(route, params);
    };
    
    const isActive = (route) => {
        return currentRoute === route ? styles.activeIcon : {};
    };

    return (
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigate('Home')}>
                <Image source={require('./assets/home.png')} style={[styles.icon, isActive('Home')]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigate('Stations', { currentLocation: currentLocation, stations: stationData })}>
                <Image source={require('./assets/bike.png')} style={[styles.icon, isActive('Stations')]} />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigate('QRCodeScanner')} style={styles.qrCodeButton}>
                <Image source={require('./assets/qr-code.png')} style={[styles.qrCodeIcon, isActive('QRCodeScanner')]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigate('History')}>
               <Image source={require('./assets/history.png')} style={[styles.icon, isActive('History')]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                const url = 'tel:0035280062456'; // Ensure the URL is correct
                Linking.canOpenURL(url)
                .then(supported => {
                    if (!supported) {
                    console.warn("Can't handle url: " + url);
                    } else {
                    return Linking.openURL(url);
                    }
                })
                .catch(err => console.error('An error occurred', err));
            }}>
                <Image source={require('./assets/telephone.png')} style={styles.icon} />
            </TouchableOpacity>

        </View>
    );
};
const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Evenly space out the icons
        alignItems: 'center',
        position: 'absolute',
        bottom: 0, // Align to the bottom of the screen
        left: 0,
        right: 0,
        backgroundColor: '#a36c2c', // Brown color, adjust as needed
        height: 60, // Adjust the height as per your design
        borderTopLeftRadius: 15, // Rounded corners for a modern look
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, // Slight shadow for depth
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 300,
    },
    icon: {
        width: 25, // Standard size for icons
        height: 25,
        resizeMode: 'contain', // Keep icon aspect ratio
    },
    qrCodeButton: {
        // Make QR Code button larger and more prominent
        width: 50, // Larger size for QR code button
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25, // Circular shape
        backgroundColor: '#F7DBB9', // A distinct color, adjust as needed
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        top: -15, // Raise the button above the bar
    },
    qrCodeIcon: {
        width: 30, // Size of QR code icon inside the button
        height: 30,
        resizeMode: 'contain',
    },
    activeIcon: {
        // Style for active icon (optional)
        // Implement this to visually distinguish the active tab
    }
});


export default NavigationBar;
