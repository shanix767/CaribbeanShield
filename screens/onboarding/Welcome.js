// screens/onboarding/Welcome.js
//
// First screen a new install ever sees - before parish selection and the
// pretest. Purely informational, no state changes here.
//
// Shows the full CaribbeanShield logo (assets/CS-logo2.png). The logo
// already contains the app name and tagline, so there's no separate text
// title - the name would otherwise appear twice.

import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';

const APP_LOGO = require('../../assets/CS-logo2.png');

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  // Big on a phone, but capped so it never pushes the text and button off
  // a short screen or looks oversized on a tablet.
  const logoSize = Math.min(width * 0.8, height * 0.45, 380);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Image
          source={APP_LOGO}
          style={{ width: logoSize, height: logoSize, marginBottom: 20 }}
          resizeMode="contain"
          accessible
          accessibilityLabel="CaribbeanShield. Prepare, protect, together. A safer tomorrow."
        />
        <Text style={styles.subtitle}>
          Learn, plan, and prepare for hurricane season and other hazards across Dominica -
          through missions, real emergency information, and a live hazard dashboard.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('ParishSelection')}
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  getStartedButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});