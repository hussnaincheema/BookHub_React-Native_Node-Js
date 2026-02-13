import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/home.styles";
import COLORS from "../../constants/colors";
import { getCurrentUser } from "../../apis/api";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.username || "Guest"} 👋</Text>
                        <Text style={styles.headerSubtitle}>What are you reading today?</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for books, authors..."
                        placeholderTextColor={COLORS.placeholderText}
                    />
                </View>

                {/* Featured Section (Placeholder) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Books</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {/* Placeholder for content */}
                <View style={{ height: 200, backgroundColor: COLORS.cardBackground, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ color: COLORS.textSecondary }}>Featured books will appear here</Text>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>New Arrivals</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {/* Placeholder for content */}
                <View style={{ height: 200, backgroundColor: COLORS.cardBackground, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.textSecondary }}>New arrivals will appear here</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
