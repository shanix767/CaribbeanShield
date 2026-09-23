// screens/Posttest.js
//
// Reuses the exact same 16 questions as the pretest (missionContent/
// onboarding/pretest.js) - a valid pre/post comparison needs the same
// instrument measured twice, not a different one. Reuses Quiz.js the same
// way Pretest.js does; the only real difference is this writes to
// posttestScore/RECORD_POSTTEST_SCORE instead of the pretest equivalents,
// and lives outside the onboarding stack since it's taken later, after
// playing through missions - not on first launch.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../context/GameContext';
import { PRETEST_ACTIVITY } from '../missionContent/onboarding/pretest';
import { savePosttestScoreToFirestore } from '../services/firestoreUsers';
import Quiz from '../components/activities/Quiz';
import { COLORS } from '../theme/colors';

export default function PosttestScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();
  const [posttestScore, setPosttestScore] = useState(null); // null while still taking it

  const totalQuestions = PRETEST_ACTIVITY.content.questions.length;
  const pretestScore = state.pretestScore;

  function handlePosttestComplete(score) {
    dispatch({ type: 'RECORD_POSTTEST_SCORE', score, maxScore: totalQuestions });
    setPosttestScore(score);
    if (state.userId) {
      savePosttestScoreToFirestore(state.userId, score, totalQuestions);
    }
  }

  if (posttestScore === null) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.introHeader}>
          <Text style={styles.introHeaderText}>
            Same {totalQuestions} questions as your pretest - this measures how much your
            knowledge has changed.
          </Text>
        </View>
        <Quiz activity={PRETEST_ACTIVITY} onComplete={handlePosttestComplete} />
      </View>
    );
  }

  const improvement = pretestScore !== null ? posttestScore - pretestScore.score : null;

  return (
    <SafeAreaView style={styles.resultsContainer} edges={["top", "bottom"]}>
      <Text style={styles.resultsIcon}>📈</Text>
      <Text style={styles.resultsTitle}>Posttest complete</Text>
      <Text style={styles.resultsScore}>
        {posttestScore} / {totalQuestions}
      </Text>

      {pretestScore !== null && (
        <Text style={styles.comparisonText}>
          Pretest was {pretestScore.score} / {pretestScore.maxScore}
          {improvement > 0 && ` - up ${improvement} question${improvement === 1 ? '' : 's'}`}
          {improvement === 0 && ' - no change'}
          {improvement < 0 && ` - down ${Math.abs(improvement)} question${Math.abs(improvement) === 1 ? '' : 's'}`}
        </Text>
      )}

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
        <Text style={styles.doneButtonText}>Done</Text>
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
    marginBottom: 8,
  },
  comparisonText: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});