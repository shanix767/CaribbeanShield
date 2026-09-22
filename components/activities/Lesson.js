// components/activities/Lesson.js
//
// Reusable across every "read this, then continue" activity in any
// mission/level/stage - e.g. L1.1 "What Is a Hurricane?" and L1.3 "Watch
// vs Warning". The content itself (body text, bullet points) always comes
// from the activity's content object, never hardcoded here, so this one
// component can render any lesson in any mission.

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LessonActivity({ activity, onComplete }) {
  const { body, bullets } = activity.content;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.body}>{body}</Text>

        {bullets.map((bulletText, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletMarker}>•</Text>
            <Text style={styles.bulletText}>{bulletText}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
        <Text style={styles.continueButtonText}>Continue (+{activity.xpReward} XP)</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletMarker: {
    fontSize: 15,
    color: COLORS.backgroundGreenD,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.textDark,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});