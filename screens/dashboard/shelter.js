// ShelterMapScreen.js
//
// Shows the user's current location, the nearest emergency shelters from
// services/shelters.js, and an actual road route (via OSRM) to whichever
// one is currently selected. Shows up to 5 nearby shelters rather than just
// the single closest one, since the nearest shelter could be full, closed,
// or have a blocked access road during a real event - having an easy way to
// see and switch to an alternative matters here.

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  getCurrentUserLocation,
  findNearestShelters,
  fetchRoadRoute,
} from '../../services/locationApi';
import { COLORS } from '../../theme/colors';

const SHELTER_COUNT = 5;

export default function ShelterScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyShelters, setNearbyShelters] = useState([]); // [{shelter, straightLineDistanceKm}]
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [route, setRoute] = useState(null);
  const [travelMode, setTravelMode] = useState('driving');
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Loads the user's position and the list of nearby shelters. Only runs on
  // initial load / manual refresh - selecting a different shelter from the
  // list does NOT re-run this, just re-fetches the route (see below).
  const loadUserAndShelters = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const position = await getCurrentUserLocation();
      setUserLocation(position);

      const shelters = findNearestShelters(
        position.latitude,
        position.longitude,
        SHELTER_COUNT
      );
      setNearbyShelters(shelters);
      setSelectedIndex(0); // default to nearest
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  }, []);

  // Fetches the road route to whichever shelter is currently selected.
  // Separate from loadUserAndShelters so switching shelters doesn't require
  // re-fetching GPS position or re-sorting the shelter list.
  const loadRouteToSelected = useCallback(async () => {
    if (!userLocation || nearbyShelters.length === 0) return;

    const { shelter } = nearbyShelters[selectedIndex];
    setIsRouteLoading(true);

    try {
      const roadRoute = await fetchRoadRoute(
        userLocation.latitude,
        userLocation.longitude,
        shelter.latitude,
        shelter.longitude,
        travelMode
      );
      setRoute(roadRoute);
    } catch {
      // Road routing failing shouldn't block showing the map - fall back to
      // no drawn route, straight-line distance still shown in the info card.
      setRoute(null);
    }

    setIsRouteLoading(false);
  }, [userLocation, nearbyShelters, selectedIndex, travelMode]);

  useEffect(() => {
    loadUserAndShelters();
  }, [loadUserAndShelters]);

  useEffect(() => {
    loadRouteToSelected();
  }, [loadRouteToSelected]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.textGreen} />
        <Text style={styles.loadingText}>Finding nearby shelters...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={loadUserAndShelters}>
          <Text style={styles.actionButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selected = nearbyShelters[selectedIndex];

  return (
    <View style={styles.screenContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation
      >
        {nearbyShelters.map((entry, index) => (
          <Marker
            key={`${index}-${selectedIndex === index}`}
            coordinate={entry.shelter}
            title={entry.shelter.name}
            description={`${entry.shelter.community} - ${entry.shelter.type}`}
            pinColor={index === selectedIndex ? COLORS.marker : COLORS.backgroundGreenD}
            onPress={() => setSelectedIndex(index)}
          />
        ))}

        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeColor={COLORS.routeYellow}
            strokeWidth={6}
          />
        )}
      </MapView>

      {/* Horizontal picker for the nearby shelters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.shelterList}
        contentContainerStyle={styles.shelterListContent}
      >
        {nearbyShelters.map((entry, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.shelterChip, isSelected && styles.shelterChipSelected]}
              onPress={() => setSelectedIndex(index)}
            >
              <Text
                style={[
                  styles.shelterChipName,
                  isSelected && styles.shelterChipNameSelected,
                ]}
                numberOfLines={1}
              >
                {entry.shelter.name}
              </Text>
              <Text
                style={[
                  styles.shelterChipDistance,
                  isSelected && styles.shelterChipDistanceSelected,
                ]}
              >
                {entry.straightLineDistanceKm} km
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.infoCard}>
        <Text style={styles.shelterName}>{selected.shelter.name}</Text>
        <Text style={styles.shelterDetail}>
          {selected.shelter.community} - {selected.shelter.type}
        </Text>

        <View style={styles.modeToggleRow}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              travelMode === 'driving' && styles.modeButtonActive,
            ]}
            onPress={() => setTravelMode('driving')}
          >
            <Text
              style={[
                styles.modeButtonText,
                travelMode === 'driving' && styles.modeButtonTextActive,
              ]}
            >
              🚗 Driving
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              travelMode === 'walking' && styles.modeButtonActive,
            ]}
            onPress={() => setTravelMode('walking')}
          >
            <Text
              style={[
                styles.modeButtonText,
                travelMode === 'walking' && styles.modeButtonTextActive,
              ]}
            >
              🚶 Walking
            </Text>
          </TouchableOpacity>
        </View>

        {isRouteLoading ? (
          <View style={styles.routeLoadingRow}>
            <ActivityIndicator size="small" color={COLORS.textGreen} />
            <Text style={styles.routeLoadingText}>Getting route...</Text>
          </View>
        ) : route ? (
          <Text style={styles.distanceText}>
            {route.distanceKm} km {travelMode === 'walking' ? 'on foot' : 'by road'}{' '}
            (~{route.durationMinutes} min {travelMode === 'walking' ? 'walk' : 'drive'})
          </Text>
        ) : (
          <>
            <Text style={styles.distanceText}>
              ~{selected.straightLineDistanceKm} km straight-line distance
            </Text>
            <Text style={styles.offlineNote}>
              Road route and map imagery need an internet connection - if
              you're offline, this shelter's location and straight-line
              distance above are still accurate.
            </Text>
          </>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={loadUserAndShelters}>
          <Text style={styles.actionButtonText}>Refresh My Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textDark,
  },
  errorText: {
    color: COLORS.textOrange,
    textAlign: 'center',
    marginBottom: 16,
  },
  shelterList: {
    backgroundColor: COLORS.backgroundCream,
    maxHeight: 64,
  },
  shelterListContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  shelterChip: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
  },
  shelterChipSelected: {
    backgroundColor: COLORS.backgroundGreen,
    borderColor: COLORS.borderGreen,
  },
  shelterChipName: {
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontSize: 13,
  },
  shelterChipNameSelected: {
    color: COLORS.textWhite,
  },
  shelterChipDistance: {
    color: COLORS.textGray,
    fontSize: 12,
    marginTop: 2,
  },
  shelterChipDistanceSelected: {
    color: COLORS.textCream,
  },
  infoCard: {
    backgroundColor: COLORS.backgroundWhite,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  shelterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textGreen,
  },
  shelterDetail: {
    color: COLORS.textDark,
    marginTop: 2,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCream,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
  },
  modeButtonActive: {
    backgroundColor: COLORS.backgroundGreen,
    borderColor: COLORS.borderGreen,
  },
  modeButtonText: {
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  modeButtonTextActive: {
    color: COLORS.textWhite,
  },
  distanceText: {
    color: COLORS.textDark,
    marginTop: 8,
    fontWeight: 'bold',
  },
  offlineNote: {
    color: COLORS.textGray,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  routeLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  routeLoadingText: {
    color: COLORS.textDark,
  },
  actionButton: {
    marginTop: 12,
    backgroundColor: COLORS.backgroundGreen,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
});