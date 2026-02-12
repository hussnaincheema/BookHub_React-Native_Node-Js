import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import CustomButton from "./CustomButton";

const ConfirmationModal = ({ visible, title, message, onConfirm, onCancel }) => {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="alert-circle" size={64} color={COLORS.warning || "#FFC107"} />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Cancel"
                            onPress={onCancel}
                            style={styles.cancelButton}
                            isPrimary={false}
                            customStyle={styles.cancelButtonText}
                        />
                        <CustomButton
                            title="Logout"
                            onPress={onConfirm}
                            style={styles.confirmButton}
                        />
                    </View>
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
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        marginTop: 0,
    },
    cancelButtonText: {
        color: COLORS.black,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: COLORS.error || "#D32F2F",
        marginTop: 0,
    }
});

export default ConfirmationModal;
