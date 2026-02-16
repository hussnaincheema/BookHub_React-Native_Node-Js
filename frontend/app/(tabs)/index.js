import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import styles from "../../styles/home.styles";
import COLORS from "../../constants/colors";
import { getCurrentUser, getBooks } from "../../apis/api";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedBookCard from "../../components/FeaturedBookCard";
import BookCard from "../../components/BookCard";
import EmptyState from "../../components/EmptyState";

const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]); // Store all books for search
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };
        loadUser();
        fetchBooks(1);
    }, []);

    const fetchBooks = async (pageNum = 1, shouldRefresh = false) => {
        try {
            if (pageNum === 1) {
                if (!shouldRefresh) setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await getBooks(pageNum, 10);
            if (response.success) {
                if (pageNum === 1) {
                    setBooks(response.books);
                    setAllBooks(response.books); // Store all books
                    // Set featured books as the first 5 books with highest ratings
                    const featured = [...response.books]
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 5);
                    setFeaturedBooks(featured);
                } else {
                    const newBooks = [...books, ...response.books];
                    setBooks(newBooks);
                    setAllBooks(newBooks); // Update all books
                }
                setHasMore(response.currentPage < response.totalPages);
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to fetch books",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchBooks(1, true);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !searchQuery) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchBooks(nextPage);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text.trim() === "") {
            // Reset to all books when search is cleared
            setBooks(allBooks);
            const featured = [...allBooks]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5);
            setFeaturedBooks(featured);
        } else {
            // Filter books by title (case-insensitive)
            const filtered = allBooks.filter(book =>
                book.title.toLowerCase().includes(text.toLowerCase())
            );
            setBooks(filtered);
            // Update featured books based on filtered results
            const featured = [...filtered]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5);
            setFeaturedBooks(featured);
        }
    };

    const renderHeader = useCallback(() => (
        <>
            {/* Featured Section */}
            {featuredBooks.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured Books</Text>
                        <TouchableOpacity onPress={() => router.push("/addBook")}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={featuredBooks}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `featured-${item._id}`}
                        renderItem={({ item }) => <FeaturedBookCard book={item} />}
                        contentContainerStyle={styles.featuredList}
                    />
                </>
            )}

            {/* New Arrivals Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Arrivals</Text>
                <TouchableOpacity onPress={() => router.push("/addBook")}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
        </>
    ), [featuredBooks, router]);

    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator size="small" color={COLORS.primary} style={styles.footerLoader} />;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingContainer} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

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
                    placeholder="Search for books..."
                    placeholderTextColor={COLORS.placeholderText}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <BookCard book={item} />}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={<EmptyState message="No books available yet." />}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                keyboardShouldPersistTaps="handled"
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </SafeAreaView>
    );
};

export default Home;
