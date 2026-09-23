// missionContent/onboarding/pretest.js
//
// The pretest shown once during onboarding, before any mission content is
// played. Its 16 questions are the exact same questions used later inside
// Hurricane Ready Level 1 (L1.2, L1.5, and L1.12 combined) - reused
// deliberately so pretest and posttest measure the same underlying
// knowledge. Worth remembering for the write-up: because L1.12 is also
// played during real gameplay, a player will see these exact questions
// again mid-mission, which is a genuine practice-effect risk to be
// explicit about in the methodology section, not something to paper over.
//
// ids are prefixed by source activity to stay globally unique when
// combined into one list (the originals were only unique within their own
// activity) - e.g. 'l1.2-q1', not just 'q1'.
//
// This is shaped as a single quiz "activity" object so it can be rendered
// directly by components/activities/Quiz.js without any changes to that
// component - xpReward is set to 16 (the question count) specifically so
// Quiz's built-in scoring math (xpReward * correct/total, rounded)
// resolves to exactly "number of questions correct," which the Pretest
// screen then reads as the actual score rather than as XP. No
// timeLimitSeconds is set - the pretest is deliberately untimed, since it
// measures baseline knowledge, not performance under time pressure.

export const PRETEST_ACTIVITY = {
  id: 'pretest',
  type: 'quiz',
  title: 'Hurricane Readiness Pretest',
  xpReward: 16,
  content: {
    questions: [
      // --- from L1.2: Hurricane Hazards Quiz ---
      {
        id: 'l1.2-q1',
        prompt: 'Which of these is NOT a hurricane hazard?',
        options: ['Storm surge', 'Falling trees', 'Drought', 'Flying debris'],
        correctOptionIndex: 2,
        explanation:
          'Drought is a slow-onset hazard unrelated to hurricanes. Hurricanes bring wind, rain, ' +
          'flooding, storm surge, landslides, and debris hazards.',
      },
      {
        id: 'l1.2-q2',
        prompt: 'What is storm surge?',
        options: [
          'A sudden rise in sea level pushed onshore by the storm',
          'A type of hurricane warning siren',
          'The eye of the hurricane',
          'A category of wind speed',
        ],
        correctOptionIndex: 0,
        explanation:
          'Storm surge is seawater pushed onto land by a hurricane\u2019s winds - often the deadliest ' +
          'hazard in a hurricane, especially in low-lying coastal areas.',
      },
      {
        id: 'l1.2-q3',
        prompt: 'Heavy hurricane rainfall in Dominica\u2019s hills can trigger which secondary hazard?',
        options: ['Wildfire', 'Landslides', 'Drought', 'Tornadoes only'],
        correctOptionIndex: 1,
        explanation:
          'Dominica\u2019s steep, volcanic terrain makes landslides a major secondary hazard during ' +
          'heavy hurricane rainfall.',
      },

      // --- from L1.5: Hurricane Myths (True or False) ---
      {
        id: 'l1.5-q1',
        prompt: 'Taping windows in an X pattern will stop them from shattering in high winds.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
        explanation:
          'False - tape does not add meaningful strength to glass and can create larger, more ' +
          'dangerous shards if the window breaks. Storm shutters or plywood are the real protection.',
      },
      {
        id: 'l1.5-q2',
        prompt: 'The calm "eye" of a hurricane means the storm has passed.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
        explanation:
          'False - the eye is a temporary calm at the storm\u2019s centre. Winds return suddenly, ' +
          'often from the opposite direction, once the eye passes.',
      },
      {
        id: 'l1.5-q3',
        prompt: 'A Category 1 hurricane can still be dangerous and cause serious damage.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
        explanation:
          'True - even the lowest category brings winds strong enough to damage roofs, snap tree ' +
          'branches, and cause power outages.',
      },

      // --- from L1.12: 10-Question Hurricane Quiz ---
      {
        id: 'l1.12-q1',
        prompt: 'A storm has sustained winds of 65 mph. What classification is it?',
        options: ['Tropical Depression', 'Tropical Storm', 'Hurricane', 'Major Hurricane'],
        correctOptionIndex: 1,
        explanation:
          'Tropical Storm covers 39-73 mph. It only becomes a hurricane once winds reach 74 mph.',
      },
      {
        id: 'l1.12-q2',
        prompt: 'A hurricane is classed a "Major Hurricane" starting at which category?',
        options: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
        correctOptionIndex: 2,
        explanation: 'Major Hurricane means Category 3 or higher.',
      },
      {
        id: 'l1.12-q3',
        prompt: 'Under a Hurricane WATCH, about how much time do you have before conditions are possible?',
        options: ['12 hours', '36 hours', '48 hours', '72 hours'],
        correctOptionIndex: 2,
        explanation:
          '48 hours for a Watch. 36 hours is the Warning threshold - don\u2019t mix the two up.',
      },
      {
        id: 'l1.12-q4',
        prompt: 'Which of these is the SAFEST place to shelter during high winds?',
        options: [
          'Room with a large window facing the storm',
          'Top-floor bedroom with balcony access',
          'Interior room with no windows',
          'Garage with the door cracked open for ventilation',
        ],
        correctOptionIndex: 2,
        explanation:
          'Interior, windowless rooms are safest. Cracking a garage door open does NOT relieve ' +
          'pressure - that\u2019s a myth, and it lets wind and debris in.',
      },
      {
        id: 'l1.12-q5',
        prompt: 'According to ODM, how much water should you store per person, per day?',
        options: ['Half a gallon', 'One gallon', 'Two gallons', 'Five gallons'],
        correctOptionIndex: 1,
        explanation: 'At least one gallon per person, per day, per ODM\u2019s emergency kit guidance.',
      },
      {
        id: 'l1.12-q6',
        prompt: 'What actually causes storm surge?',
        options: [
          'Heavy rainfall overflowing rivers',
          'Sea water pushed onshore by the storm\u2019s winds',
          'Landslide debris blocking waterways',
          'Water mains bursting under pressure',
        ],
        correctOptionIndex: 1,
        explanation:
          'Storm surge is sea water pushed onto land by the hurricane\u2019s winds - a different ' +
          'mechanism from river or rain flooding.',
      },
      {
        id: 'l1.12-q7',
        prompt: 'The hurricane\u2019s eye passes over and it goes suddenly calm. What should you do?',
        options: [
          'Go outside to check for damage',
          'Stay sheltered - winds return suddenly, often from the opposite direction',
          'Call your emergency contacts immediately',
          'Begin repairs while it\u2019s safe',
        ],
        correctOptionIndex: 1,
        explanation: 'The eye is temporary. Leaving shelter during it is a common, dangerous mistake.',
      },
      {
        id: 'l1.12-q8',
        prompt: 'When should you evacuate, if an evacuation order is given?',
        options: [
          'Once winds start picking up',
          'As soon as roads are already flooding',
          'Immediately, before conditions worsen and roads become unsafe',
          'Only once the hurricane reaches Category 3',
        ],
        correctOptionIndex: 2,
        explanation: 'Waiting for visible danger before evacuating is what makes evacuations deadly.',
      },
      {
        id: 'l1.12-q9',
        prompt: 'Which of these should NOT be relied on for official hurricane updates?',
        options: [
          'ODM alerts',
          'National Hurricane Center bulletins',
          'A forwarded voice note from a friend',
          'Local radio broadcasting ODM updates',
        ],
        correctOptionIndex: 2,
        explanation:
          'Secondhand forwards are unverified and can be outdated or wrong - stick to official sources.',
      },
      {
        id: 'l1.12-q10',
        prompt: "What's the recommended plywood thickness for boarding up windows?",
        options: ['1/4 inch', '1/2 inch', '1 inch', '2 inch'],
        correctOptionIndex: 1,
        explanation:
          'Half-inch plywood (marine plywood is best), pre-drilled for screws well before the storm.',
      },
    ],
  },
};