// screens/missions/activityPlayer.js
//
// Renders one stage's activities one at a time, in order. Which component
// renders each activity is decided purely by its `type` field — this
// screen doesn't know or care whether an activity is a lesson, a quiz, or
// a checklist, it just hands off to the matching component from
// components/activities/. Adding a new activity type later means adding
// one more case below, not touching this screen's structure.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGameContext, STAGE_ORDER } from '../../context/GameContext';
import { HURRICANE_MISSION_CONTENT } from '../../missionContent/hurricane';
import Lesson from '../../components/activities/Lesson';
import Quiz from '../../components/activities/Quiz';
import Checklist from '../../components/activities/Checklist';
import Matching from '../../components/activities/Matching';
import Scenario from '../../components/activities/Scenario';
import { COLORS } from '../../theme/colors';

const MISSION_CONTENT_BY_ID = {
  hurricaneReady: HURRICANE_MISSION_CONTENT,
};

export default function ActivityPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { missionId, level, stage } = route.params;
  const { dispatch } = useGameContext();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const mission = MISSION_CONTENT_BY_ID[missionId];
  const levelContent = mission.levels[level];
  const stageContent = levelContent.stages[stage];
  const activities = stageContent.activities;
  const currentActivity = activities[currentActivityIndex];

  const isLastStage = stage === STAGE_ORDER[STAGE_ORDER.length - 1];
  const isLastActivityInStage = currentActivityIndex === activities.length - 1;

  function handleActivityComplete() {
    dispatch({
      type: 'COMPLETE_ACTIVITY',
      missionId,
      level,
      stage,
      activityId: currentActivity.id,
      xpReward: currentActivity.xpReward,
    });

    if (!isLastActivityInStage) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      return;
    }

    // Finished the last activity in this stage. Only the very last stage
    // (Recover) in the sequence actually awards the level's badge — every
    // other stage just returns to the level overview so the player can
    // see the next stage unlock.
    if (isLastStage) {
      dispatch({
        type: 'COMPLETE_LEVEL',
        missionId,
        level,
        badgeId: levelContent.badgeId,
      });
    }

    navigation.goBack();
  }

  if (!currentActivity.content) {
    // Defensive fallback — MissionDetailScreen already disables entry into
    // stages without real content, so this shouldn't normally be reached.
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.comingSoonText}>This activity isn't built yet.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentActivity.type === 'lesson') {
    return <Lesson activity={currentActivity} onComplete={handleActivityComplete} />;
  }

  if (currentActivity.type === 'quiz') {
    return <Quiz activity={currentActivity} onComplete={handleActivityComplete} />;
  }

  if (currentActivity.type === 'checklist') {
    return <Checklist activity={currentActivity} onComplete={handleActivityComplete} />;
  }

  if (currentActivity.type === 'matching') {
    return <Matching activity={currentActivity} onComplete={handleActivityComplete} />;
  }

  if (currentActivity.type === 'scenario') {
    return <Scenario activity={currentActivity} onComplete={handleActivityComplete} />;
  }

  // A type without a matching component yet (e.g. 'matching', 'scenario' —
  // not built in this pass).
  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.comingSoonText}>
        Activity type "{currentActivity.type}" isn't built yet.
      </Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
  comingSoonText: {
    color: COLORS.textGray,
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});