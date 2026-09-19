// notifications.js
//
// LOCAL notifications only — this detects changes each time the app checks
// hazard data (on open or refresh) and fires a notification if something is
// different from last time. It does NOT run in the background when the app
// is closed; that would require a server-side pipeline (a scheduled backend
// checking the APIs independently, plus push tokens) which is a separate,
// much bigger undertaking than this.
//
// Requires: npx expo install expo-notifications @react-native-async-storage/async-storage
// expo-notifications has native code — needs an EAS rebuild, same as
// react-native-maps and expo-location did.

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_KNOWN_STATE_KEY = "caribbeanShield:lastKnownHazardState";

// Controls how notifications behave while the app is open and in the
// foreground — without this, Expo's default is to NOT show an alert banner
// for foreground notifications, which would make this feature invisible
// during the exact moment it's most likely to fire (right after a refresh).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function presentNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // null = show immediately
  });
}

// Builds a simple "fingerprint" of the current hazard state — just enough
// detail to detect that something changed, not a full data dump.
function buildStateSnapshot({ storms, earthquakes, volcanicReports, floods }) {
  return {
    stormNames: (storms || []).map((s) => s.name).sort(),
    earthquakeIds: (earthquakes || [])
      .map((e) => `${e.place}-${e.occurredAt}`)
      .sort(),
    volcanoTitles: (volcanicReports || [])
      .filter((v) => v.isRegionallyRelevant)
      .map((v) => v.title)
      .sort(),
    floodNames: (floods || [])
      .filter((f) => f.isRegionallyRelevant)
      .map((f) => f.name)
      .sort(),
  };
}

function arraysDiffer(a, b) {
  if (a.length !== b.length) return true;
  return a.some((item, index) => item !== b[index]);
}

// Compares the current hazard data against what was last seen (persisted in
// AsyncStorage), fires a notification per category that has something new,
// and saves the current state as the new "last known" baseline.
export async function checkForHazardChangesAndNotify(currentData) {
  const currentSnapshot = buildStateSnapshot(currentData);

  let previousSnapshot = null;
  try {
    const storedJson = await AsyncStorage.getItem(LAST_KNOWN_STATE_KEY);
    previousSnapshot = storedJson ? JSON.parse(storedJson) : null;
  } catch {
    previousSnapshot = null; // corrupted or missing — treat as first run
  }

  // First time ever running — just save the baseline, don't notify about
  // "changes" from nothing, since that would fire on every fresh install.
  if (previousSnapshot) {
    if (arraysDiffer(currentSnapshot.stormNames, previousSnapshot.stormNames)) {
      await presentNotification(
        "Hurricane Watch Update",
        currentSnapshot.stormNames.length > 0
          ? `Active storm(s): ${currentSnapshot.stormNames.join(", ")}`
          : "No active tropical systems in the Atlantic."
      );
    }

    if (arraysDiffer(currentSnapshot.earthquakeIds, previousSnapshot.earthquakeIds)) {
      await presentNotification(
        "Earthquake Update",
        "New earthquake activity detected near Dominica."
      );
    }

    if (arraysDiffer(currentSnapshot.volcanoTitles, previousSnapshot.volcanoTitles)) {
      await presentNotification(
        "Volcanic Activity Update",
        currentSnapshot.volcanoTitles.length > 0
          ? `Regional activity: ${currentSnapshot.volcanoTitles.join(", ")}`
          : "No regional volcanic activity reported."
      );
    }

    if (arraysDiffer(currentSnapshot.floodNames, previousSnapshot.floodNames)) {
      await presentNotification(
        "Flood Alert Update",
        currentSnapshot.floodNames.length > 0
          ? `Regional flood event: ${currentSnapshot.floodNames.join(", ")}`
          : "No regional flood alerts reported."
      );
    }
  }

  await AsyncStorage.setItem(LAST_KNOWN_STATE_KEY, JSON.stringify(currentSnapshot));
}