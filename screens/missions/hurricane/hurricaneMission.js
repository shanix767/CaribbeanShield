// screens/missions/hurricane/hurricaneMission.js
//
// Content and metadata for the Hurricane Ready mission - separate from
// GameContext on purpose. GameContext only tracks PROGRESS (which level is
// done, how much XP earned); this file describes WHAT each level actually
// is. Adding a new mission later means adding a file like this one, not
// touching GameContext's reducer.

export const HURRICANE_READY_MISSION = {
  missionId: 'hurricaneReady',
  title: 'Hurricane Ready',
  description: 'Learn how to prepare for and stay safe during a hurricane.',
  // TODO: replace with the real mission icon once art is ready (see the
  // badge/icon asset list - 6 images needed total for this mission).
  iconPlaceholder: '🌀',

  levels: [
    {
      level: 1,
      title: 'Hurricane Basics',
      xpReward: 50,
      description:
        'Learn what makes a hurricane, and how to read the CDM alert scale.',
      // TODO: fill in actual quiz questions / content steps for this level.
      content: null,
    },
    {
      level: 2,
      title: 'Go-Bag Assembly',
      xpReward: 75,
      description:
        'Build an emergency go-bag with the essentials you would need.',
      content: null,
    },
    {
      level: 3,
      title: 'Shelter Identification',
      xpReward: 100,
      description:
        'Find and recognize your nearest emergency shelter before you need it.',
      content: null,
    },
    {
      level: 4,
      title: 'Household Communications Plan',
      xpReward: 150,
      description:
        'Put together a plan for how your household stays in contact and reunites.',
      content: null,
      isFinalLevel: true,
      badgeId: 'knowTheStorm',
      badgeName: 'Know the Storm',
    },
  ],
};