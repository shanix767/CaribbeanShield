//Home Screen

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useGame } from '../../context/GameContext';

//Missions shown on home screen
const HOME_MISSIONS = [
  { id: 'hurricane', 
    icon: '🌀', 
    title: 'Hurricane Ready', 
    xp: 150, 
    badge: 'Storm Watcher' },

  { id: 'earthquake', 
    icon: '🌊', 
    title: 'Earthquake Prep', 
    xp: 100, 
    badge: 'Tremor Guard' },
  
  { id: 'kit', 
    icon: '🎒', 
    title: 'Build Your Go-Kit', 
    xp: 130, 
    badge: 'Ready Pack' },
];

//Fake alerts - API to replace later
const ALERTS = [
  {
    id: 1,
    type: 'Hurricane',
    level: 'Watch',
    icon: '🌀',
    bgColor: Colors.bg,
    tagBg: Colors.border,
    tagColor: Colors.amber,
    desc: 'Tropical wave tracking NNW - 72hr outlook',
  },

  {
    id: 2,
    type: 'Seismic',
    level: 'Info',
    icon: '🌊',
    bgColor: Colors.bg,
    tagBg: Colors.border,
    tagColor: Colors.green,
    desc: 'M2.3 detected 45km SE of Roseau',
  },
];

//Readiness percentage
function getReadinessLabel(readiness) {
  if (readiness === 0) return 'Start a mission to begin building your readiness';
  if (readiness < 30) return 'Getting started - keep going';
  if (readiness < 60) return 'Making progress - complete more missions';
  if (readiness < 100) return 'Almost there - finish your remaining missions';
  return 'Fully prepared - Island Defender!';
}


export default function HomeScreen() {
  //Live game stats
  const { loaded,
          level, 
          levelName,
          readiness, 
          xp,
          unlockedMissions,
          completedMissions,
          parish } = useGame();


   // Merge mission data with live state
  const missions = HOME_MISSIONS.map((m) => ({
    ...m,
    unlocked: unlockedMissions.includes(m.id),
    completed: completedMissions.includes(m.id),
  }));


  //Main screen content
return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>{parish || 'Dominica'}</Text>
          </View>
          {/* XP top right */}
          <View style={styles.xpBox}>
            <Text style={styles.xpNum}>{xp}</Text>
            <Text style={styles.xpLbl}>XP</Text>
          </View>
        </View>

        {/* Readiness card */}
        <View style={styles.card}>
          <View style={styles.readinessTop}>
            <View>
              <Text style={styles.label}>READINESS SCORE</Text>
              {/* Readiness percentage */}
              <Text style={styles.bigNum}>{readiness}%</Text>
            </View>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          {/* Progress bar */}
          <View style={styles.trackBg}>
            <View style={[styles.trackFill, { width: `${readiness}%` }]} />
          </View>
          <Text style={styles.cardBody}>{getReadinessLabel(readiness)}</Text>
        </View>

        {/* Level */}
        <View style={styles.levelCard}>
          <Text style={styles.levelIcon}>⚡</Text>
          <View style={styles.flex1}>
            <Text style={styles.levelText}>Level {level} - {levelName}</Text>
            <Text style={styles.levelSub}>{xp} XP earned so far</Text>
          </View>
        </View>

        {/* Active alerts, static for now */}
        <Text style={styles.sectionTitle}>Active Alerts</Text>
        {ALERTS.map((a) => (
          <View key={a.id} style={styles.alertCard}>
            <View style={styles.row}>
              <View style={[styles.alertIconWrap, { backgroundColor: a.bgColor }]}>
                <Text style={styles.alertIconText}>{a.icon}</Text>
              </View>
              <View style={styles.flex1}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>{a.type}</Text>
                  <View style={[styles.tag, { backgroundColor: a.tagBg }]}>
                    <Text style={[styles.tagText, { color: a.tagColor }]}>
                      {a.level}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardBody}>{a.desc}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Mission cards */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Missions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/missions')}>
            <Text style={styles.seeAll}>See all ›</Text>
          </TouchableOpacity>
        </View>

        {missions.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.missionCard, !m.unlocked && styles.locked]}
            onPress={() => m.unlocked && router.push(`/mission/${m.id}`)}
            disabled={!m.unlocked}
          >
            <Text style={styles.missionIcon}>{m.icon}</Text>
            <View style={styles.flex1}>
              <Text style={styles.cardTitle}>
                {m.title}{!m.unlocked ? ' 🔒' : ''}
              </Text>
              <Text style={styles.cardBody}>🏅 {m.badge}</Text>
            </View>
            <View style={styles.missionRight}>
              {m.completed ? (
                <View style={styles.doneTag}>
                  <Text style={styles.doneTagText}>✓ Done</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.xpText}>+{m.xp}</Text>
                  <Text style={styles.xpSubText}>XP</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Parish indicator */}
        <View style={styles.parishCard}>
          <Text style={styles.parishIcon}>📍</Text>
          <View>
            <Text style={styles.label}>YOUR PARISH</Text>
            <Text style={styles.cardTitle}>{parish || 'Not set'}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  
  safe: { 
    flex: 1, 
    backgroundColor: Colors.bg 
  },

  scroll: { 
    flex: 1 
  },

  content: { 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 40 
  },
  
  
 // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: { fontSize: 13, color: Colors.muted },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text, marginTop: 2 },

  // XP box
  xpBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  xpNum: { fontSize: 18, fontWeight: '800', color: Colors.amber },
  xpLbl: { fontSize: 9, color: Colors.muted },

  // Generic card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  // Readiness
  readinessTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bigNum: { fontSize: 32, fontWeight: '800', color: Colors.text },
  shieldIcon: { fontSize: 32 },
  trackBg: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    marginTop: 10,
    overflow: 'hidden',
  },
  trackFill: { height: 8, backgroundColor: Colors.green, borderRadius: 6 },
  cardBody: { fontSize: 12, color: Colors.muted, marginTop: 6, lineHeight: 18 },

  // Level card
  levelCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  levelIcon: { fontSize: 22 },
  flex1: { flex: 1 },
  levelText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  levelSub: { fontSize: 11, color: Colors.muted, marginTop: 2 },

  // Section headings
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  seeAll: { fontSize: 12, color: Colors.green, fontWeight: '600', marginTop: 8 },

  // Alert card
  alertCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alertIconText: { fontSize: 18 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, fontWeight: '700' },

  // Mission card
  missionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  locked: { opacity: 0.45 },
  missionIcon: { fontSize: 26 },
  missionRight: { alignItems: 'center' },
  xpText: { fontSize: 13, fontWeight: '800', color: Colors.amber, textAlign: 'right' },
  xpSubText: { fontSize: 9, color: Colors.muted, textAlign: 'right' },
  doneTag: {
    backgroundColor: '#E6F0E4',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneTagText: { fontSize: 11, fontWeight: '700', color: Colors.green },

  // Parish card
  parishCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  parishIcon: { fontSize: 20 },
});