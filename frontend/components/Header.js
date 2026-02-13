import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";

const Header = ({ title, showBack = false, rightIcon, onRightPress, variant = "white" }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const isPrimary = variant === "primary";

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: COLORS.white,
                paddingTop: insets.top,
                height: 60 + insets.top,
                borderBottomColor: COLORS.border,
            }
        ]}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={isPrimary ? COLORS.white : COLORS.textPrimary} />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={[styles.title, { color: COLORS.textPrimary }]}>
                {title}
            </Text>
            <View style={styles.rightContainer}>
                {rightIcon && (
                    <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                        <Ionicons name={rightIcon} size={30} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    leftContainer: {
        width: 40,
    },
    rightContainer: {
        width: 40,
        alignItems: "flex-end",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    iconButton: {
        padding: 5,
    },
});

export default Header;
