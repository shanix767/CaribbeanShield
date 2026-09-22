// components/activities/Matching.js
//
// Reusable for any "match item to description" activity - e.g. L1.10
// Emergency Equipment Match. Tap-to-select-then-tap-to-pair, not
// drag-and-drop - drag-and-drop is far more fragile on mobile (fiddly hit
// targets, easy to mis-drop) for no real benefit here. The right-hand
// column is shuffled once on mount so the pairs aren't trivially in the
// same order as the left column.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

  const allPairsMatched = matchedPairIds.length === pairs.length;

  function handleSelectLeftItem(pairId) {
    if (matchedPairIds.includes(pairId)) return;
    setSelectedPairId(pairId);
  }

  function handleSelectRightItem(pairId) {
    if (matchedPairIds.includes(pairId)) return;
    if (selectedPairId === null) return; // must pick a left item first

    const isCorrectMatch = selectedPairId === pairId;

    if (isCorrectMatch) {
      setMatchedPairIds([...matchedPairIds, pairId]);
      setSelectedPairId(null);
    } else {
      // Briefly flash red on the wrong right-side item, then clear the
      // selection so the player can try again.
      setWrongAttemptPairId(pairId);
      setTimeout(() => {
        setWrongAttemptPairId(null);
        setSelectedPairId(null);
      }, 600);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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
        <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
          <Text style={styles.continueButtonText}>Continue (+{activity.xpReward} XP)</Text>
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
    backgroundColor: COLORS.backgroundRed,
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
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});