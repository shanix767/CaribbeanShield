// screens/onboarding/Permissions.js
//
// Requests push notification and location permissions up front during
// onboarding, rather than the app's previous behaviour of only asking for
// each lazily the first time a relevant feature was used (notifications
// on app open via App.js, location the first time the Shelter tab was
// visited). Reuses the existing permission-request functions from
// services/ rather than duplicating the expo-notifications/expo-location
// calls here.
//
// Both are skippable - a player can continue without granting either;
// the app's existing lazy-request behaviour elsewhere still covers anyone
// who skips here and grants later.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestNotificationPermission } from '../../services/notifications';
import { requestLocationPermission } from '../../services/locationApi';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

export default function PermissionsScreen() {
  const navigation = useNavigation();
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  async function handleAllowNotifications() {
    const granted = await requestNotificationPermission();
    setNotificationsGranted(granted);
  }

  async function handleAllowLocation() {
    const granted = await requestLocationPermission();
    setLocationGranted(granted);
  }

  function handleContinue() {
    navigation.navigate('UserId');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScreenHeader
        title="Almost ready"
        subtitle="Step 2 of 4 · Enable alerts to protect your household."
        onBack={() => navigation.goBack()}
      />
      <View style={styles.container}>
      {/* The two cards scroll, so on a short screen they can never overlap
          the Continue button below them. */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.permissionCard}>
          <View style={styles.iconCircleYellow}>
            <Text style={styles.iconText}>🔔</Text>
          </View>
          <Text style={styles.permissionTitle}>Push Notifications</Text>
          <Text style={styles.permissionBody}>
            Required to receive hurricane, volcano, and flood warnings.
          </Text>
          {notificationsGranted ? (
            <Text style={styles.grantedText}>✓ Allowed</Text>
          ) : (
            <TouchableOpacity style={styles.allowButton} onPress={handleAllowNotifications}>
              <Text style={styles.allowButtonText}>Allow Notifications</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.permissionCard}>
          <View style={styles.iconCircleGreen}>
            <Text style={styles.iconText}>📍</Text>
          </View>
          <Text style={styles.permissionTitle}>Location Access</Text>
          <Text style={styles.permissionBody}>
            Used to find your nearest shelter and calculate the route there.
          </Text>
          {locationGranted ? (
            <Text style={styles.grantedText}>✓ Allowed</Text>
          ) : (
            <TouchableOpacity style={styles.allowButton} onPress={handleAllowLocation}>
              <Text style={styles.allowButtonText}>Allow Location</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleContinue}>
        <Text style={styles.skipText}>Skip for now (alerts may be less accurate)</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  permissionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleYellow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleGreen: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundGreenL,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  permissionBody: {
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  allowButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  allowButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  grantedText: {
    color: COLORS.backgroundGreenD,
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  continueButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: COLORS.textGray,
    fontSize: 13,
    textAlign: 'center',
  },
});