import { View, Text, StyleSheet } from "react-native";

const IncidentsDrawer = () => {

return ( 
    <View style={styles.container}>
        <Text style={styles.text}> Incidents </Text>
    </View>
    );
};

export default IncidentsDrawer;

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