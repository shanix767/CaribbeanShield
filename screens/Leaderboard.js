// screens/Leaderboard.js
//
// Fetches every user's XP and badge count from Firestore, ranks by XP,
// and highlights the current device's own row. Reads once on mount and
// on pull-to-refresh - this is a small-scale evaluation study (n=5
// target participants), not a live-updating social feature, so there's
// no need for a real-time Firestore listener here.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../context/GameContext';
import { fetchAllUsersForLeaderboard } from '../services/firestoreUsers';
import { COLORS } from '../theme/colors';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const { state } = useGameContext();
  const [users, setUsers] = useState([]);
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Leaderboard</Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : users.length === 0 ? (
        <Text style={styles.emptyText}>
          No users found yet - this may mean no one's progress has synced, or Firestore
          couldn't be reached. Pull down to try again.
        </Text>
      ) : (
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
                </View>
                <View style={styles.statsColumn}>
                  <Text style={styles.xpValue}>{item.totalXp} XP</Text>
                  <Text style={styles.badgeValue}>🏅 {item.badgeCount}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
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
    marginBottom: 16,
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
});