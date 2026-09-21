// screens/missions/MissionDetailScreen.js

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGameContext } from '../../context/GameContext';
import { HURRICANE_READY_MISSION } from './hurricane/hurricaneMission';
import { EARTHQUAKE_AWARENESS_MISSION } from './earthquake/earthquakeMission';
import { VOLCANIC_HAZARD_READY_MISSION } from './volcano/volcanoMission';
import { FLASH_FLOOD_AWARE_MISSION } from './flood/floodMission';
import { COLORS } from '../../theme/colors';

// Includes the stub missions too (even though they're not in
// MissionsListScreen's ALL_MISSIONS yet) so this screen is ready for them
// the moment they get real content and get added there.
const MISSION_CONTENT_BY_ID = {
  hurricaneReady: HURRICANE_READY_MISSION,
  earthquakeAwareness: EARTHQUAKE_AWARENESS_MISSION,
  volcanicHazardReady: VOLCANIC_HAZARD_READY_MISSION,
  flashFloodAware: FLASH_FLOOD_AWARE_MISSION,
};

export default function MissionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { missionId } = route.params;
  const { state, dispatch } = useGameContext();
  const [justCompletedLevel, setJustCompletedLevel] = useState(null);

  const mission = MISSION_CONTENT_BY_ID[missionId];
  const progress = state.missions[missionId] || {
    currentLevel: 0,
    completedLevels: [],
    xpEarned: 0,
    badgeEarned: false,
  };

  if (!mission) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Mission "{missionId}" not found.</Text>
      </View>
    );
  }

  function handleMarkComplete(level) {
    dispatch({
      type: 'COMPLETE_LEVEL',
      missionId: mission.missionId,
      level: level.level,
      xpReward: level.xpReward,
      isFinalLevel: !!level.isFinalLevel,
    });
    setJustCompletedLevel(level.level);
  }

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Missions</Text>
      </TouchableOpacity>

      <Text style={styles.missionIcon}>{mission.iconPlaceholder}</Text>
      <Text style={styles.missionTitle}>{mission.title}</Text>
      <Text style={styles.missionDescription}>{mission.description}</Text>

      {progress.badgeEarned && (
        <View style={styles.badgeBanner}>
          <Text style={styles.badgeBannerText}>
            🏅 Badge earned: {mission.levels.find((l) => l.isFinalLevel)?.badgeName}
          </Text>
        </View>
      )}

      {mission.levels.length === 0 && (
        <Text style={styles.emptyText}>This mission doesn't have content yet.</Text>
      )}

      {mission.levels.map((level) => {
        const isCompleted = progress.completedLevels.includes(level.level);
        const isNextUp = !isCompleted && level.level === progress.currentLevel + 1;
        const isLocked = !isCompleted && !isNextUp;

        return (
          <View
            key={level.level}
            style={[
              styles.levelCard,
              isCompleted && styles.levelCardCompleted,
              isLocked && styles.levelCardLocked,
            ]}
          >
            <Text style={styles.levelTitle}>
              Level {level.level}: {level.title}
              {isCompleted ? ' ✓' : ''}
            </Text>
            <Text style={styles.levelDescription}>{level.description}</Text>
            <Text style={styles.levelXp}>{level.xpReward} XP</Text>

            {isNextUp && (
              <TouchableOpacity style={styles.markCompleteButton} onPress={() => handleMarkComplete(level)}>
                <Text style={styles.markCompleteButtonText}>
                  Mark Complete (stub — real content coming later)
                </Text>
              </TouchableOpacity>
            )}

            {isLocked && <Text style={styles.lockedLabel}>🔒 Complete the previous level first</Text>}
          </View>
        );
      })}

      {justCompletedLevel != null && (
        <Text style={styles.confirmationText}>
          Level {justCompletedLevel} marked complete — progress saved.
        </Text>
      )}
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
  emptyText: {
    color: COLORS.textGray,
    fontStyle: 'italic',
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
  levelCardCompleted: {
    borderWidth: 2,
    borderColor: COLORS.borderGreen,
  },
  levelCardLocked: {
    opacity: 0.5,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  levelDescription: {
    color: COLORS.textGray,
    marginTop: 4,
  },
  levelXp: {
    color: COLORS.textOrange,
    fontWeight: 'bold',
    marginTop: 6,
  },
  markCompleteButton: {
    marginTop: 12,
    backgroundColor: COLORS.backgroundGreen,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  markCompleteButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  lockedLabel: {
    color: COLORS.textGray,
    fontSize: 12,
    marginTop: 8,
  },
  confirmationText: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
});