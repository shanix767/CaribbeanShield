// screens/SideMissionPlayer.js
//
// Plays a single side mission's checklist — reuses components/activities/
// Checklist.js directly, same pattern as the pretest reusing Quiz.js. On
// submit, awards the badge regardless of how many items were checked —
// side missions are self-reported real-world tasks ("did you build a
// kit"), so the badge rewards the act of doing the task honestly, not a
// perfect-accuracy result the way the main mission's knowledge tests do.

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../context/GameContext';
import { SIDE_MISSIONS } from '../missionContent/sideMissions';
import Checklist from '../components/activities/Checklist';
import { COLORS } from '../theme/colors';

export default function SideMissionPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { sideMissionId } = route.params;
  const { dispatch } = useGameContext();

  const sideMission = SIDE_MISSIONS[sideMissionId];

  function handleComplete(earnedXp) {
    dispatch({
      type: 'COMPLETE_SIDE_MISSION',
      sideMissionId,
      xpReward: earnedXp,
      badgeId: sideMission.badgeId,
    });
    // Home is a tab nested inside MainTabs, not a direct sibling of this
    // stack screen — needs the { screen, params } nested-navigator form,
    // not a plain navigate('Home', ...).
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {
        justEarnedBadges: [{ badgeId: sideMission.badgeId, badgeName: sideMission.badgeName }],
      },
    });
  }

  if (!sideMission) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Side mission not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {sideMission.icon} {sideMission.title}
        </Text>
      </SafeAreaView>

      <Checklist
        activity={{
          id: sideMission.id,
          title: sideMission.title,
          xpReward: sideMission.xpReward,
          content: sideMission.content,
        }}
        onComplete={handleComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});