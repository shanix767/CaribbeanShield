// screens/missions/missionsList.js

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useGameContext,
  getPlayerLevel,
  getReadinessPercentage,
  getMissionXp,
} from '../../context/GameContext';
import { HURRICANE_MISSION_CONTENT } from '../../missionContent/hurricane';
import { COLORS } from '../../theme/colors';

// Add new missions here once they're converted to the new level->stage->
// activity schema (see missionContent/hurricane/ for the pattern).
const ALL_MISSIONS = [HURRICANE_MISSION_CONTENT];

export default function MissionsListScreen() {
  const navigation = useNavigation();
  const { state } = useGameContext();
  const playerLevel = getPlayerLevel(state);
  const readinessPercent = getReadinessPercentage(state, ALL_MISSIONS);

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.screenTitle}>Missions</Text>

      <View style={styles.statusCard}>
        <Text style={styles.playerLevelText}>
          Level {playerLevel.level} — {playerLevel.name}
        </Text>
        <View style={styles.readinessRow}>
          <View style={styles.readinessBarTrack}>
            <View style={[styles.readinessBarFill, { width: `${readinessPercent}%` }]} />
          </View>
          <Text style={styles.readinessLabel}>{readinessPercent}% Ready</Text>
        </View>
      </View>

      {ALL_MISSIONS.map((mission) => {
        const missionProgress = state.missions[mission.missionId];
        const badgesEarnedCount = missionProgress ? missionProgress.badgesEarned.length : 0;
        const totalLevelsBuilt = Object.keys(mission.levels).length;
        const missionXp = getMissionXp(state, mission.missionId);

        return (
          <TouchableOpacity
            key={mission.missionId}
            style={styles.missionCard}
            onPress={() => navigation.navigate('MissionDetail', { missionId: mission.missionId })}
          >
            <Text style={styles.missionIcon}>{mission.iconPlaceholder}</Text>

            <View style={styles.missionInfo}>
              <Text style={styles.missionTitle}>{mission.title}</Text>
              <Text style={styles.missionDescription}>{mission.description}</Text>

              <View style={styles.progressRow}>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(badgesEarnedCount / totalLevelsBuilt) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>
                  {badgesEarnedCount}/{totalLevelsBuilt} badges
                </Text>
              </View>

              <Text style={styles.xpLabel}>{missionXp} XP earned</Text>
            </View>
          </TouchableOpacity>
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
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: COLORS.backgroundGreen,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  playerLevelText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  readinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readinessBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.backgroundWhite,
    overflow: 'hidden',
  },
  readinessBarFill: {
    height: '100%',
    backgroundColor: COLORS.borderYellow,
  },
  readinessLabel: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 12,
  },
  missionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  missionIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  missionDescription: {
    color: COLORS.textGray,
    fontSize: 13,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.backgroundCream,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.backgroundGreen,
  },
  progressLabel: {
    color: COLORS.textDark,
    fontWeight: 'bold',
    fontSize: 12,
  },
  xpLabel: {
    color: COLORS.textOrange,
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 6,
  },
});