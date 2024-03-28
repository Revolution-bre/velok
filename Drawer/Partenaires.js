import { View, Text, StyleSheet } from "react-native";

const PartenaireDrawer = () => {

return ( 
    <View style={styles.container}>
        <Text style={styles.text}> Stations </Text>
    </View>
    );
};

export default PartenaireDrawer;

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