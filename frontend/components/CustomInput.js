import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const CustomInput = ({
    label,
    iconName,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    onTogglePassword,
    isPassword,
    keyboardType,
    autoCapitalize,
    error,
}) => {
    return (
        <View style={styles.inputGroup}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {iconName && (
                    <Ionicons
                        name={iconName}
                        size={20}
                        color={COLORS.textSecondary}
                        style={styles.inputIcon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.placeholderText}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
                {isPassword && (
                    <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
                        <Ionicons
                            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.errorContainer}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <Text style={styles.errorPlaceholder}>.</Text>
                )}
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: COLORS.textPrimary,
        fontWeight: "500",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.inputBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
    },
    inputError: {
        borderColor: "red",
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 48,
        color: COLORS.textDark,
    },
    eyeIcon: {
        padding: 8,
    },
    errorContainer: {
        height: 20,
    },
    errorText: {
        color: "red",
        fontSize: 12,
    },
    errorPlaceholder: {
        color: "transparent",
        fontSize: 12,
    },
});

export default CustomInput;
