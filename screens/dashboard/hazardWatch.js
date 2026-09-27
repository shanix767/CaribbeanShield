import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { fetchHurricaneWatchData } from '../../services/hurricaneApi';
import { fetchRecentEarthquakes } from '../../services/earthquakeApi';
import { fetchWeeklyVolcanoActivity } from '../../services/volcanoApi';
import { fetchRecentFloodAlerts } from '../../services/floodApi';
import { TEST_STORM, TEST_EARTHQUAKES, TEST_VOLCANOES, TEST_FLOODS } from '../../services/testData';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { TEST_MODE } from '../../testMode';

// Distance bands are just a rough visual cue, not an official watch/warning -
// see the note rendered on the storms card below.
function proximityLabel(distanceKm) {
  if (distanceKm == null) return null;
  if (distanceKm < 800) return { text: 'Close - worth tracking closely', color: COLORS.textOrange };
  if (distanceKm < 2000) return { text: 'Moderate distance', color: COLORS.textGray };
  return { text: 'Far from Dominica', color: COLORS.textGreen };
}

// Turns a raw fetch error into something a participant can understand.
// With no connection the phone reports low-level errors such as
// "java.net.UnknownHostException", which mean nothing to a user.
function friendlyFetchError(sourceName, errorMessage) {
  const message = String(errorMessage || '');
  const looksOffline = /UnknownHost|Unable to resolve|Network request failed|fetch failed|timed? ?out|abort/i.test(
    message
  );
  if (looksOffline) {
    return `No internet connection. ${sourceName} data will load when you're back online - pull down to refresh.`;
  }
  return `Couldn't reach ${sourceName} right now. Pull down to try again.`;
}

export default function HazardWatchScreen() {
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
      <View style={styles.screenContainer}>
      <ScreenHeader
        title="Hazard Watch"
        subtitle="Hurricanes, earthquakes, volcanoes and floods"
      />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={COLORS.textGreen} />
          <Text style={styles.loadingText}>Checking for hazards...</Text>
        </View>
      </View>
    );
  }

  const hasActiveStorms = watchData?.storms?.length > 0;

  return (
    <View style={styles.screenContainer}>
      <ScreenHeader
        title="Hazard Watch"
        subtitle="Hurricanes, earthquakes, volcanoes and floods"
      />
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadWatchData(true)}
            colors={[COLORS.textGreen]}
          />
        }
      >
        {/* Active storms section */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Atlantic Basin</Text>

          {watchData.stormsError && (
            <Text style={styles.errorText}>
              {friendlyFetchError('Hurricane (NHC)', watchData.stormsError)}
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
              {friendlyFetchError('Weather', watchData.conditionsError)}
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
              {friendlyFetchError('Earthquake (USGS)', earthquakesError)}
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
              {friendlyFetchError('Volcano (GVP)', volcanicReportsError)}
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
              {friendlyFetchError('Flood (GDACS)', floodsError)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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