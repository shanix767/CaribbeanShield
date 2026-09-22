// screens/missions/missionDetail.js

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useGameContext,
  STAGE_ORDER,
  areAllStageActivitiesAttempted,
  getStageEarnedXp,
  getStagePossibleXp,
  getLevelEarnedXp,
  getLevelPossibleXp,
} from '../../context/GameContext';
import { HURRICANE_MISSION_CONTENT } from '../../missionContent/hurricane';
import { COLORS } from '../../theme/colors';

// Add new missions here once they're converted to the new schema.
const MISSION_CONTENT_BY_ID = {
  hurricaneReady: HURRICANE_MISSION_CONTENT,
};

// Display labels and icons for each stage - purely cosmetic, kept out of
// the content files since every mission's stages are named the same way.
const STAGE_DISPLAY = {
  learn: { icon: '🧠', label: 'Learn' },
  plan: { icon: '📝', label: 'Plan' },
  prepare: { icon: '🎒', label: 'Prepare' },
  prove: { icon: '✅', label: 'Prove Readiness' },
  respond: { icon: '🚨', label: 'Respond' },
  recover: { icon: '🔄', label: 'Recover' },
};

// A stage is only worth entering once every one of its activities has
// real content - the remaining stages of Level 1 without content yet are
// stubbed with content: null (see missionContent/hurricane/level1.js).
function stageHasRealContent(stageContent) {
  return stageContent.activities.every((activity) => activity.content !== null);
}

export default function MissionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { missionId } = route.params;
  const { state } = useGameContext();

  const mission = MISSION_CONTENT_BY_ID[missionId];
  const missionProgress = state.missions[missionId];

  if (!mission || !missionProgress) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Mission "{missionId}" not found.</Text>
      </View>
    );
  }

  const levelNumbers = Object.keys(mission.levels).map(Number).sort((a, b) => a - b);

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Missions</Text>
      </TouchableOpacity>

      <Text style={styles.missionIcon}>{mission.iconPlaceholder}</Text>
      <Text style={styles.missionTitle}>{mission.title}</Text>
      <Text style={styles.missionDescription}>{mission.description}</Text>

      {missionProgress.badgesEarned.length > 0 && (
        <View style={styles.badgeBanner}>
          <Text style={styles.badgeBannerText}>
            🏅 Badges earned: {missionProgress.badgesEarned.length}
          </Text>
        </View>
      )}

      {levelNumbers.map((levelNumber) => {
        const levelContent = mission.levels[levelNumber];
        const levelProgress = missionProgress.levels[levelNumber] || {
          completed: false,
          stages: {},
        };

        // Level 1 is always unlocked. Level N unlocks once Level N-1's
        // badge has been earned - not reachable yet since only Level 1
        // exists, but this keeps the screen correct as levels get added.
        const previousLevelNumber = levelNumber - 1;
        const previousLevelBadgeId = mission.levels[previousLevelNumber]?.badgeId;
        const isLevelUnlocked =
          levelNumber === levelNumbers[0] ||
          missionProgress.badgesEarned.includes(previousLevelBadgeId);

        const levelEarnedXp = getLevelEarnedXp(levelProgress);
        const levelPossibleXp = getLevelPossibleXp(levelContent);

        return (
          <View
            key={levelNumber}
            style={[styles.levelCard, !isLevelUnlocked && styles.levelCardLocked]}
          >
            <Text style={styles.levelTitle}>
              Level {levelNumber}: {levelContent.title}
              {levelProgress.completed ? ' ✓' : ''}
            </Text>

            {isLevelUnlocked && (
              <Text style={styles.levelXpText}>
                {levelEarnedXp}/{levelPossibleXp} XP
                {!levelProgress.completed && levelEarnedXp > 0
                  ? ' - perfect score across every stage earns the badge'
                  : ''}
              </Text>
            )}

            {!isLevelUnlocked && (
              <Text style={styles.lockedLabel}>
                🔒 Complete Level {previousLevelNumber} first
              </Text>
            )}

            {isLevelUnlocked &&
              STAGE_ORDER.map((stageName, stageIndex) => {
                const stageContent = levelContent.stages[stageName];
                const stageProgress = levelProgress.stages[stageName] || { activityXp: {} };
                const hasRealContent = stageHasRealContent(stageContent);

                const stageEarnedXp = getStageEarnedXp(levelProgress, stageName);
                const stagePossibleXp = getStagePossibleXp(stageContent);
                const isStagePerfect =
                  stagePossibleXp > 0 && stageEarnedXp === stagePossibleXp;

                // A stage unlocks for the first time once the previous
                // stage has been ATTEMPTED in full - this is about attempt
                // coverage, not correctness. A player can move on having
                // gotten some answers wrong; only the level's BADGE
                // requires a perfect score (see the XP line above), and
                // any stage can always be re-entered to retry and improve.
                const previousStageName = STAGE_ORDER[stageIndex - 1];
                const previousStageAttempted =
                  stageIndex === 0 ||
                  areAllStageActivitiesAttempted(
                    levelProgress.stages[previousStageName] || { activityXp: {} },
                    levelContent.stages[previousStageName]
                  );

                const isEnterable = hasRealContent && previousStageAttempted;

                return (
                  <TouchableOpacity
                    key={stageName}
                    style={[styles.stageRow, isStagePerfect && styles.stageRowComplete]}
                    disabled={!isEnterable}
                    onPress={() =>
                      navigation.navigate('ActivityPlayer', {
                        missionId,
                        level: levelNumber,
                        stage: stageName,
                      })
                    }
                  >
                    <Text style={styles.stageIcon}>{STAGE_DISPLAY[stageName].icon}</Text>
                    <View style={styles.stageInfo}>
                      <Text style={styles.stageLabel}>
                        {STAGE_DISPLAY[stageName].label}
                        {isStagePerfect ? ' ✓' : ''}
                      </Text>
                      <Text style={styles.stageProgressText}>
                        {hasRealContent ? `${stageEarnedXp}/${stagePossibleXp} XP` : 'Coming soon'}
                      </Text>
                    </View>
                    {!isEnterable && hasRealContent && (
                      <Text style={styles.stageLockIcon}>🔒</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
  errorText: {
    color: COLORS.textOrange,
  },
  backLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  missionIcon: {
    fontSize: 48,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginTop: 4,
  },
  missionDescription: {
    color: COLORS.textGray,
    marginTop: 4,
    marginBottom: 16,
  },
  badgeBanner: {
    backgroundColor: COLORS.backgroundGreen,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  badgeBannerText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
  levelCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  levelCardLocked: {
    opacity: 0.5,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  levelXpText: {
    fontSize: 12,
    color: COLORS.textOrange,
    marginBottom: 10,
  },
  lockedLabel: {
    color: COLORS.textGray,
    fontSize: 12,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCream,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  stageRowComplete: {
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
  },
  stageIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  stageInfo: {
    flex: 1,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  stageProgressText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  stageLockIcon: {
    fontSize: 16,
  },
});