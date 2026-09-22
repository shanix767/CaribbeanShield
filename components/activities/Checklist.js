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
  // did not select the incorrect ones. Shown as encouragement, not used
  // to gate progress (this is a Learn-stage activity, not a Prove test).
  const correctItemIds = items.filter((item) => item.isCorrect).map((item) => item.id);
  const numberCorrectlySelected = selectedItemIds.filter((id) => correctItemIds.includes(id)).length;
  const numberIncorrectlySelected = selectedItemIds.filter((id) => !correctItemIds.includes(id)).length;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.prompt}>{prompt}</Text>

        {items.map((item) => {
          const isSelected = selectedItemIds.includes(item.id);

          // Once submitted, show the real answer key regardless of what
          // the player picked, so they leave the activity knowing the
          // right answer, not just whether they were right.
          let itemStyle = styles.item;
          if (hasSubmitted && item.isCorrect) {
            itemStyle = styles.itemCorrectAnswer;
          } else if (hasSubmitted && isSelected && !item.isCorrect) {
            itemStyle = styles.itemWronglySelected;
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
              <Text style={styles.itemLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}

        {hasSubmitted && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>
              You correctly identified {numberCorrectlySelected} of {correctItemIds.length} hazards
              {numberIncorrectlySelected > 0
                ? `, and selected ${numberIncorrectlySelected} item(s) that weren't hazards.`
                : '.'}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={hasSubmitted ? onComplete : handleSubmit}
      >
        <Text style={styles.actionButtonText}>
          {hasSubmitted ? `Continue (+${activity.xpReward} XP)` : 'Submit'}
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
  itemWronglySelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundRed,
    borderWidth: 1,
    borderColor: COLORS.textRed,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
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
  actionButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});