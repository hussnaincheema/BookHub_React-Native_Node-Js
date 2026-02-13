import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const BookCard = ({ book, onEdit, onDelete }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: book.image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{book.rating}</Text>
                    </View>
                </View>
                <Text style={styles.caption} numberOfLines={2}>{book.caption}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => onEdit(book)} style={styles.actionButton}>
                        <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(book._id)} style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        flexDirection: "row",
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 110,
        borderRadius: 8,
        backgroundColor: COLORS.inputBackground,
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginLeft: 4,
    },
    caption: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginVertical: 4,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    actionButton: {
        padding: 8,
        marginLeft: 12,
    },
});

export default BookCard;
