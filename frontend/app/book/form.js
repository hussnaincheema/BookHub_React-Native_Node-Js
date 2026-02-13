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
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { bookSchema } from "../../constants/validation";
import { createBook, updateBook } from "../../apis/api";

const BookForm = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEdit = !!params.id;

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(params.image || null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: params.title || "",
            caption: params.caption || "",
            rating: params.rating || "",
        },
        validationSchema: bookSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (!image) {
                Toast.show({
                    type: "error",
                    text1: "Image Required",
                    text2: "Please select a book cover image",
                });
                return;
            }

            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("caption", values.caption);
                formData.append("rating", values.rating);

                // Check if image is a local URI (newly picked) or a remote URL (existing)
                if (image && !image.startsWith('http')) {
                    const filename = image.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image`;

                    formData.append("image", {
                        uri: image,
                        name: filename,
                        type,
                    });
                } else if (isEdit) {
                    // For edit, if image hasn't changed, we might still need to send the URL 
                    // or the backend handles "no new image" correctly.
                    // Based on backend code: If image exists and image !== book.image, it updates.
                    // If we don't send 'image' field in body, it might fail validation if required.
                    // Let's send the existing URL if it hasn't changed.
                    formData.append("image", image);
                }

                let response;
                if (isEdit) {
                    response = await updateBook(params.id, formData);
                } else {
                    response = await createBook(formData);
                }

                if (response.success) {
                    Toast.show({
                        type: "success",
                        text1: "Success",
                        text2: isEdit ? "Book updated successfully" : "Book added successfully",
                    });
                    router.back();
                }
            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: error.message || "Something went wrong",
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Header title={isEdit ? "Edit Book" : "Add Book"} showBack={true} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="camera-outline" size={40} color={COLORS.textSecondary} />
                                <Text style={styles.placeholderText}>Select Book Cover</Text>
                            </View>
                        )}
                        <View style={styles.editIcon}>
                            <Ionicons name="pencil" size={16} color="white" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.form}>
                        <CustomInput
                            label="Book Title"
                            placeholder="Enter book title"
                            iconName="book-outline"
                            value={formik.values.title}
                            onChangeText={formik.handleChange("title")}
                            onBlur={formik.handleBlur("title")}
                            error={formik.touched.title && formik.errors.title}
                        />

                        <CustomInput
                            label="Caption / Review"
                            placeholder="Write a short review..."
                            iconName="chatbubble-outline"
                            value={formik.values.caption}
                            onChangeText={formik.handleChange("caption")}
                            onBlur={formik.handleBlur("caption")}
                            error={formik.touched.caption && formik.errors.caption}
                            multiline
                        />

                        <CustomInput
                            label="Rating (1-5)"
                            placeholder="Rate this book"
                            iconName="star-outline"
                            value={formik.values.rating}
                            onChangeText={formik.handleChange("rating")}
                            onBlur={formik.handleBlur("rating")}
                            error={formik.touched.rating && formik.errors.rating}
                            keyboardType="numeric"
                        />

                        <CustomButton
                            title={isEdit ? "Update Book" : "Add Book"}
                            onPress={formik.handleSubmit}
                            loading={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        padding: 20,
    },
    imagePicker: {
        width: 150,
        height: 200,
        borderRadius: 12,
        backgroundColor: COLORS.inputBackground,
        alignSelf: "center",
        marginBottom: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: "hidden",
        position: "relative",
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    placeholder: {
        alignItems: "center",
    },
    placeholderText: {
        color: COLORS.textSecondary,
        marginTop: 10,
        fontSize: 14,
    },
    editIcon: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    form: {
        marginTop: 10,
    },
});

export default BookForm;
