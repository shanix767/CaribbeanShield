// screens/settings/SettingsMenu.js
//
// Entry point to settings sub-screens. Kept intentionally small right now
// (Change Location, Notifications) - add entries here as more settings
// get built, rather than guessing at a bigger menu upfront.
//
// The Developer Test Panel entry only appears in development builds
// (__DEV__ is true when running through Expo/Metro, false in a release
// APK), so participants never see it. Set SHOW_DEV_PANEL to true to force
// it on in a release build for your own testing - and back to __DEV__
// before building for participants.

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

const SHOW_DEV_PANEL = __DEV__;

const SETTINGS_ITEMS = [
  { icon: '📍', label: 'Change Location', route: 'ChangeLocation' },
  { icon: '🔔', label: 'Notifications', route: 'NotificationSettings' },
  ...(SHOW_DEV_PANEL
    ? [{ icon: '🛠', label: 'Developer Test Panel', route: 'DevTestPanel' }]
    : []),
];

export default function SettingsMenuScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <View style={styles.container}>

      {SETTINGS_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.row}
          onPress={() => navigation.navigate(item.route)}
        >
          <Text style={styles.rowIcon}>{item.icon}</Text>
          <Text style={styles.rowLabel}>{item.label}</Text>
          <Text style={styles.rowChevron}>›</Text>
        </TouchableOpacity>
      ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  rowIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  rowChevron: {
    fontSize: 20,
    color: COLORS.textGray,
  },
});