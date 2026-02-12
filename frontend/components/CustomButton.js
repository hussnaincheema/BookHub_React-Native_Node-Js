import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const CustomButton = ({ title, onPress, loading, variant = "primary", style }) => {
    const isPrimary = variant === "primary";

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primaryButton : styles.outlineButton,
                style,
                loading && styles.disabledButton
            ]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.primary} />
            ) : (
                <Text style={[styles.buttonText, isPrimary ? styles.primaryText : styles.outlineText]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    primaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
});

export default CustomButton;
