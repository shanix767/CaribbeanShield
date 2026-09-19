// earthquakeApi.js
//
// Pulls recent earthquake activity near Dominica from USGS's public
// earthquake query API. Unlike the hurricane data, USGS gives us exact
// magnitude, location, and coordinates directly — no proximity estimating
// needed, since every quake already comes back within our requested radius.

const USGS_QUERY_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

// Roseau, Dominica — center point for the search radius below.
const DOMINICA_LAT = 15.3017;
const DOMINICA_LON = -61.388;

// How far out and how far back to look. 500 km covers the Eastern Caribbean
// island chain (Dominica sits in an active seismic zone between several
// nearby fault systems); 30 days keeps the list relevant without being empty
// most of the time, since small quakes are fairly frequent in this region.
const SEARCH_RADIUS_KM = 500;
const LOOKBACK_DAYS = 30;

// Below this magnitude, quakes are common and rarely felt — filtering them
// out keeps the list meaningful instead of showing dozens of tiny events.
const MINIMUM_MAGNITUDE = 2.5;

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// Straight-line distance between two lat/lon points, in km.
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

// Fetches recent earthquakes near Dominica and reshapes each one into the
// fields this app displays.
export async function fetchRecentEarthquakes() {
  const requestUrl =
    `${USGS_QUERY_URL}` +
    `?format=geojson` +
    `&starttime=${isoDateDaysAgo(LOOKBACK_DAYS)}` +
    `&latitude=${DOMINICA_LAT}` +
    `&longitude=${DOMINICA_LON}` +
    `&maxradiuskm=${SEARCH_RADIUS_KM}` +
    `&minmagnitude=${MINIMUM_MAGNITUDE}` +
    `&orderby=time`;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`USGS request failed with status ${response.status}`);
  }

  const geoJsonData = await response.json();
  const features = geoJsonData.features || [];

  return features.map((feature) => {
    const { mag, place, time, url, tsunami, felt } = feature.properties;
    const [quakeLon, quakeLat] = feature.geometry.coordinates;

    return {
      magnitude: mag,
      place, // USGS's own human-readable location, e.g. "45 km NW of Roseau, Dominica"
      occurredAt: time, // unix timestamp in milliseconds
      detailsUrl: url,
      hadTsunamiWarning: tsunami === 1,
      feltReportCount: felt, // number of "did you feel it" reports, can be null
      distanceFromDominicaKm: Math.round(
        haversineDistanceKm(DOMINICA_LAT, DOMINICA_LON, quakeLat, quakeLon)
      ),
    };
  });
}