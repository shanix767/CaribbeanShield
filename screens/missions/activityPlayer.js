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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useGameContext,
  STAGE_ORDER,
  getStageEarnedXp,
  getStagePossibleXp,
  getLevelEarnedXp,
  getLevelPossibleXp,
  hasCompletedMission,
} from '../../context/GameContext';
import { MISSION_CONTENT_BY_ID } from '../../missionContent';
import Lesson from '../../components/activities/Lesson';
import Quiz from '../../components/activities/Quiz';
import Checklist from '../../components/activities/Checklist';
import Matching from '../../components/activities/Matching';
import Scenario from '../../components/activities/Scenario';
import { COLORS } from '../../theme/colors';

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

  const isLastStage = stage === STAGE_ORDER[STAGE_ORDER.length - 1];
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

    // Finished the last activity in this stage. Only the very last stage
    // (Recover) in the sequence can award the level's badge, and only if
    // this attempt brought the level's total XP to its full possible
    // amount - a perfect score, not just full attempt coverage.
    //
    // levelProgress (read above, before this dispatch) already reflects
    // every stage and every earlier activity in THIS stage, since those
    // were dispatched on previous calls to this function. The only thing
    // it doesn't yet include is earnedXp from THIS activity, since that
    // dispatch hasn't landed in state yet - so it's added in directly
    // here rather than re-reading state after the dispatch above.
    if (isLastStage) {
      const alreadyEarnedAcrossLevel = levelProgress ? getLevelEarnedXp(levelProgress) : 0;
      const totalEarnedIncludingThisActivity = alreadyEarnedAcrossLevel + earnedXp;
      const totalPossibleForLevel = getLevelPossibleXp(levelContent);
      const isPerfectScore = totalEarnedIncludingThisActivity === totalPossibleForLevel;

      if (isPerfectScore) {
        dispatch({
          type: 'COMPLETE_LEVEL',
          missionId,
          level,
          badgeId: levelContent.badgeId,
        });

        // Check whether THIS level was the last one needed to complete
        // the whole mission - same "add the fresh value to what's
        // already in state" approach as the level score check above,
        // since this level's badge isn't in state yet either.
        const allLevelBadgeIds = Object.values(mission.levels).map((lvl) => lvl.badgeId);
        const badgesEarnedSoFar = missionProgress ? missionProgress.badgesEarned : [];
        const badgesEarnedIncludingThisLevel = [...badgesEarnedSoFar, levelContent.badgeId];
        const isMissionNowComplete = allLevelBadgeIds.every((badgeId) =>
          badgesEarnedIncludingThisLevel.includes(badgeId)
        );

        const newlyEarnedBadges = [
          { badgeId: levelContent.badgeId, badgeName: levelContent.badgeName },
        ];

        if (isMissionNowComplete && mission.missionBadge) {
          dispatch({
            type: 'COMPLETE_MISSION',
            missionId,
            badgeId: mission.missionBadge.badgeId,
          });
          newlyEarnedBadges.push({
            badgeId: mission.missionBadge.badgeId,
            badgeName: mission.missionBadge.badgeName,
          });
        }

        // navigate (not goBack) so MissionDetailScreen's params update
        // with the just-earned badge(s), which is what triggers its
        // popup. React Navigation pops back to the already-mounted
        // MissionDetail screen in the stack and merges these params in,
        // rather than pushing a duplicate instance.
        navigation.navigate('MissionDetail', {
          missionId,
          justEarnedBadges: newlyEarnedBadges,
        });
        return;
      }
      // If it's not a perfect score, no badge is awarded - the player can
      // re-enter this stage (or any earlier stage) to retry activities
      // and try again. Nothing here blocks that; COMPLETE_ACTIVITY always
      // accepts a fresh attempt.
    }

    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.wrapper} edges={["top"]}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressHeaderText}>
          {STAGE_DISPLAY_LABELS[stage]} progress: {stageEarnedXpSoFar} / {stagePossibleXp} XP
        </Text>
      </View>

      {renderActivity()}
    </SafeAreaView>
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
  },
  progressHeader: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  progressHeaderText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
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