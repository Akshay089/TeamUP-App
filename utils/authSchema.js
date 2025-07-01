import * as Yup from "yup";
const validationSchema=Yup.object().shape({
    // Only require fullName for signup, not for signin
    fullName: Yup.string(),

    email:Yup.string().required("Email is required").email("Invalid email format"),

    password: Yup.string().required("Password is required").min(6,"Password mus be of 6 characters long"),
});

export default validationSchema;