// GameContext.js
//
// One shared game state for ALL missions (Hurricane Ready, and whatever
// gets added later - Volcanic Hazard Ready, Flash Flood Aware, etc.). The
// reducer doesn't know anything about hurricanes specifically - it just
// tracks progress per missionId/level/stage/activity, so adding a new
// mission or level later means adding content to missionContent/, not
// writing new reducer code.
//
// Every mission now follows the same six-stage shape per level:
// Learn -> Plan -> Prepare -> Prove -> Respond -> Recover. Each level
// awards its own badge on completion (missions can therefore earn several
// badges, not just one).
//
// XP is stored PER ACTIVITY (activityId -> xp earned on the most recent
// attempt), not just a running stage total. This is what makes retrying
// possible: redoing an activity overwrites its stored XP with the new
// attempt's result rather than being blocked or adding on top of the old
// value - the player's score always reflects their latest attempt, and a
// level's badge is only awarded once every activity's XP sums to that
// level's full possible total (see getLevelEarnedXp/getLevelPossibleXp
// and how ActivityPlayerScreen uses them).
//
// Persists to AsyncStorage so progress survives closing the app, and loads
// that saved progress back in on startup.

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_STATE_STORAGE_KEY = 'caribbeanShield:gameState';

// The six stages every mission level is built from, in play order. Content
// files and UI screens should iterate stages in this order rather than
// hardcoding their own list, so everything stays in sync if this ever
// changes.
export const STAGE_ORDER = ['learn', 'plan', 'prepare', 'prove', 'respond', 'recover'];

// Starting state for a stage nobody has touched yet.
function createEmptyStageProgress() {
  return {
    activityXp: {}, // activityId -> xp earned on the most recent attempt
  };
}

// Starting state for a level nobody has touched yet. Built lazily (see the
// reducer below) rather than pre-created for every mission, since the
// reducer doesn't know in advance how many levels a mission will end up
// having.
function createEmptyLevelProgress() {
  const stages = {};
  STAGE_ORDER.forEach((stageName) => {
    stages[stageName] = createEmptyStageProgress();
  });
  return {
    stages,
    completed: false, // true once this level's badge has been earned
  };
}

// Starting state for a mission that hasn't been touched yet.
function createEmptyMissionProgress() {
  return {
    badgesEarned: [], // one badge id per completed level, e.g. ['knowTheStorm']
    levels: {}, // filled in lazily per level as the player reaches it
  };
}

const initialState = {
  parish: null,
  onboardingCompleted: false,
  // { score, maxScore, completedAt } once taken, otherwise null. Kept
  // OUTSIDE the missions/parish fields RESET_PROGRESS wipes - see that
  // case below - so running a new evaluation participant through
  // onboarding again doesn't silently erase the previous participant's
  // score before it's been recorded elsewhere.
  pretestScore: null,
  posttestScore: null,
  missions: {
    // Seeded here so the UI can render a mission card immediately, even
    // before the player has done anything with it. New missions get added
    // to this object as they're built in missionContent/.
    hurricaneReady: createEmptyMissionProgress(),
  },
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE': {
      // Used once on startup to replace the whole state with whatever was
      // saved in AsyncStorage from a previous session.
      return action.savedState;
    }

    case 'SET_PARISH': {
      return { ...state, parish: action.parish };
    }

    case 'COMPLETE_ONBOARDING': {
      return { ...state, onboardingCompleted: true };
    }

    case 'RECORD_PRETEST_SCORE': {
      const { score, maxScore } = action;
      return {
        ...state,
        pretestScore: { score, maxScore, completedAt: new Date().toISOString() },
      };
    }

    case 'RECORD_POSTTEST_SCORE': {
      const { score, maxScore } = action;
      return {
        ...state,
        posttestScore: { score, maxScore, completedAt: new Date().toISOString() },
      };
    }

    case 'COMPLETE_ACTIVITY': {
      // Dispatched every time the player finishes one activity inside one
      // stage of one level - e.g. finishing the "Hurricane Hazards Quiz"
      // inside Level 1's Learn stage. xpReward here is however much XP
      // THIS ATTEMPT actually earned (computed by the activity component
      // itself based on correctness - see components/activities/), not
      // necessarily the activity's full possible XP.
      //
      // Deliberately allows re-completing an already-attempted activity -
      // this is what makes retrying to improve a score possible. The
      // stored value for that activity is simply overwritten with this
      // attempt's result, so a player's score always reflects their most
      // recent attempt, not their first or their best.
      const { missionId, level, stage, activityId, xpReward } = action;
      const existingMissionProgress = state.missions[missionId] || createEmptyMissionProgress();
      const existingLevelProgress =
        existingMissionProgress.levels[level] || createEmptyLevelProgress();
      const existingStageProgress = existingLevelProgress.stages[stage];

      const updatedStageProgress = {
        activityXp: {
          ...existingStageProgress.activityXp,
          [activityId]: xpReward,
        },
      };

      const updatedLevelProgress = {
        ...existingLevelProgress,
        stages: {
          ...existingLevelProgress.stages,
          [stage]: updatedStageProgress,
        },
      };

      return {
        ...state,
        missions: {
          ...state.missions,
          [missionId]: {
            ...existingMissionProgress,
            levels: {
              ...existingMissionProgress.levels,
              [level]: updatedLevelProgress,
            },
          },
        },
      };
    }

    case 'COMPLETE_LEVEL': {
      // Dispatched only when the player finishes a level's final Recover
      // activity AND their total earned XP for the level equals the
      // level's full possible XP - see ActivityPlayerScreen for that
      // check. This action itself doesn't re-verify the score; it just
      // records the badge once told to.
      const { missionId, level, badgeId } = action;
      const existingMissionProgress = state.missions[missionId] || createEmptyMissionProgress();
      const existingLevelProgress =
        existingMissionProgress.levels[level] || createEmptyLevelProgress();

      // Guard against double-awarding the same badge.
      if (existingMissionProgress.badgesEarned.includes(badgeId)) {
        return state;
      }

      return {
        ...state,
        missions: {
          ...state.missions,
          [missionId]: {
            ...existingMissionProgress,
            badgesEarned: [...existingMissionProgress.badgesEarned, badgeId],
            levels: {
              ...existingMissionProgress.levels,
              [level]: { ...existingLevelProgress, completed: true },
            },
          },
        },
      };
    }

    case 'COMPLETE_MISSION': {
      // Dispatched when every level's badge has been earned - awards the
      // mission-wide badge (e.g. "Hurricane Ready"), separate from any
      // single level's own badge. Uses the same badgesEarned array as
      // COMPLETE_LEVEL - this badge just isn't tied to a specific level.
      const { missionId, badgeId } = action;
      const existingMissionProgress = state.missions[missionId] || createEmptyMissionProgress();

      if (existingMissionProgress.badgesEarned.includes(badgeId)) {
        return state;
      }

      return {
        ...state,
        missions: {
          ...state.missions,
          [missionId]: {
            ...existingMissionProgress,
            badgesEarned: [...existingMissionProgress.badgesEarned, badgeId],
          },
        },
      };
    }

    case 'RESET_PROGRESS': {
      // Used to prepare the app for a new evaluation participant. Resets
      // parish, onboarding status, and all mission progress - so the next
      // person goes through onboarding (including taking their own fresh
      // pretest) from scratch - but deliberately carries the CURRENT
      // pretestScore/posttestScore forward rather than wiping them to
      // null. That gives the researcher a window to read and record the
      // previous participant's score before it's overwritten by the next
      // person's own pretest; Reset Progress alone never destroys it.
      return {
        ...initialState,
        pretestScore: state.pretestScore,
        posttestScore: state.posttestScore,
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext(null);

// A saved state is only usable if every stage in it has the current
// activityXp shape - a save from before this shape changed (e.g. an old
// completedActivityIds/xpEarned stage) would otherwise crash every helper
// in this file the moment the app tries to read it. Rather than requiring
// a manual storage clear whenever this shape changes again in the future,
// an incompatible save is just treated as if there were no save at all -
// the app starts fresh from initialState instead of crashing.
function isSavedStateCompatible(savedState) {
  if (!savedState || !savedState.missions) return false;

  return Object.values(savedState.missions).every((mission) => {
    if (!mission.levels) return true; // a mission with no levels touched yet is fine
    return Object.values(mission.levels).every((level) => {
      if (!level.stages) return false;
      return Object.values(level.stages).every(
        (stage) => stage.activityXp !== undefined
      );
    });
  });
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [hasLoadedSavedState, setHasLoadedSavedState] = useState(false);

  // Load any previously saved progress once, on first mount.
  useEffect(() => {
    async function loadSavedState() {
      try {
        const savedJson = await AsyncStorage.getItem(GAME_STATE_STORAGE_KEY);
        if (savedJson) {
          const parsedState = JSON.parse(savedJson);
          if (isSavedStateCompatible(parsedState)) {
            dispatch({ type: 'LOAD_STATE', savedState: parsedState });
          }
          // An incompatible save is silently skipped - the app just
          // proceeds with initialState, same as a fresh install.
        }
      } catch {
        // Corrupted or missing save - just start fresh from initialState.
      }
      setHasLoadedSavedState(true);
    }

    loadSavedState();
  }, []);

  // Save to AsyncStorage every time state changes, but only AFTER the
  // initial load above has finished - otherwise this would immediately
  // overwrite a real saved game with the blank initialState on every startup.
  useEffect(() => {
    if (!hasLoadedSavedState) return;

    AsyncStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Saving failed - not much the player can do about this in the
      // moment, so just let it silently retry on the next state change.
    });
  }, [state, hasLoadedSavedState]);

  return (
    <GameContext.Provider value={{ state, dispatch, hasLoadedSavedState }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook so screens can just call useGameContext() instead of
// importing both useContext and GameContext everywhere.
export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used inside a GameProvider');
  }
  return context;
}

// --- Derived helpers ---
// These read from state but don't belong in the reducer itself - they're
// just convenient calculations screens will want often (leaderboard,
// badges screen, mission detail, tier display).

function sumStageXp(stageProgress) {
  return Object.values(stageProgress.activityXp).reduce((sum, xp) => sum + xp, 0);
}

export function getTotalXp(state) {
  let total = 0;
  Object.values(state.missions).forEach((mission) => {
    Object.values(mission.levels).forEach((level) => {
      Object.values(level.stages).forEach((stage) => {
        total += sumStageXp(stage);
      });
    });
  });
  return total;
}

// Same idea as getTotalXp above, but scoped to one mission - used by the
// Missions list screen to show each mission's own XP rather than the
// player's grand total.
export function getMissionXp(state, missionId) {
  const missionProgress = state.missions[missionId];
  if (!missionProgress) return 0;

  let total = 0;
  Object.values(missionProgress.levels).forEach((level) => {
    Object.values(level.stages).forEach((stage) => {
      total += sumStageXp(stage);
    });
  });
  return total;
}

// How much XP a specific stage has earned so far - used for the live XP
// progress display while playing through a stage's activities.
export function getStageEarnedXp(levelProgress, stageName) {
  const stageProgress = levelProgress.stages[stageName];
  if (!stageProgress) return 0;
  return sumStageXp(stageProgress);
}

// The maximum XP a stage could possibly earn - the sum of every one of
// its activities' full xpReward, regardless of what's actually been
// earned so far. Used alongside getStageEarnedXp to show "X / Y XP".
export function getStagePossibleXp(stageContent) {
  return stageContent.activities.reduce((sum, activityItem) => sum + activityItem.xpReward, 0);
}

// Total XP earned across every stage of one level.
export function getLevelEarnedXp(levelProgress) {
  return STAGE_ORDER.reduce((sum, stageName) => {
    const stageProgress = levelProgress.stages[stageName];
    return sum + (stageProgress ? sumStageXp(stageProgress) : 0);
  }, 0);
}

// Total possible XP across every stage of one level - a level's badge is
// only awarded once getLevelEarnedXp equals this value (a perfect score),
// per the "100% of the level's XP" requirement.
export function getLevelPossibleXp(levelContent) {
  return STAGE_ORDER.reduce((sum, stageName) => {
    const stageContent = levelContent.stages[stageName];
    return sum + (stageContent ? getStagePossibleXp(stageContent) : 0);
  }, 0);
}

export function getEarnedBadgeIds(state) {
  return Object.values(state.missions).flatMap((mission) => mission.badgesEarned);
}

// Whether every activity in a stage has been ATTEMPTED at least once -
// this is about attempt coverage (used to decide whether the next stage
// unlocks), not correctness. A player can attempt every activity, get some
// wrong, and still move on to the next stage; only the level's BADGE
// requires a perfect score (see getLevelEarnedXp/getLevelPossibleXp).
export function areAllStageActivitiesAttempted(stageProgress, stageContent) {
  if (!stageContent || stageContent.activities.length === 0) return false;
  return stageContent.activities.every((activityItem) =>
    Object.prototype.hasOwnProperty.call(stageProgress.activityXp, activityItem.id)
  );
}

// A mission counts as fully complete once every level defined in its
// content has had its badge earned - takes the mission's content (not just
// its id) since GameContext itself doesn't know how many levels a mission
// has (content and progress are deliberately kept separate - see
// missionContent/ files).
export function hasCompletedMission(state, missionContent) {
  const missionProgress = state.missions[missionContent.missionId];
  if (!missionProgress) return false;

  const allBadgeIdsForThisMission = Object.values(missionContent.levels).map(
    (level) => level.badgeId
  );
  return allBadgeIdsForThisMission.every((badgeId) =>
    missionProgress.badgesEarned.includes(badgeId)
  );
}

export function hasCompletedAllMissions(state, allMissionContents) {
  return allMissionContents.every((missionContent) => hasCompletedMission(state, missionContent));
}

// Player level/title based on total XP across all missions - thresholds
// carried over from the original GameContext design.
const LEVEL_THRESHOLDS = [
  { minXp: 0, level: 1, name: 'Newcomer' },
  { minXp: 100, level: 2, name: 'Preparedness Cadet' },
  { minXp: 250, level: 3, name: 'Community Guardian' },
  { minXp: 500, level: 4, name: 'Crisis Responder' },
  { minXp: 800, level: 5, name: 'Island Defender' },
];

export function getPlayerLevel(state) {
  const totalXp = getTotalXp(state);
  // Thresholds are ordered lowest to highest - find the last one the
  // player's XP still qualifies for.
  let currentLevel = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXp >= threshold.minXp) {
      currentLevel = threshold;
    }
  }
  return { level: currentLevel.level, name: currentLevel.name };
}

// --- Readiness Score ---
// This is deliberately a SEPARATE metric from XP (see getTotalXp above),
// though now that XP itself reflects correctness (not just completion),
// the two are more closely related than before - which is a good thing:
// a player who clicks through everything but gets it all wrong now earns
// close to 0 XP AND a low Readiness Score, rather than looking "done" on
// paper while having learned nothing.

// Stage weights within a single level. Learn counts least since reading a
// lesson is the lowest bar to clear; Plan/Prepare/Prove count more since
// they require actually doing something; Respond counts highest since it
// measures decision-making under pressure, not just knowledge. Recover
// counts least of the "doing" stages since it's a shorter, simpler check.
const STAGE_WEIGHTS = {
  learn: 0.15,
  plan: 0.2,
  prepare: 0.2,
  prove: 0.2,
  respond: 0.15,
  recover: 0.1,
};

// Level weights across a full six-level mission. Later levels count for
// more since they represent household- and community-level readiness, not
// just personal knowledge. These stay fixed at these values even while
// only Level 1 exists in content, so the Readiness Score honestly reflects
// "how ready is this player for a REAL hurricane" rather than "how much of
// what's been built so far has this player finished" - those are
// different questions, and only the first one matters for the research
// write-up. In practice this means the maximum possible Readiness Score
// right now is 10% (Level 1's full weight) until Levels 2-6 are built -
// that's expected, not a bug.
const LEVEL_WEIGHTS = {
  1: 0.1,
  2: 0.15,
  3: 0.2,
  4: 0.2,
  5: 0.2,
  6: 0.15,
};

// Fraction of a stage's possible XP that's actually been earned - this now
// captures correctness, not just attempt coverage, since XP itself is
// correctness-weighted (see components/activities/).
function getStageXpFraction(stageProgress, stageContent) {
  const possibleXp = getStagePossibleXp(stageContent);
  if (!stageContent || possibleXp === 0) return 0;
  return sumStageXp(stageProgress) / possibleXp;
}

function getLevelReadinessFraction(levelProgress, levelContent) {
  let weightedSum = 0;
  STAGE_ORDER.forEach((stageName) => {
    const stageProgress = levelProgress.stages[stageName];
    const stageContent = levelContent.stages[stageName];
    const stageFraction = getStageXpFraction(stageProgress, stageContent);
    weightedSum += stageFraction * STAGE_WEIGHTS[stageName];
  });
  return weightedSum;
}

// The player's Readiness Score for one mission, as a percentage (0-100).
// Needs the mission's content (not just its id) since the calculation
// needs to know how many activities each stage has and how much XP each
// is worth.
export function getMissionReadinessScore(state, missionContent) {
  const missionProgress = state.missions[missionContent.missionId];
  if (!missionProgress) return 0;

  let weightedSum = 0;
  Object.keys(LEVEL_WEIGHTS).forEach((levelNumberKey) => {
    const levelContent = missionContent.levels[levelNumberKey];
    const levelProgress = missionProgress.levels[levelNumberKey];
    // Levels with no content yet (not built) or no progress yet (not
    // started) simply contribute 0 - see the comment on LEVEL_WEIGHTS
    // above for why that's intentional.
    if (!levelContent || !levelProgress) return;
    const levelFraction = getLevelReadinessFraction(levelProgress, levelContent);
    weightedSum += levelFraction * LEVEL_WEIGHTS[levelNumberKey];
  });

  return Math.round(weightedSum * 100);
}

// Overall readiness across every mission that's been built so far - the
// average of each mission's own Readiness Score above. Takes the full
// mission content list (not just ids) since each mission's score
// calculation needs its own content definition.
export function getReadinessPercentage(state, allMissionContents) {
  if (allMissionContents.length === 0) return 0;

  const scores = allMissionContents.map((missionContent) =>
    getMissionReadinessScore(state, missionContent)
  );

  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(averageScore);
}

// TODO: tier/unlock system across missions (e.g. "complete Hurricane Ready
// before Volcanic Hazard Ready unlocks") - revisit once a second mission
// actually exists (Phase 3) and it's clear what order they should unlock
// in - no point guessing tier assignments for missions that aren't built
// yet.