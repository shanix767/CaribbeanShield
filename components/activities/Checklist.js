// components/activities/Checklist.js
//
// Reusable across every "select all that apply" activity - Hazard Hunt,
// Mini Emergency Kit, Information Sources, After the Storm, etc. Each
// item in the content just needs a label and an isCorrect flag; this
// component doesn't know or care what the checklist is actually about.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChecklistActivity({ activity, onComplete }) {
  const { prompt, items } = activity.content;
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  function toggleItem(itemId) {
    if (hasSubmitted) return; // no changing answers after submitting
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
    }
  }

  function handleSubmit() {
    setHasSubmitted(true);
  }

  // How many items the player got right - selected the correct ones AND
  // did not select the incorrect ones.
  const correctItemIds = items.filter((item) => item.isCorrect).map((item) => item.id);
  const numberCorrectlySelected = selectedItemIds.filter((id) => correctItemIds.includes(id)).length;
  const numberIncorrectlySelected = selectedItemIds.filter((id) => !correctItemIds.includes(id)).length;

  // Full accuracy across every item - both correctly selecting a hazard
  // AND correctly leaving a non-hazard unselected both count as "right."
  // This is what the activity's earned XP is based on: getting some items
  // wrong (missed hazards or false alarms) earns proportionally less than
  // the activity's full xpReward, not the full amount just for finishing.
  const numberOfItemsJudgedCorrectly = items.filter((item) => {
    const isSelected = selectedItemIds.includes(item.id);
    return isSelected === item.isCorrect;
  }).length;
  const earnedXp = Math.round(activity.xpReward * (numberOfItemsJudgedCorrectly / items.length));

  // Side missions ("tick what you actually have ready") are self-reports,
  // not right/wrong questions, so their feedback is worded differently.
  const isSelfReport = !!activity.selfReport;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.prompt}>{prompt}</Text>

        {items.map((item) => {
          const isSelected = selectedItemIds.includes(item.id);

          // Once submitted, show the real answer key regardless of what
          // the player picked, so they leave the activity knowing the
          // right answer, not just whether they were right.
          // After submitting, each item shows one of four results, with a
          // short label so colour is never the only cue:
          //   picked and correct  -> green
          //   correct but missed  -> white with a dashed green border
          //   picked but wrong    -> pale pink with a red border
          //   not picked, not correct -> unchanged
          let itemStyle = styles.item;
          let resultLabel = null;
          if (hasSubmitted && item.isCorrect && isSelected) {
            itemStyle = styles.itemCorrectAnswer;
            resultLabel = isSelfReport
              ? null
              : { text: '✓ Correct', style: styles.resultCorrect };
          } else if (hasSubmitted && item.isCorrect) {
            itemStyle = styles.itemMissed;
            resultLabel = {
              text: isSelfReport ? 'Not ready yet' : 'Missed - this was a correct answer',
              style: styles.resultCorrect,
            };
          } else if (hasSubmitted && isSelected && !item.isCorrect) {
            itemStyle = styles.itemWronglySelected;
            resultLabel = { text: '✗ Not a correct answer', style: styles.resultWrong };
          } else if (isSelected) {
            itemStyle = styles.itemSelected;
          }

          return (
            <TouchableOpacity
              key={item.id}
              style={itemStyle}
              onPress={() => toggleItem(item.id)}
              disabled={hasSubmitted}
            >
              <Text style={styles.checkbox}>{isSelected ? '☑' : '☐'}</Text>
              <View style={styles.itemTextColumn}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {resultLabel && <Text style={resultLabel.style}>{resultLabel.text}</Text>}
              </View>
            </TouchableOpacity>
          );
        })}

        {hasSubmitted && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>
              {isSelfReport
                ? `You have ${numberCorrectlySelected} of ${correctItemIds.length} ready`
                : `You picked ${numberCorrectlySelected} of the ${correctItemIds.length} correct ${
                    correctItemIds.length === 1 ? 'answer' : 'answers'
                  }`}
              {numberIncorrectlySelected > 0
                ? `, plus ${numberIncorrectlySelected} ${
                    numberIncorrectlySelected === 1 ? 'item that was' : 'items that were'
                  } not correct.`
                : '.'}
            </Text>
            <Text style={styles.xpEarnedText}>+{earnedXp} XP</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={hasSubmitted ? () => onComplete(earnedXp) : handleSubmit}
      >
        <Text style={styles.actionButtonText}>
          {hasSubmitted ? `Continue (+${earnedXp} XP)` : 'Submit'}
        </Text>
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
  },
  prompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  itemSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 2,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  itemCorrectAnswer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGreenAlert,
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  // Pale pink with a red border and dark text - solid red made the dark
  // text unreadable.
  itemWronglySelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.feedbackIncorrect,
    borderWidth: 2,
    borderColor: COLORS.textRed,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  itemMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  itemTextColumn: {
    flex: 1,
  },
  resultCorrect: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginTop: 4,
  },
  resultWrong: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textRed,
    marginTop: 4,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
  },
  feedbackBox: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textDark,
  },
  xpEarnedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textOrange,
    marginTop: 6,
  },
  actionButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});