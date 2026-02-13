import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import COLORS from "../../constants/colors";
import Header from "../../components/Header";
import BookCard from "../../components/BookCard";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import { getUserBooks, deleteBook } from "../../apis/api";

const MyBooks = () => {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);

    const fetchBooks = async (pageNum = 1, shouldRefresh = false) => {
        try {
            if (pageNum === 1) {
                if (!shouldRefresh) setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await getUserBooks(pageNum, 10);
            if (response.success) {
                if (pageNum === 1) {
                    setBooks(response.books);
                } else {
                    setBooks(prev => [...prev, ...response.books]);
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

    useFocusEffect(
        useCallback(() => {
            fetchBooks(1, true);
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchBooks(1, true);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchBooks(nextPage);
        }
    };

    const handleDeletePress = (id) => {
        setSelectedBookId(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteBook(selectedBookId);
            if (response.success) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Book deleted successfully",
                });
                setBooks(books.filter(book => book._id !== selectedBookId));
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to delete book",
            });
        } finally {
            setDeleteModalVisible(false);
            setSelectedBookId(null);
        }
    };

    const handleEditPress = (book) => {
        router.push({
            pathname: "/book/form",
            params: {
                id: book._id,
                title: book.title,
                caption: book.caption,
                rating: book.rating.toString(),
                image: book.image
            }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Header
                title="Books"
                variant="primary"
                rightIcon="add-circle"
                onRightPress={() => router.push("/book/form")}
            />

            <View style={styles.content}>
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                ) : (
                    <FlatList
                        data={books}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <BookCard
                                book={item}
                                onEdit={handleEditPress}
                                onDelete={handleDeletePress}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={<EmptyState message="No books added yet. Click '+' to add one." />}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} /> : null}
                    />
                )}
            </View>

            <ConfirmationModal
                visible={deleteModalVisible}
                title="Delete Book"
                message="Are you sure you want to delete this book?"
                confirmText="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        flexGrow: 1,
    },
    loader: {
        marginTop: 50,
    },
});

export default MyBooks;
