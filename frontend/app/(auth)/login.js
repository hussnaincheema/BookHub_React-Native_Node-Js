import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useFormik } from "formik";
import styles from "../../styles/login.styles";
import authService from "../../services/authService";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { loginSchema } from "../../constants/validation";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authService.login(values);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.message || "Logged in successfully",
        });
        setTimeout(() => router.replace("/(tabs)"), 1000);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: error.message || "Invalid credentials",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/login.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label="Email Address"
              iconName="mail-outline"
              placeholder="Enter your email"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email && formik.errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Password"
              iconName="lock-closed-outline"
              placeholder="Enter your password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && formik.errors.password}
              secureTextEntry={!showPassword}
              isPassword
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <CustomButton
              title="Login"
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
