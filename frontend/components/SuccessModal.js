import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import CustomButton from "./CustomButton";

const SuccessModal = ({ visible, message, onConfirm }) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={64} color={COLORS.primary} />
                    </View>
                    <Text style={styles.title}>Success!</Text>
                    <Text style={styles.message}>{message}</Text>
                    <CustomButton title="Go to Login" onPress={onConfirm} style={styles.button} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 24,
    },
    button: {
        width: "100%",
        marginTop: 0,
    }
});

export default SuccessModal;
