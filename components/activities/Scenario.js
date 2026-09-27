// components/activities/Scenario.js
//
// Reusable for any "here's a situation, what do you do" activity - e.g.
// L1.14 60-Second Decision Challenge and L1.15 Hurricane Warning Scenario.
// Not timed in this version (a real countdown is a later enhancement) -
// the point right now is the decision-then-consequence structure itself.

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { COLORS } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Scenario({ activity, onComplete }) {
  const { situationText, choices } = activity.content;
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);

  const selectedChoice = choices.find((choice) => choice.id === selectedChoiceId);
  const earnedXp = selectedChoice && selectedChoice.isBestChoice ? activity.xpReward : 0;

  function handleSelectChoice(choiceId) {
    if (selectedChoiceId) return; // already answered
    setSelectedChoiceId(choiceId);
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
      <View style={styles.situationBox}>
        <Text style={styles.situationText}>{situationText}</Text>
      </View>

      {!selectedChoice &&
        choices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
            style={styles.choiceButton}
            onPress={() => handleSelectChoice(choice.id)}
          >
            <Text style={styles.choiceButtonText}>{choice.text}</Text>
          </TouchableOpacity>
        ))}

      {selectedChoice && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackHeading}>
            {selectedChoice.isBestChoice ? '✅ Good decision' : '⚠️ Not the safest choice'}
          </Text>
          <Text style={styles.feedbackText}>{selectedChoice.consequenceText}</Text>
        </View>
      )}
      </ScrollView>

      {selectedChoice && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={() => onComplete(earnedXp)}>
            <Text style={styles.continueButtonText}>Continue (+{earnedXp} XP)</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  // Content scrolls; the action button stays pinned below it, so it can
  // never be pushed off the bottom of the screen by long text.
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  situationBox: {
    backgroundColor: COLORS.backgroundRed,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  situationText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 21,
  },
  choiceButton: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  choiceButtonText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  feedbackBox: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 16,
  },
  feedbackHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textDark,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});