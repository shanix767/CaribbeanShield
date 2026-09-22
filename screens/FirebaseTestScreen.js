// screens/FirebaseTestScreen.js
//
// TEMPORARY - Firebase init confirmation, plus a dev-only shortcut for
// testing downstream features (the badge popup, Badge Page) without
// grinding through all six real stages every test cycle. Delete this
// whole file and its tab in App.js once no longer needed; none of this
// is part of the real app.

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { useGameContext } from '../context/GameContext';
import { HURRICANE_MISSION_CONTENT } from '../missionContent/hurricane';

export default function FirebaseTestScreen() {
  const navigation = useNavigation();
  const { dispatch } = useGameContext();
  const [status, setStatus] = useState('Checking...');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    try {
      const app = getApp();
      setStatus('✅ Firebase initialized successfully');
      setDetails({
        name: app.name,
        projectId: app.options.projectId,
      });
    } catch (error) {
      setStatus('❌ Firebase failed to initialize');
      setDetails({ error: error.message });
    }
  }, []);

  // Bypasses the whole activity/stage flow and directly dispatches
  // COMPLETE_LEVEL, then navigates to MissionDetail with the same params
  // ActivityPlayerScreen would send on a real perfect score - so the
  // badge popup and Badge Page can be tested instantly without touching
  // the real gating logic at all.
  function handleForceEarnLevel1Badge() {
    const level1Content = HURRICANE_MISSION_CONTENT.levels[1];
    dispatch({
      type: 'COMPLETE_LEVEL',
      missionId: 'hurricaneReady',
      level: 1,
      badgeId: level1Content.badgeId,
    });
    navigation.navigate('MissionDetail', {
      missionId: 'hurricaneReady',
      justEarnedBadges: [
        { badgeId: level1Content.badgeId, badgeName: level1Content.badgeName },
      ],
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      {details && (
        <Text style={styles.details}>{JSON.stringify(details, null, 2)}</Text>
      )}

      <TouchableOpacity style={styles.devButton} onPress={handleForceEarnLevel1Badge}>
        <Text style={styles.devButtonText}>🛠 DEV: Force-earn Level 1 badge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2EDE4',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  details: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#2B2B2B',
  },
  devButton: {
    marginTop: 32,
    backgroundColor: '#8B4513',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  devButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});