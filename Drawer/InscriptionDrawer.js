import { View, Text, StyleSheet } from "react-native";

const InscriptionDrawer = () => {

return ( 
    <View style={styles.container}>
        <Text style={styles.text}> Stations </Text>
    </View>
    );
};

export default InscriptionDrawer;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    }
});