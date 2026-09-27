// screens/BadgePage.js
//
// Shows every badge that exists across every mission's content - level
// badges and each mission's own mission-wide badge - earned ones in full
// colour, unearned ones greyed out via reduced opacity (React Native has
// no CSS grayscale filter for images, so opacity is the practical
// stand-in). Reachable from the just-earned popup on MissionDetailScreen,
// from the "Badges earned" banner there, and from a link on the Missions
// list.

import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGameContext, getEarnedBadgeIds } from '../context/GameContext';
import { getAllBadges } from '../missionContent/badges';
import { COLORS } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

export default function BadgePageScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // The same screen is used as the Badges tab and as a pushed page.
  const isTab = route.name === 'Badges';
  const { state } = useGameContext();
  const allBadges = getAllBadges();
  const earnedBadgeIds = getEarnedBadgeIds(state);

  return (
    <View style={styles.screen}>
      {/* Opened as a tab there's nothing to go back to; opened from Missions
          or a badge popup, it shows a back link. */}
      <ScreenHeader
        title="Badges"
        subtitle={`${earnedBadgeIds.length} of ${allBadges.length} earned`}
        onBack={isTab ? undefined : () => navigation.goBack()}
      />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.grid}>
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
                {badge.missionId === null
                  ? badge.missionTitle
                  : badge.levelNumber
                  ? `${badge.missionTitle} · Level ${badge.levelNumber}`
                  : `${badge.missionTitle} · Mission Complete`}
              </Text>
              {!isEarned && <Text style={styles.lockedLabel}>🔒 Not yet earned</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollArea: {
    flex: 1,
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
    padding: 20,
    paddingBottom: 32,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  badgeImage: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  badgeImageLocked: {
    opacity: 0.25,
  },
  badgeImagePlaceholder: {
    width: 72,
    height: 72,
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