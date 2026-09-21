// testMode.js
//
// Shared between screens/dashboard/HazardWatchScreen.js (what's displayed)
// and App.js (the app-wide alert check) — kept in one place so both always
// agree on whether test data is active, rather than each having their own
// copy that could drift out of sync.
//
// Flip any of these to true to preview that card with sample alert data
// instead of waiting for a real event. Leave all false for normal live data.
export const TEST_MODE = {
  hurricane: false,
  earthquake: false,
  volcano: false,
  flood: false,
};