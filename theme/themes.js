// theme/themes.js
//
// Shared layout settings, built on the palette in theme/colors.js. Screens
// don't hard-code these values: the header (components/ScreenHeader.js)
// and screen backgrounds read them from here, so changing a value below
// changes it on every screen at once.

import { COLORS } from './colors';

export const THEME = {
  // The green bar at the top of every main screen. It runs up behind the
  // phone's status bar, so the status bar icons are set to light (white)
  // to stay readable on it.
  header: {
    backgroundColor: COLORS.backgroundGreenD,
    titleColor: COLORS.textWhite,
    subtitleColor: COLORS.textCream,
    backLinkColor: COLORS.textWhite,
    titleSize: 20,
    subtitleSize: 13,
    backLinkSize: 14,
    paddingHorizontal: 16,
    paddingTop: 8, // added below the status bar
    paddingBottom: 14,
    statusBarStyle: 'light',
  },

  // The area below the header.
  screen: {
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
};
