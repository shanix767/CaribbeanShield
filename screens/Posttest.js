// screens/Posttest.js
//
// The post-test uses the same 50-item instrument as the pre-test
// (missionContent/onboarding/pretest.js) and the same no-feedback flow as
// screens/onboarding/Pretest.js: the player picks an option, taps Next,
// and moves straight to the next question - no right/wrong highlighting,
// no explanation. Answers are scored silently and only the final total is
// shown, with the pre-test score for comparison. This matters for the
// evaluation: the post-test is taken more than once (Day 1 and Week 2),
// so showing answers would teach participants the test itself.
//
// Differences from Pretest.js: writes RECORD_POSTTEST_SCORE instead of the
// pretest equivalent, shows the pre/post comparison on the results screen,
// and returns to Missions with Done rather than finishing onboarding.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../context/GameContext';
import { PRETEST_ACTIVITY } from '../missionContent/onboarding/pretest';
import { savePosttestScoreToFirestore } from '../services/firestoreUsers';
import { COLORS } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

export default function PosttestScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();
  const [posttestScore, setPosttestScore] = useState(null); // null while still taking it
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const questions = PRETEST_ACTIVITY.content.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const pretestScore = state.pretestScore;

  // Scores the answer silently and moves on - nothing about correctness is
  // shown to the player.
  function handleNext() {
    const newCorrectCount =
      correctCount + (selectedIndex === currentQuestion.correctOptionIndex ? 1 : 0);
    if (isLastQuestion) {
      handlePosttestComplete(newCorrectCount);
    } else {
      setCorrectCount(newCorrectCount);
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
    }
  }

  function handlePosttestComplete(score) {
    dispatch({ type: 'RECORD_POSTTEST_SCORE', score, maxScore: totalQuestions });
    setPosttestScore(score);
    // Best-effort sync, same as the pre-test - local state is the source
    // of truth; see services/firestoreUsers.js.
    if (state.userId) {
      savePosttestScoreToFirestore(state.userId, score, totalQuestions);
    }
  }

  if (posttestScore === null) {
    return (
      <SafeAreaView style={styles.wrapper} edges={['bottom']}>
        <ScreenHeader
          title="Post-test"
          subtitle={`Same ${totalQuestions} questions as your pretest - this measures how much your knowledge has changed. Answer as best you can.`}
          onBack={() => navigation.goBack()}
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

  const improvement = pretestScore ? posttestScore - pretestScore.score : null;

  return (
    <SafeAreaView style={styles.wrapper} edges={['bottom']}>
      <ScreenHeader title="Post-test results" />
      <View style={styles.resultsContainer}>
      <Text style={styles.resultsIcon}>📈</Text>
      <Text style={styles.resultsTitle}>Posttest complete</Text>
      <Text style={styles.resultsScore}>
        {posttestScore} / {totalQuestions}
      </Text>

      {pretestScore ? (
        <Text style={styles.comparisonText}>
          Pretest was {pretestScore.score} / {pretestScore.maxScore}
          {improvement > 0 && ` - up ${improvement} question${improvement === 1 ? '' : 's'}`}
          {improvement === 0 && ' - no change'}
          {improvement < 0 &&
            ` - down ${Math.abs(improvement)} question${Math.abs(improvement) === 1 ? '' : 's'}`}
        </Text>
      ) : (
        <Text style={styles.comparisonText}>No pretest score recorded to compare against.</Text>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
        <Text style={styles.continueButtonText}>Done</Text>
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
    marginBottom: 8,
  },
  comparisonText: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 32,
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