import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/login.styles";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import SuccessModal from "../../components/SuccessModal";
import { signupSchema } from "../../constants/validation";
import COLORS from "../../constants/colors";
import { register } from "../../apis/api";

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);

        if (image) {
          const filename = image.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append("profileImage", {
            uri: image,
            name: filename,
            type,
          });
        }

        await register(formData);
        setModalVisible(true);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: error.message || "Sign up failed",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleModalConfirm = () => {
    setModalVisible(false);
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.topIllustration}>
          <Text style={[styles.title, { marginBottom: 10 }]}>Create Account</Text>
          <TouchableOpacity onPress={pickImage} style={localStyles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={localStyles.image} />
            ) : (
              <View style={localStyles.placeholder}>
                <Ionicons name="camera-outline" size={40} color={COLORS.textSecondary} />
                <Text style={localStyles.placeholderText}>Add Photo</Text>
              </View>
            )}
            <View style={localStyles.editIcon}>
              <Ionicons name="pencil" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label="Username"
              iconName="person-outline"
              placeholder="Enter your username"
              value={formik.values.username}
              onChangeText={formik.handleChange("username")}
              onBlur={formik.handleBlur("username")}
              error={formik.touched.username && formik.errors.username}
              autoCapitalize="none"
            />

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
              placeholder="Create a password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && formik.errors.password}
              secureTextEntry={!showPassword}
              isPassword
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <CustomButton
              title="Sign Up"
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SuccessModal
        visible={modalVisible}
        message="Your account has been created successfully!"
        onConfirm={handleModalConfirm}
      />
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});

export default SignUp;
