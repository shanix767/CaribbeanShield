// components/activities/Quiz.js
//
// Reusable across every quiz-style activity, including true/false quizzes
// (a true/false question is just a quiz question with two options, so
// there's no need for a separate component). Walks the player through
// each question one at a time, shows whether they were right with a short
// explanation, then lets them continue. This is a Learn-stage quiz, not a
// Prove-stage test, so there's no pass/fail gate — the point is exposure
// and immediate feedback, not screening.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizActivity({ activity, onComplete }) {
  const { questions } = activity.content;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const wasCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;

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
      <Text style={styles.progressLabel}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

      {currentQuestion.options.map((optionText, optionIndex) => {
        const isSelected = optionIndex === selectedOptionIndex;
        const isCorrectOption = optionIndex === currentQuestion.correctOptionIndex;

        // Once answered, highlight the correct option green and, if the
        // player picked wrong, highlight their (wrong) pick red — so they
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
          <Text style={styles.feedbackHeading}>{wasCorrect ? '✅ Correct!' : '❌ Not quite'}</Text>
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
  progressLabel: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 8,
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