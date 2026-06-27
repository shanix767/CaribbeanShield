import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useGame } from '../../context/GameContext';

// All possible badges - earned state driven by GameContext
const BADGES = [
  { id: 'Storm Watcher', icon: '🏅', mission: 'hurricane' },
  { id: 'Ready Pack',    icon: '🎒', mission: 'kit' },
  { id: 'Tremor Guard',  icon: '🌊', mission: 'earthquake' },
  { id: 'Safe Harbour',  icon: '🏠', mission: 'shelter' },
  { id: 'Ash Sentinel',  icon: '🌋', mission: 'volcano' },
];

export default function Profile() {
  const { xp, readiness, level, levelName, earnedBadges, completedMissions, resetGame } = useGame();

  // Reset confirmation - important for back-to-back evaluation sessions
  function handleReset() {
    Alert.alert(
      'Reset Progress',
      'This will clear all XP, badges and completed missions. Used for evaluation testing only.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetGame },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Stats card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>LEVEL</Text>
          <Text style={styles.levelText}>
            {level} - {levelName}
          </Text>

          {/* XP row */}
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.statLabel}>Total XP</Text>
            <Text style={styles.statValue}>{xp} XP</Text>
          </View>

          {/* Readiness row */}
          <View style={styles.row}>
            <Text style={styles.statLabel}>Readiness Score</Text>
            <Text style={styles.statValue}>{readiness}%</Text>
          </View>
          {/* Readiness progress bar */}
          <View style={styles.trackBg}>
            <View style={[styles.trackFill, { width: `${readiness}%` }]} />
          </View>

          {/* Missions completed row */}
          <View style={styles.row}>
            <Text style={styles.statLabel}>Missions Completed</Text>
            <Text style={styles.statValue}>{completedMissions.length}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 48 },

  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },

  // Card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.green,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: { fontSize: 13, color: Colors.muted },
  statValue: { fontSize: 13, fontWeight: '700', color: Colors.text },

  // Progress bar
  trackBg: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  trackFill: { height: 8, backgroundColor: Colors.green, borderRadius: 6 },

  // Section title
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },

});