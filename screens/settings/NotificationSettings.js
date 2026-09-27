// screens/settings/NotificationSettings.js
//
// Only shows toggles for hazard types that genuinely exist in the app
// (Hurricane/Flood/Volcanic/Earthquake - the four sources this app
// actually fetches). Deliberately does NOT include the mockup's other
// categories (Wildfire, mission reminders, badge/level-up pushes,
// community challenges) - none of those features exist yet, and a toggle
// for something with no real behaviour behind it would just be a facade.
// These four toggles are genuinely wired into App.js's hazard-check
// logic, which skips fetching/notifying for any category switched off
// here. Hurricane is permanently on - it's the app's primary documented
// hazard and isn't part of notificationPreferences at all (see
// GameContext).

import { View, Text, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../../context/GameContext';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();

  function handleToggle(key, value) {
    dispatch({ type: 'SET_NOTIFICATION_PREFERENCE', key, value });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} backLabel="Settings" />
      <View style={styles.container}>

      <Text style={styles.sectionHeader}>⚠️ Disaster Alerts</Text>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Hurricane warnings</Text>
          <Text style={styles.rowSubtext}>Critical - cannot be disabled</Text>
        </View>
        <Switch value={true} disabled trackColor={{ true: COLORS.backgroundGreenD }} />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Flood warnings</Text>
        </View>
        <Switch
          value={state.notificationPreferences.floodWarnings}
          onValueChange={(value) => handleToggle('floodWarnings', value)}
          trackColor={{ true: COLORS.backgroundGreenD }}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Volcanic activity</Text>
        </View>
        <Switch
          value={state.notificationPreferences.volcanicActivity}
          onValueChange={(value) => handleToggle('volcanicActivity', value)}
          trackColor={{ true: COLORS.backgroundGreenD }}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Earthquake alerts</Text>
        </View>
        <Switch
          value={state.notificationPreferences.earthquakeAlerts}
          onValueChange={(value) => handleToggle('earthquakeAlerts', value)}
          trackColor={{ true: COLORS.backgroundGreenD }}
        />
      </View>

      <Text style={styles.footnote}>
        Turning off a category here means the app won't check for or notify you about that
        hazard type. It still uses your device's overall notification permission - if that's
        off, nothing will show regardless of these settings.
      </Text>
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
    padding: 20,
  },
  backLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  rowSubtext: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  footnote: {
    fontSize: 12,
    color: COLORS.textGray,
    lineHeight: 17,
    marginTop: 12,
  },
});