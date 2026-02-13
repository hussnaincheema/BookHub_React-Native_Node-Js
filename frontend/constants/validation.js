import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const signupSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const bookSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, "Title must be at least 2 characters")
        .required("Title is required"),
    caption: Yup.string()
        .min(5, "Caption must be at least 5 characters")
        .required("Caption is required"),
    rating: Yup.number()
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .required("Rating is required"),
});
