// screens/onboarding/Pretest.js
//
// Reuses components/activities/Quiz.js directly rather than building a
// separate quiz UI - PRETEST_ACTIVITY (see missionContent/onboarding/
// pretest.js) is shaped as a normal quiz activity with xpReward set to
// the question count (16), so Quiz's existing scoring math naturally
// resolves to "number of questions correct" rather than XP. Quiz itself
// doesn't know or care that this is a pretest rather than a mission
// activity - it just renders questions and reports a score back.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../../context/GameContext';
import { PRETEST_ACTIVITY } from '../../missionContent/onboarding/pretest';
import { savePretestScoreToFirestore } from '../../services/firestoreUsers';
import Quiz from '../../components/activities/Quiz';
import { COLORS } from '../../theme/colors';

export default function PretestScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();
  const [pretestScore, setPretestScore] = useState(null); // null while still taking it

  const totalQuestions = PRETEST_ACTIVITY.content.questions.length;

  function handlePretestComplete(score) {
    dispatch({ type: 'RECORD_PRETEST_SCORE', score, maxScore: totalQuestions });
    setPretestScore(score);
    // Local state (above) is the source of truth the app runs on - this
    // Firestore write is a best-effort sync on top of it, not a
    // dependency; see services/firestoreUsers.js.
    if (state.userId) {
      savePretestScoreToFirestore(state.userId, score, totalQuestions);
    }
  }

  function handleFinishOnboarding() {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    // Reset rather than navigate, so the onboarding screens aren't sitting
    // underneath MainTabs on the back stack - there's nothing to "go back
    // to" once onboarding is done.
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }

  if (pretestScore === null) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.introHeader}>
          <Text style={styles.introHeaderText}>
            Before we start, a quick {totalQuestions}-question pretest - this gives us a
            baseline to compare against later, so answer as best you can even if you're
            not sure.
          </Text>
        </View>
        <Quiz activity={PRETEST_ACTIVITY} onComplete={handlePretestComplete} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.resultsContainer} edges={["top", "bottom"]}>
      <Text style={styles.resultsIcon}>📋</Text>
      <Text style={styles.resultsTitle}>Pretest complete</Text>
      <Text style={styles.resultsScore}>
        {pretestScore} / {totalQuestions}
      </Text>
      <Text style={styles.resultsSubtitle}>
        This is your baseline - we'll compare it against a posttest later to see how much
        you've learned.
      </Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleFinishOnboarding}>
        <Text style={styles.continueButtonText}>Continue to CaribbeanShield</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  introHeader: {
    backgroundColor: COLORS.backgroundGreenD,
    padding: 16,
  },
  introHeaderText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.textOrange,
    marginBottom: 16,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});