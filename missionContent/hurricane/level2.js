// missionContent/hurricane/level2.js

export const HURRICANE_LEVEL_2 = {
  levelNumber: 2,
  title: 'Level Title',
  badgeId: 'personalPreparedness',
  badgeName: 'Personal Preparedness',
  completionBonusXp: 25,

  stages: {
    learn: {
      activities: [
        {
          id: 'L2.1',
          type: 'lesson',
          title: 'Placeholder Lesson',
          xpReward: 10,
          content: {
            body: 'Placeholder lesson content.',
            bullets: [
              'Key point 1',
              'Key point 2',
              'Key point 3',
            ],
          },
        },
        {
          id: 'L2.2',
          type: 'quiz',
          title: 'Placeholder Quiz',
          xpReward: 15,
          content: {
            questions: [],
          },
        },
        {
          id: 'L2.3',
          type: 'lesson',
          title: 'Placeholder Lesson',
          xpReward: 10,
          content: {
            body: 'Placeholder lesson content.',
            bullets: [],
          },
        },
        {
          id: 'L2.4',
          type: 'checklist',
          title: 'Placeholder Checklist',
          xpReward: 15,
          content: {
            prompt: 'Placeholder checklist prompt.',
            items: [],
          },
        },
        {
          id: 'L2.5',
          type: 'quiz',
          title: 'Placeholder Quiz',
          xpReward: 10,
          content: {
            questions: [],
          },
        },
      ],
    },

    plan: {
      activities: [
        {
          id: 'L2.6',
          type: 'checklist',
          title: 'Placeholder Planning Activity',
          xpReward: 15,
          content: {
            prompt: 'Placeholder prompt.',
            items: [],
          },
        },
        {
          id: 'L2.7',
          type: 'checklist',
          title: 'Placeholder Safe Location Activity',
          xpReward: 15,
          content: {
            prompt: 'Placeholder prompt.',
            items: [],
          },
        },
        {
          id: 'L2.8',
          type: 'lesson',
          title: 'Placeholder Emergency Contacts',
          xpReward: 10,
          content: {
            body: 'Placeholder content.',
            bullets: [],
          },
        },
      ],
    },

    prepare: {
      activities: [
        {
          id: 'L2.9',
          type: 'checklist',
          title: 'Placeholder Preparation Checklist',
          xpReward: 20,
          content: {
            prompt: 'Placeholder prompt.',
            items: [],
          },
        },
        {
          id: 'L2.10',
          type: 'matching',
          title: 'Placeholder Matching Activity',
          xpReward: 10,
          content: {
            prompt: 'Placeholder prompt.',
            pairs: [],
          },
        },
        {
          id: 'L2.11',
          type: 'checklist',
          title: 'Placeholder Information Sources',
          xpReward: 10,
          content: {
            prompt: 'Placeholder prompt.',
            items: [],
          },
        },
      ],
    },

    prove: {
      activities: [
        {
          id: 'L2.12',
          type: 'quiz',
          title: 'Placeholder Readiness Quiz',
          xpReward: 25,
          content: {
            timeLimitSeconds: 20,
            questions: [],
          },
        },
        {
          id: 'L2.13',
          type: 'checklist',
          title: 'Placeholder Hazard Test',
          xpReward: 20,
          content: {
            prompt: 'Placeholder prompt.',
            items: [],
          },
        },
        {
          id: 'L2.14',
          type: 'scenario',
          title: 'Placeholder Decision Challenge',
          xpReward: 15,
          content: {
            situationText: 'Placeholder situation.',
            choices: [],
          },
        },
      ],
    },

    respond: {
      activities: [
        {
          id: 'L2.15',
          type: 'scenario',
          title: 'Placeholder Response Scenario',
          xpReward: 60,
          content: {
            situationText: 'Placeholder situation.',
            choices: [],
          },
        },
      ],
    },

    recover: {
      activities: [
        {
          id: 'L2.16',
          type: 'checklist',
          title: 'Placeholder Recovery Checklist',
          xpReward: 40,
          content: {
            prompt: 'Placeholder recovery prompt.',
            items: [],
          },
        },
      ],
    },
  },
};