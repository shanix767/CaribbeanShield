// floodApi.js
//
// Pulls flood events from GDACS (Global Disaster Alert and Coordination
// System) — a UN/EU-run global disaster monitoring system, free to query,
// no API key required.
//
// IMPORTANT LIMITATION: GDACS only tracks disaster-scale floods (events large
// enough to have meaningful population impact), not routine local flooding.
// For a small island like Dominica, this will often show "no alerts" even
// during ordinary heavy-rain flooding that never reaches GDACS's threshold.
// That's expected — this is a "is there a major regional flood event"
// check, not a substitute for local Met Office flood warnings.
//
// GDACS returns GeoJSON. Some events are mapped as a Point (a single
// coordinate) and some as a Polygon (an affected area) — distance is only
// calculated for Point events, since finding the nearest edge of a polygon
// is more complexity than this app needs right now.

const GDACS_SEARCH_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH";

const DOMINICA_LAT = 15.3017;
const DOMINICA_LON = -61.388;

// How far back to look, and how far out a flood counts as regionally relevant.
const LOOKBACK_DAYS = 90;
const REGIONAL_RELEVANCE_RADIUS_KM = 1500;

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0]; // GDACS wants YYYY-MM-DD
}

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

function stripHtmlTags(htmlText) {
  if (!htmlText) return "";
  return htmlText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Without a timeout, a slow or unreachable feed leaves the screen spinning
// forever — this wraps fetch so it gives up after a fixed wait instead.
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

export async function fetchRecentFloodAlerts() {
  const requestUrl =
    `${GDACS_SEARCH_URL}` +
    `?eventlist=FL` +
    `&fromdate=${isoDateDaysAgo(LOOKBACK_DAYS)}` +
    `&todate=${isoDateDaysAgo(0)}` +
    `&alertlevel=green;orange;red`;

  const response = await fetchWithTimeout(requestUrl);

  if (!response.ok) {
    throw new Error(`GDACS request failed with status ${response.status}`);
  }

  const geoJsonData = await response.json();
  const features = geoJsonData.features || [];

  return features.map((feature) => {
    const props = feature.properties || {};

    // Only Point geometry gives us a single coordinate to measure distance
    // from. Polygon-shaped flood extents are skipped for distance purposes.
    let distanceFromDominicaKm = null;
    if (feature.geometry?.type === "Point") {
      const [lon, lat] = feature.geometry.coordinates;
      distanceFromDominicaKm = Math.round(
        haversineDistanceKm(DOMINICA_LAT, DOMINICA_LON, lat, lon)
      );
    }

    return {
      name: props.name || props.eventname || "Unnamed flood event",
      country: props.country,
      alertLevel: props.alertlevel, // "Green" | "Orange" | "Red"
      summary: stripHtmlTags(props.htmldescription),
      fromDate: props.fromdate,
      toDate: props.todate,
      reportUrl: props.url?.report || props.url || null,
      distanceFromDominicaKm,
      isRegionallyRelevant:
        distanceFromDominicaKm != null &&
        distanceFromDominicaKm <= REGIONAL_RELEVANCE_RADIUS_KM,
    };
  });
}