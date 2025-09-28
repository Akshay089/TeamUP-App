import Constants from "expo-constants";

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

export const getNearbyTurfs = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=turf&location=${lat},${lng}&radius=5000&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("getNearbyTurfs error:", err);
    return [];
  }
};
export function getPhotoUrl(photoRef, maxWidth = 400) {
  const API_KEY = "AIzaSyB8nYYTx8SrdrXC-StnBj-LsuZIZI2kqbg";
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${API_KEY}`;
}