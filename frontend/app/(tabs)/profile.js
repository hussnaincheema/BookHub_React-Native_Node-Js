import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import authService from "../../services/authService";
import ConfirmationModal from "../../components/ConfirmationModal";

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", content: "" });
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    const handleLogoutPress = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        setLogoutModalVisible(false);
        await authService.logout();
        router.replace("/login");
    };

    const openModal = (title, content) => {
        setModalContent({ title, content });
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.username}>{user?.username || "Guest User"}</Text>
                    <Text style={styles.email}>{user?.email || "guest@example.com"}</Text>
                </View>

                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>General</Text>

                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => openModal("Privacy Policy", PRIVACY_POLICY_TEXT)}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}>
                                <Ionicons name="shield-checkmark-outline" size={22} color="#2E7D32" />
                            </View>
                            <Text style={styles.rowLabel}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => openModal("Terms & Conditions", TERMS_TEXT)}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: "#E3F2FD" }]}>
                                <Ionicons name="document-text-outline" size={22} color="#1565C0" />
                            </View>
                            <Text style={styles.rowLabel}>Terms & Conditions</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>

            <ConfirmationModal
                visible={logoutModalVisible}
                title="Logout"
                message="Are you sure you want to logout?"
                onConfirm={confirmLogout}
                onCancel={() => setLogoutModalVisible(false)}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{modalContent.title}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalText}>{modalContent.content}</Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const PRIVACY_POLICY_TEXT = `
Privacy Policy

1. Introduction
Welcome to BookHub. We respect your privacy and are committed to protecting your personal data.

2. Data We Collect
We collect personal information such as your name, email address, and profile picture when you register.

3. How We Use Your Data
We use your data to provide and improve our services, manage your account, and communicate with you.

4. Data Security
We implement appropriate security measures to protect your personal data from unauthorized access or disclosure.

5. Your Rights
You have the right to access, correct, or delete your personal data.
`;

const TERMS_TEXT = `
Terms and Conditions

1. Acceptance of Terms
By accessing and using BookHub, you accept and agree to be bound by the terms and provision of this agreement.

2. User Accounts
You are responsible for maintaining the confidentiality of your account and password.

3. User Conduct
You agree to use the app only for lawful purposes. You are prohibited from posting content that is illegal, abusive, or harmful.

4. Intellectual Property
All content included on this app, such as text, graphics, logos, is the property of BookHub or its content suppliers.

5. Termination
We reserve the right to terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms.
`;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    profileSection: {
        alignItems: "center",
        marginVertical: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "white",
    },
    username: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    settingsSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textSecondary,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.textPrimary,
    },
    logoutButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFEBEE",
        marginHorizontal: 20,
        marginTop: 30,
        padding: 15,
        borderRadius: 12,
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.error,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "80%",
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    modalScroll: {
        flex: 1,
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.textSecondary,
    },
});

export default Profile;
