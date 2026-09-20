import { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { fetchHurricaneWatchData } from './services/hurricaneApi';
import { fetchRecentEarthquakes } from './services/earthquakeApi';
import { fetchWeeklyVolcanoActivity } from './services/volcanoApi';
import { fetchRecentFloodAlerts } from './services/floodApi';
import { TEST_STORM, TEST_EARTHQUAKES, TEST_VOLCANOES, TEST_FLOODS } from './services/testData';
import ShelterMapScreen from './ShelterMapScreen';
import {
  requestNotificationPermission,
  checkForHazardChangesAndNotify,
} from './services/notifications';
import { COLORS } from './theme/colors';

// Flip any of these to true to preview that card with sample alert data
// instead of waiting for a real event. Leave all false for normal live data.
const TEST_MODE = {
  hurricane: false,
  earthquake: false,
  volcano: false,
  flood: false,
};

// Distance bands are just a rough visual cue, not an official watch/warning -
// see the note rendered on the storms card below.
function proximityLabel(distanceKm) {
  if (distanceKm == null) return null;
  if (distanceKm < 800) return { text: 'Close - worth tracking closely', color: COLORS.textOrange };
  if (distanceKm < 2000) return { text: 'Moderate distance', color: COLORS.textGray };
  return { text: 'Far from Dominica', color: COLORS.textGreen };
}

function HazardDashboard() {
  const [watchData, setWatchData] = useState(null);
  const [earthquakes, setEarthquakes] = useState([]);
  const [earthquakesError, setEarthquakesError] = useState(null);
  const [volcanicReports, setVolcanicReports] = useState([]);
  const [volcanicReportsError, setVolcanicReportsError] = useState(null);
  const [floods, setFloods] = useState([]);
  const [floodsError, setFloodsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWatchData = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const [hurricaneResult, earthquakeResult, volcanoResult, floodResult] =
      await Promise.allSettled([
        fetchHurricaneWatchData(),
        fetchRecentEarthquakes(),
        fetchWeeklyVolcanoActivity(),
        fetchRecentFloodAlerts(),
      ]);

    const finalStorms = TEST_MODE.hurricane
      ? TEST_STORM
      : hurricaneResult.status === 'fulfilled' ? hurricaneResult.value : null;
    const finalEarthquakes = TEST_MODE.earthquake
      ? TEST_EARTHQUAKES
      : earthquakeResult.status === 'fulfilled' ? earthquakeResult.value : [];
    const finalVolcanicReports = TEST_MODE.volcano
      ? TEST_VOLCANOES
      : volcanoResult.status === 'fulfilled' ? volcanoResult.value : [];
    const finalFloods = TEST_MODE.flood
      ? TEST_FLOODS
      : floodResult.status === 'fulfilled' ? floodResult.value : [];

    setWatchData(finalStorms);
    setEarthquakes(finalEarthquakes);
    setEarthquakesError(
      TEST_MODE.earthquake
        ? null
        : earthquakeResult.status === 'rejected' ? earthquakeResult.reason.message : null
    );
    setVolcanicReports(finalVolcanicReports);
    setVolcanicReportsError(
      TEST_MODE.volcano
        ? null
        : volcanoResult.status === 'rejected' ? volcanoResult.reason.message : null
    );
    setFloods(finalFloods);
    setFloodsError(
      TEST_MODE.flood
        ? null
        : floodResult.status === 'rejected' ? floodResult.reason.message : null
    );

    // Note: hazard-change detection and notifications happen once at the
    // top-level App component below (so the alert modal can appear
    // regardless of which tab is active), not here. A manual pull-to-refresh
    // updates the displayed data but does NOT re-trigger a notification
    // check - only app open does.

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadWatchData();
  }, [loadWatchData]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.textGreen} />
        <Text style={styles.loadingText}>Checking the Atlantic...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const hasActiveStorms = watchData?.storms?.length > 0;

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadWatchData(true)}
            colors={[COLORS.textGreen]}
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
            <Text style={styles.calmText}>
              🟢 No active tropical systems in the Atlantic.
            </Text>
          )}

          {!watchData.stormsError && hasActiveStorms && (
            <>
              <Text style={styles.disclaimerText}>
                Distance shown is a straight-line estimate, not an official
                watch or warning. Tap a storm for the real NHC advisory.
              </Text>

              {watchData.storms.map((storm, index) => {
                const proximity = proximityLabel(storm.distanceFromDominicaKm);
                return (
                  <View key={index} style={styles.stormRow}>
                    <Text style={styles.stormTitle}>
                      {storm.classificationLabel} {storm.name}
                      {storm.category ? ` - Category ${storm.category}` : ''}
                    </Text>

                    {storm.windMph != null && (
                      <Text style={styles.stormDetail}>
                        Max sustained winds: {storm.windMph} mph
                      </Text>
                    )}

                    {storm.movement && (
                      <Text style={styles.stormDetail}>
                        Moving {storm.movement}
                      </Text>
                    )}

                    {proximity && (
                      <Text style={[styles.stormDetail, { color: proximity.color }]}>
                        ~{storm.distanceFromDominicaKm} km from Dominica -{' '}
                        {proximity.text}
                      </Text>
                    )}

                    {storm.publicAdvisoryUrl && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(storm.publicAdvisoryUrl)}
                      >
                        <Text style={styles.advisoryLink}>
                          Read official NHC advisory →
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </>
          )}
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

        {/* Recent earthquakes section */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Recent Earthquakes (30 days)</Text>

          {earthquakesError && (
            <Text style={styles.errorText}>
              Couldn't reach USGS right now: {earthquakesError}
            </Text>
          )}

          {!earthquakesError && earthquakes.length === 0 && (
            <Text style={styles.calmText}>
              🟢 No earthquakes of magnitude 2.5+ within 500 km recently.
            </Text>
          )}

          {!earthquakesError &&
            earthquakes.length > 0 &&
            earthquakes.map((quake, index) => (
              <View key={index} style={styles.stormRow}>
                <Text style={styles.stormTitle}>
                  Magnitude {quake.magnitude.toFixed(1)}
                </Text>
                <Text style={styles.stormDetail}>{quake.place}</Text>
                <Text style={styles.stormDetail}>
                  {new Date(quake.occurredAt).toLocaleString()}
                </Text>
                <Text style={styles.stormDetail}>
                  ~{quake.distanceFromDominicaKm} km from Dominica
                </Text>
                {quake.hadTsunamiWarning && (
                  <Text style={[styles.stormDetail, { color: COLORS.textOrange }]}>
                    ⚠ Tsunami warning was issued for this event
                  </Text>
                )}
                <TouchableOpacity onPress={() => Linking.openURL(quake.detailsUrl)}>
                  <Text style={styles.advisoryLink}>View on USGS →</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {/* Regional volcanic activity section */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Regional Volcanic Activity</Text>

          {volcanicReportsError && (
            <Text style={styles.errorText}>
              Couldn't reach GVP right now: {volcanicReportsError}
            </Text>
          )}

          {!volcanicReportsError && (() => {
            const regionalReports = volcanicReports.filter((r) => r.isRegionallyRelevant);
            if (regionalReports.length === 0) {
              return (
                <Text style={styles.calmText}>
                  🟢 No reported activity at Caribbean-region volcanoes this
                  week ({volcanicReports.length} volcanoes reported worldwide).
                </Text>
              );
            }
            return regionalReports.map((report, index) => (
              <View key={index} style={styles.stormRow}>
                <Text style={styles.stormTitle}>{report.title}</Text>
                <Text style={styles.stormDetail}>{report.summary}</Text>
                {report.distanceFromDominicaKm != null && (
                  <Text style={styles.stormDetail}>
                    ~{report.distanceFromDominicaKm} km from Dominica
                  </Text>
                )}
                <TouchableOpacity onPress={() => Linking.openURL(report.detailsLink)}>
                  <Text style={styles.advisoryLink}>Read full GVP report →</Text>
                </TouchableOpacity>
              </View>
            ));
          })()}
        </View>

        {/* Regional flood alerts section */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Regional Flood Alerts (90 days)</Text>

          <Text style={styles.disclaimerText}>
            GDACS only tracks disaster-scale floods, not routine local
            flooding - "no alerts" here doesn't mean it's safe from ordinary
            heavy rain.
          </Text>

          {floodsError && (
            <Text style={styles.errorText}>
              Couldn't reach GDACS right now: {floodsError}
            </Text>
          )}

          {!floodsError && (() => {
            const regionalFloods = floods.filter((f) => f.isRegionallyRelevant);
            if (regionalFloods.length === 0) {
              return (
                <Text style={styles.calmText}>
                  🟢 No disaster-scale flood events reported in the region
                  ({floods.length} reported worldwide in the last 90 days).
                </Text>
              );
            }
            return regionalFloods.map((flood, index) => (
              <View key={index} style={styles.stormRow}>
                <Text style={styles.stormTitle}>
                  {flood.name} - {flood.country} ({flood.alertLevel})
                </Text>
                <Text style={styles.stormDetail}>{flood.summary}</Text>
                {flood.distanceFromDominicaKm != null && (
                  <Text style={styles.stormDetail}>
                    ~{flood.distanceFromDominicaKm} km from Dominica
                  </Text>
                )}
                {flood.reportUrl && (
                  <TouchableOpacity onPress={() => Linking.openURL(flood.reportUrl)}>
                    <Text style={styles.advisoryLink}>Read full GDACS report →</Text>
                  </TouchableOpacity>
                )}
              </View>
            ));
          })()}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCream,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textDark,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textGreen,
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
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  calmText: {
    color: COLORS.textDark,
  },
  errorText: {
    color: COLORS.textOrange,
  },
  disclaimerText: {
    color: COLORS.textGray,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  stormRow: {
    marginBottom: 14,
  },
  stormTitle: {
    fontWeight: 'bold',
    color: COLORS.textOrange,
    marginBottom: 2,
  },
  stormDetail: {
    color: COLORS.textDark,
    marginTop: 2,
  },
  advisoryLink: {
    color: COLORS.textGreen,
    marginTop: 6,
    fontWeight: 'bold',
  },
  conditionLine: {
    color: COLORS.textDark,
    marginBottom: 4,
  },
});

// Top-level App - toggles between the hazard dashboard and the shelter map.
// A full-screen map needs its own space rather than sitting inside a
// scrolling card, so this is a simple tab switch rather than adding either
// screen inside the other.
//
// This component ALSO independently fetches hazard data once, on app open,
// specifically to check for changes and show an in-app modal that appears
// no matter which tab the user is on - HazardDashboard's own fetch (for
// display) is separate, so the four hazard APIs do get called twice on
// open. Not the most efficient, but far lower-risk than restructuring
// HazardDashboard's already-working state management to share one fetch.
export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    async function checkForChangesOnAppOpen() {
      await requestNotificationPermission();

      const [hurricaneResult, earthquakeResult, volcanoResult, floodResult] =
        await Promise.allSettled([
          fetchHurricaneWatchData(),
          fetchRecentEarthquakes(),
          fetchWeeklyVolcanoActivity(),
          fetchRecentFloodAlerts(),
        ]);

      const storms = TEST_MODE.hurricane
        ? TEST_STORM.storms
        : hurricaneResult.status === 'fulfilled' ? hurricaneResult.value.storms : [];
      const earthquakes = TEST_MODE.earthquake
        ? TEST_EARTHQUAKES
        : earthquakeResult.status === 'fulfilled' ? earthquakeResult.value : [];
      const volcanicReports = TEST_MODE.volcano
        ? TEST_VOLCANOES
        : volcanoResult.status === 'fulfilled' ? volcanoResult.value : [];
      const floods = TEST_MODE.flood
        ? TEST_FLOODS
        : floodResult.status === 'fulfilled' ? floodResult.value : [];

      try {
        const changes = await checkForHazardChangesAndNotify({
          storms,
          earthquakes,
          volcanicReports,
          floods,
        });
        if (changes.length > 0) {
          setActiveAlerts(changes);
        }
      } catch {
        // Notifications are a nice-to-have - never block the app over this.
      }
    }

    checkForChangesOnAppOpen();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={topTabStyles.tabBar}>
        <TouchableOpacity
          style={[
            topTabStyles.tabButton,
            activeView === 'dashboard' && topTabStyles.tabButtonActive,
          ]}
          onPress={() => setActiveView('dashboard')}
        >
          <Text
            style={[
              topTabStyles.tabLabel,
              activeView === 'dashboard' && topTabStyles.tabLabelActive,
            ]}
          >
            Hazard Watch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            topTabStyles.tabButton,
            activeView === 'shelterMap' && topTabStyles.tabButtonActive,
          ]}
          onPress={() => setActiveView('shelterMap')}
        >
          <Text
            style={[
              topTabStyles.tabLabel,
              activeView === 'shelterMap' && topTabStyles.tabLabelActive,
            ]}
          >
            Nearest Shelter
          </Text>
        </TouchableOpacity>
      </View>

      {activeView === 'dashboard' ? <HazardDashboard /> : <ShelterMapScreen />}

      {/* App-wide alert modal - appears over whichever tab is active */}
      <Modal
        visible={activeAlerts.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveAlerts([])}
      >
        <View style={alertModalStyles.overlay}>
          <View style={alertModalStyles.card}>
            <View style={alertModalStyles.headerBand}>
              <Text style={alertModalStyles.heading}>⚠️ Hazard Update</Text>
            </View>

            {activeAlerts.map((alert, index) => (
              <View key={index} style={alertModalStyles.alertRow}>
                <Text style={alertModalStyles.alertTitle}>{alert.title}</Text>
                <Text style={alertModalStyles.alertBody}>{alert.body}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={alertModalStyles.dismissButton}
              onPress={() => setActiveAlerts([])}
            >
              <Text style={alertModalStyles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const alertModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  headerBand: {
    backgroundColor: COLORS.backgroundRed,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.borderRed,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  alertRow: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  alertBody: {
    color: COLORS.textDark,
    marginTop: 2,
  },
  dismissButton: {
    margin: 20,
    marginTop: 16,
    backgroundColor: COLORS.backgroundGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
});

const topTabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.backgroundCream,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
  },
  tabButtonActive: {
    backgroundColor: COLORS.backgroundGreen,
  },
  tabLabel: {
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  tabLabelActive: {
    color: COLORS.textWhite,
  },
});