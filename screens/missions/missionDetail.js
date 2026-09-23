// screens/missions/missionDetail.js

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useGameContext,
  STAGE_ORDER,
  areAllStageActivitiesAttempted,
  areAllLevelActivitiesAttempted,
  getStageEarnedXp,
  getStagePossibleXp,
  getLevelEarnedXp,
  getLevelPossibleXp,
} from '../../context/GameContext';
import { MISSION_CONTENT_BY_ID } from '../../missionContent';
import { getBadgeImage } from '../../missionContent/badges';
import { COLORS } from '../../theme/colors';

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
  const [justEarnedBadges, setJustEarnedBadges] = useState(null);

  // ActivityPlayerScreen navigates back here with justEarnedBadges set
  // (an array - usually one badge, but two if finishing the final level
  // also completes the whole mission) when a badge was just earned.
  // Capture it into local state to drive the popup, then clear the param
  // so it doesn't re-trigger on a later re-render or re-navigation to
  // this same screen.
  useEffect(() => {
    if (route.params?.justEarnedBadges) {
      setJustEarnedBadges(route.params.justEarnedBadges);
      navigation.setParams({ justEarnedBadges: undefined });
    }
  }, [route.params?.justEarnedBadges]);

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
    <>
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Missions</Text>
      </TouchableOpacity>

      <Text style={styles.missionIcon}>{mission.iconPlaceholder}</Text>
      <Text style={styles.missionTitle}>{mission.title}</Text>
      <Text style={styles.missionDescription}>{mission.description}</Text>

      {missionProgress.badgesEarned.length > 0 && (
        <TouchableOpacity
          style={styles.badgeBanner}
          onPress={() => navigation.navigate('BadgePage')}
        >
          <Text style={styles.badgeBannerText}>
            🏅 Badges earned: {missionProgress.badgesEarned.length} - tap to view
          </Text>
        </TouchableOpacity>
      )}

      {levelNumbers.map((levelNumber) => {
        const levelContent = mission.levels[levelNumber];
        const levelProgress = missionProgress.levels[levelNumber] || {
          completed: false,
          stages: {},
        };

        // Level 1 is always unlocked. Level N unlocks once Level N-1 has
        // been fully attempted AND scored at least 75% of its possible
        // XP - attempted alone isn't quite enough on its own (someone
        // could click through getting almost everything wrong), but
        // requiring the full 100% the badge needs would be too strict a
        // gate on just moving forward. 75% overall, since XP is already
        // correctness-weighted, reads as "engaged with everything and did
        // reasonably well" rather than "answered every question right."
        const previousLevelNumber = levelNumber - 1;
        const previousLevelContent = mission.levels[previousLevelNumber];
        const previousLevelProgress = missionProgress.levels[previousLevelNumber];

        const previousLevelAllAttempted =
          previousLevelContent &&
          previousLevelProgress &&
          areAllLevelActivitiesAttempted(previousLevelProgress, previousLevelContent);
        const previousLevelPossibleXp = previousLevelContent
          ? getLevelPossibleXp(previousLevelContent)
          : 0;
        const previousLevelEarnedXp = previousLevelProgress
          ? getLevelEarnedXp(previousLevelProgress)
          : 0;
        const previousLevelScorePercent =
          previousLevelPossibleXp > 0
            ? Math.round((previousLevelEarnedXp / previousLevelPossibleXp) * 100)
            : 0;
        const previousLevelMetScoreThreshold = previousLevelScorePercent >= 75;

        const isLevelUnlocked =
          levelNumber === levelNumbers[0] ||
          (previousLevelAllAttempted && previousLevelMetScoreThreshold);

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
                {!previousLevelAllAttempted
                  ? `🔒 Attempt every activity in Level ${previousLevelNumber} first`
                  : `🔒 Score at least 75% in Level ${previousLevelNumber} to unlock (currently ${previousLevelScorePercent}%)`}
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

      <Modal
        visible={!!justEarnedBadges}
        transparent
        animationType="fade"
        onRequestClose={() => setJustEarnedBadges(null)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.popupHeading}>
              {justEarnedBadges && justEarnedBadges.length > 1 ? 'Badges Earned!' : 'Badge Earned!'}
            </Text>

            {(justEarnedBadges || []).map((badge) => {
              const image = getBadgeImage(badge.badgeId);
              return (
                <View key={badge.badgeId} style={styles.popupBadgeRow}>
                  {image ? (
                    <Image source={image} style={styles.popupBadgeImage} resizeMode="contain" />
                  ) : (
                    <View style={styles.popupBadgeImagePlaceholder}>
                      <Text style={styles.popupBadgeImagePlaceholderText}>🏅</Text>
                    </View>
                  )}
                  <Text style={styles.popupBadgeName}>{badge.badgeName}</Text>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.popupPrimaryButton}
              onPress={() => {
                setJustEarnedBadges(null);
                navigation.navigate('BadgePage');
              }}
            >
              <Text style={styles.popupPrimaryButtonText}>View Badges</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setJustEarnedBadges(null)}>
              <Text style={styles.popupDismiss}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  popupOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popupCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  popupBadgeRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  popupBadgeImage: {
    width: 88,
    height: 88,
    marginBottom: 8,
  },
  popupBadgeImagePlaceholder: {
    width: 88,
    height: 88,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBadgeImagePlaceholderText: {
    fontSize: 48,
  },
  popupHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 16,
  },
  popupBadgeName: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  popupPrimaryButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  popupPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  popupDismiss: {
    color: COLORS.textGray,
    fontSize: 14,
  },
});