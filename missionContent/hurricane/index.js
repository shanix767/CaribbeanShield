// missionContent/hurricane/index.js
//
// Combines each level file into the single mission-content shape
// GameContext's getMissionReadinessScore/getReadinessPercentage expect:
// { missionId, levels: { 1: {...}, 2: {...}, ... } }. Only Level 1 exists
// so far — add levels 2-6 here as they're built, same pattern.

import { HURRICANE_LEVEL_1 } from './level1';

export const HURRICANE_MISSION_CONTENT = {
  missionId: 'hurricaneReady',
  title: 'Hurricane Ready',
  description: 'Learn, plan, and prepare for hurricane season across six levels of increasing readiness.',
  iconPlaceholder: '🌀',
  levels: {
    1: HURRICANE_LEVEL_1,
  },
};