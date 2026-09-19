// testData.js
//
// Sample data matching the exact shape each service function returns, so you
// can preview what the UI looks like with an active alert without waiting
// for a real hurricane/earthquake/eruption/flood to happen. Toggle these on
// in App.js's TEST_MODE object.
//
// Keep this in sync with the real field names in each services/*Api.js file
// if those ever change — this is just plain data, not validated against them.

export const TEST_STORM = {
  storms: [
    {
      name: "Maria",
      classificationCode: "HU",
      classificationLabel: "Hurricane",
      category: 3,
      windMph: 120,
      movement: "WNW at 12 mph",
      lastUpdate: new Date().toISOString(),
      publicAdvisoryUrl: "https://www.nhc.noaa.gov/",
      distanceFromDominicaKm: 450,
    },
  ],
  stormsError: null,
  conditions: {
    description: "heavy rain",
    temperatureCelsius: 26.5,
    windSpeedMetersPerSecond: 14.2,
    humidityPercent: 92,
    observedAt: Math.floor(Date.now() / 1000),
  },
  conditionsError: null,
};

export const TEST_EARTHQUAKES = [
  {
    magnitude: 5.4,
    place: "32 km NW of Roseau, Dominica",
    occurredAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    detailsUrl: "https://earthquake.usgs.gov/",
    hadTsunamiWarning: false,
    feltReportCount: 214,
    distanceFromDominicaKm: 32,
  },
  {
    magnitude: 3.1,
    place: "88 km N of Roseau, Dominica",
    occurredAt: Date.now() - 1000 * 60 * 60 * 26, // yesterday
    detailsUrl: "https://earthquake.usgs.gov/",
    hadTsunamiWarning: false,
    feltReportCount: null,
    distanceFromDominicaKm: 88,
  },
];

export const TEST_VOLCANOES = [
  {
    title: "Soufrière (Dominica)",
    summary:
      "Elevated fumarolic activity was observed with increased sulfur odor reported by residents. No eruption confirmed.",
    detailsLink: "https://volcano.si.edu/",
    distanceFromDominicaKm: 15,
    isRegionallyRelevant: true,
  },
];

export const TEST_FLOODS = [
  {
    name: "Tropical Storm Flooding",
    country: "Dominica",
    alertLevel: "Orange",
    summary:
      "Heavy rainfall associated with a tropical system has caused river overflow and localized flooding in low-lying areas.",
    fromDate: new Date().toISOString(),
    toDate: null,
    reportUrl: "https://www.gdacs.org/",
    distanceFromDominicaKm: 0,
    isRegionallyRelevant: true,
  },
];