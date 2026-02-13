import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import COLORS from "../constants/colors";
import { getToken, getCurrentUser } from "../apis/api";

const WelcomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
          const token = await getToken();
        const user = await getCurrentUser();

        if (token && user) {
          router.replace("/(tabs)");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/login.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Discover Your Next Favorite Book</Text>
          <Text style={styles.subtitle}>
            Read, review, and share your thoughts with a community of book lovers.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  imageContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default WelcomeScreen;
