// screens/onboarding/ParishSelection.js
//
// Dominica's 10 parishes, listed alphabetically. Dispatches SET_PARISH
// immediately on tap rather than requiring a separate confirm step -
// picking again before leaving this screen just re-dispatches with the
// new choice.

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../../context/GameContext';
import { COLORS } from '../../theme/colors';

const PARISHES = [
  'Saint Andrew',
  'Saint David',
  'Saint George',
  'Saint John',
  'Saint Joseph',
  'Saint Luke',
  'Saint Mark',
  'Saint Patrick',
  'Saint Paul',
  'Saint Peter',
];

export default function ParishSelectionScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();

  function handleSelectParish(parishName) {
    dispatch({ type: 'SET_PARISH', parish: parishName });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Which parish are you in?</Text>
        <Text style={styles.subtitle}>
          This helps tailor shelter and hazard information to your area.
        </Text>

        {PARISHES.map((parishName) => {
          const isSelected = state.parish === parishName;
          return (
            <TouchableOpacity
              key={parishName}
              style={isSelected ? styles.parishRowSelected : styles.parishRow}
              onPress={() => handleSelectParish(parishName)}
            >
              <Text style={styles.parishText}>{parishName}</Text>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, !state.parish && styles.continueButtonDisabled]}
        disabled={!state.parish}
        onPress={() => navigation.navigate('Pretest')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 20,
  },
  parishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  parishRowSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 2,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  parishText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.backgroundGreenD,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});