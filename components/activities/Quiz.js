// components/activities/Quiz.js
//
// Reusable across every quiz-style activity, including true/false quizzes
// (a true/false question is just a quiz question with two options, so
// there's no need for a separate component). Walks the player through
// each question one at a time, shows whether they were right with a short
// explanation, then lets them continue.
//
// An optional per-question countdown (content.timeLimitSeconds) turns a
// Learn-stage "exposure" quiz into a genuine Prove-stage test - running
// out of time counts as a wrong answer. Quizzes that don't set this field
// (the Learn-stage ones) behave exactly as before: no timer, no pressure,
// the point there is exposure and feedback, not screening.

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Quiz({ activity, onComplete }) {
  const { questions, timeLimitSeconds } = activity.content;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(timeLimitSeconds || null);
  const [ranOutOfTime, setRanOutOfTime] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const wasCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;

  // Reset the countdown every time a new question loads (only relevant
  // when this quiz actually has a time limit set).
  useEffect(() => {
    if (timeLimitSeconds) {
      setSecondsRemaining(timeLimitSeconds);
      setRanOutOfTime(false);
    }
  }, [currentQuestionIndex]);

  // The countdown itself. Stops as soon as the player answers (by choice
  // or by running out of time), so it never keeps ticking in the
  // background after the question is over.
  useEffect(() => {
    if (!timeLimitSeconds) return;
    if (hasAnswered) return;

    if (secondsRemaining <= 0) {
      // Time ran out before the player picked an option - this counts as
      // a wrong answer, same as picking the wrong option would.
      setHasAnswered(true);
      setRanOutOfTime(true);
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsRemaining((previousSeconds) => previousSeconds - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [secondsRemaining, hasAnswered, timeLimitSeconds]);

  function handleSelectOption(optionIndex) {
    if (hasAnswered) return; // don't let the player change their answer after seeing feedback
    setSelectedOptionIndex(optionIndex);
    setHasAnswered(true);
  }

  function handleNext() {
    if (isLastQuestion) {
      onComplete();
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.headerRow}>
        <Text style={styles.progressLabel}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        {timeLimitSeconds && !hasAnswered && (
          <Text style={[styles.timerLabel, secondsRemaining <= 5 && styles.timerLabelUrgent]}>
            ⏱️ {secondsRemaining}s
          </Text>
        )}
      </View>

      <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

      {currentQuestion.options.map((optionText, optionIndex) => {
        const isSelected = optionIndex === selectedOptionIndex;
        const isCorrectOption = optionIndex === currentQuestion.correctOptionIndex;

        // Once answered, highlight the correct option green and, if the
        // player picked wrong, highlight their (wrong) pick red - so they
        // can see both what they chose and what the right answer was.
        let optionStyle = styles.option;
        if (hasAnswered && isCorrectOption) {
          optionStyle = styles.optionCorrect;
        } else if (hasAnswered && isSelected && !isCorrectOption) {
          optionStyle = styles.optionIncorrect;
        }

        return (
          <TouchableOpacity
            key={optionIndex}
            style={optionStyle}
            onPress={() => handleSelectOption(optionIndex)}
            disabled={hasAnswered}
          >
            <Text style={styles.optionText}>{optionText}</Text>
          </TouchableOpacity>
        );
      })}

      {hasAnswered && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackHeading}>
            {ranOutOfTime ? '⏱️ Time\u2019s up!' : wasCorrect ? '✅ Correct!' : '❌ Not quite'}
          </Text>
          <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
        </View>
      )}

      {hasAnswered && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? `Finish (+${activity.xpReward} XP)` : 'Next Question'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.textGray,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  timerLabelUrgent: {
    color: COLORS.textRed,
  },
  prompt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  option: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  optionCorrect: {
    backgroundColor: COLORS.backgroundGreenAlert,
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  optionIncorrect: {
    backgroundColor: COLORS.backgroundRed,
    borderWidth: 1,
    borderColor: COLORS.textRed,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  feedbackBox: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
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
  nextButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});