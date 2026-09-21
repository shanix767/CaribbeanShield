// hurricane-watch.js
//
// Single-screen view for CaribbeanShield's hurricane data. Shows:
//   - Whether there's an active tropical system anywhere in the Atlantic
//   - Current local conditions in Dominica
//
// Kept intentionally simple for now - this is the first real API integration
// for the Hurricane Ready mission line (Phase 2). Loading/error/data states
// only; no caching or retry logic yet.

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
//import { useFocusEffect } from "expo-router";
import { fetchHurricaneWatchData } from "../services/hurricaneApi";
import { COLORS } from "../theme/colors";


export default function HurricaneWatchScreen() {
  const [watchData, setWatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWatchData = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const result = await fetchHurricaneWatchData();
    setWatchData(result);

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // useFocusEffect, not useEffect - tab/stack screens stay mounted in
  // React Navigation, so this re-runs the fetch each time the screen
  // is opened rather than only on first mount.
  // useFocusEffect(
  //   useCallback(() => {
  //     loadWatchData();
  //   }, [loadWatchData])
  // );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.forestGreen} />
        <Text style={styles.loadingText}>Checking the Atlantic...</Text>
      </View>
    );
  }

  const hasActiveStorms = watchData?.storms?.length > 0;

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => loadWatchData(true)}
          colors={[COLORS.forestGreen]}
        />
      }
    >
      <Text style={styles.screenTitle}>Hurricane Watch</Text>

      {/* Active storms section */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Atlantic Basin</Text>

        {watchData.stormsError && (
          <Text style={styles.errorText}>
            Couldn't reach NHC right now: {watchData.stormsError}
          </Text>
        )}

        {!watchData.stormsError && !hasActiveStorms && (
          <Text style={styles.calmText}>No active tropical systems.</Text>
        )}

        {!watchData.stormsError &&
          hasActiveStorms &&
          watchData.storms.map((storm, index) => (
            <View key={index} style={styles.stormRow}>
              <Text style={styles.stormTitle}>{storm.title}</Text>
              <Text style={styles.stormSummary}>{storm.summary}</Text>
            </View>
          ))}
      </View>

      {/* Local conditions section */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Dominica Right Now</Text>

        {watchData.conditionsError && (
          <Text style={styles.errorText}>
            Couldn't reach OpenWeatherMap: {watchData.conditionsError}
          </Text>
        )}

        {watchData.conditions && (
          <View>
            <Text style={styles.conditionLine}>
              {watchData.conditions.description}
            </Text>
            <Text style={styles.conditionLine}>
              {watchData.conditions.temperatureCelsius}°C
            </Text>
            <Text style={styles.conditionLine}>
              Wind: {watchData.conditions.windSpeedMetersPerSecond} m/s
            </Text>
            <Text style={styles.conditionLine}>
              Humidity: {watchData.conditions.humidityPercent}%
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundwWhite,
  },
  scrollContent: {
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundWhite,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textDark,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.forestGreen,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  calmText: {
    color: COLORS.textDark,
  },
  errorText: {
    color: COLORS.textRed,
  },
  stormRow: {
    marginBottom: 10,
  },
  stormTitle: {
    fontWeight: "bold",
    color: COLORS.textOrange,
  },
  stormSummary: {
    color: COLORS.textDark,
    marginTop: 2,
  },
  conditionLine: {
    color: COLORS.textDark,
    marginBottom: 4,
  },
});