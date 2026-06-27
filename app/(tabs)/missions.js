import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useGame } from '../../context/GameContext';

// Full mission list with tier grouping
// Tier 1 unlocked by default, tier 2 unlocks after 1 tier 1 complete, etc.
const ALL_MISSIONS = [
  {
    id: 'hurricane',
    icon: '🌀',
    title: 'Hurricane Ready',
    desc: 'Learn to prepare your home and family before a hurricane strikes.',
    xp: 150,
    badge: 'Storm Watcher',
    tier: 1,
  },
  {
    id: 'kit',
    icon: '🎒',
    title: 'Build Your Go-Kit',
    desc: 'Assemble a 72-hour emergency supply kit for your household.',
    xp: 130,
    badge: 'Ready Pack',
    tier: 1,
  },
  {
    id: 'earthquake',
    icon: '🌊',
    title: 'Earthquake Prep',
    desc: 'Know what to do before, during and after a seismic event.',
    xp: 100,
    badge: 'Tremor Guard',
    tier: 2,
  },
  {
    id: 'shelter',
    icon: '🏠',
    title: 'Find Your Shelter',
    desc: 'Identify your nearest official evacuation shelter.',
    xp: 80,
    badge: 'Safe Harbour',
    tier: 2,
  },
  {
    id: 'volcano',
    icon: '🌋',
    title: 'Volcanic Awareness',
    desc: 'Understand ash fall, exclusion zones and UWI-SRC alert levels.',
    xp: 120,
    badge: 'Ash Sentinel',
    tier: 3,
  },
];

export default function Missions() {
  const router = useRouter();

  // Pull live state from GameContext
  const { xp, unlockedMissions, completedMissions } = useGame();

  // Merge static mission data with live unlock/complete state
  const missions = ALL_MISSIONS.map((m) => ({
    ...m,
    unlocked: unlockedMissions.includes(m.id),
    completed: completedMissions.includes(m.id),
  }));

  // Split into sections for display
  const completed = missions.filter((m) => m.completed);
  const inProgress = missions.filter((m) => m.unlocked && !m.completed);
  const locked = missions.filter((m) => !m.unlocked);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Missions</Text>
        <Text style={styles.pageSub}>
          Complete missions to earn XP and raise your readiness score.
        </Text>

        {/* ── Stats strip ────────────────────────────── */}
        <View style={styles.statsRow}>
          {[
            { icon: '🌿', val: xp, lbl: 'Total XP' },
            { icon: '✅', val: completed.length, lbl: 'Completed' },
            { icon: '🔒', val: locked.length, lbl: 'Locked' },
          ].map((s, i, arr) => (
            <View
              key={s.lbl}
              style={[styles.statCell, i < arr.length - 1 && styles.statBorder]}
            >
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        {/* ── Completed missions ─────────────────────── */}
        {completed.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✅ Completed</Text>
            {completed.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                onPress={() => router.push(`/mission/${m.id}`)}
              />
            ))}
          </>
        )}

        {/* ── In progress missions ───────────────────── */}
        {inProgress.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>In Progress</Text>
            {inProgress.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                onPress={() => router.push(`/mission/${m.id}`)}
              />
            ))}
          </>
        )}

        {/* ── Locked missions ────────────────────────── */}
        {locked.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🔒 Locked</Text>
            {/* Hint to tell user how to unlock */}
            <View style={styles.unlockHint}>
              <Text style={styles.unlockHintText}>
                Complete more missions to unlock the next tier.
              </Text>
            </View>
            {locked.map((m) => (
              <MissionCard key={m.id} mission={m} onPress={() => {}} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Mission card component ──────────────────────────────
function MissionCard({ mission, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, !mission.unlocked && styles.locked]}
      onPress={onPress}
      disabled={!mission.unlocked}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardIcon}>{mission.icon}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardTitle}>
            {mission.title}{!mission.unlocked ? ' 🔒' : ''}
          </Text>
          <Text style={styles.cardDesc}>{mission.desc}</Text>
        </View>
        {/* XP or done indicator */}
        <View style={styles.cardRight}>
          {mission.completed ? (
            <View style={styles.doneTag}>
              <Text style={styles.doneTagText}>✓</Text>
            </View>
          ) : (
            <>
              <Text style={styles.xpText}>+{mission.xp}</Text>
              <Text style={styles.xpLbl}>XP</Text>
            </>
          )}
        </View>
      </View>

      {/* Bottom row — tier label, badge name, status chip */}
      <View style={styles.cardBottom}>
        <Text style={styles.tier}>Tier {mission.tier}</Text>
        <Text style={styles.badge}>🏅 {mission.badge}</Text>
        <View style={[
          styles.statusChip,
          {
            backgroundColor: mission.completed
              ? '#E6F0E4'
              : mission.unlocked
              ? '#FFF3DC'
              : Colors.surface,
          },
        ]}>
          <Text style={[
            styles.statusText,
            {
              color: mission.completed
                ? Colors.green
                : mission.unlocked
                ? Colors.amber
                : Colors.muted,
            },
          ]}>
            {mission.completed
              ? 'Complete'
              : mission.unlocked
              ? 'In Progress'
              : 'Locked'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
  pageSub: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },

  // Stats strip
  statsRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    flexDirection: 'row',
    paddingVertical: 14,
    marginBottom: 8,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statVal: { fontSize: 17, fontWeight: '800', color: Colors.text },
  statLbl: { fontSize: 10, color: Colors.muted, marginTop: 2 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 18,
    marginBottom: 8,
  },

  // Unlock hint banner
  unlockHint: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  unlockHintText: { fontSize: 12, color: Colors.amber, fontWeight: '500' },

  // Mission card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  locked: { opacity: 0.45 },
  cardTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  cardIcon: { fontSize: 26, marginTop: 2 },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  cardDesc: { fontSize: 12, color: Colors.muted, marginTop: 3, lineHeight: 17 },
  cardRight: { alignItems: 'center' },
  xpText: { fontSize: 13, fontWeight: '800', color: Colors.amber },
  xpLbl: { fontSize: 9, color: Colors.muted, textAlign: 'center' },
  doneTag: {
    backgroundColor: Colors.cardbg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneTagText: { fontSize: 13, fontWeight: '800', color: Colors.green },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  tier: { fontSize: 10, color: Colors.muted },
  badge: { fontSize: 10, color: Colors.muted, flex: 1 },
  statusChip: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
});