// screens/onboarding/ParishSelection.js
//
// Dominica's 10 parishes, plus an optional free-text Community field for
// more specific alert targeting later. The parish picker is a plain
// Modal + list, not a native <Picker> component — @react-native-picker/
// picker is a native module and would mean another EAS rebuild just for
// a dropdown; this gets the same visual result in pure JS.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [communityInput, setCommunityInput] = useState(state.community || '');

  function handleSelectParish(parishName) {
    dispatch({ type: 'SET_PARISH', parish: parishName });
    setIsPickerOpen(false);
  }

  function handleContinue() {
    const trimmedCommunity = communityInput.trim();
    if (trimmedCommunity) {
      dispatch({ type: 'SET_COMMUNITY', community: trimmedCommunity });
    }
    navigation.navigate('Permissions');
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Where are you based?</Text>
        <Text style={styles.subtitle}>Your parish helps tailor shelter and hazard information to your area.</Text>

        <Text style={styles.fieldLabel}>Parish</Text>
        <TouchableOpacity style={styles.dropdownField} onPress={() => setIsPickerOpen(true)}>
          <Text style={state.parish ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
            {state.parish || 'Select your parish'}
          </Text>
          <Text style={styles.dropdownChevron}>▾</Text>
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Community (optional)</Text>
        <TextInput
          style={styles.textInput}
          value={communityInput}
          onChangeText={setCommunityInput}
          placeholder="e.g. Goodwill, Portsmouth..."
          placeholderTextColor={COLORS.textGray}
        />

        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            ℹ️ Used for parish-level alerts only — never shared or tracked.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !state.parish && styles.continueButtonDisabled]}
        disabled={!state.parish}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>

      <Modal visible={isPickerOpen} transparent animationType="slide" onRequestClose={() => setIsPickerOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsPickerOpen(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select your parish</Text>
            <FlatList
              data={PARISHES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === state.parish;
                return (
                  <TouchableOpacity
                    style={isSelected ? styles.modalRowSelected : styles.modalRow}
                    onPress={() => handleSelectParish(item)}
                  >
                    <Text style={styles.modalRowText}>{item}</Text>
                    {isSelected && <Text style={styles.modalCheckmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  dropdownValueText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  dropdownPlaceholderText: {
    fontSize: 15,
    color: COLORS.textGray,
  },
  dropdownChevron: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  textInput: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 20,
  },
  infoNote: {
    backgroundColor: COLORS.backgroundGreenAlert,
    borderRadius: 8,
    padding: 14,
  },
  infoNoteText: {
    fontSize: 13,
    color: COLORS.textGreenD,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCream,
  },
  modalRowSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCream,
  },
  modalRowText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  modalCheckmark: {
    fontSize: 16,
    color: COLORS.backgroundGreenD,
    fontWeight: 'bold',
  },
});