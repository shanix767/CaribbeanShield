// screens/Home.js
//
// The dashboard: current mission progress, active hazard alerts, a
// leaderboard snippet, and side missions. Alert detection reuses the
// exact same pattern as HazardWatchScreen (storms.length > 0, etc.)
// rather than inventing separate severity logic — this is a simple
// "what's the current state" summary, distinct from App.js's alert Modal,
// which is specifically about detecting CHANGES since last check for a
// notification. Home just shows what's true right now.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGameContext,
  getPlayerLevel,
  getTotalXp,
  getLevelEarnedXp,
  getLevelPossibleXp,
} from '../context/GameContext';
import { MISSION_CONTENT_BY_ID } from '../missionContent';
import { getAllSideMissions } from '../missionContent/sideMissions';
import { getBadgeImage } from '../missionContent/badges';
import { fetchAllUsersForLeaderboard } from '../services/firestoreUsers';
import { fetchHurricaneWatchData } from '../services/hurricaneApi';
import { fetchRecentEarthquakes } from '../services/earthquakeApi';
import { fetchWeeklyVolcanoActivity } from '../services/volcanoApi';
import { fetchRecentFloodAlerts } from '../services/floodApi';
import { TEST_MODE } from '../testMode';
import { COLORS } from '../theme/colors';

const HURRICANE_MISSION_ID = 'hurricaneReady';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// First level whose badge isn't yet earned — a simple proxy for "what the
// player is currently working on," not a full re-implementation of
// MissionDetailScreen's unlock-percentage logic (that lives there because
// it needs to be precise for gating; here it's just a dashboard summary).
function getCurrentActiveLevelNumber(mission, missionProgress) {
  const levelNumbers = Object.keys(mission.levels).map(Number).sort((a, b) => a - b);
  for (const levelNumber of levelNumbers) {
    const badgeId = mission.levels[levelNumber].badgeId;
    if (!missionProgress.badgesEarned.includes(badgeId)) {
      return levelNumber;
    }
  }
  return levelNumbers[levelNumbers.length - 1];
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { state } = useGameContext();

  const [leaderboardTop, setLeaderboardTop] = useState([]);
  const [alertSummary, setAlertSummary] = useState(null); // null = still loading
  const [justEarnedBadges, setJustEarnedBadges] = useState(null);

  const playerLevel = getPlayerLevel(state);
  const totalXp = getTotalXp(state);

  const mission = MISSION_CONTENT_BY_ID[HURRICANE_MISSION_ID];
  const missionProgress = state.missions[HURRICANE_MISSION_ID];
  const currentLevelNumber = getCurrentActiveLevelNumber(mission, missionProgress);
  const currentLevelContent = mission.levels[currentLevelNumber];
  const currentLevelProgress = missionProgress.levels[currentLevelNumber] || {
    stages: {},
    completed: false,
  };
  const currentLevelEarnedXp = getLevelEarnedXp(currentLevelProgress);
  const currentLevelPossibleXp = getLevelPossibleXp(currentLevelContent);

  const sideMissions = getAllSideMissions();

  // Badge popup — same pattern as MissionDetailScreen, for side missions
  // completed via SideMissionPlayerScreen navigating back here.
  useEffect(() => {
    if (route.params?.justEarnedBadges) {
      setJustEarnedBadges(route.params.justEarnedBadges);
      navigation.setParams({ justEarnedBadges: undefined });
    }
  }, [route.params?.justEarnedBadges]);

  const loadLeaderboardSnippet = useCallback(async () => {
    const users = await fetchAllUsersForLeaderboard();
    users.sort((a, b) => b.totalXp - a.totalXp);
    setLeaderboardTop(users.slice(0, 3));
  }, []);

  const loadAlertSummary = useCallback(async () => {
    const [hurricaneResult, earthquakeResult, volcanoResult, floodResult] =
      await Promise.allSettled([
        fetchHurricaneWatchData(),
        fetchRecentEarthquakes(),
        fetchWeeklyVolcanoActivity(),
        fetchRecentFloodAlerts(),
      ]);

    const storms = TEST_MODE.hurricane
      ? []
      : hurricaneResult.status === 'fulfilled' ? hurricaneResult.value.storms : [];
    // Hurricane has no on/off preference. The other three respect
    // notificationPreferences, same as App.js's check — if a category is
    // turned off in settings, Home's banner shouldn't surface it either.
    const earthquakes = !state.notificationPreferences.earthquakeAlerts
      ? []
      : TEST_MODE.earthquake
      ? []
      : earthquakeResult.status === 'fulfilled' ? earthquakeResult.value : [];
    const volcanicReports = !state.notificationPreferences.volcanicActivity
      ? []
      : TEST_MODE.volcano
      ? []
      : volcanoResult.status === 'fulfilled' ? volcanoResult.value : [];
    const floods = !state.notificationPreferences.floodWarnings
      ? []
      : TEST_MODE.flood
      ? []
      : floodResult.status === 'fulfilled' ? floodResult.value : [];

    const hasActiveStorm = storms.length > 0;
    const hasActiveEarthquake = earthquakes.length > 0;
    const hasActiveVolcano = volcanicReports.length > 0;
    const hasActiveFlood = floods.length > 0;

    if (hasActiveStorm) {
      const storm = storms[0];
      setAlertSummary({
        icon: '🌀',
        title: `${storm.classificationLabel} ${storm.name}${storm.category ? ` — Category ${storm.category}` : ''}`,
        detail: storm.movement ? `Moving ${storm.movement}` : 'Tap for details',
      });
    } else if (hasActiveEarthquake) {
      setAlertSummary({ icon: '🌍', title: 'Recent earthquake activity nearby', detail: 'Tap for details' });
    } else if (hasActiveVolcano) {
      setAlertSummary({ icon: '🌋', title: 'Volcanic activity reported this week', detail: 'Tap for details' });
    } else if (hasActiveFlood) {
      setAlertSummary({ icon: '🌊', title: 'Flood alert in the region', detail: 'Tap for details' });
    } else {
      setAlertSummary(null); // no active alerts
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLeaderboardSnippet();
      loadAlertSummary();
    }, [loadLeaderboardSnippet, loadAlertSummary])
  );

  const currentUserRank = leaderboardTop.findIndex((u) => u.userId === state.userId);
  const isCurrentUserInTop = currentUserRank !== -1;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>
            {getGreeting()}
            {state.userName ? `,\n${state.userName}` : ''}
          </Text>
          <View style={styles.headerRightGroup}>
            <View style={styles.appBadge}>
              <Text style={styles.appBadgeText}>🌀 CS</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('SettingsMenu')}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.missionCard}>
          <View style={styles.missionCardHeader}>
            <Text style={styles.missionCardTitle}>
              Level {currentLevelNumber} · {currentLevelContent.title}
            </Text>
            <Text style={styles.missionCardXp}>
              {currentLevelEarnedXp}/{currentLevelPossibleXp}
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${currentLevelPossibleXp > 0 ? (currentLevelEarnedXp / currentLevelPossibleXp) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.playerLevelText}>
            {playerLevel.name} · {totalXp} total XP
          </Text>
        </View>

        <TouchableOpacity
          style={alertSummary ? styles.alertCardActive : styles.alertCardCalm}
          onPress={() => navigation.navigate('Alert')}
        >
          {alertSummary ? (
            <>
              <Text style={styles.alertIcon}>{alertSummary.icon}</Text>
              <View style={styles.alertTextColumn}>
                <Text style={styles.alertTitle}>{alertSummary.title}</Text>
                <Text style={styles.alertDetail}>{alertSummary.detail}</Text>
              </View>
              <Text style={styles.alertChevron}>›</Text>
            </>
          ) : (
            <Text style={styles.calmText}>
              {alertSummary === null ? '🟢 No active alerts — all clear' : 'Checking for alerts...'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Leaderboard</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
            <Text style={styles.sectionLink}>Full board</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.leaderboardCard}>
          {leaderboardTop.length === 0 ? (
            <Text style={styles.emptyText}>No users on the leaderboard yet.</Text>
          ) : (
            leaderboardTop.map((user, index) => (
              <View key={user.userId} style={styles.leaderboardRow}>
                <Text style={styles.leaderboardRank}>
                  {index === 0 ? '🥇' : `#${index + 1}`}
                </Text>
                <Text style={styles.leaderboardName}>
                  {user.userId === state.userId ? 'You' : user.name}
                </Text>
                <Text style={styles.leaderboardXp}>{user.totalXp}</Text>
              </View>
            ))
          )}
          {!isCurrentUserInTop && state.userId && (
            <Text style={styles.notInTopText}>You're not in the top 3 yet</Text>
          )}
        </View>

        <Text style={styles.sectionHeader}>Side Missions</Text>
        {sideMissions.map((sideMission) => {
          const sideMissionProgress = state.sideMissions[sideMission.id];
          const isDone = sideMissionProgress?.completed;

          return (
            <TouchableOpacity
              key={sideMission.id}
              style={styles.sideMissionCard}
              onPress={() => navigation.navigate('SideMissionPlayer', { sideMissionId: sideMission.id })}
            >
              <Text style={styles.sideMissionIcon}>{sideMission.icon}</Text>
              <View style={styles.sideMissionInfo}>
                <Text style={styles.sideMissionTitle}>{sideMission.title}</Text>
                <Text style={styles.sideMissionSubtitle}>
                  {sideMission.xpReward} XP · {isDone ? 'Done' : 'Not started'}
                </Text>
              </View>
              {isDone && <Text style={styles.sideMissionCheck}>✓</Text>}
            </TouchableOpacity>
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
            <Text style={styles.popupHeading}>Badge Earned!</Text>
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
                navigation.navigate('Badges');
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 22,
  },
  appBadge: {
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  appBadgeText: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    fontSize: 13,
  },
  missionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  missionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  missionCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flexShrink: 1,
  },
  missionCardXp: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.backgroundCream,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.backgroundGreenD,
  },
  playerLevelText: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  alertCardCalm: {
    backgroundColor: COLORS.backgroundGreenAlert,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  alertCardActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundYellow,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  calmText: {
    color: COLORS.textGreenD,
    fontWeight: 'bold',
    fontSize: 13,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertTextColumn: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontSize: 13,
  },
  alertDetail: {
    color: COLORS.textDark,
    fontSize: 12,
    marginTop: 2,
  },
  alertChevron: {
    fontSize: 20,
    color: COLORS.textDark,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  sectionLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    fontSize: 13,
  },
  leaderboardCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  leaderboardRank: {
    width: 36,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  leaderboardXp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  notInTopText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyText: {
    color: COLORS.textGray,
    fontSize: 13,
  },
  sideMissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  sideMissionIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  sideMissionInfo: {
    flex: 1,
  },
  sideMissionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  sideMissionSubtitle: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  sideMissionCheck: {
    fontSize: 20,
    color: COLORS.backgroundGreenD,
    fontWeight: 'bold',
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
  popupHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 16,
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