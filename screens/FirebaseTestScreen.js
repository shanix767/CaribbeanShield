// screens/FirebaseTestScreen.js
//
// TEMPORARY - just confirms the Firebase native module initialized
// correctly on-device. Delete this file and its tab in App.js once
// confirmed working; this isn't part of the real app.

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getApp } from '@react-native-firebase/app';

export default function FirebaseTestScreen() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      {details && (
        <Text style={styles.details}>{JSON.stringify(details, null, 2)}</Text>
      )}
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
});