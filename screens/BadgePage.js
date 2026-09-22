// screens/BadgePage.js
//
// Shows every badge that exists across every mission's content - level
// badges and each mission's own mission-wide badge - earned ones in full
// colour, unearned ones greyed out via reduced opacity (React Native has
// no CSS grayscale filter for images, so opacity is the practical
// stand-in). Reachable from the just-earned popup on MissionDetailScreen,
// from the "Badges earned" banner there, and from a link on the Missions
// list.

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext, getEarnedBadgeIds } from '../context/GameContext';
import { getAllBadges } from '../missionContent/badges';
import { COLORS } from '../theme/colors';

export default function BadgePageScreen() {
  const navigation = useNavigation();
  const { state } = useGameContext();
  const allBadges = getAllBadges();
  const earnedBadgeIds = getEarnedBadgeIds(state);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Badges</Text>
      <Text style={styles.subtitle}>
        {earnedBadgeIds.length} of {allBadges.length} earned
      </Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {allBadges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.badgeId);

          return (
            <View key={badge.badgeId} style={styles.badgeCard}>
              {badge.image ? (
                <Image
                  source={badge.image}
                  style={[styles.badgeImage, !isEarned && styles.badgeImageLocked]}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.badgeImagePlaceholder}>
                  <Text style={styles.badgeImagePlaceholderText}>🏅</Text>
                </View>
              )}
              <Text style={[styles.badgeName, !isEarned && styles.badgeNameLocked]}>
                {badge.badgeName}
              </Text>
              <Text style={styles.badgeSource}>
                {badge.levelNumber
                  ? `${badge.missionTitle} · Level ${badge.levelNumber}`
                  : `${badge.missionTitle} · Mission Complete`}
              </Text>
              {!isEarned && <Text style={styles.lockedLabel}>🔒 Not yet earned</Text>}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 10,
  },
  backLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textGreen,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '49%',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  badgeImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  badgeImageLocked: {
    opacity: 0.25,
  },
  badgeImagePlaceholder: {
    width: 100,
    height: 100,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImagePlaceholderText: {
    fontSize: 40,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  badgeNameLocked: {
    opacity: 0.4,
  },
  badgeSource: {
    fontSize: 11,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 4,
  },
  lockedLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    marginTop: 6,
  },
});