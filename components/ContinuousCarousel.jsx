// components/ContinuousCarousel.jsx
import { useEffect } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.78);
const CARD_SPACING = 14;

export default function ContinuousCarousel({ turfs = [], onCardPress }) {
  if (turfs.length === 0) {
    return <Text style={{ padding: 20, textAlign: 'center' }}>No turfs found</Text>;
  }

  // Duplicate turfs for infinite scroll effect
  const data = [...turfs, ...turfs];

  const totalCardSetWidth = (CARD_WIDTH + CARD_SPACING) * turfs.length;

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-totalCardSetWidth, {
        duration: turfs.length * 4000, // Adjust scroll speed here
        easing: Easing.linear,
      }),
      -1, // infinite repeat
      false
    );
  }, [turfs]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePressIn = () => {
    cancelAnimation(translateX);
  };

  const handlePressOut = () => {
    translateX.value = withRepeat(
      withTiming(-totalCardSetWidth, {
        duration: turfs.length * 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.scroller, animatedStyle, { width: totalCardSetWidth * 2 }]}
      >
        {data.map((item, index) => (
          <View style={styles.card} key={`${item.place_id}-${index}`}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onCardPress(item)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View style={styles.imageWrap}>
                <Image
                  source={{
                    uri:
                      item.photos?.length > 0
                        ? getPhotoUrl(item.photos[0].photo_reference)
                        : 'https://via.placeholder.com/300x200.png?text=Turf',
                  }}
                  style={styles.image}
                />
                <View style={styles.imageOverlay} />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{item.rating ?? 'N/A'}</Text>
                  <Text>⭐</Text>
                </View>
              </View>

              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.address} numberOfLines={1}>
                  {item.vicinity}
                </Text>
                <Text style={styles.meta}>{item.user_ratings_total ?? 0} reviews</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    overflow: 'hidden',
  },
  scroller: {
    flexDirection: 'row',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginRight: CARD_SPACING,
    marginBottom: 10,
  },
  imageWrap: { height: 140, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#ff9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginRight: 4,
  },
  details: { padding: 10 },
  name: { fontWeight: '700', fontSize: 16, color: '#222' },
  address: { color: '#666', fontSize: 13, marginTop: 2 },
  meta: { marginTop: 4, fontSize: 12, color: '#999' },
});

// Replace this with your actual Google API key or logic
function getPhotoUrl(photoRef) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=AIzaSyB8nYYTx8SrdrXC-StnBj-LsuZIZI2kqbg`;
}
