// missionContent/hurricane/index.js
//
// Combines each level file into the single mission-content shape
// GameContext's getMissionReadinessScore/getReadinessPercentage expect:
// { missionId, levels: { 1: {...}, 2: {...}, ... } }. Only Level 1 exists
// so far - add levels 2-6 here as they're built, same pattern.

import { HURRICANE_LEVEL_1 } from './level1';
import { HURRICANE_LEVEL_2 } from './level2';
import { HURRICANE_LEVEL_3 } from './level3';
import { HURRICANE_LEVEL_4 } from './level4';
import { HURRICANE_LEVEL_5 } from './level5';
import { HURRICANE_LEVEL_6 } from './level6';

export const HURRICANE_MISSION_CONTENT = {
  missionId: 'hurricaneReady',
  title: 'Hurricane Ready',
  description: 'Learn, plan, and prepare for hurricane season across six levels of increasing readiness.',
  iconPlaceholder: '🌀',
  // Awarded once every level's own badge has been earned - separate from
  // any single level's badge. See getAllBadges/hasCompletedMission.
  missionBadge: {
    badgeId: 'hurricaneReadyBadge',
    badgeName: 'Hurricane Ready',
  },
  levels: {
    1: HURRICANE_LEVEL_1,
    2: HURRICANE_LEVEL_2,
    3: HURRICANE_LEVEL_3,
    4: HURRICANE_LEVEL_4,
    5: HURRICANE_LEVEL_5,
    6: HURRICANE_LEVEL_6,
  },
};