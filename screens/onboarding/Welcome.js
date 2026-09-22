// screens/onboarding/Welcome.js
//
// First screen a new install ever sees - before parish selection and the
// pretest. Purely informational, no state changes here.

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.icon}>🌀</Text>
        <Text style={styles.title}>CaribbeanShield</Text>
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
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 16,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});