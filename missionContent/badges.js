// missionContent/badges.js
//
// The badge catalog is derived directly from mission content rather than
// maintained as a separate list - a level badge appears here automatically
// the moment its level exists in missionContent/, and each mission's own
// mission-wide badge (see missionBadge on the mission content object)
// appears alongside its level badges.
//
// Image requires use a literal path per entry - React Native/Metro needs
// a static string to bundle a local image, so this can't be built
// dynamically from a badgeId string at runtime.

import { ALL_MISSIONS } from './index';

const BADGE_IMAGES = {
  knowTheStorm: require('../assets/badges/knowTheStorm.png'),
  personalPreparedness: require('../assets/badges/personalPreparedness.png'),
  familyPreparedness: require('../assets/badges/familyPreparedness.png'),
  homeAndCommunity: require('../assets/badges/homeAndCommunity.png'),
  hurricaneResponse: require('../assets/badges/hurricaneResponse.png'),
  hurricaneMaster: require('../assets/badges/hurricaneMaster.png'),
  hurricaneReadyBadge: require('../assets/badges/hurricaneReadyBadge.png'),
};

// Falls back to null (not an emoji) when a badge has no image yet - the
// rendering side (BadgePage, the earned-badge popup) is responsible for
// deciding what to show in that case, e.g. a plain placeholder box.
export function getBadgeImage(badgeId) {
  return BADGE_IMAGES[badgeId] || null;
}

export function getAllBadges() {
  const badges = [];

  ALL_MISSIONS.forEach((mission) => {
    Object.values(mission.levels).forEach((level) => {
      badges.push({
        badgeId: level.badgeId,
        badgeName: level.badgeName,
        missionId: mission.missionId,
        missionTitle: mission.title,
        levelNumber: level.levelNumber,
        image: getBadgeImage(level.badgeId),
      });
    });

    if (mission.missionBadge) {
      badges.push({
        badgeId: mission.missionBadge.badgeId,
        badgeName: mission.missionBadge.badgeName,
        missionId: mission.missionId,
        missionTitle: mission.title,
        levelNumber: null, // not tied to a specific level
        image: getBadgeImage(mission.missionBadge.badgeId),
      });
    }
  });

  return badges;
}