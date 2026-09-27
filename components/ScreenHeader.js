// components/ScreenHeader.js
//
// The green bar at the top of every main screen - the same bar the side
// missions started with, now shared. All its colours and sizes come from
// THEME.header (theme/themes.js), so it is styled in one place.
//
// It handles the top safe area itself: the green runs up behind the phone's
// status bar, and the title sits just below it. It also switches the status
// bar icons (time, battery) to white while its screen is showing.
//
// Usage:
//   <ScreenHeader title="Badges" />
//   <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
//   <ScreenHeader
//     title="Good afternoon"
//     subtitle="Nix"
//     right={<HeaderButton label="⚙️" onPress={openSettings} accessibilityLabel="Settings" />}
//   />
//
// Props:
//   title     - main heading
//   subtitle  - optional smaller line under the title
//   onBack    - optional; shows "← Back" above the title
//   backLabel - optional text for the back link (default "Back")
//   right     - optional element shown to the right of the title
//   children  - optional extra content inside the bar, below the title

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../theme/themes';

const HEADER = THEME.header;

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  right,
  children,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + HEADER.paddingTop }]}>
      <StatusBar style={HEADER.statusBarStyle} />

      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 16 }}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
        >
          <Text style={styles.backLink}>← {backLabel}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.titleRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {right}
      </View>

      {children}
    </View>
  );
}

// A small tappable icon or word for the header's right side, e.g. the
// settings gear or "Save".
export function HeaderButton({ label, onPress, accessibilityLabel }) {
  return (
    <TouchableOpacity
      style={styles.headerButton}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <Text style={styles.headerButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: HEADER.backgroundColor,
    paddingHorizontal: HEADER.paddingHorizontal,
    paddingBottom: HEADER.paddingBottom,
  },
  backLink: {
    color: HEADER.backLinkColor,
    fontSize: HEADER.backLinkSize,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    color: HEADER.titleColor,
    fontSize: HEADER.titleSize,
    fontWeight: 'bold',
  },
  subtitle: {
    color: HEADER.subtitleColor,
    fontSize: HEADER.subtitleSize,
    lineHeight: HEADER.subtitleSize + 5,
    marginTop: 3,
  },
  headerButton: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  headerButtonText: {
    color: HEADER.titleColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
