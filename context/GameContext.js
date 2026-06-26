//Global game state
//Stores XP, Missions, Badges and Progress

import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Key used to save and retrieve progress from device
const STORAGE_KEY = 'caribbeanshield_state';

//Default game data for a new player
const INITIAL_STATE = {
    xp: 0,
    completedMissions: [],
    earnedBadges: [],
    parish: 'Saint George',
};

//Badge awards
const MISSION_BADGES = {
    hurricane: 'Storm Watcher',
    kit:       'Ready Pack',
    earthquake:'Tremor Guard',
    shelter:   'Safe Harbour',
    volcano:   'Ash Sentinel',
};

//Readiness contribution per mission
const MISSION_WEIGHTS = {
    hurricane: 25,
    kit:       25,
    earthquake:20,
    shelter:   15,
    volcano:   15,
};

//Calulates overall prepareddess on completed missions
function calcReadiness(completedMissions) {
    return completedMissions.reduce(
        (sum, id) => sum + (MISSION_WEIGHTS[id] || 0), 0
    );
}

//Determines player level and title
function getLevel(xp) {
    if (xp < 100) return { level: 1, name: 'Newcomer' };
    if (xp < 250) return { level: 2, name: 'Preparedness Cadet' };
    if (xp < 500) return { level: 3, name: 'Community Guardian' };
    if (xp < 800) return { level: 4, name: 'Crisis Responder' };
    return { level: 5, name: 'Island Defender' };
}

//Controls availbel missions
function getUnlocked(completedMissions) {
    const tier1 = ['hurricane', 'kit'];
    const tier2 = ['earthquake', 'shelter'];
    const tier3 = ['volcano'];
    const unlocked = [...tier1];
    const tier1Done = tier1.filter(id => completedMissions.includes(id));
    const tier2Done = tier2.filter(id => completedMissions.includes(id));
    if (tier1Done.length >= 1) unlocked.push(...tier2);
    if (tier2Done.length >= 1) unlocked.push(...tier3);
    return unlocked;
}

const GameContext = createContext(null);

//Provided game data for all sceens
export function GameProvider({ children }) {
    const [state, setState] = useState(INITIAL_STATE);
    const [loaded, setLoaded] = useState(false);

    //Loads saved game prgress
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(saved => {
            if (saved) {
                try {
                    setState(JSON.parse(saved));
                } catch (error) {
                    console.error('Saved game data is invalid:', error);
                }
            }
            setLoaded(true);
        }).catch(error => {
            console.error('Could not load game data:', error);
            setLoaded(true);
        });
    },[]);
    
    //Saves progress after state change
    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, [state, loaded]);
    
    //Marks a mission as complete
    function completeMission(id, xpReward) {
    setState(prev => {
      if (prev.completedMissions.includes(id)) return prev;
      const completedMissions = [...prev.completedMissions, id];
      const earnedBadges = MISSION_BADGES[id]
        ? [...prev.earnedBadges, MISSION_BADGES[id]]
        : prev.earnedBadges;
      return { ...prev, xp: prev.xp + xpReward, completedMissions, earnedBadges };
    });
  }

//Resets game progress to default
function resetGame() {
    setState(INITIAL_STATE);
  }
const { level, name: levelName } = getLevel(state.xp);
return (
    <GameContext.Provider value={{
        ...state,
        loaded,
        level,
        levelName,
        readiness: calcReadiness(state.completedMissions),
        unlockedMissions: getUnlocked(state.completedMissions),
        completeMission,
        resetGame,
        }}>
            {children}
    </GameContext.Provider>
    );
}

//Custom hook to access game data
export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used inside GameProvider');
    return ctx;
}