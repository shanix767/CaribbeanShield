// screens/onboarding/UserId.js
//
// Asks for the user's name, and shows the sequential ID (CS-100001,
// CS-100002, ...) that will be assigned to them. The ID shown here is
// only a PREVIEW (read via previewNextUserId, which doesn't claim
// anything) - the real claim happens on Continue via claimNextUserId,
// which atomically increments the shared counter so two people
// onboarding at the same moment can never end up with the same ID. If
// Firestore can't be reached at all when claiming (no signal), this
// falls back to a random local ID so onboarding still isn't blocked -
// see handleContinue below.

import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../../context/GameContext';
import { previewNextUserId, claimNextUserId, createUserRecord } from '../../services/firestoreUsers';
import { COLORS } from '../../theme/colors';

export default function UserIdScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();
  const [nameInput, setNameInput] = useState('');
  const [previewedId, setPreviewedId] = useState(null); // null while loading
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    previewNextUserId().then(setPreviewedId);
  }, []);

  async function handleContinue() {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    setIsSaving(true);

    let claimedId = await claimNextUserId();
    if (!claimedId) {
      // Firestore unreachable - fall back to a random local ID so
      // onboarding still isn't blocked entirely offline. Won't be
      // sequential or synced until connectivity returns.
      const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
      claimedId = `CS-OFFLINE-${randomPart}`;
    }

    dispatch({ type: 'SET_USER_ID', userId: claimedId });
    dispatch({ type: 'SET_USER_NAME', userName: trimmedName });
    await createUserRecord(claimedId, trimmedName, state.parish);

    setIsSaving(false);
    navigation.navigate('Pretest');
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>
          This is used to match your pretest and posttest results.
        </Text>

        <TextInput
          style={styles.input}
          value={nameInput}
          onChangeText={setNameInput}
          placeholder="Your name"
          placeholderTextColor={COLORS.textGray}
        />

        <View style={styles.idPreviewCard}>
          <Text style={styles.idPreviewLabel}>Your ID will be</Text>
          {previewedId ? (
            <Text style={styles.idPreviewValue}>{previewedId}</Text>
          ) : (
            <ActivityIndicator color={COLORS.backgroundGreenD} />
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!nameInput.trim() || isSaving) && styles.continueButtonDisabled,
        ]}
        disabled={!nameInput.trim() || isSaving}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>
          {isSaving ? 'Saving...' : 'Continue'}
        </Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textGray,
    marginBottom: 24,
  },
  input: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 20,
  },
  idPreviewCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  idPreviewLabel: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  idPreviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
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
});