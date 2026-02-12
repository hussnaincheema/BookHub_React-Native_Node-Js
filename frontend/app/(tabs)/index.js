import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/home.styles";
import COLORS from "../../constants/colors";
import authService from "../../services/authService";
import { useRouter } from "expo-router";

const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        router.replace("/login");
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.username || "Guest"} 👋</Text>
                        <Text style={styles.headerSubtitle}>What are you reading today?</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.profileButton}>
                        <Image
                            source={{ uri: user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
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
        </View>
    );
};

export default Home;
