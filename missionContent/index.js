// missionContent/index.js
//
// The single source of truth for "which missions exist" - every screen
// that needs to list, look up, or iterate missions should import from
// here rather than defining its own local list. Previously MissionsList,
// MissionDetail, and ActivityPlayer each had their own copy of this same
// mapping, which is exactly the kind of thing that quietly drifts out of
// sync once a second mission gets added.

import { HURRICANE_MISSION_CONTENT } from './hurricane';

export const ALL_MISSIONS = [HURRICANE_MISSION_CONTENT];

export const MISSION_CONTENT_BY_ID = {};
ALL_MISSIONS.forEach((mission) => {
  MISSION_CONTENT_BY_ID[mission.missionId] = mission;
});