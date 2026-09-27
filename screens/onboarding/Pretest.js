// screens/onboarding/Pretest.js
//
// Renders PRETEST_ACTIVITY (see missionContent/onboarding/pretest.js) with
// its own simple question flow rather than components/activities/Quiz.js,
// because the pretest must not reveal whether an answer was correct. The
// player picks an option, taps Next, and moves straight to the next
// question - no right/wrong highlighting, no explanation. Answers are
// scored silently and only the final total is shown. Mission quizzes still
// use Quiz.js with its normal feedback; nothing there is changed.
//
// A "Skip" link lets the player go straight into the app without a
// pretest score (after a confirmation). Set SHOW_SKIP_PRETEST to false for
// evaluation builds, so participants can't skip their baseline.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../../context/GameContext';
import { PRETEST_ACTIVITY } from '../../missionContent/onboarding/pretest';
import { savePretestScoreToFirestore } from '../../services/firestoreUsers';
import { COLORS } from '../../theme/colors';
import ScreenHeader, { HeaderButton } from '../../components/ScreenHeader';

// Turn off for evaluation builds so participants always sit the pretest.
const SHOW_SKIP_PRETEST = true;

export default function PretestScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();
  const [pretestScore, setPretestScore] = useState(null); // null while still taking it
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const questions = PRETEST_ACTIVITY.content.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Scores the answer silently and moves on - nothing about correctness is
  // shown to the player.
  function handleNext() {
    const newCorrectCount =
      correctCount + (selectedIndex === currentQuestion.correctOptionIndex ? 1 : 0);
    if (isLastQuestion) {
      handlePretestComplete(newCorrectCount);
    } else {
      setCorrectCount(newCorrectCount);
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
    }
  }

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

  function handleSkipPretest() {
    Alert.alert(
      'Skip the pretest?',
      "You won't have a baseline score, so the posttest can't show how much you've " +
        "improved. You can't come back to the pretest later.",
      [
        { text: 'Take the pretest', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'SKIP_PRETEST' });
            handleFinishOnboarding();
          },
        },
      ]
    );
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
      <SafeAreaView style={styles.wrapper} edges={['bottom']}>
        <ScreenHeader
          title="Pretest"
          subtitle={`Step 4 of 4 · ${totalQuestions} questions to give a baseline to compare against later. Answer as best you can, even if you're not sure.`}
          right={
            SHOW_SKIP_PRETEST ? (
              <HeaderButton label="Skip ›" onPress={handleSkipPretest} accessibilityLabel="Skip pretest" />
            ) : null
          }
        />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.questionArea}>
          <Text style={styles.progressText}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
          <Text style={styles.promptText}>{currentQuestion.prompt}</Text>
          {currentQuestion.options.map((optionText, index) => {
            const isSelected = selectedIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                onPress={() => setSelectedIndex(index)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {optionText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          style={[styles.nextButton, selectedIndex === null && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedIndex === null}
        >
          <Text style={styles.nextButtonText}>{isLastQuestion ? 'Finish' : 'Next'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper} edges={['bottom']}>
      <ScreenHeader title="Pretest complete" />
      <View style={styles.resultsContainer}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scroll: {
    flex: 1,
  },
  questionArea: {
    padding: 16,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    lineHeight: 23,
    marginBottom: 16,
  },
  optionRow: {
    borderWidth: 1.5,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    backgroundColor: COLORS.backgroundWhite,
  },
  optionRowSelected: {
    borderColor: COLORS.backgroundGreenD,
    borderWidth: 2.5,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.textGreen,
    lineHeight: 21,
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
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
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});