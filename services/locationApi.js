// locationApi.js
//
// Handles three things for the shelter map:
//   1. Getting the user's current GPS position (expo-location)
//   2. Finding the nearest shelter from services/shelters.js by straight-line
//      distance
//   3. Fetching an actual road route from the user to that shelter, via
//      OSRM's free public routing server
//
// IMPORTANT LIMITATION: OSRM's public demo server (router.project-osrm.org)
// is meant for light/testing use, not production traffic - there's no
// uptime guarantee and it can be slow or rate-limited under heavy use. Fine
// for a coursework app, but if this app grows real users, a paid routing
// provider (Mapbox, Google Directions) would be the more reliable choice.

import * as Location from "expo-location";
import { SHELTERS } from "./shelters";

const OSRM_ROUTE_URL = "https://router.project-osrm.org/route/v1/driving";

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS_KM = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

async function fetchWithTimeout(url, timeoutMs = 10000) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: abortController.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Asks for location permission (if not already granted) and returns the
// user's current coordinates. Throws if permission is denied.
export async function getCurrentUserLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission was not granted");
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

// Finds the N closest shelters (straight-line) to a given position, sorted
// nearest-first. Used to offer alternatives in case the single nearest
// shelter turns out to be full, closed, or its access road is blocked.
export function findNearestShelters(userLatitude, userLongitude, count = 5) {
  const withDistances = SHELTERS.map((shelter) => ({
    shelter,
    straightLineDistanceKm:
      Math.round(
        haversineDistanceKm(
          userLatitude,
          userLongitude,
          shelter.latitude,
          shelter.longitude
        ) * 10
      ) / 10,
  }));

  withDistances.sort((a, b) => a.straightLineDistanceKm - b.straightLineDistanceKm);

  return withDistances.slice(0, count);
}

// Finds just the closest shelter - thin wrapper around findNearestShelters
// for callers that only need the single nearest one.
export function findNearestShelter(userLatitude, userLongitude) {
  const [nearest] = findNearestShelters(userLatitude, userLongitude, 1);
  return nearest;
}

// Fetches an actual road route between two points from OSRM, returning the
// route's coordinates (for drawing on the map) plus real driving distance
// and duration.
export async function fetchRoadRoute(fromLat, fromLon, toLat, toLon) {
  // OSRM wants "longitude,latitude" order, opposite of how most APIs do it.
  const requestUrl =
    `${OSRM_ROUTE_URL}/${fromLon},${fromLat};${toLon},${toLat}` +
    `?overview=full&geometries=geojson`;

  const response = await fetchWithTimeout(requestUrl);

  if (!response.ok) {
    throw new Error(`OSRM request failed with status ${response.status}`);
  }

  const routeData = await response.json();

  if (routeData.code !== "Ok" || !routeData.routes?.length) {
    throw new Error("No road route found between these points");
  }

  const route = routeData.routes[0];

  // GeoJSON coordinates come as [lon, lat] pairs - react-native-maps wants
  // {latitude, longitude} objects, so flip them here.
  const routeCoordinates = route.geometry.coordinates.map(([lon, lat]) => ({
    latitude: lat,
    longitude: lon,
  }));

  return {
    coordinates: routeCoordinates,
    distanceKm: Math.round((route.distance / 1000) * 10) / 10,
    durationMinutes: Math.round(route.duration / 60),
  };
}