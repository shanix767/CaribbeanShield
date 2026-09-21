// GameContext.js
//
// One shared game state for ALL missions (Hurricane Ready, and whatever
// gets added later — Volcanic Hazard Ready, Flash Flood Aware, etc.). The
// reducer doesn't know anything about hurricanes specifically — it just
// tracks progress per missionId, so adding a new mission later means adding
// a new entry to missionContent/, not writing new reducer code.
//
// Persists to AsyncStorage so progress survives closing the app, and loads
// that saved progress back in on startup.

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_STATE_STORAGE_KEY = 'caribbeanShield:gameState';

// Starting state for a mission that hasn't been touched yet.
function createEmptyMissionProgress() {
  return {
    currentLevel: 0, // 0 means "not started" — level 1 is the first real level
    completedLevels: [],
    xpEarned: 0,
    badgeEarned: false,
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

    case 'COMPLETE_LEVEL': {
      const { missionId, level, xpReward, isFinalLevel } = action;
      const existingProgress = state.missions[missionId] || createEmptyMissionProgress();

      // Guard against double-counting XP if a level somehow gets completed
      // twice (e.g. a screen re-fires the action on re-render).
      if (existingProgress.completedLevels.includes(level)) {
        return state;
      }

      const updatedProgress = {
        ...existingProgress,
        currentLevel: Math.max(existingProgress.currentLevel, level),
        completedLevels: [...existingProgress.completedLevels, level],
        xpEarned: existingProgress.xpEarned + xpReward,
        badgeEarned: existingProgress.badgeEarned || isFinalLevel,
      };

      return {
        ...state,
        missions: {
          ...state.missions,
          [missionId]: updatedProgress,
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
// badges screen, tier display).

export function getTotalXp(state) {
  return Object.values(state.missions).reduce(
    (total, mission) => total + mission.xpEarned,
    0
  );
}

export function getEarnedBadgeIds(state) {
  return Object.entries(state.missions)
    .filter(([, mission]) => mission.badgeEarned)
    .map(([missionId]) => missionId);
}

export function hasCompletedAllMissions(state, allMissionIds) {
  return allMissionIds.every((missionId) => state.missions[missionId]?.badgeEarned);
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

// Overall readiness percentage — how far through ALL defined missions the
// player is, averaged evenly across missions regardless of how many levels
// each one has. Takes the full mission content list (not just ids) since it
// needs each mission's level count, which GameContext itself doesn't know
// about (content and progress are deliberately kept separate — see
// missionContent/ files).
export function getReadinessPercentage(state, allMissions) {
  if (allMissions.length === 0) return 0;

  const perMissionCompletion = allMissions.map((mission) => {
    const progress = state.missions[mission.missionId];
    if (!progress) return 0;
    return progress.completedLevels.length / mission.levels.length;
  });

  const averageCompletion =
    perMissionCompletion.reduce((sum, fraction) => sum + fraction, 0) /
    perMissionCompletion.length;

  return Math.round(averageCompletion * 100);
}

// TODO: tier/unlock system across missions (e.g. "complete Hurricane Ready
// before Volcanic Hazard Ready unlocks") — the original GameContext had
// this for the old flat 5-mission list, but that grouping no longer applies
// now that kit/shelter folded into Hurricane Ready's levels. Revisit once
// a second mission actually exists (Phase 3) and it's clear what order they
// should unlock in — no point guessing tier assignments for missions that
// aren't built yet.