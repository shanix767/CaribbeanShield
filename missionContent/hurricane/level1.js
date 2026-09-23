// missionContent/hurricane/level1.js
//
// Content for Hurricane Ready - Level 1: "Know the Storm". This file is
// pure data - no UI code - so the same activity can be rendered by
// whichever reusable activity-type component matches its `type` (see
// components/activities/). GameContext never imports this file directly;
// screens pass it in wherever a readiness/XP calculation needs to know
// how many activities exist per stage.
//
// XP values match the CaribbeanShield Hurricane Mission scoring design:
// Learn subtotal 60, Plan 40, Prepare 40, Prove 60, Respond 60, Recover 40
// = 300 XP for the level, +25 completion bonus.
//
// Only the Learn stage has real content right now - Plan/Prepare/Prove/
// Respond/Recover are stubbed with correct ids and xpReward values (so XP
// totals are already right) but placeholder activity content, clearly
// marked TODO. Fill these in once the Learn-stage vertical slice has been
// tested end-to-end on device.

export const HURRICANE_LEVEL_1 = {
  levelNumber: 1,
  title: "Know the Storm",
  badgeId: "knowTheStorm",
  badgeName: "Know The Storm",
  completionBonusXp: 25,
  stages: {
    learn: {
      activities: [
        {
          id: "L1.1",
          type: "lesson",
          title: "What Is a Hurricane?",
          xpReward: 10,
          content: {
            body:
              "A hurricane is a powerful, rotating storm that forms over warm ocean water in the Atlantic. " +
              "Warm, moist air rises and cools, forming clouds and releasing heat that fuels the storm - the " +
              "warmer the ocean, the stronger a hurricane can grow. Storms are classed Category 1 to 5 on the " +
              "Saffir-Simpson scale, based on sustained wind speed.",
            bullets: [
              "Sustained winds of at least 74 mph (119 km/h) to be classed a hurricane",
              "The Atlantic hurricane season runs June 1 to November 30",
              "Dominica sits in an active hurricane path - Hurricane Maria (2017) was a Category 5 storm",
            ],
          },
        },
        {
          id: "L1.2",
          type: "quiz",
          title: "Hurricane Hazards Quiz",
          xpReward: 15,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "Which of these is NOT a hurricane hazard?",
                options: ["Storm surge", "Falling trees", "Drought", "Flying debris"],
                correctOptionIndex: 2,
                explanation:
                  "Drought is a slow-onset hazard unrelated to hurricanes. Hurricanes bring wind, rain, " +
                  "flooding, storm surge, landslides, and debris hazards.",
              },
              {
                id: "q2",
                prompt: "What is storm surge?",
                options: [
                  "A sudden rise in sea level pushed onshore by the storm",
                  "A type of hurricane warning siren",
                  "The eye of the hurricane",
                  "A category of wind speed",
                ],
                correctOptionIndex: 0,
                explanation:
                  "Storm surge is seawater pushed onto land by a hurricane's winds - often the deadliest " +
                  "hazard in a hurricane, especially in low-lying coastal areas.",
              },
              {
                id: "q3",
                prompt: "Heavy hurricane rainfall in Dominica's hills can trigger which secondary hazard?",
                options: ["Wildfire", "Landslides", "Drought", "Tornadoes only"],
                correctOptionIndex: 1,
                explanation:
                  "Dominica's steep, volcanic terrain makes landslides a major secondary hazard during " +
                  "heavy hurricane rainfall.",
              },
            ],
          },
        },
        {
          id: "L1.3",
          type: "lesson",
          title: "Watch vs Warning",
          xpReward: 10,
          content: {
            body:
              "The Office of Disaster Management (ODM) and NOAA's National Hurricane Center use two key " +
              "alert levels. Knowing the difference determines how urgently you need to act.",
            bullets: [
              "HURRICANE WATCH: hurricane conditions are POSSIBLE in your area, usually within 48 hours - start preparing now",
              "HURRICANE WARNING: hurricane conditions are EXPECTED in your area, usually within 36 hours - finish preparations immediately",
              "A Warning is more urgent than a Watch - it means the storm is close and preparation time is running out",
            ],
          },
        },
        {
          id: "L1.4",
          type: "checklist",
          title: "Hazard Hunt",
          xpReward: 15,
          content: {
            prompt: "Look at each item below. Select every one that would be a hurricane hazard around a home.",
            items: [
              { id: "i1", label: "Loose roof tiles", isCorrect: true },
              { id: "i2", label: "A well-secured garden shed", isCorrect: false },
              { id: "i3", label: "A large tree branch overhanging the roof", isCorrect: true },
              { id: "i4", label: "A car parked inside a closed garage", isCorrect: false },
              { id: "i5", label: "An unsecured gas cylinder near the house", isCorrect: true },
              { id: "i6", label: "Outdoor furniture left loose in the yard", isCorrect: true },
            ],
          },
        },
        {
          id: "L1.5",
          type: "quiz",
          title: "Hurricane Myths (True or False)",
          xpReward: 10,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "Taping windows in an X pattern will stop them from shattering in high winds.",
                options: ["True", "False"],
                correctOptionIndex: 1,
                explanation:
                  "False - tape does not add meaningful strength to glass and can create larger, more " +
                  "dangerous shards if the window breaks. Storm shutters or plywood are the real protection.",
              },
              {
                id: "q2",
                prompt: "The calm 'eye' of a hurricane means the storm has passed.",
                options: ["True", "False"],
                correctOptionIndex: 1,
                explanation:
                  "False - the eye is a temporary calm at the storm's centre. Winds return suddenly, " +
                  "often from the opposite direction, once the eye passes.",
              },
              {
                id: "q3",
                prompt: "A Category 1 hurricane can still be dangerous and cause serious damage.",
                options: ["True", "False"],
                correctOptionIndex: 0,
                explanation:
                  "True - even the lowest category brings winds strong enough to damage roofs, snap tree " +
                  "branches, and cause power outages.",
              },
            ],
          },
        },
      ],
    },

    // TODO: real content for the remaining five stages. ids and xpReward
    // values are already set to match the scoring design (Plan 40 total,
    // Prepare 40, Prove 60, Respond 60, Recover 40) so XP math is correct
    // even before real activity content is written - placeholder screens
    // will just show a "coming soon" note for now.
    plan: {
      activities: [
        {
          id: "L1.6",
          type: "checklist",
          title: "Identify Your Household Hazards",
          xpReward: 15,
          content: {
            prompt: "Which of these hazard types should a household in Dominica actually plan for during hurricane season?",
            items: [
              { id: "i1", label: "Flooding", isCorrect: true },
              { id: "i2", label: "Landslides", isCorrect: true },
              { id: "i3", label: "Strong winds", isCorrect: true },
              { id: "i4", label: "Coastal flooding / storm surge", isCorrect: true },
              { id: "i5", label: "Blizzards", isCorrect: false },
              { id: "i6", label: "Wildfire", isCorrect: false },
            ],
          },
        },
        {
          id: "L1.7",
          type: "checklist",
          title: "Find Your Safe Location",
          xpReward: 15,
          content: {
            prompt: "Which of these describe a good safe room to shelter in during a hurricane?",
            items: [
              { id: "i1", label: "Interior room with no windows", isCorrect: true },
              { id: "i2", label: "Small room under the stairs", isCorrect: true },
              { id: "i3", label: "Ground-floor room, away from flood-prone areas", isCorrect: true },
              { id: "i4", label: "Top-floor room with a balcony", isCorrect: false },
              { id: "i5", label: "Room with large glass doors", isCorrect: false },
              { id: "i6", label: "Basement known to flood", isCorrect: false },
            ],
          },
        },
        {
          id: "L1.8",
          type: "lesson",
          title: "Emergency Contact List",
          xpReward: 10,
          content: {
            body:
              "A written or saved emergency contact list matters most when phone networks are down and you " +
              "can't simply look a number up. Keep a copy on paper as well as on your phone.",
            bullets: [
              "Police, Fire, and Ambulance (Dominica): 911",
              "Office of Disaster Management (ODM): (767) 266-4411 / (767) 266-4412",
              "Dominica Red Cross Society: (767) 448-8280",
              "DOWASCO (water faults): (767) 448-4811 - DOMLEC (electricity faults): 811",
              "An out-of-area contact who can relay messages if local lines are jammed",
            ],
          },
        },
      ],
    },
    prepare: {
      activities: [
        {
          id: "L1.9",
          type: "checklist",
          title: "Build a Mini Emergency Kit",
          xpReward: 20,
          content: {
            prompt: "Select the items that belong in a basic emergency kit.",
            items: [
              { id: "i1", label: "Flashlight with spare batteries", isCorrect: true },
              { id: "i2", label: "Battery-powered or hand-crank radio", isCorrect: true },
              { id: "i3", label: "Bottled water (enough for several days)", isCorrect: true },
              { id: "i4", label: "Non-perishable food", isCorrect: true },
              { id: "i5", label: "Basic first aid supplies", isCorrect: true },
              { id: "i6", label: "Scented candles for lighting", isCorrect: false },
              { id: "i7", label: "Fireworks", isCorrect: false },
            ],
          },
        },
        {
          id: "L1.10",
          type: "matching",
          title: "Emergency Equipment Match",
          xpReward: 10,
          content: {
            prompt: "Match each item to what it's used for.",
            pairs: [
              { id: "p1", left: "🔦 Flashlight", right: "Provides light during a power outage" },
              { id: "p2", left: "📻 Radio", right: "Receives official emergency broadcasts" },
              { id: "p3", left: "💧 Water", right: "Keeps you hydrated for several days" },
              { id: "p4", left: "🩹 First Aid Kit", right: "Treats minor cuts and injuries" },
            ],
          },
        },
        {
          id: "L1.11",
          type: "checklist",
          title: "Emergency Information Sources",
          xpReward: 10,
          content: {
            prompt: "Which of these are reliable, official sources of hurricane information?",
            items: [
              { id: "i1", label: "Office of Disaster Management (ODM) alerts", isCorrect: true },
              { id: "i2", label: "National Hurricane Center bulletins", isCorrect: true },
              { id: "i3", label: "Government Information Service broadcasts", isCorrect: true },
              { id: "i4", label: "A forwarded WhatsApp voice note from a friend", isCorrect: false },
              { id: "i5", label: "An unverified social media post", isCorrect: false },
            ],
          },
        },
      ],
    },
    prove: {
      activities: [
        {
          id: "L1.12",
          type: "quiz",
          title: "10-Question Hurricane Quiz",
          xpReward: 25,
          content: {
            timeLimitSeconds: 20,
            questions: [
              {
                id: "q1",
                prompt: "A storm has sustained winds of 65 mph. What classification is it?",
                options: ["Tropical Depression", "Tropical Storm", "Hurricane", "Major Hurricane"],
                correctOptionIndex: 1,
                explanation:
                  "Tropical Storm covers 39-73 mph. It only becomes a hurricane once winds reach 74 mph.",
              },
              {
                id: "q2",
                prompt: "A hurricane is classed a 'Major Hurricane' starting at which category?",
                options: ["Category 1", "Category 2", "Category 3", "Category 4"],
                correctOptionIndex: 2,
                explanation: "Major Hurricane means Category 3 or higher.",
              },
              {
                id: "q3",
                prompt: "Under a Hurricane WATCH, about how much time do you have before conditions are possible?",
                options: ["12 hours", "36 hours", "48 hours", "72 hours"],
                correctOptionIndex: 2,
                explanation:
                  "48 hours for a Watch. 36 hours is the Warning threshold - don't mix the two up.",
              },
              {
                id: "q4",
                prompt: "Which of these is the SAFEST place to shelter during high winds?",
                options: [
                  "Room with a large window facing the storm",
                  "Top-floor bedroom with balcony access",
                  "Interior room with no windows",
                  "Garage with the door cracked open for ventilation",
                ],
                correctOptionIndex: 2,
                explanation:
                  "Interior, windowless rooms are safest. Cracking a garage door open does NOT relieve " +
                  "pressure - that's a myth, and it lets wind and debris in.",
              },
              {
                id: "q5",
                prompt: "According to ODM, how much water should you store per person, per day?",
                options: ["Half a gallon", "One gallon", "Two gallons", "Five gallons"],
                correctOptionIndex: 1,
                explanation: "At least one gallon per person, per day, per ODM's emergency kit guidance.",
              },
              {
                id: "q6",
                prompt: "What actually causes storm surge?",
                options: [
                  "Heavy rainfall overflowing rivers",
                  "Sea water pushed onshore by the storm's winds",
                  "Landslide debris blocking waterways",
                  "Water mains bursting under pressure",
                ],
                correctOptionIndex: 1,
                explanation:
                  "Storm surge is sea water pushed onto land by the hurricane's winds - a different " +
                  "mechanism from river or rain flooding.",
              },
              {
                id: "q7",
                prompt: "The hurricane's eye passes over and it goes suddenly calm. What should you do?",
                options: [
                  "Go outside to check for damage",
                  "Stay sheltered - winds return suddenly, often from the opposite direction",
                  "Call your emergency contacts immediately",
                  "Begin repairs while it's safe",
                ],
                correctOptionIndex: 1,
                explanation: "The eye is temporary. Leaving shelter during it is a common, dangerous mistake.",
              },
              {
                id: "q8",
                prompt: "When should you evacuate, if an evacuation order is given?",
                options: [
                  "Once winds start picking up",
                  "As soon as roads are already flooding",
                  "Immediately, before conditions worsen and roads become unsafe",
                  "Only once the hurricane reaches Category 3",
                ],
                correctOptionIndex: 2,
                explanation: "Waiting for visible danger before evacuating is what makes evacuations deadly.",
              },
              {
                id: "q9",
                prompt: "Which of these should NOT be relied on for official hurricane updates?",
                options: [
                  "ODM alerts",
                  "National Hurricane Center bulletins",
                  "A forwarded voice note from a friend",
                  "Local radio broadcasting ODM updates",
                ],
                correctOptionIndex: 2,
                explanation:
                  "Secondhand forwards are unverified and can be outdated or wrong - stick to official sources.",
              },
              {
                id: "q10",
                prompt: "What's the recommended plywood thickness for boarding up windows?",
                options: ["1/4 inch", "1/2 inch", "1 inch", "2 inch"],
                correctOptionIndex: 1,
                explanation:
                  "Half-inch plywood (marine plywood is best), pre-drilled for screws well before the storm.",
              },
            ],
          },
        },
        {
          id: "L1.13",
          type: "checklist",
          title: "Hazard Identification Test",
          xpReward: 20,
          content: {
            prompt: "Select every hurricane hazard from this list.",
            items: [
              { id: "i1", label: "Storm surge", isCorrect: true },
              { id: "i2", label: "Flying debris", isCorrect: true },
              { id: "i3", label: "Landslides", isCorrect: true },
              { id: "i4", label: "Downed power lines", isCorrect: true },
              { id: "i5", label: "Drought", isCorrect: false },
              { id: "i6", label: "Wildfire", isCorrect: false },
            ],
          },
        },
        {
          id: "L1.14",
          type: "scenario",
          title: "60-Second Decision Challenge",
          xpReward: 15,
          content: {
            situationText:
              "ODM has just issued a Hurricane Warning for Dominica. You're at home. What's your " +
              "immediate next step?",
            choices: [
              {
                id: "c1",
                text: "Finish securing loose outdoor items and check your emergency kit",
                isBestChoice: true,
                consequenceText:
                  "Right instinct - a Warning means the storm is close. Finishing preparation immediately, " +
                  "not waiting, is exactly what's needed.",
              },
              {
                id: "c2",
                text: "Wait and see how the weather looks in a few hours",
                isBestChoice: false,
                consequenceText:
                  "A Warning means conditions are expected within 36 hours - waiting narrows your " +
                  "preparation time right when you need it most.",
              },
              {
                id: "c3",
                text: "Go out to buy supplies you haven't gotten yet",
                isBestChoice: false,
                consequenceText:
                  "By Warning stage, roads and stores get busy and conditions can deteriorate fast - " +
                  "supply runs should happen at Watch stage, not Warning stage.",
              },
            ],
          },
        },
      ],
    },
    respond: {
      activities: [
        {
          id: "L1.15",
          type: "scenario",
          title: "Hurricane Warning Scenario",
          xpReward: 60,
          content: {
            situationText:
              "The hurricane has intensified overnight and ODM has now ordered evacuation for your " +
              "coastal community. You have about 30 minutes before roads become unsafe. What do you do?",
            choices: [
              {
                id: "c1",
                text: "Grab your emergency kit and evacuate to the designated shelter immediately",
                isBestChoice: true,
                consequenceText:
                  "Correct - once an evacuation order is given, moving immediately with your prepared kit " +
                  "is the safest response. Delaying risks being caught on unsafe roads.",
              },
              {
                id: "c2",
                text: "Stay to protect your property",
                isBestChoice: false,
                consequenceText:
                  "Property can be repaired or replaced - an evacuation order means your location is no " +
                  "longer considered safe. Staying behind puts your life at risk.",
              },
              {
                id: "c3",
                text: "Wait for a family member to arrive before leaving",
                isBestChoice: false,
                consequenceText:
                  "This is exactly why a family communication and meeting-point plan matters (a later " +
                  "mission covers this) - waiting past the safe window can trap everyone.",
              },
            ],
          },
        },
      ],
    },
    recover: {
      activities: [
        {
          id: "L1.16",
          type: "checklist",
          title: "After the Storm",
          xpReward: 40,
          content: {
            prompt: "After the storm passes, which of these should you watch out for before going outside?",
            items: [
              { id: "i1", label: "Downed power lines", isCorrect: true },
              { id: "i2", label: "Floodwater on roads", isCorrect: true },
              { id: "i3", label: "Damaged or unstable buildings", isCorrect: true },
              { id: "i4", label: "Fallen trees blocking roads", isCorrect: true },
              { id: "i5", label: "Freshly cut grass", isCorrect: false },
              { id: "i6", label: "Parked cars with no visible damage", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
};