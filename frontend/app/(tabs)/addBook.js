import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const AddBook = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Add Book Screen</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    text: {
        color: COLORS.textPrimary,
        fontSize: 18,
    },
});

export default AddBook;
