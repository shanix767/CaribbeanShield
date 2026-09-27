// theme/colors.js
//
// CaribbeanShield palette - "Rainforest & Mango": a fresh mint background,
// vivid rainforest greens, a deep forest-green tab bar, mango for rewards
// and the active tab, and hibiscus pink for XP and highlights. Every text
// colour passes WCAG AA (4.5:1 or better) on the background it's used on.
//
// All original key names are kept, so this file drops straight in without
// touching any screen.

export const COLORS = {
  // Backgrounds
  backgroundWhite: '#FFFFFF', // cards
  backgroundCream: '#E3F6E6', // main screen background (mint)
  backgroundGreen: '#188043', // rainforest green - hero cards
  backgroundGreenL: '#C9EFD2', // pale green - icon circles, soft highlights
  backgroundGreenD: '#0F5C31', // deep forest - buttons, headers, tab bar
  backgroundYellow: '#FFE3B8', // pale mango - active alert cards, top-rank highlight
  backgroundRed: '#C0392B', // danger red - use with WHITE text only

  // Text
  textGreen: '#0F6B38', // headings and links on mint/white
  textGreenD: '#0F3D22', // text on pale green backgrounds
  textDark: '#132A1C', // body text
  textWhite: '#FFFFFF',
  textCream: '#F4FBF5',
  textBrown: '#6B4F2A',
  textRed: '#B3261E', // errors, wrong-answer borders
  textGray: '#3E5A47', // secondary text
  textSlate: '#22474C',
  textOrange: '#C2185B', // XP and accent text (hibiscus pink)

  // Borders
  borderCream: '#B9D9C1', // card and input borders
  borderGreen: '#188043',
  borderYellow: '#FF9F1C', // mango - reward accents, readiness bar fill, active tab
  borderRed: '#C0392B',

  // Map
  routeYellow: '#FF9F1C',
  markerO: '#E63972', // selected shelter (hibiscus)
  markerG: '#0F5C31', // other shelters
  marker: '#E63972', // shelter.js uses COLORS.marker for the selected pin

  // Popups
  overlayDark: 'rgba(10, 30, 18, 0.55)',

  // Alerts and answer feedback
  backgroundRedAlert: '#C0392B',
  backgroundYellowAlert: '#FFB547',
  backgroundGreenAlert: '#C9EFD2', // calm status, correct answers (dark text)
  feedbackIncorrect: '#FADADD', // pale pink for wrong answers (dark text)

  // Accents
  seaTeal: '#0E7C86',
  sand: '#FFE3B8',
  forestGreen: '#188043', // app/hurricaneWatch.js references this
};