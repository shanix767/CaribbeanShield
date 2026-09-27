// components/activities/Matching.js
//
// Reusable for any "match item to description" activity - e.g. L1.10
// Emergency Equipment Match. Tap-to-select-then-tap-to-pair, not
// drag-and-drop - drag-and-drop is far more fragile on mobile (fiddly hit
// targets, easy to mis-drop) for no real benefit here. The right-hand
// column is shuffled once on mount so the pairs aren't trivially in the
// same order as the left column.
//
// Scoring: the player keeps trying until every pair is matched, but each
// wrong attempt is counted and reduces the XP awarded, so matching is
// accuracy-weighted like every other activity type:
//
//   earnedXp = round(xpReward * pairs / (pairs + wrongAttempts))
//
// No mistakes earns full XP; e.g. 5 pairs with 2 wrong attempts on a
// 20 XP activity earns round(20 * 5/7) = 14 XP. Because COMPLETE_ACTIVITY
// overwrites the stored XP, the player can replay the stage to improve it.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

// Fisher-Yates shuffle, written out with a temp variable rather than a
// destructuring swap - easier to read and step through, which matters
// more here than saving a line.
function shuffleArray(originalArray) {
  const shuffled = [...originalArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomI = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomI];
    shuffled[randomI] = temp;
  }
  return shuffled;
}

export default function Matching({ activity, onComplete }) {
  const { prompt, pairs } = activity.content;

  // Shuffled once when the activity is first shown, not on every
  // re-render - otherwise the right column would reshuffle after every
  // tap, which would be disorienting rather than challenging.
  const [shuffledRightItems] = useState(() => shuffleArray(pairs));

  const [selectedPairId, setSelectedPairId] = useState(null);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [wrongAttemptPairId, setWrongAttemptPairId] = useState(null);
  const [wrongAttemptCount, setWrongAttemptCount] = useState(0);

  const allPairsMatched = matchedPairIds.length === pairs.length;

  // Accuracy-weighted XP - see the scoring note at the top of the file.
  const earnedXp = Math.round(
    activity.xpReward * (pairs.length / (pairs.length + wrongAttemptCount))
  );

  function handleSelectLeftItem(pairId) {
    if (matchedPairIds.includes(pairId)) return;
    if (wrongAttemptPairId !== null) return; // wait for the red flash to clear
    setSelectedPairId(pairId);
  }

  function handleSelectRightItem(pairId) {
    if (matchedPairIds.includes(pairId)) return;
    if (selectedPairId === null) return; // must pick a left item first
    // Ignore taps during the red flash, so one mistake can't be counted
    // twice by tapping again before the selection resets.
    if (wrongAttemptPairId !== null) return;

    const isCorrectMatch = selectedPairId === pairId;

    if (isCorrectMatch) {
      setMatchedPairIds([...matchedPairIds, pairId]);
      setSelectedPairId(null);
    } else {
      // Count the mistake, briefly flash red on the wrong right-side item,
      // then clear the selection so the player can try again.
      setWrongAttemptCount((count) => count + 1);
      setWrongAttemptPairId(pairId);
      setTimeout(() => {
        setWrongAttemptPairId(null);
        setSelectedPairId(null);
      }, 600);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.prompt}>{prompt}</Text>

      <View style={styles.columnsRow}>
        <View style={styles.column}>
          {pairs.map((pair) => {
            const isMatched = matchedPairIds.includes(pair.id);
            const isSelected = selectedPairId === pair.id;

            let itemStyle = styles.item;
            if (isMatched) itemStyle = styles.itemMatched;
            else if (isSelected) itemStyle = styles.itemSelected;

            return (
              <TouchableOpacity
                key={pair.id}
                style={itemStyle}
                onPress={() => handleSelectLeftItem(pair.id)}
                disabled={isMatched}
              >
                <Text style={styles.itemText}>{pair.left}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.column}>
          {shuffledRightItems.map((pair) => {
            const isMatched = matchedPairIds.includes(pair.id);
            const isWrongAttempt = wrongAttemptPairId === pair.id;

            let itemStyle = styles.item;
            if (isMatched) itemStyle = styles.itemMatched;
            else if (isWrongAttempt) itemStyle = styles.itemWrong;

            return (
              <TouchableOpacity
                key={pair.id}
                style={itemStyle}
                onPress={() => handleSelectRightItem(pair.id)}
                disabled={isMatched}
              >
                <Text style={styles.itemText}>{pair.right}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {allPairsMatched && (
        <Text style={styles.resultText}>
          {wrongAttemptCount === 0
            ? 'All pairs matched with no mistakes!'
            : `All pairs matched with ${wrongAttemptCount} ${
                wrongAttemptCount === 1 ? 'mistake' : 'mistakes'
              }.`}
        </Text>
      )}
      </ScrollView>

      {allPairsMatched && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={() => onComplete(earnedXp)}>
            <Text style={styles.continueButtonText}>
              Continue (+{earnedXp}/{activity.xpReward} XP)
            </Text>
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
  prompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  item: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  itemSelected: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 2,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  itemMatched: {
    backgroundColor: COLORS.backgroundGreenAlert,
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  itemWrong: {
    // feedbackIncorrect comes from the new palette; falls back to the old
    // red if colors.js hasn't been swapped yet.
    backgroundColor: COLORS.feedbackIncorrect || COLORS.backgroundRed,
    borderWidth: 1,
    borderColor: COLORS.textRed,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 13,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: 'center',
    marginTop: 16,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});