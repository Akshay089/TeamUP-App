import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getNearbyTurfs } from '../services/GooglePlacesService';
import { getUserLocation } from '../services/LocationService';
import ContinuousCarousel from './ContinuousCarousel';

const { width } = Dimensions.get('window');

export default function NearbyTurfs() {
  const [location, setLocation] = useState(null);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getUserLocation();
        if (!loc) {
          setLoading(false);
          return;
        }
        setLocation(loc);
        const results = await getNearbyTurfs(loc.latitude, loc.longitude);
        setTurfs(results);
      } catch (err) {
        console.log('NearbyTurfs useEffect err', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Animate map when turf selection changes
  useEffect(() => {
    if (selectedTurf && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedTurf.geometry.location.lat,
          longitude: selectedTurf.geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        350
      );
    }
  }, [selectedTurf]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>
          Location permission denied. Enable location and restart the app.
        </Text>
      </View>
    );
  }

  if (selectedTurf) {
    // Show map only when a turf is selected
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: selectedTurf.geometry.location.lat,
            longitude: selectedTurf.geometry.location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={location} title="You" pinColor="blue" />
          <Marker
            coordinate={{
              latitude: selectedTurf.geometry.location.lat,
              longitude: selectedTurf.geometry.location.lng,
            }}
            title={selectedTurf.name}
            description={selectedTurf.vicinity}
          />
        </MapView>

        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTurf(null)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default view: show carousel only
  return (
    <View style={styles.container}>
      <ContinuousCarousel turfs={turfs} onCardPress={setSelectedTurf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  closeButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
