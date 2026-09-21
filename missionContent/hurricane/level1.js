// missionContent/hurricane/level1.js
//
// Content for Hurricane Ready — Level 1: "Know the Storm". This file is
// pure data — no UI code — so the same activity can be rendered by
// whichever reusable activity-type component matches its `type` (see
// components/activities/). GameContext never imports this file directly;
// screens pass it in wherever a readiness/XP calculation needs to know
// how many activities exist per stage.
//
// XP values match the CaribbeanShield Hurricane Mission scoring design:
// Learn subtotal 60, Plan 40, Prepare 40, Prove 60, Respond 60, Recover 40
// = 300 XP for the level, +25 completion bonus.
//
// Only the Learn stage has real content right now — Plan/Prepare/Prove/
// Respond/Recover are stubbed with correct ids and xpReward values (so XP
// totals are already right) but placeholder activity content, clearly
// marked TODO. Fill these in once the Learn-stage vertical slice has been
// tested end-to-end on device.

export const HURRICANE_LEVEL_1 = {
  levelNumber: 1,
  title: 'Know the Storm',
  badgeId: 'stormWatcher',
  badgeName: 'Storm Watcher',
  completionBonusXp: 25,
  stages: {
    learn: {
      activities: [
        {
          id: 'L1.1',
          type: 'lesson',
          title: 'What Is a Hurricane?',
          xpReward: 10,
          content: {
            body:
              'A hurricane is a powerful, rotating storm that forms over warm ocean water in the Atlantic. ' +
              'Warm, moist air rises and cools, forming clouds and releasing heat that fuels the storm — the ' +
              'warmer the ocean, the stronger a hurricane can grow. Storms are classed Category 1 to 5 on the ' +
              'Saffir-Simpson scale, based on sustained wind speed.',
            bullets: [
              'Sustained winds of at least 74 mph (119 km/h) to be classed a hurricane',
              'The Atlantic hurricane season runs June 1 to November 30',
              'Dominica sits in an active hurricane path — Hurricane Maria (2017) was a Category 5 storm',
            ],
          },
        },
        {
          id: 'L1.2',
          type: 'quiz',
          title: 'Hurricane Hazards Quiz',
          xpReward: 15,
          content: {
            questions: [
              {
                id: 'q1',
                prompt: 'Which of these is NOT a hurricane hazard?',
                options: ['Storm surge', 'Falling trees', 'Drought', 'Flying debris'],
                correctOptionIndex: 2,
                explanation:
                  'Drought is a slow-onset hazard unrelated to hurricanes. Hurricanes bring wind, rain, ' +
                  'flooding, storm surge, landslides, and debris hazards.',
              },
              {
                id: 'q2',
                prompt: 'What is storm surge?',
                options: [
                  'A sudden rise in sea level pushed onshore by the storm',
                  'A type of hurricane warning siren',
                  'The eye of the hurricane',
                  'A category of wind speed',
                ],
                correctOptionIndex: 0,
                explanation:
                  'Storm surge is seawater pushed onto land by a hurricane\u2019s winds — often the deadliest ' +
                  'hazard in a hurricane, especially in low-lying coastal areas.',
              },
              {
                id: 'q3',
                prompt: 'Heavy hurricane rainfall in Dominica\u2019s hills can trigger which secondary hazard?',
                options: ['Wildfire', 'Landslides', 'Drought', 'Tornadoes only'],
                correctOptionIndex: 1,
                explanation:
                  'Dominica\u2019s steep, volcanic terrain makes landslides a major secondary hazard during ' +
                  'heavy hurricane rainfall.',
              },
            ],
          },
        },
        {
          id: 'L1.3',
          type: 'lesson',
          title: 'Watch vs Warning',
          xpReward: 10,
          content: {
            body:
              'The Office of Disaster Management (ODM) and NOAA\u2019s National Hurricane Center use two key ' +
              'alert levels. Knowing the difference determines how urgently you need to act.',
            bullets: [
              'HURRICANE WATCH: hurricane conditions are POSSIBLE in your area, usually within 48 hours — start preparing now',
              'HURRICANE WARNING: hurricane conditions are EXPECTED in your area, usually within 36 hours — finish preparations immediately',
              'A Warning is more urgent than a Watch — it means the storm is close and preparation time is running out',
            ],
          },
        },
        {
          id: 'L1.4',
          type: 'checklist',
          title: 'Hazard Hunt',
          xpReward: 15,
          content: {
            prompt: 'Look at each item below. Select every one that would be a hurricane hazard around a home.',
            items: [
              { id: 'i1', label: 'Loose roof tiles', isCorrect: true },
              { id: 'i2', label: 'A well-secured garden shed', isCorrect: false },
              { id: 'i3', label: 'A large tree branch overhanging the roof', isCorrect: true },
              { id: 'i4', label: 'A car parked inside a closed garage', isCorrect: false },
              { id: 'i5', label: 'An unsecured gas cylinder near the house', isCorrect: true },
              { id: 'i6', label: 'Outdoor furniture left loose in the yard', isCorrect: true },
            ],
          },
        },
        {
          id: 'L1.5',
          type: 'quiz',
          title: 'Hurricane Myths (True or False)',
          xpReward: 10,
          content: {
            questions: [
              {
                id: 'q1',
                prompt: 'Taping windows in an X pattern will stop them from shattering in high winds.',
                options: ['True', 'False'],
                correctOptionIndex: 1,
                explanation:
                  'False — tape does not add meaningful strength to glass and can create larger, more ' +
                  'dangerous shards if the window breaks. Storm shutters or plywood are the real protection.',
              },
              {
                id: 'q2',
                prompt: 'The calm "eye" of a hurricane means the storm has passed.',
                options: ['True', 'False'],
                correctOptionIndex: 1,
                explanation:
                  'False — the eye is a temporary calm at the storm\u2019s centre. Winds return suddenly, ' +
                  'often from the opposite direction, once the eye passes.',
              },
              {
                id: 'q3',
                prompt: 'A Category 1 hurricane can still be dangerous and cause serious damage.',
                options: ['True', 'False'],
                correctOptionIndex: 0,
                explanation:
                  'True — even the lowest category brings winds strong enough to damage roofs, snap tree ' +
                  'branches, and cause power outages.',
              },
            ],
          },
        },
      ],
    },

    // TODO: real content for the remaining five stages. ids and xpReward
    // values are already set to match the scoring design (Plan 40 total,
    // Prepare 40, Prove 60, Respond 60, Recover 40) so XP math is correct
    // even before real activity content is written — placeholder screens
    // will just show a "coming soon" note for now.
    plan: {
      activities: [
        { id: 'L1.6', type: 'checklist', title: 'Identify Your Household Hazards', xpReward: 15, content: null },
        { id: 'L1.7', type: 'checklist', title: 'Find Your Safe Location', xpReward: 15, content: null },
        { id: 'L1.8', type: 'lesson', title: 'Emergency Contact List', xpReward: 10, content: null },
      ],
    },
    prepare: {
      activities: [
        { id: 'L1.9', type: 'checklist', title: 'Build a Mini Emergency Kit', xpReward: 20, content: null },
        { id: 'L1.10', type: 'matching', title: 'Emergency Equipment Match', xpReward: 10, content: null },
        { id: 'L1.11', type: 'checklist', title: 'Emergency Information Sources', xpReward: 10, content: null },
      ],
    },
    prove: {
      activities: [
        { id: 'L1.12', type: 'quiz', title: '10-Question Hurricane Quiz', xpReward: 25, content: null },
        { id: 'L1.13', type: 'checklist', title: 'Hazard Identification Test', xpReward: 20, content: null },
        { id: 'L1.14', type: 'scenario', title: '60-Second Decision Challenge', xpReward: 15, content: null },
      ],
    },
    respond: {
      activities: [
        { id: 'L1.15', type: 'scenario', title: 'Hurricane Warning Scenario', xpReward: 60, content: null },
      ],
    },
    recover: {
      activities: [
        { id: 'L1.16', type: 'checklist', title: 'After the Storm', xpReward: 40, content: null },
      ],
    },
  },
};