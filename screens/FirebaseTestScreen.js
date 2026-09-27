// screens/FirebaseTestScreen.js
//
// DEVELOPER TEST PANEL - not part of the real app. Opened from Settings →
// Developer Test Panel (registered in App.js as the "DevTestPanel" stack
// screen). The Settings entry only shows in development builds.
//
// Five test areas:
//   1. Badges    - force-earn any level badge (and the mission badge) to
//                  test the badge popup, Badge Page and badge counts.
//   2. Quiz      - play any real quiz from the mission in a sandbox.
//   3. Checklist - play any real checklist in a sandbox.
//   4. Matching  - play any real matching activity in a sandbox.
//   5. Scenario  - play any real scenario in a sandbox.
//
// The sandbox renders the SAME activity components the missions use, with
// the SAME content, but its onComplete only displays the result - it never
// dispatches COMPLETE_ACTIVITY, so testing here never changes the player's
// real XP, progress or Readiness Score. Only the Badges area changes state.

import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { useGameContext } from '../context/GameContext';
import { HURRICANE_MISSION_CONTENT } from '../missionContent/hurricane';
import Quiz from '../components/activities/Quiz';
import Checklist from '../components/activities/Checklist';
import Matching from '../components/activities/Matching';
import Scenario from '../components/activities/Scenario';
import { COLORS } from '../theme/colors';
import ScreenHeader, { HeaderButton } from '../components/ScreenHeader';

const MISSION = HURRICANE_MISSION_CONTENT;
const MISSION_ID = MISSION.missionId;
const STAGE_KEYS = ['learn', 'plan', 'prepare', 'prove', 'respond', 'recover'];

const TEST_AREAS = [
  { key: 'badges', label: '🏅 Badges' },
  { key: 'quiz', label: '❓ Quiz' },
  { key: 'checklist', label: '☑️ Checklist' },
  { key: 'matching', label: '🔗 Matching' },
  { key: 'scenario', label: '🌀 Scenario' },
];

const ACTIVITY_COMPONENTS = {
  quiz: Quiz,
  checklist: Checklist,
  matching: Matching,
  scenario: Scenario,
};

// What each activity type should do, shown as a reminder while testing.
const WHAT_TO_CHECK = {
  quiz:
    'Answer some right and some wrong. Correct option turns green with an explanation; XP = reward × correct ÷ total. On timed quizzes, let one question run out: it should count as wrong.',
  checklist:
    'Tick all correct items: full XP. Then miss one correct item, or tick one wrong item: XP should drop for each mistake.',
  matching:
    'Match all pairs with no mistakes: full XP. Then make wrong matches: each should flash red, and XP = reward × pairs ÷ (pairs + mistakes).',
  scenario:
    'Pick the best choice: full XP and consequence text. Pick a weaker choice: lower XP and a different consequence.',
};

// Every built activity in the mission, grouped by type, with its location
// so the tester knows which one they are playing.
function collectActivitiesByType() {
  const byType = { quiz: [], checklist: [], matching: [], scenario: [] };
  Object.keys(MISSION.levels)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((levelNumber) => {
      const level = MISSION.levels[levelNumber];
      STAGE_KEYS.forEach((stageKey) => {
        const stage = level.stages[stageKey];
        if (!stage) return;
        stage.activities.forEach((activity) => {
          if (!activity.content || !byType[activity.type]) return;
          byType[activity.type].push({ activity, levelNumber, stageKey });
        });
      });
    });
  return byType;
}

export default function FirebaseTestScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();

  const [firebaseStatus, setFirebaseStatus] = useState('Checking...');
  const [activeArea, setActiveArea] = useState('badges');
  const [sampleIndex, setSampleIndex] = useState({ quiz: 0, checklist: 0, matching: 0, scenario: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0); // forces a fresh component on replay
  const [lastResult, setLastResult] = useState(null);

  const activitiesByType = useMemo(collectActivitiesByType, []);

  useEffect(() => {
    try {
      const app = getApp();
      setFirebaseStatus(`✅ Firebase OK (${app.options.projectId})`);
    } catch (error) {
      setFirebaseStatus(`❌ Firebase failed: ${error.message}`);
    }
  }, []);

  const badgesEarned = state.missions[MISSION_ID]?.badgesEarned || [];
  const levelNumbers = Object.keys(MISSION.levels).map(Number).sort((a, b) => a - b);

  // ---------- 1. Badges ----------

  function forceEarnLevelBadge(levelNumber) {
    const level = MISSION.levels[levelNumber];
    const newlyEarned = [];

    if (!badgesEarned.includes(level.badgeId)) {
      dispatch({ type: 'COMPLETE_LEVEL', missionId: MISSION_ID, level: levelNumber, badgeId: level.badgeId });
      newlyEarned.push({ badgeId: level.badgeId, badgeName: level.badgeName });
    }

    // Same mission-badge check the Activity Player uses.
    const allLevelBadgeIds = levelNumbers.map((n) => MISSION.levels[n].badgeId);
    const earnedIncludingThis = [...badgesEarned, level.badgeId];
    const missionComplete = allLevelBadgeIds.every((id) => earnedIncludingThis.includes(id));
    if (missionComplete && MISSION.missionBadge && !badgesEarned.includes(MISSION.missionBadge.badgeId)) {
      dispatch({ type: 'COMPLETE_MISSION', missionId: MISSION_ID, badgeId: MISSION.missionBadge.badgeId });
      newlyEarned.push({ badgeId: MISSION.missionBadge.badgeId, badgeName: MISSION.missionBadge.badgeName });
    }

    if (newlyEarned.length === 0) {
      Alert.alert('Already earned', `Level ${levelNumber} badge is already earned.`);
      return;
    }
    navigation.navigate('MissionDetail', { missionId: MISSION_ID, justEarnedBadges: newlyEarned });
  }

  function forceEarnAllBadges() {
    const newlyEarned = [];
    levelNumbers.forEach((levelNumber) => {
      const level = MISSION.levels[levelNumber];
      if (!badgesEarned.includes(level.badgeId)) {
        dispatch({ type: 'COMPLETE_LEVEL', missionId: MISSION_ID, level: levelNumber, badgeId: level.badgeId });
        newlyEarned.push({ badgeId: level.badgeId, badgeName: level.badgeName });
      }
    });
    if (MISSION.missionBadge && !badgesEarned.includes(MISSION.missionBadge.badgeId)) {
      dispatch({ type: 'COMPLETE_MISSION', missionId: MISSION_ID, badgeId: MISSION.missionBadge.badgeId });
      newlyEarned.push({ badgeId: MISSION.missionBadge.badgeId, badgeName: MISSION.missionBadge.badgeName });
    }
    if (newlyEarned.length === 0) {
      Alert.alert('Nothing to earn', 'Every badge is already earned.');
      return;
    }
    navigation.navigate('MissionDetail', { missionId: MISSION_ID, justEarnedBadges: newlyEarned });
  }

  function confirmResetProgress() {
    Alert.alert(
      'Reset all progress?',
      'Clears XP, badges, parish and onboarding (pre/post-test scores are kept). The app returns to onboarding next time it opens.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_PROGRESS' }) },
      ]
    );
  }

  // ---------- 2-5. Activity sandbox ----------

  const samples = activitiesByType[activeArea] || [];
  const currentSample = samples[sampleIndex[activeArea] || 0];

  function changeSample(step) {
    if (samples.length === 0) return;
    const next = ((sampleIndex[activeArea] || 0) + step + samples.length) % samples.length;
    setSampleIndex({ ...sampleIndex, [activeArea]: next });
    setLastResult(null);
  }

  function startSandbox() {
    setLastResult(null);
    setPlayKey(playKey + 1);
    setIsPlaying(true);
  }

  function handleSandboxComplete(earnedXp) {
    const possibleXp = currentSample.activity.xpReward;
    setLastResult({
      title: currentSample.activity.title,
      earnedXp,
      possibleXp,
      percent: possibleXp > 0 ? Math.round((earnedXp / possibleXp) * 100) : 0,
    });
    setIsPlaying(false);
  }

  if (isPlaying && currentSample) {
    const ActivityComponent = ACTIVITY_COMPONENTS[activeArea];
    return (
      <View style={styles.sandboxWrapper}>
        <ScreenHeader
          title="🧪 Sandbox"
          subtitle={`L${currentSample.levelNumber} ${currentSample.stageKey}: ${currentSample.activity.title} (progress not saved)`}
          right={<HeaderButton label="✕ Exit" onPress={() => setIsPlaying(false)} />}
        />
        <ActivityComponent
          key={playKey}
          activity={currentSample.activity}
          onComplete={handleSandboxComplete}
        />
      </View>
    );
  }

  // ---------- Panel ----------

  return (
    <View style={styles.wrapper}>
      <ScreenHeader
        title="🛠 Developer Test Panel"
        onBack={() => navigation.goBack()}
        backLabel="Settings"
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.firebaseStatus}>{firebaseStatus}</Text>

        <View style={styles.areaTabs}>
          {TEST_AREAS.map((area) => (
            <TouchableOpacity
              key={area.key}
              style={[styles.areaTab, activeArea === area.key && styles.areaTabActive]}
              onPress={() => {
                setActiveArea(area.key);
                setLastResult(null);
              }}
            >
              <Text style={[styles.areaTabText, activeArea === area.key && styles.areaTabTextActive]}>
                {area.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeArea === 'badges' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Badge earning</Text>
            <Text style={styles.cardText}>
              Earned: {badgesEarned.length} of {levelNumbers.length + (MISSION.missionBadge ? 1 : 0)}
              {badgesEarned.length > 0 ? `\n${badgesEarned.join(', ')}` : ''}
            </Text>
            <Text style={styles.checkText}>
              Check: the popup appears, the badge shows in colour on the Badge Page, and earning the
              last level badge also awards the mission badge in the same popup.
            </Text>

            <View style={styles.buttonGrid}>
              {levelNumbers.map((levelNumber) => {
                const earned = badgesEarned.includes(MISSION.levels[levelNumber].badgeId);
                return (
                  <TouchableOpacity
                    key={levelNumber}
                    style={[styles.gridButton, earned && styles.gridButtonDone]}
                    onPress={() => forceEarnLevelBadge(levelNumber)}
                  >
                    <Text style={styles.gridButtonText}>
                      {earned ? '✓ ' : ''}Level {levelNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={forceEarnAllBadges}>
              <Text style={styles.primaryButtonText}>Earn all badges (tests mission badge)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('BadgePage')}>
              <Text style={styles.secondaryButtonText}>Open Badge Page</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerButton} onPress={confirmResetProgress}>
              <Text style={styles.primaryButtonText}>Reset all progress</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeArea !== 'badges' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {TEST_AREAS.find((a) => a.key === activeArea).label} test
            </Text>
            <Text style={styles.checkText}>What to check: {WHAT_TO_CHECK[activeArea]}</Text>

            {samples.length === 0 ? (
              <Text style={styles.cardText}>No {activeArea} activities found in the mission content.</Text>
            ) : (
              <>
                <View style={styles.sampleRow}>
                  <TouchableOpacity style={styles.arrowButton} onPress={() => changeSample(-1)}>
                    <Text style={styles.arrowText}>‹</Text>
                  </TouchableOpacity>
                  <View style={styles.sampleInfo}>
                    <Text style={styles.sampleTitle}>{currentSample.activity.title}</Text>
                    <Text style={styles.sampleMeta}>
                      Level {currentSample.levelNumber} · {currentSample.stageKey} ·{' '}
                      {currentSample.activity.xpReward} XP · {(sampleIndex[activeArea] || 0) + 1} of{' '}
                      {samples.length}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.arrowButton} onPress={() => changeSample(1)}>
                    <Text style={styles.arrowText}>›</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={startSandbox}>
                  <Text style={styles.primaryButtonText}>▶ Play in sandbox</Text>
                </TouchableOpacity>

                {lastResult && (
                  <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>Result: {lastResult.title}</Text>
                    <Text style={styles.resultXp}>
                      {lastResult.earnedXp} / {lastResult.possibleXp} XP ({lastResult.percent}%)
                    </Text>
                    <Text style={styles.cardText}>
                      Sandbox only: real progress was not changed.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.backgroundCream },
  scroll: { padding: 16, paddingBottom: 40 },
  backLink: { color: COLORS.textGreen, fontWeight: 'bold', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 4 },
  firebaseStatus: { fontSize: 13, color: COLORS.textGray, marginBottom: 16 },

  areaTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  areaTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
  },
  areaTabActive: { backgroundColor: COLORS.backgroundGreenD, borderColor: COLORS.backgroundGreenD },
  areaTabText: { fontSize: 13, color: COLORS.textDark, fontWeight: 'bold' },
  areaTabTextActive: { color: COLORS.textWhite },

  card: { backgroundColor: COLORS.backgroundWhite, borderRadius: 12, padding: 16 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 8 },
  cardText: { fontSize: 13, color: COLORS.textGray, marginBottom: 8 },
  checkText: {
    fontSize: 13,
    color: COLORS.textDark,
    backgroundColor: COLORS.backgroundCream,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    lineHeight: 18,
  },

  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  gridButton: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundCream,
    alignItems: 'center',
  },
  gridButtonDone: { backgroundColor: COLORS.backgroundGreenAlert },
  gridButtonText: { fontWeight: 'bold', color: COLORS.textDark },

  primaryButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: COLORS.textWhite, fontWeight: 'bold', fontSize: 15 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: { color: COLORS.textGreen, fontWeight: 'bold' },
  dangerButton: {
    backgroundColor: COLORS.backgroundRed,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
  },

  sampleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  arrowButton: { paddingHorizontal: 14, paddingVertical: 6 },
  arrowText: { fontSize: 30, color: COLORS.textGreen, fontWeight: 'bold' },
  sampleInfo: { flex: 1, alignItems: 'center' },
  sampleTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textDark, textAlign: 'center' },
  sampleMeta: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },

  resultBox: { marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: COLORS.backgroundCream },
  resultTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },
  resultXp: { fontSize: 22, fontWeight: 'bold', color: COLORS.textOrange, marginVertical: 4 },

  sandboxWrapper: { flex: 1, backgroundColor: COLORS.backgroundCream },
  sandboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGreenD,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sandboxHeaderText: { flex: 1, color: COLORS.textWhite, fontSize: 12, fontWeight: 'bold' },
  sandboxExit: { color: COLORS.textWhite, fontWeight: 'bold', fontSize: 14, marginLeft: 10 },
});