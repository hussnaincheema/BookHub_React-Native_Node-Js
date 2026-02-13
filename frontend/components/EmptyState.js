import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const EmptyState = ({ message, icon = "book-outline" }) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={COLORS.textSecondary} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    text: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginTop: 16,
    },
});

export default EmptyState;
