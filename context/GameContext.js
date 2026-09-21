// GameContext.js
//
// One shared game state for ALL missions (Hurricane Ready, and whatever
// gets added later — Volcanic Hazard Ready, Flash Flood Aware, etc.). The
// reducer doesn't know anything about hurricanes specifically — it just
// tracks progress per missionId/level/stage/activity, so adding a new
// mission or level later means adding content to missionContent/, not
// writing new reducer code.
//
// Every mission now follows the same six-stage shape per level:
// Learn -> Plan -> Prepare -> Prove -> Respond -> Recover. Each level
// awards its own badge on completion (missions can therefore earn several
// badges, not just one), and progress is tracked per individual activity
// within each stage — not just "level done or not."
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
    completedActivityIds: [],
    xpEarned: 0,
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
    badgesEarned: [], // one badge id per completed level, e.g. ['stormWatcher']
    levels: {}, // filled in lazily per level as the player reaches it
  };
}

const initialState = {
  parish: null,
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

    case 'COMPLETE_ACTIVITY': {
      // Dispatched every time the player finishes one activity inside one
      // stage of one level — e.g. finishing the "Hurricane Hazards Quiz"
      // inside Level 1's Learn stage. This is the fine-grained progress
      // unit everything else (XP, Readiness Score) is built from.
      const { missionId, level, stage, activityId, xpReward } = action;
      const existingMissionProgress = state.missions[missionId] || createEmptyMissionProgress();
      const existingLevelProgress =
        existingMissionProgress.levels[level] || createEmptyLevelProgress();
      const existingStageProgress = existingLevelProgress.stages[stage];

      // Guard against double-counting XP if an activity somehow gets
      // completed twice (e.g. a screen re-fires the action on re-render,
      // or the player backs out and re-enters an already-done activity).
      if (existingStageProgress.completedActivityIds.includes(activityId)) {
        return state;
      }

      const updatedStageProgress = {
        completedActivityIds: [...existingStageProgress.completedActivityIds, activityId],
        xpEarned: existingStageProgress.xpEarned + xpReward,
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
      // Dispatched once, when the player finishes a level's final Recover
      // activity — this is what actually awards the level's badge.
      // Finishing individual activities (above) does NOT award a badge by
      // itself; this action is the explicit "level complete" moment.
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

    case 'RESET_PROGRESS': {
      // Used by the Profile screen's Reset Progress button — needed for
      // running multiple evaluation sessions without old progress carrying
      // over between participants.
      return initialState;
    }

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [hasLoadedSavedState, setHasLoadedSavedState] = useState(false);

  // Load any previously saved progress once, on first mount.
  useEffect(() => {
    async function loadSavedState() {
      try {
        const savedJson = await AsyncStorage.getItem(GAME_STATE_STORAGE_KEY);
        if (savedJson) {
          dispatch({ type: 'LOAD_STATE', savedState: JSON.parse(savedJson) });
        }
      } catch {
        // Corrupted or missing save — just start fresh from initialState.
      }
      setHasLoadedSavedState(true);
    }

    loadSavedState();
  }, []);

  // Save to AsyncStorage every time state changes, but only AFTER the
  // initial load above has finished — otherwise this would immediately
  // overwrite a real saved game with the blank initialState on every startup.
  useEffect(() => {
    if (!hasLoadedSavedState) return;

    AsyncStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Saving failed — not much the player can do about this in the
      // moment, so just let it silently retry on the next state change.
    });
  }, [state, hasLoadedSavedState]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
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
// These read from state but don't belong in the reducer itself — they're
// just convenient calculations screens will want often (leaderboard,
// badges screen, mission detail, tier display).

export function getTotalXp(state) {
  let total = 0;
  Object.values(state.missions).forEach((mission) => {
    Object.values(mission.levels).forEach((level) => {
      Object.values(level.stages).forEach((stage) => {
        total += stage.xpEarned;
      });
    });
  });
  return total;
}

// Same idea as getTotalXp above, but scoped to one mission — used by the
// Missions list screen to show each mission's own XP rather than the
// player's grand total.
export function getMissionXp(state, missionId) {
  const missionProgress = state.missions[missionId];
  if (!missionProgress) return 0;

  let total = 0;
  Object.values(missionProgress.levels).forEach((level) => {
    Object.values(level.stages).forEach((stage) => {
      total += stage.xpEarned;
    });
  });
  return total;
}

export function getEarnedBadgeIds(state) {
  return Object.values(state.missions).flatMap((mission) => mission.badgesEarned);
}

// A mission counts as fully complete once every level defined in its
// content has had its badge earned — takes the mission's content (not just
// its id) since GameContext itself doesn't know how many levels a mission
// has (content and progress are deliberately kept separate — see
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

// Player level/title based on total XP across all missions — thresholds
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
  // Thresholds are ordered lowest to highest — find the last one the
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
// This is deliberately a SEPARATE metric from XP (see getTotalXp above).
// XP measures game engagement — how much a player has done. Readiness
// Score measures actual disaster preparedness — which is the thing
// CaribbeanShield's research question is actually about. A player could
// rack up plenty of XP from easy Learn/Plan activities while still having
// a low Readiness Score if they've skipped the harder, higher-weighted
// Prepare/Respond work. Keeping these separate is what lets the eventual
// analysis distinguish "did they engage with the app" from "did their
// preparedness actually improve."

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
// what's been built so far has this player finished" — those are
// different questions, and only the first one matters for the research
// write-up. In practice this means the maximum possible Readiness Score
// right now is 10% (Level 1's full weight) until Levels 2-6 are built —
// that's expected, not a bug.
const LEVEL_WEIGHTS = {
  1: 0.1,
  2: 0.15,
  3: 0.2,
  4: 0.2,
  5: 0.2,
  6: 0.15,
};

function getStageCompletionFraction(stageProgress, stageContent) {
  if (!stageContent || stageContent.activities.length === 0) return 0;
  return stageProgress.completedActivityIds.length / stageContent.activities.length;
}

function getLevelReadinessFraction(levelProgress, levelContent) {
  let weightedSum = 0;
  STAGE_ORDER.forEach((stageName) => {
    const stageProgress = levelProgress.stages[stageName];
    const stageContent = levelContent.stages[stageName];
    const stageFraction = getStageCompletionFraction(stageProgress, stageContent);
    weightedSum += stageFraction * STAGE_WEIGHTS[stageName];
  });
  return weightedSum;
}

// The player's Readiness Score for one mission, as a percentage (0-100).
// Needs the mission's content (not just its id) since the calculation
// needs to know how many activities each stage has.
export function getMissionReadinessScore(state, missionContent) {
  const missionProgress = state.missions[missionContent.missionId];
  if (!missionProgress) return 0;

  let weightedSum = 0;
  Object.keys(LEVEL_WEIGHTS).forEach((levelNumberKey) => {
    const levelContent = missionContent.levels[levelNumberKey];
    const levelProgress = missionProgress.levels[levelNumberKey];
    // Levels with no content yet (not built) or no progress yet (not
    // started) simply contribute 0 — see the comment on LEVEL_WEIGHTS
    // above for why that's intentional.
    if (!levelContent || !levelProgress) return;
    const levelFraction = getLevelReadinessFraction(levelProgress, levelContent);
    weightedSum += levelFraction * LEVEL_WEIGHTS[levelNumberKey];
  });

  return Math.round(weightedSum * 100);
}

// Overall readiness across every mission that's been built so far — the
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
// before Volcanic Hazard Ready unlocks") — revisit once a second mission
// actually exists (Phase 3) and it's clear what order they should unlock
// in — no point guessing tier assignments for missions that aren't built
// yet.