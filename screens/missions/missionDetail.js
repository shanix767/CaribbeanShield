// screens/missions/missionDetail.js

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import {
  useGameContext,
  STAGE_ORDER,
  areAllStageActivitiesAttempted,
  areAllLevelActivitiesAttempted,
  getStageEarnedXp,
  getStagePossibleXp,
  getLevelEarnedXp,
  getLevelPossibleXp,
  getMissionReadinessScore,
} from '../../context/GameContext';
import { MISSION_CONTENT_BY_ID } from '../../missionContent';
import { getBadgeImage } from '../../missionContent/badges';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

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
  const { state, dispatch } = useGameContext();
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

  // Level and mission badges are awarded here, whenever this screen shows
  // with new progress - not only at the end of the Recover stage. A level's
  // badge needs a perfect score across all its activities, and a player
  // often gets there by going back and retrying an earlier stage (Learn,
  // Plan...) after already finishing Recover. Checking here, from the
  // saved progress, catches every route to a perfect score, and also
  // awards any badge that was missed before this check existed.
  // COMPLETE_LEVEL / COMPLETE_MISSION ignore a badge that's already
  // earned, so this can never award the same badge twice.
  // Only while this screen is showing: it stays mounted underneath the
  // Activity Player, and its badge popup would otherwise appear on top of
  // an activity the player is still in the middle of.
  const isFocused = useIsFocused();
  const missionProgressForBadges = state.missions[missionId];
  useEffect(() => {
    if (!isFocused) return;
    const missionContent = MISSION_CONTENT_BY_ID[missionId];
    if (!missionContent || !missionProgressForBadges) return;

    const earnedBadgeIds = [...missionProgressForBadges.badgesEarned];
    const newlyEarnedBadges = [];

    Object.keys(missionContent.levels)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((levelNumber) => {
        const levelContent = missionContent.levels[levelNumber];
        const levelProgress = missionProgressForBadges.levels[levelNumber];
        if (!levelProgress || earnedBadgeIds.includes(levelContent.badgeId)) return;

        const isPerfectScore =
          getLevelEarnedXp(levelProgress) === getLevelPossibleXp(levelContent);
        if (!isPerfectScore) return;

        dispatch({
          type: 'COMPLETE_LEVEL',
          missionId,
          level: levelNumber,
          badgeId: levelContent.badgeId,
        });
        earnedBadgeIds.push(levelContent.badgeId);
        newlyEarnedBadges.push({
          badgeId: levelContent.badgeId,
          badgeName: levelContent.badgeName,
        });
      });

    // The mission-wide badge, once every level's badge is earned.
    const missionBadge = missionContent.missionBadge;
    const allLevelBadgeIds = Object.values(missionContent.levels).map((level) => level.badgeId);
    if (
      missionBadge &&
      !earnedBadgeIds.includes(missionBadge.badgeId) &&
      allLevelBadgeIds.every((badgeId) => earnedBadgeIds.includes(badgeId))
    ) {
      dispatch({ type: 'COMPLETE_MISSION', missionId, badgeId: missionBadge.badgeId });
      newlyEarnedBadges.push({ badgeId: missionBadge.badgeId, badgeName: missionBadge.badgeName });
    }

    if (newlyEarnedBadges.length > 0) {
      setJustEarnedBadges((current) => [...(current || []), ...newlyEarnedBadges]);
    }
  }, [isFocused, missionProgressForBadges, missionId, dispatch]);

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

  // This mission's own Readiness Score (0-100), as opposed to the overall
  // average across every mission shown on the Missions tab.
  const missionReadinessPercent = getMissionReadinessScore(state, mission);
  const readinessTitle = mission.readinessLabel || `${mission.title} Readiness`;

  return (
    <View style={styles.screenContainer}>
    <ScreenHeader
      title={`${mission.iconPlaceholder} ${mission.title}`}
      onBack={() => navigation.goBack()}
      backLabel="Missions"
    />
    <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.missionDescription}>{mission.description}</Text>

      <View style={styles.readinessCard}>
        <Text style={styles.readinessTitle}>{readinessTitle}</Text>
        <View style={styles.readinessRow}>
          <View style={styles.readinessBarTrack}>
            <View
              style={[styles.readinessBarFill, { width: `${missionReadinessPercent}%` }]}
            />
          </View>
          <Text style={styles.readinessPercent}>{missionReadinessPercent}%</Text>
        </View>
      </View>

      {missionProgress.badgesEarned.length > 0 && (
        <TouchableOpacity
          style={styles.badgeBanner}
          onPress={() => navigation.navigate('BadgePage')}
        >
          <Text style={styles.badgeBannerText}>
            🏅 {missionProgress.badgesEarned.length}{' '}
            {missionProgress.badgesEarned.length === 1 ? 'badge' : 'badges'} earned · View all ›
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
  readinessCard: {
    backgroundColor: COLORS.backgroundGreen,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  readinessTitle: {
    color: COLORS.textWhite,
    fontSize: 14,
    marginBottom: 6,
  },
  readinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readinessBarTrack: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.backgroundWhite,
    overflow: 'hidden',
  },
  readinessBarFill: {
    height: '100%',
    backgroundColor: COLORS.borderYellow,
  },
  readinessPercent: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 18,
  },
  badgeBanner: {
    backgroundColor: COLORS.backgroundGreen,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  // Centred with textAlign on the full-width text rather than alignItems on
  // the banner: Android can under-measure bold text that contains an emoji
  // when it is shrink-wrapped, which cut off the last word.
  badgeBannerText: {
    width: '100%',
    textAlign: 'center',
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 15,
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