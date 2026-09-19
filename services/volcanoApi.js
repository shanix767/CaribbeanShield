// volcanoApi.js
//
// Pulls the Smithsonian/USGS Weekly Volcanic Activity Report — a global feed
// covering roughly 16 volcanoes per week (continuing eruptions plus new
// activity). It's XML, and each entry includes a georss:point with the
// volcano's coordinates, so — same approach as the hurricane feed — we
// calculate distance from Dominica ourselves rather than relying on the feed
// to know what's "Caribbean-relevant".
//
// Requires: npm install fast-xml-parser (same package used for the earlier
// NHC RSS version — if you removed it after switching hurricanes to JSON,
// you'll need to reinstall it for this one).

import { XMLParser } from "fast-xml-parser";

const WEEKLY_VOLCANO_RSS_URL = "https://volcano.si.edu/news/WeeklyVolcanoRSS.xml";

const DOMINICA_LAT = 15.3017;
const DOMINICA_LON = -61.388;

// Volcanoes within this distance are flagged as regionally relevant to
// Dominica — loose enough to cover the whole Lesser Antilles arc.
const REGIONAL_RELEVANCE_RADIUS_KM = 1200;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function stripHtmlTags(htmlText) {
  if (!htmlText) return "";
  return htmlText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

// georss:point comes through as "latitude longitude" in one string, e.g.
// "19.023 -98.622". Splits and parses it into numbers.
function parseGeoRssPoint(pointString) {
  if (!pointString) return null;
  const parts = pointString.trim().split(/\s+/).map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null;
  return { lat: parts[0], lon: parts[1] };
}

export async function fetchWeeklyVolcanoActivity() {
  // Without a timeout, a slow or unreachable feed leaves the screen spinning
  // forever — AbortController lets fetch give up after a fixed wait instead.
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 seconds

  let response;
  try {
    response = await fetch(WEEKLY_VOLCANO_RSS_URL, { signal: abortController.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("GVP feed timed out after 10 seconds");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`GVP feed request failed with status ${response.status}`);
  }

  const rawXmlText = await response.text();
  const parsedFeed = xmlParser.parse(rawXmlText);

  const feedItems = parsedFeed?.rss?.channel?.item;
  if (!feedItems) {
    return [];
  }

  const itemList = Array.isArray(feedItems) ? feedItems : [feedItems];

  const volcanoReports = itemList.map((item) => {
    // The namespaced tag comes through with the colon in its key name.
    const point = parseGeoRssPoint(item["georss:point"]);
    const distanceFromDominicaKm = point
      ? Math.round(haversineDistanceKm(DOMINICA_LAT, DOMINICA_LON, point.lat, point.lon))
      : null;

    return {
      title: item.title, // usually "Volcano Name (Country)"
      summary: stripHtmlTags(item.description),
      detailsLink: item.link,
      distanceFromDominicaKm,
      isRegionallyRelevant:
        distanceFromDominicaKm != null &&
        distanceFromDominicaKm <= REGIONAL_RELEVANCE_RADIUS_KM,
    };
  });

  // Nearest to Dominica first, so anything actually relevant to the app's
  // audience surfaces above unrelated volcanoes on the other side of the world.
  volcanoReports.sort((a, b) => {
    if (a.distanceFromDominicaKm == null) return 1;
    if (b.distanceFromDominicaKm == null) return -1;
    return a.distanceFromDominicaKm - b.distanceFromDominicaKm;
  });

  return volcanoReports;
}