// screens/missions/activityPlayer.js
//
// Renders one stage's activities one at a time, in order. Which component
// renders each activity is decided purely by its `type` field - this
// screen doesn't know or care whether an activity is a lesson, a quiz, or
// a checklist, it just hands off to the matching component from
// components/activities/. Each activity component computes its own earned
// XP based on correctness and passes it back via onComplete(earnedXp) -
// this screen just records whatever value it's given.
//
// The level's badge is only awarded when the player's total earned XP for
// the ENTIRE level equals the level's full possible XP - a perfect score,
// not just having attempted everything. See handleActivityComplete below.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useGameContext,
  getStageEarnedXp,
  getStagePossibleXp,
} from '../../context/GameContext';
import { MISSION_CONTENT_BY_ID } from '../../missionContent';
import Lesson from '../../components/activities/Lesson';
import Quiz from '../../components/activities/Quiz';
import Checklist from '../../components/activities/Checklist';
import Matching from '../../components/activities/Matching';
import Scenario from '../../components/activities/Scenario';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

const STAGE_DISPLAY_LABELS = {
  learn: 'Learn',
  plan: 'Plan',
  prepare: 'Prepare',
  prove: 'Prove Readiness',
  respond: 'Respond',
  recover: 'Recover',
};

export default function ActivityPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { missionId, level, stage } = route.params;
  const { state, dispatch } = useGameContext();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const mission = MISSION_CONTENT_BY_ID[missionId];
  const levelContent = mission.levels[level];
  const stageContent = levelContent.stages[stage];
  const activities = stageContent.activities;
  const currentActivity = activities[currentActivityIndex];

  const isLastActivityInStage = currentActivityIndex === activities.length - 1;

  // Live XP progress for this stage - reads straight from state, so it
  // updates automatically on every re-render after an activity completes
  // (including retries, since COMPLETE_ACTIVITY overwrites rather than
  // blocks). Falls back to 0 gracefully if this level hasn't been touched
  // in state yet (e.g. the very first activity the player ever opens).
  const missionProgress = state.missions[missionId];
  const levelProgress = missionProgress ? missionProgress.levels[level] : undefined;
  const stageEarnedXpSoFar = levelProgress ? getStageEarnedXp(levelProgress, stage) : 0;
  const stagePossibleXp = getStagePossibleXp(stageContent);

  function handleActivityComplete(earnedXp) {
    dispatch({
      type: 'COMPLETE_ACTIVITY',
      missionId,
      level,
      stage,
      activityId: currentActivity.id,
      xpReward: earnedXp,
    });

    if (!isLastActivityInStage) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      return;
    }

    // Finished the last activity in this stage - back to Mission Detail.
    // Level and mission badges are checked there, from the saved progress
    // (see MissionDetailScreen), so a perfect score earns the badge whichever
    // stage it was completed in, including retries of earlier stages.
    navigation.goBack();
  }

  return (
    <View style={styles.wrapper}>
      <ScreenHeader
        title={`Level ${level} · ${STAGE_DISPLAY_LABELS[stage]}`}
        subtitle={`Activity ${currentActivityIndex + 1} of ${activities.length} · ${stageEarnedXpSoFar} / ${stagePossibleXp} XP`}
        onBack={() => navigation.goBack()}
      />

      {renderActivity()}
    </View>
  );

  function renderActivity() {
    if (!currentActivity.content) {
      // Defensive fallback - MissionDetailScreen already disables entry
      // into stages without real content, so this shouldn't normally be
      // reached.
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.comingSoonText}>This activity isn't built yet.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // key={currentActivity.id} makes React start each activity fresh. Without
    // it, two activities of the same type in a row (e.g. Level 1's two Plan
    // checklists) reuse the same component, so the previous activity's
    // selections and submitted state carry over into the next one.
    if (currentActivity.type === 'lesson') {
      return <Lesson key={currentActivity.id} activity={currentActivity} onComplete={handleActivityComplete} />;
    }

    if (currentActivity.type === 'quiz') {
      return <Quiz key={currentActivity.id} activity={currentActivity} onComplete={handleActivityComplete} />;
    }

    if (currentActivity.type === 'checklist') {
      return <Checklist key={currentActivity.id} activity={currentActivity} onComplete={handleActivityComplete} />;
    }

    if (currentActivity.type === 'matching') {
      return <Matching key={currentActivity.id} activity={currentActivity} onComplete={handleActivityComplete} />;
    }

    if (currentActivity.type === 'scenario') {
      return <Scenario key={currentActivity.id} activity={currentActivity} onComplete={handleActivityComplete} />;
    }

    // A type without a matching component yet.
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
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
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