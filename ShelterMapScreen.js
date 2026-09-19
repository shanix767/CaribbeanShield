// ShelterMapScreen.js
//
// Shows the user's current location, the nearest emergency shelter from
// services/shelters.js, and an actual road route (via OSRM) between them —
// not just a straight line, so distance/time estimates are realistic for
// someone actually driving there.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  getCurrentUserLocation,
  findNearestShelter,
  fetchRoadRoute,
} from './services/locationApi';
import { COLORS } from './theme/colors';

export default function ShelterMapScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestShelter, setNearestShelter] = useState(null);
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadShelterRoute = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const position = await getCurrentUserLocation();
      setUserLocation(position);

      const { shelter, straightLineDistanceKm } = findNearestShelter(
        position.latitude,
        position.longitude
      );
      setNearestShelter({ ...shelter, straightLineDistanceKm });

      try {
        const roadRoute = await fetchRoadRoute(
          position.latitude,
          position.longitude,
          shelter.latitude,
          shelter.longitude
        );
        setRoute(roadRoute);
      } catch (routeError) {
        // Road routing failing shouldn't block showing the map and shelter —
        // just fall back to no drawn route, straight-line distance still shown.
        setRoute(null);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadShelterRoute();
  }, [loadShelterRoute]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.forestGreen} />
        <Text style={styles.loadingText}>Finding your nearest shelter...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadShelterRoute}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={nearestShelter}
          title={nearestShelter.name}
          description={`${nearestShelter.community} — ${nearestShelter.type}`}
          pinColor={COLORS.marker}
        />

        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeColor={COLORS.routeYellow}
            strokeWidth={6}
          />
        )}
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.shelterName}>{nearestShelter.name}</Text>
        <Text style={styles.shelterDetail}>
          {nearestShelter.community} — {nearestShelter.type}
        </Text>

        {route ? (
          <Text style={styles.distanceText}>
            {route.distanceKm} km by road (~{route.durationMinutes} min drive)
          </Text>
        ) : (
          <>
            <Text style={styles.distanceText}>
              ~{nearestShelter.straightLineDistanceKm} km straight-line distance
            </Text>
            <Text style={styles.offlineNote}>
              Road route and map imagery need an internet connection — if
              you're offline, this shelter's location and straight-line
              distance above are still accurate.
            </Text>
          </>
        )}

        <TouchableOpacity style={styles.retryButton} onPress={loadShelterRoute}>
          <Text style={styles.retryButtonText}>Refresh My Location</Text>
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
    backgroundColor: COLORS.backgroundWhite,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textDark,
  },
  errorText: {
    color: COLORS.textRed,
    textAlign: 'center',
    marginBottom: 16,
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
  distanceText: {
    color: COLORS.textDark,
    marginTop: 8,
    fontWeight: 'bold',
  },
  offlineNote: {
    color: '#6B6B6B',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: COLORS.textGreen,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
});