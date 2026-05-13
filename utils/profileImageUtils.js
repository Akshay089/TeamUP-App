import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { CLOUDINARY_API, CLOUDINARY_CONFIG } from "../config/cloudinaryConfig";

export const pickProfileImage = async () => {
  try {
    const mediaTypes =
      ImagePicker.MediaType?.Images || ImagePicker.MediaTypeOptions.Images;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
  } catch (error) {
    console.error("Error picking profile image:", error);
    Alert.alert("Error", "Failed to pick image from gallery");
  }
  return null;
};

export const uploadProfileImageToCloudinary = async (imageUri) => {
  try {
    const data = new FormData();

    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: `profile-${Date.now()}.jpg`,
    });

    data.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CONFIG.CLOUD_NAME);

    const response = await fetch(CLOUDINARY_API, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary error: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.secure_url) {
      return result.secure_url;
    } else {
      throw new Error("No URL returned from Cloudinary");
    }
  } catch (error) {
    console.error("Error uploading profile image to Cloudinary:", error);
    Alert.alert(
      "Upload failed",
      "Unable to upload profile image. Please try again.",
    );
    return null;
  }
};

export const pickAndUploadProfileImage = async () => {
  const image = await pickProfileImage();
  if (!image) return null;

  const uploadedUrl = await uploadProfileImageToCloudinary(image.uri);
  return uploadedUrl;
};
