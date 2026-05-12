import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const inactive = "#94a3b8";
const active = "#0d9488";

const tabs = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'discover', title: 'Discover', icon: 'compass' },
  { name: 'bookings', title: 'Bookings', icon: 'calendar' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function SwipeableTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(0);

  // Get current tab index from pathname
  const getCurrentTabIndex = () => {
    const currentTab = tabs.find(tab => pathname.includes(`/(tabs)/${tab.name}`));
    return currentTab ? tabs.indexOf(currentTab) : 0;
  };

  useEffect(() => {
    const index = getCurrentTabIndex();
    setCurrentPage(index);
  }, [pathname]);

  const handlePageSelected = (e) => {
    const page = e.nativeEvent.position;
    setCurrentPage(page);
    // Don't navigate here as expo-router handles the content
  };

  const handleTabPress = (index) => {
    setCurrentPage(index);
    const tab = tabs[index];
    router.replace(`/(tabs)/${tab.name}`);
  };

  const currentTabIndex = getCurrentTabIndex();

  return (
    <View style={{ flex: 1 }}>
      {/* Content area - expo-router will render the current screen */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBarContainer}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={72} tint="light" style={StyleSheet.absoluteFill} />
        ) : null}
        <View style={styles.tabBar}>
          {tabs.map((tab, index) => {
            const isActive = index === currentTabIndex;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => handleTabPress(index)}
              >
                <Ionicons
                  name={isActive ? tab.icon : `${tab.icon}-outline`}
                  size={24}
                  color={isActive ? active : inactive}
                />
                <Text style={[styles.tabLabel, { color: isActive ? active : inactive }]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 78,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    marginHorizontal: 12,
    marginBottom: Platform.OS === 'ios' ? 20 : 12,
    borderRadius: 24,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#ffffff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});