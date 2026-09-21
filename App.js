// App.js
//
// React Navigation setup (not expo-router). Structure:
//   NavigationContainer
//     GameProvider (so any screen can useGameContext())
//       Stack.Navigator
//         "MainTabs" -> the bottom tab bar (Hazard Watch / Shelter / Missions)
//         "MissionDetail" -> pushed on top of the tabs when a mission is tapped
//
// The app-wide hazard-change alert Modal lives here at the top level, same
// reasoning as before: a Modal overlays the full screen regardless of where
// it's rendered in the tree, so placing it here means it shows over
// whichever tab/screen is currently active.

import { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { GameProvider } from './context/GameContext';

import HazardWatchScreen from './screens/dashboard/hazardWatch';
import ShelterScreen from './screens/dashboard/shelter';
import MissionsListScreen from './screens/missions/missionsList';
import MissionDetailScreen from './screens/missions/missionDetail';

import FirebaseTestScreen from './screens/FirebaseTestScreen'; // TEMPORARY



import { fetchHurricaneWatchData } from './services/hurricaneApi';
import { fetchRecentEarthquakes } from './services/earthquakeApi';
import { fetchWeeklyVolcanoActivity } from './services/volcanoApi';
import { fetchRecentFloodAlerts } from './services/floodApi';
import { TEST_STORM, TEST_EARTHQUAKES, TEST_VOLCANOES, TEST_FLOODS } from './services/testData';
import { requestNotificationPermission, checkForHazardChangesAndNotify } from './services/notifications';
import { TEST_MODE } from './testMode';
import { COLORS } from './theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.textWhite,
        tabBarInactiveTintColor: COLORS.textDark,
        tabBarActiveBackgroundColor: COLORS.backgroundGreen,
        tabBarStyle: { backgroundColor: COLORS.backgroundCream },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="HazardWatch" component={HazardWatchScreen} options={{ title: 'Hazard Watch' }} />
      <Tab.Screen name="Shelter" component={ShelterScreen} options={{ title: 'Nearest Shelter' }} />
      <Tab.Screen name="Missions" component={MissionsListScreen} options={{ title: 'Missions' }} />
      <Tab.Screen name="FirebaseTest" component={FirebaseTestScreen} options={{ title: '🔥 FB Test' }} />
      {/* TEMPORARY tab above — remove once Firebase is confirmed working */}
    </Tab.Navigator>
  );
}

export default function App() {
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    async function checkForChangesOnAppOpen() {
      await requestNotificationPermission();

      const [hurricaneResult, earthquakeResult, volcanoResult, floodResult] =
        await Promise.allSettled([
          fetchHurricaneWatchData(),
          fetchRecentEarthquakes(),
          fetchWeeklyVolcanoActivity(),
          fetchRecentFloodAlerts(),
        ]);

      const storms = TEST_MODE.hurricane
        ? TEST_STORM.storms
        : hurricaneResult.status === 'fulfilled' ? hurricaneResult.value.storms : [];
      const earthquakes = TEST_MODE.earthquake
        ? TEST_EARTHQUAKES
        : earthquakeResult.status === 'fulfilled' ? earthquakeResult.value : [];
      const volcanicReports = TEST_MODE.volcano
        ? TEST_VOLCANOES
        : volcanoResult.status === 'fulfilled' ? volcanoResult.value : [];
      const floods = TEST_MODE.flood
        ? TEST_FLOODS
        : floodResult.status === 'fulfilled' ? floodResult.value : [];

      try {
        const changes = await checkForHazardChangesAndNotify({
          storms,
          earthquakes,
          volcanicReports,
          floods,
        });
        if (changes.length > 0) {
          setActiveAlerts(changes);
        }
      } catch {
        // Notifications are a nice-to-have — never block the app over this.
      }
    }

    checkForChangesOnAppOpen();
  }, []);

  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <Modal
        visible={activeAlerts.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveAlerts([])}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.headerBand}>
              <Text style={styles.heading}>⚠️ Hazard Update</Text>
            </View>

            {activeAlerts.map((alert, index) => (
              <View key={index} style={styles.alertRow}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertBody}>{alert.body}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.dismissButton} onPress={() => setActiveAlerts([])}>
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  headerBand: {
    backgroundColor: COLORS.backgroundRed,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.borderRed,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  alertRow: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  alertBody: {
    color: COLORS.textDark,
    marginTop: 2,
  },
  dismissButton: {
    margin: 20,
    marginTop: 16,
    backgroundColor: COLORS.backgroundGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
});