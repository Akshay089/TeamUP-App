import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert } from "react-native";
import { storage } from "../config/firebaseConfig";

export const pickImageFromGallery = async () => {
  try {
    const mediaTypes = ImagePicker.MediaType?.Images || ImagePicker.MediaTypeOptions.Images;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
  } catch (error) {
    console.error("Error picking image:", error);
    Alert.alert("Error", "Failed to pick image from gallery");
  }
  return null;
};

export const uploadImageToFirebase = async (imageUri, filename) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `turfs/${filename}`);
    await uploadBytes(storageRef, blob);

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    Alert.alert("Upload failed", "Unable to upload image. Please try again.");
    return null;
  }
};

export const pickAndUploadImage = async (filename) => {
  const image = await pickImageFromGallery();
  if (!image) return null;

  const uploadedUrl = await uploadImageToFirebase(image.uri, filename);
  return uploadedUrl;
};
