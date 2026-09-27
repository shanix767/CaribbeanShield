// screens/Leaderboard.js
//
// Three views on the same underlying data: rank individual users by XP,
// count how many players hold each player rank (Newcomer to Island
// Defender), or rank parishes by their users' TOTAL combined XP. Reads once on mount and
// on pull-to-refresh - this is a small-scale evaluation study (n=5 target
// participants), not a live-updating social feature, so there's no need
// for a real-time Firestore listener here.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGameContext,
  getTotalXp,
  getRankForXp,
  getNextRank,
  LEVEL_THRESHOLDS,
} from '../context/GameContext';
import { fetchAllUsersForLeaderboard } from '../services/firestoreUsers';
import { COLORS } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

const VIEW_MODES = [
  { id: 'user', label: 'Players' },
  { id: 'rank', label: 'Ranks' },
  { id: 'parish', label: 'Parishes' },
];

// How many players hold each rank, highest rank first. Names are kept so
// the rank card can show who is there.
function countPlayersByRank(users) {
  return [...LEVEL_THRESHOLDS].reverse().map((rank) => {
    const playersAtRank = users.filter((user) => getRankForXp(user.totalXp).level === rank.level);
    return { ...rank, playerCount: playersAtRank.length, players: playersAtRank };
  });
}

// Groups users by parish and sums their XP - users with no parish set
// (shouldn't normally happen post-onboarding, but handled defensively)
// are grouped under "Unknown" rather than silently dropped or crashing.
function aggregateByParish(users) {
  const totalsByParish = {};

  users.forEach((user) => {
    const parishKey = user.parish || 'Unknown';
    if (!totalsByParish[parishKey]) {
      totalsByParish[parishKey] = { parish: parishKey, totalXp: 0, totalBadges: 0, userCount: 0 };
    }
    totalsByParish[parishKey].totalXp += user.totalXp;
    totalsByParish[parishKey].totalBadges += user.badgeCount;
    totalsByParish[parishKey].userCount += 1;
  });

  return Object.values(totalsByParish).sort((a, b) => b.totalXp - a.totalXp);
}

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const { state } = useGameContext();
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState('user'); // 'user' | 'rank' | 'parish'
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    const fetchedUsers = await fetchAllUsersForLeaderboard();
    fetchedUsers.sort((a, b) => b.totalXp - a.totalXp);
    setUsers(fetchedUsers);
  }, []);

  useEffect(() => {
    loadLeaderboard().finally(() => setIsLoading(false));
  }, [loadLeaderboard]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadLeaderboard();
    setIsRefreshing(false);
  }

  const parishRankings = aggregateByParish(users);
  const rankCounts = countPlayersByRank(users);

  // The current player's own rank uses their local XP, which is always up
  // to date (their Firestore total can lag behind by a sync).
  const myTotalXp = getTotalXp(state);
  const myRank = getRankForXp(myTotalXp);
  const myNextRank = getNextRank(myTotalXp);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScreenHeader title="🏆 Leaderboard" onBack={() => navigation.goBack()} />
      <View style={styles.container}>

      <View style={styles.toggleRow}>
        {VIEW_MODES.map((mode) => {
          const isActive = viewMode === mode.id;
          return (
            <TouchableOpacity
              key={mode.id}
              style={isActive ? styles.toggleButtonActive : styles.toggleButton}
              onPress={() => setViewMode(mode.id)}
            >
              <Text style={isActive ? styles.toggleTextActive : styles.toggleText}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {viewMode === 'parish' && (
        <Text style={styles.subtitle}>Dominica · Parishes ranked by total combined XP</Text>
      )}
      {viewMode === 'rank' && (
        <Text style={styles.subtitle}>How many players have reached each rank</Text>
      )}

      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : users.length === 0 ? (
        <Text style={styles.emptyText}>
          No users found yet - this may mean no one's progress has synced, or Firestore
          couldn't be reached. Pull down to try again.
        </Text>
      ) : viewMode === 'user' ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.userId}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item, index }) => {
            const isCurrentUser = item.userId === state.userId;
            return (
              <View style={[styles.row, isCurrentUser && styles.rowHighlighted]}>
                <Text style={styles.rank}>
                  {index < 3 ? RANK_MEDALS[index] : `#${index + 1}`}
                </Text>
                <View style={styles.rowInfo}>
                  <Text style={styles.name}>
                    {item.name}
                    {isCurrentUser ? ' (You)' : ''}
                  </Text>
                  <Text style={styles.userId}>
                    {getRankForXp(item.totalXp).emoji} {getRankForXp(item.totalXp).name}
                  </Text>
                </View>
                <View style={styles.statsColumn}>
                  <Text style={styles.xpValue}>{item.totalXp} XP</Text>
                  <Text style={styles.badgeValue}>🏅 {item.badgeCount}</Text>
                </View>
              </View>
            );
          }}
        />
      ) : viewMode === 'rank' ? (
        <FlatList
          data={rankCounts}
          keyExtractor={(item) => String(item.level)}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ListHeaderComponent={
            <View style={styles.myRankCard}>
              <Text style={styles.myRankLabel}>Your rank</Text>
              <Text style={styles.myRankName}>
                {myRank.emoji} {myRank.name}
              </Text>
              <Text style={styles.myRankNext}>
                {myNextRank
                  ? `${myNextRank.xpNeeded.toLocaleString()} XP to ${myNextRank.emoji} ${myNextRank.name}`
                  : 'Top rank reached'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isMyRank = item.level === myRank.level;
            const share = users.length > 0 ? item.playerCount / users.length : 0;
            const shownNames = item.players.slice(0, 5).map((player) => player.name);
            const hiddenCount = item.players.length - shownNames.length;
            return (
              <View style={[styles.rankRow, isMyRank && styles.rowHighlighted]}>
                <View style={styles.rankRowTop}>
                  <Text style={styles.rankEmoji}>{item.emoji}</Text>
                  <View style={styles.rowInfo}>
                    <Text style={styles.name}>
                      {item.name}
                      {isMyRank ? ' (You)' : ''}
                    </Text>
                    <Text style={styles.userId}>From {item.minXp.toLocaleString()} XP</Text>
                  </View>
                  <View style={styles.statsColumn}>
                    <Text style={styles.rankCount}>{item.playerCount}</Text>
                    <Text style={styles.badgeValue}>
                      player{item.playerCount === 1 ? '' : 's'}
                    </Text>
                  </View>
                </View>
                <View style={styles.rankBarTrack}>
                  <View style={[styles.rankBarFill, { width: `${share * 100}%` }]} />
                </View>
                {shownNames.length > 0 && (
                  <Text style={styles.rankNames} numberOfLines={2}>
                    {shownNames.join(', ')}
                    {hiddenCount > 0 ? ` and ${hiddenCount} more` : ''}
                  </Text>
                )}
              </View>
            );
          }}
        />
      ) : (
        <FlatList
          data={parishRankings}
          keyExtractor={(item) => item.parish}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item, index }) => {
            const isCurrentUserParish = item.parish === state.parish;
            return (
              <View
                style={[
                  styles.row,
                  index === 0 && styles.parishCardTop,
                  isCurrentUserParish && index !== 0 && styles.rowHighlighted,
                ]}
              >
                <Text style={styles.rank}>
                  {index < 3 ? RANK_MEDALS[index] : `#${index + 1}`}
                </Text>
                <View style={styles.rowInfo}>
                  <Text style={styles.name}>
                    {item.parish}
                    {isCurrentUserParish ? ' (Yours)' : ''}
                  </Text>
                  <Text style={styles.userId}>
                    {item.userCount} user{item.userCount === 1 ? '' : 's'}
                  </Text>
                </View>
                <View style={styles.statsColumn}>
                  <Text style={styles.xpValue}>{item.totalXp.toLocaleString()} XP</Text>
                  <Text style={styles.badgeValue}>🏅 {item.totalBadges}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.backgroundGreenD,
  },
  toggleText: {
    color: COLORS.textGray,
    fontWeight: 'bold',
    fontSize: 13,
  },
  toggleTextActive: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 13,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 12,
  },
  loadingText: {
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rowHighlighted: {
    borderWidth: 2,
    borderColor: COLORS.backgroundGreenD,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 44,
    color: COLORS.textDark,
  },
  rowInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  userId: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  statsColumn: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  badgeValue: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  myRankCard: {
    backgroundColor: COLORS.backgroundGreen,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  myRankLabel: {
    fontSize: 12,
    color: COLORS.textCream,
    marginBottom: 2,
  },
  myRankName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  myRankNext: {
    fontSize: 13,
    color: COLORS.textWhite,
    marginTop: 4,
  },
  rankRow: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rankRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 26,
    width: 44,
  },
  rankCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  rankBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.backgroundGreenL,
    marginTop: 10,
    overflow: 'hidden',
  },
  rankBarFill: {
    height: '100%',
    backgroundColor: COLORS.borderYellow,
  },
  rankNames: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 8,
  },
  parishCardTop: {
    borderWidth: 1,
    borderColor: COLORS.borderYellow,
    backgroundColor: COLORS.backgroundYellow,
  },
});