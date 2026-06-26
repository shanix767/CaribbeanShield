//Home Screen

import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useGame } from '../../context/GameContext';

export default function HomeScreen() {
  const { loaded, level, levelName, readiness, xp } = useGame();

  //Prevent loading missing data
  if (!loaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading CaribbeanShield...</Text>
      </View>
    );
  }

  //Main screen content
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CaribbeanShield</Text>
      <Text style={styles.subtitle}>Be ready. Stay Safe.Protect your community.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your preparedness level</Text>
        <Text style={styles.level}>
          Level {level}: {levelName}
        </Text>
        <Text style={styles.details}>XP: {xp}</Text>
        <Text style={styles.details}>Readiness: {readiness}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 24,
    justifyContent: 'center',
  },
  
  loading: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.green,
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 28,
  },
  
  card: {
    backgroundColor: Colors.card,
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  label: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 8,
  },
  
  level: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  
  details: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 4,
  },
});