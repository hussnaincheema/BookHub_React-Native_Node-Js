import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const FeaturedBookCard = ({ book, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(book)}>
            <Image source={{ uri: book.image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{book.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        width: 140,
        marginRight: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    image: {
        width: "100%",
        height: 180,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: COLORS.inputBackground,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 6,
        minHeight: 36,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginLeft: 4,
    },
});

export default FeaturedBookCard;
