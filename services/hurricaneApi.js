// hurricaneApi.js
//
// Pulls two pieces of hurricane-relevant data for CaribbeanShield:
//   1. NHC's CurrentStorms.json — structured data (not prose) on any active
//      Atlantic tropical system: name, category, wind speed, movement.
//   2. OpenWeatherMap current conditions for Dominica — local wind/rain/pressure.
//
// IMPORTANT LIMITATION: NHC's JSON does NOT list which islands are under an
// official watch/warning — that detail only exists in the prose public
// advisory or in NHC's GIS map layers, neither of which is practical to parse
// here. Instead, we calculate straight-line distance from each storm to
// Dominica ourselves. This is a rough proximity estimate, NOT an official
// watch/warning determination — the screen must make that distinction clear
// to the user, with a link to the real advisory for anything official.

const CURRENT_STORMS_URL = "https://www.nhc.noaa.gov/CurrentStorms.json";

// TODO: move this to an env variable (e.g. via expo-constants + app.config.js)
// before this ships anywhere public — an OpenWeatherMap key is free but should
// still not be hardcoded in source control.
const OPENWEATHER_API_KEY = "92e6529cafbdb2c16607344a1494daf8 ";

// Roseau, Dominica — used both as the weather lookup point and as the
// reference point for storm-distance calculations.
const DOMINICA_LAT = 15.3017;
const DOMINICA_LON = -61.388;

// NHC's two-letter classification codes, expanded to plain English.
const CLASSIFICATION_LABELS = {
  TD: "Tropical Depression",
  TS: "Tropical Storm",
  HU: "Hurricane",
  EX: "Post-Tropical Cyclone",
  SD: "Subtropical Depression",
  SS: "Subtropical Storm",
  LO: "Low Pressure System",
  DB: "Disturbance",
};

// Standard Saffir-Simpson category thresholds, in mph sustained wind.
function hurricaneCategoryFromWindMph(windMph) {
  if (windMph == null) return null;
  if (windMph >= 157) return 5;
  if (windMph >= 130) return 4;
  if (windMph >= 111) return 3;
  if (windMph >= 96) return 2;
  if (windMph >= 74) return 1;
  return null; // below hurricane strength
}

// Straight-line ("great circle") distance between two lat/lon points, in km.
// This ignores landmasses and storm forecast track entirely — it's just how
// far away the storm's current center is right now, as a rough proximity signal.
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

// Without a timeout, a slow or unreachable feed leaves the screen spinning
// forever — this wraps fetch so it gives up after a fixed wait instead.
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: abortController.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Fetches NHC's active storm list and reshapes each entry into the fields
// this app actually displays, plus a computed distance from Dominica.
export async function fetchActiveAtlanticStorms() {
  const response = await fetchWithTimeout(CURRENT_STORMS_URL);

  if (!response.ok) {
    throw new Error(`NHC request failed with status ${response.status}`);
  }

  const currentStormsData = await response.json();
  const rawStormList = currentStormsData.activeStorms || [];

  return rawStormList.map((storm) => {
    const windMph = storm.intensity != null ? Number(storm.intensity) : null;
    const category = hurricaneCategoryFromWindMph(windMph);

    const stormLat = Number(storm.latitudeNumeric);
    const stormLon = Number(storm.longitudeNumeric);
    const distanceFromDominicaKm =
      Number.isFinite(stormLat) && Number.isFinite(stormLon)
        ? Math.round(haversineDistanceKm(DOMINICA_LAT, DOMINICA_LON, stormLat, stormLon))
        : null;

    return {
      name: storm.name,
      classificationCode: storm.classification,
      classificationLabel:
        CLASSIFICATION_LABELS[storm.classification] || storm.classification,
      category, // null if not hurricane-strength
      windMph,
      movement:
        storm.movementDir && storm.movementSpeed
          ? `${storm.movementDir} at ${storm.movementSpeed} mph`
          : null,
      lastUpdate: storm.lastUpdate,
      publicAdvisoryUrl: storm.publicAdvisoryUrl || null,
      distanceFromDominicaKm,
    };
  });
}

// Fetches current weather conditions for Dominica from OpenWeatherMap.
export async function fetchDominicaConditions() {
  const requestUrl =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${DOMINICA_LAT}&lon=${DOMINICA_LON}` +
    `&units=metric&appid=${OPENWEATHER_API_KEY}`;

  const response = await fetchWithTimeout(requestUrl);

  if (!response.ok) {
    throw new Error(`OpenWeatherMap request failed with status ${response.status}`);
  }

  const weatherData = await response.json();

  return {
    description: weatherData.weather?.[0]?.description ?? "Unknown",
    temperatureCelsius: weatherData.main?.temp,
    windSpeedMetersPerSecond: weatherData.wind?.speed,
    humidityPercent: weatherData.main?.humidity,
    observedAt: weatherData.dt, // unix timestamp
  };
}

// Convenience function the screen calls once — runs both requests together
// and keeps the two results separate so one failing doesn't hide the other.
export async function fetchHurricaneWatchData() {
  const [stormsResult, conditionsResult] = await Promise.allSettled([
    fetchActiveAtlanticStorms(),
    fetchDominicaConditions(),
  ]);

  return {
    storms: stormsResult.status === "fulfilled" ? stormsResult.value : [],
    stormsError: stormsResult.status === "rejected" ? stormsResult.reason.message : null,
    conditions: conditionsResult.status === "fulfilled" ? conditionsResult.value : null,
    conditionsError:
      conditionsResult.status === "rejected" ? conditionsResult.reason.message : null,
  };
}