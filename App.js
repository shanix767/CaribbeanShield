// App.js
//
// React Navigation setup (not expo-router). Structure:
//   GameProvider (so any screen, including AppContent below, can useGameContext())
//     AppContent
//       NavigationContainer
//         Stack.Navigator (initial route depends on state.onboardingCompleted)
//           "Welcome" / "ParishSelection" / "Pretest" -> shown once, before MainTabs
//           "MainTabs" -> the bottom tab bar (Hazard Watch / Shelter / Missions)
//           "MissionDetail" -> pushed on top of the tabs when a mission is tapped
//           "ActivityPlayer" -> pushed when a stage is entered
//
// AppContent waits for hasLoadedSavedState before rendering the Navigator
// at all — Stack.Navigator's initialRouteName is only read once, on
// mount, so rendering it before the saved state has loaded could pick the
// wrong starting screen (flashing onboarding for a returning player, or
// vice versa) depending on which finished first.
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

import { GameProvider, useGameContext } from './context/GameContext';
import WelcomeScreen from './screens/onboarding/Welcome';
import ParishSelectionScreen from './screens/onboarding/ParishSelection';
import PermissionsScreen from './screens/onboarding/Permissions';
import UserIdScreen from './screens/onboarding/UserId';
import PretestScreen from './screens/onboarding/Pretest';
import HomeScreen from './screens/Home';
import HazardWatchScreen from './screens/dashboard/hazardWatch';
import ResourceHubScreen from './screens/dashboard/resourceHub';
import ShelterScreen from './screens/dashboard/shelter';
import ShelterDetailScreen from './screens/ShelterDetail';
import SettingsMenuScreen from './screens/settings/SettingsMenu';
import ChangeLocationScreen from './screens/settings/ChangeLocation';
import NotificationSettingsScreen from './screens/settings/NotificationSettings';
import MissionsListScreen from './screens/missions/missionsList';
import MissionDetailScreen from './screens/missions/missionDetail';
import ActivityPlayerScreen from './screens/missions/activityPlayer';
import SideMissionPlayerScreen from './screens/SideMissionPlayer';
import BadgePageScreen from './screens/BadgePage';
import PosttestScreen from './screens/Posttest';
import LeaderboardScreen from './screens/Leaderboard';
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Missions" component={MissionsListScreen} options={{ title: 'Missions' }} />
      <Tab.Screen name="Badges" component={BadgePageScreen} options={{ title: 'Badges' }} />
      <Tab.Screen name="Alert" component={HazardWatchScreen} options={{ title: 'Alert' }} />
      <Tab.Screen name="Hub" component={ResourceHubScreen} options={{ title: 'Hub' }} />
      <Tab.Screen name="FirebaseTest" component={FirebaseTestScreen} options={{ title: '🔥 FB Test' }} />
      {/* TEMPORARY tab above — remove once Firebase is confirmed working */}
    </Tab.Navigator>
  );
}

// Everything that used to be directly in App() now lives here instead,
// since it needs useGameContext() — which only works INSIDE GameProvider,
// not in the same component that renders GameProvider itself.
function AppContent() {
  const { state, hasLoadedSavedState } = useGameContext();
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    async function checkForChangesOnAppOpen() {
      // Only auto-request here for a RETURNING user (onboarding already
      // done) — a brand-new install goes through the dedicated
      // Permissions screen instead, which explains why the permission is
      // needed before asking. Requesting it here unconditionally would
      // trigger the OS prompt before that screen even renders, since a
      // permission prompt only shows once — making the Permissions
      // screen's own "Allow" button silently do nothing.
      if (state.onboardingCompleted) {
        await requestNotificationPermission();
      }

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
      // Hurricane has no on/off preference — it's always checked. The
      // other three respect notificationPreferences: if disabled, treat
      // it as if nothing was found, so no notification ever fires for it.
      const earthquakes = !state.notificationPreferences.earthquakeAlerts
        ? []
        : TEST_MODE.earthquake
        ? TEST_EARTHQUAKES
        : earthquakeResult.status === 'fulfilled' ? earthquakeResult.value : [];
      const volcanicReports = !state.notificationPreferences.volcanicActivity
        ? []
        : TEST_MODE.volcano
        ? TEST_VOLCANOES
        : volcanoResult.status === 'fulfilled' ? volcanoResult.value : [];
      const floods = !state.notificationPreferences.floodWarnings
        ? []
        : TEST_MODE.flood
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

  if (!hasLoadedSavedState) {
    // Brief and deliberately plain — this only shows for the moment it
    // takes AsyncStorage to return, not long enough to need branding.
    return <View style={[styles.overlay, { backgroundColor: COLORS.backgroundCream }]} />;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={state.onboardingCompleted ? 'MainTabs' : 'Welcome'}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="ParishSelection" component={ParishSelectionScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="UserId" component={UserIdScreen} />
          <Stack.Screen name="Pretest" component={PretestScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Shelter" component={ShelterScreen} />
          <Stack.Screen name="ShelterDetail" component={ShelterDetailScreen} />
          <Stack.Screen name="SettingsMenu" component={SettingsMenuScreen} />
          <Stack.Screen name="ChangeLocation" component={ChangeLocationScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
          <Stack.Screen name="ActivityPlayer" component={ActivityPlayerScreen} />
          <Stack.Screen name="SideMissionPlayer" component={SideMissionPlayerScreen} />
          <Stack.Screen name="BadgePage" component={BadgePageScreen} />
          <Stack.Screen name="Posttest" component={PosttestScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
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
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
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