// missionContent/hurricane/level6.js
//
// Hurricane Ready - Level 6: "Hurricane Master", the capstone. Per the
// design doc, this level introduces no new information - it integrates
// and tests everything from Levels 1-5 at once. Content here deliberately
// reuses facts, numbers, and scenarios already established earlier in the
// mission (Watch/Warning timing, go-bag contents, plywood spec, family
// plan fields, response principles) rather than adding new material.
//
// The Respond stage"s "Ultimate Hurricane Simulation" is built as three
// chained 100-XP scenarios (integrated decision points spanning
// prepare/evacuate/post-eye moments) rather than one single decision, same
// reasoning as Level 5"s multi-event Respond stage.
//
// XP: Learn 100, Plan 200, Prepare 220, Prove 230, Respond 300, Recover 150
// = 1200 for the level, +150 completion bonus. Badge: Hurricane Master -
// earning it also completes the whole Hurricane Ready mission (see
// missionContent/hurricane/index.js"s missionBadge).

export const HURRICANE_LEVEL_6 = {
  levelNumber: 6,
  title: "Hurricane Mastery",
  badgeId: "hurricaneMaster",
  badgeName: "Hurricane Master",
  completionBonusXp: 150,
  stages: {
    learn: {
      activities: [
        {
          id: "L6.1",
          type: "quiz",
          title: "Hurricane Masterclass",
          xpReward: 30,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "What sustained wind speed makes a storm a hurricane?",
                options: ["39 mph", "50 mph", "74 mph", "100 mph"],
                correctOptionIndex: 2,
                explanation: "74 mph is the threshold - below that, it's classed a tropical storm.",
              },
              {
                id: "q2",
                prompt: "A Hurricane Watch means conditions are possible within roughly how long?",
                options: ["12 hours", "24 hours", "48 hours", "72 hours"],
                correctOptionIndex: 2,
                explanation: "48 hours for a Watch; 36 hours or less for a Warning.",
              },
              {
                id: "q3",
                prompt: "What actually causes storm surge?",
                options: [
                  "Heavy rainfall alone",
                  "Sea water pushed onshore by the storm's winds",
                  "Landslides blocking rivers",
                  "Atmospheric pressure alone, with no wind involved",
                ],
                correctOptionIndex: 1,
                explanation: "Storm surge is sea water driven onshore by the hurricane's winds.",
              },
            ],
          },
        },
        {
          id: "L6.2",
          type: "checklist",
          title: "Comprehensive Hazard Test",
          xpReward: 30,
          content: {
            prompt: "Select every genuine hurricane hazard from this list.",
            items: [
              { id: "i1", label: "Storm surge", isCorrect: true },
              { id: "i2", label: "Landslides", isCorrect: true },
              { id: "i3", label: "Downed power lines", isCorrect: true },
              { id: "i4", label: "Flying debris", isCorrect: true },
              { id: "i5", label: "Contaminated floodwater", isCorrect: true },
              { id: "i6", label: "Drought", isCorrect: false },
              { id: "i7", label: "Wildfire", isCorrect: false },
            ],
          },
        },
        {
          id: "L6.3",
          type: "quiz",
          title: "Myth vs Fact",
          xpReward: 20,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "Taping windows in an X pattern prevents them from shattering.",
                options: ["True", "False"],
                correctOptionIndex: 1,
                explanation: "False - tape doesn't meaningfully strengthen glass and can worsen shard risk.",
              },
              {
                id: "q2",
                prompt: "Cracking a garage door open during high winds relieves pressure and protects the roof.",
                options: ["True", "False"],
                correctOptionIndex: 1,
                explanation: "False - this is a myth. It lets wind and debris in rather than relieving anything.",
              },
              {
                id: "q3",
                prompt: "A calm eye passing overhead means the hurricane has ended.",
                options: ["True", "False"],
                correctOptionIndex: 1,
                explanation: "False - winds return suddenly once the eye passes, often from the opposite direction.",
              },
            ],
          },
        },
        {
          id: "L6.4",
          type: "quiz",
          title: "Emergency Decision Knowledge",
          xpReward: 20,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "When should you evacuate, once an order is given?",
                options: [
                  "Immediately",
                  "Once conditions look genuinely bad",
                  "Only if the hurricane reaches Category 3",
                  "Whenever convenient",
                ],
                correctOptionIndex: 0,
                explanation: "Immediately - waiting for visible danger is what makes evacuations dangerous.",
              },
              {
                id: "q2",
                prompt: "What's the safest place to shelter during high winds?",
                options: [
                  "A room with large windows",
                  "An interior room with no windows",
                  "A top-floor balcony room",
                  "A garage with the door cracked open",
                ],
                correctOptionIndex: 1,
                explanation: "An interior, windowless room minimises exposure to wind and debris.",
              },
            ],
          },
        },
      ],
    },

    plan: {
      activities: [
        {
          id: "L6.5",
          type: "checklist",
          title: "Complete Family Plan Review",
          xpReward: 50,
          content: {
            prompt: "A complete family plan should cover every one of these - select them all.",
            items: [
              { id: "i1", label: "Written communication plan with every household member's contacts", isCorrect: true },
              { id: "i2", label: "In-neighbourhood and out-of-neighbourhood meeting places", isCorrect: true },
              { id: "i3", label: "Assigned roles for evacuation (documents, kit, pets, etc.)", isCorrect: true },
              { id: "i4", label: "Plans specific to any vulnerable household members", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.6",
          type: "checklist",
          title: "Complete Evacuation Plan Review",
          xpReward: 40,
          content: {
            prompt: "A complete evacuation plan includes which of these?",
            items: [
              { id: "i1", label: "A primary route AND a backup", isCorrect: true },
              { id: "i2", label: "A known destination (shelter or safe location)", isCorrect: true },
              { id: "i3", label: "Personal triggers for leaving even without an official order", isCorrect: true },
              { id: "i4", label: "A plan everyone in the household actually knows", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.7",
          type: "checklist",
          title: "Complete Communication Plan Review",
          xpReward: 40,
          content: {
            prompt: "Select what belongs in a complete communication plan.",
            items: [
              { id: "i1", label: "A written, physical copy - not just saved on a phone", isCorrect: true },
              { id: "i2", label: "An out-of-community or off-island contact", isCorrect: true },
              { id: "i3", label: "A fallback plan for if phones don't work at all", isCorrect: true },
              { id: "i4", label: "Official emergency numbers (ODM, Police, Fire & Ambulance)", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.8",
          type: "checklist",
          title: "Complete Home Safety Plan Review",
          xpReward: 35,
          content: {
            prompt: "A complete home safety plan addresses which of these?",
            items: [
              { id: "i1", label: "Roof and window protection", isCorrect: true },
              { id: "i2", label: "Drainage and flood risk around the property", isCorrect: true },
              { id: "i3", label: "Loose outdoor items and hazardous trees", isCorrect: true },
              { id: "i4", label: "A safe interior room, identified in advance", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.9",
          type: "lesson",
          title: "Complete Recovery Plan Review",
          xpReward: 35,
          content: {
            body:
              "A recovery plan is easy to skip since it only matters after the storm - but the first " +
              "hours after a hurricane carry real risks of their own.",
            bullets: [
              "Know to wait for an official All Clear before travelling",
              "Have a plan for checking on vulnerable neighbours where it's safe to do so",
              "Know what to check before re-entering your home: power lines, structural damage, floodwater",
            ],
          },
        },
      ],
    },

    prepare: {
      activities: [
        {
          id: "L6.10",
          type: "checklist",
          title: "Complete Emergency Kit Review",
          xpReward: 50,
          content: {
            prompt: "A complete household emergency kit includes which of these?",
            items: [
              { id: "i1", label: "Water - at least a gallon per person, per day", isCorrect: true },
              { id: "i2", label: "Non-perishable food and a manual can opener", isCorrect: true },
              { id: "i3", label: "First aid kit and a month's medication supply", isCorrect: true },
              { id: "i4", label: "Battery or hand-crank radio and flashlights", isCorrect: true },
              { id: "i5", label: "Warm blankets for each person", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.11",
          type: "checklist",
          title: "Complete Go-Bag Review",
          xpReward: 40,
          content: {
            prompt: "Select everything a complete, ready-to-grab go bag should contain.",
            items: [
              { id: "i1", label: "At least one day of water and food", isCorrect: true },
              { id: "i2", label: "Cash, since card machines may be down", isCorrect: true },
              { id: "i3", label: "Important documents in a waterproof container", isCorrect: true },
              { id: "i4", label: "A change of clothes", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.12",
          type: "checklist",
          title: "Household Supplies Review",
          xpReward: 40,
          content: {
            prompt: "Which of these belong in your broader household supplies (beyond the go bag)?",
            items: [
              { id: "i1", label: "Extra batteries for all battery-operated items", isCorrect: true },
              { id: "i2", label: "Masks and hand sanitizer", isCorrect: true },
              { id: "i3", label: "Paper plates, cups, and utensils", isCorrect: true },
              { id: "i4", label: "A power bank or generator, if available", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.13",
          type: "checklist",
          title: "Home Preparation Review",
          xpReward: 40,
          content: {
            prompt: "Complete home preparation includes which of these?",
            items: [
              { id: "i1", label: "Windows shuttered or boarded with ½ inch plywood", isCorrect: true },
              { id: "i2", label: "Roof sheeting checked and secured", isCorrect: true },
              { id: "i3", label: "Drains and gutters cleared", isCorrect: true },
              { id: "i4", label: "Loose outdoor items secured or stored", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.14",
          type: "checklist",
          title: "Family Preparation Review",
          xpReward: 30,
          content: {
            prompt: "Complete family preparation includes which of these?",
            items: [
              { id: "i1", label: "Every household member has a go bag suited to their needs", isCorrect: true },
              { id: "i2", label: "Roles are assigned for evacuation", isCorrect: true },
              { id: "i3", label: "Children know their home address and a parent's number", isCorrect: true },
            ],
          },
        },
        {
          id: "L6.15",
          type: "checklist",
          title: "Pet Preparation Review",
          xpReward: 20,
          content: {
            prompt: "Complete pet preparation includes which of these?",
            items: [
              { id: "i1", label: "At least 3 days of food and water for the pet", isCorrect: true },
              { id: "i2", label: "A leash or carrier", isCorrect: true },
              { id: "i3", label: "A known plan for where the pet goes if the shelter doesn't allow pets", isCorrect: true },
            ],
          },
        },
      ],
    },

    prove: {
      activities: [
        {
          id: "L6.16",
          type: "quiz",
          title: "Hurricane Readiness Assessment",
          xpReward: 100,
          content: {
            timeLimitSeconds: 20,
            questions: [
              {
                id: "q1",
                prompt: "A storm has 65 mph winds. What is it classified as?",
                options: ["Tropical Depression", "Tropical Storm", "Hurricane", "Major Hurricane"],
                correctOptionIndex: 1,
                explanation: "65 mph falls within the Tropical Storm range (39-73 mph).",
              },
              {
                id: "q2",
                prompt: "A 'Major Hurricane' is Category ___ or higher.",
                options: ["1", "2", "3", "4"],
                correctOptionIndex: 2,
                explanation: "Category 3 or higher is classed a Major Hurricane.",
              },
              {
                id: "q3",
                prompt: "What's the recommended plywood thickness for boarding windows?",
                options: ["1/4 inch", "1/2 inch", "1 inch", "2 inch"],
                correctOptionIndex: 1,
                explanation: "Half-inch plywood, ideally marine plywood, pre-drilled ahead of time.",
              },
              {
                id: "q4",
                prompt: "What should you do if the eye of the storm passes overhead?",
                options: [
                  "Go check for damage",
                  "Stay sheltered - winds return suddenly",
                  "Assume it's over",
                  "Head to your vehicle",
                ],
                correctOptionIndex: 1,
                explanation: "The eye is temporary - winds return rapidly, often from the opposite direction.",
              },
              {
                id: "q5",
                prompt: "How much water should be stored per person, per day?",
                options: ["Half a gallon", "One gallon", "Three gallons", "None needed if near a river"],
                correctOptionIndex: 1,
                explanation: "At least one gallon per person, per day, per ODM's guidance.",
              },
            ],
          },
        },
        {
          id: "L6.17",
          type: "checklist",
          title: "Preparedness Inspection",
          xpReward: 70,
          content: {
            prompt: "A full household inspection - select everything that indicates genuine readiness.",
            items: [
              { id: "i1", label: "Go bags packed for every household member", isCorrect: true },
              { id: "i2", label: "Windows protected and roof checked", isCorrect: true },
              { id: "i3", label: "Written communication plan in every go bag", isCorrect: true },
              { id: "i4", label: "A month's medication supply for anyone who needs it", isCorrect: true },
              { id: "i5", label: "Pet supplies packed, if applicable", isCorrect: true },
              { id: "i6", label: "An unopened bag of chips in the pantry", isCorrect: false },
            ],
          },
        },
        {
          id: "L6.18",
          type: "scenario",
          title: "Decision-Making Challenge",
          xpReward: 60,
          content: {
            situationText:
              "A Hurricane Warning has just been issued. You're fully prepared - kit packed, home " +
              "secured, family plan in place. What's left to do before the storm arrives?",
            choices: [
              {
                id: "c1",
                text: "Do a final readiness check, stay informed via radio, and move to your safe room once conditions worsen",
                isBestChoice: true,
                consequenceText:
                  "Exactly right - with real preparation already done, the final steps are about staying " +
                  "informed and knowing when to move to shelter, not scrambling to prepare.",
              },
              {
                id: "c2",
                text: "Relax completely since everything is already prepared",
                isBestChoice: false,
                consequenceText:
                  "Preparation reduces risk, but staying informed and ready to act as conditions change " +
                  "still matters right up until the storm passes.",
              },
            ],
          },
        },
      ],
    },

    respond: {
      activities: [
        {
          id: "L6.19",
          type: "scenario",
          title: "Full Simulation: Preparation Under Pressure",
          xpReward: 100,
          content: {
            situationText:
              "A hurricane has intensified faster than forecast. A Watch became a Warning in just a few " +
              "hours, and you still have final preparations to finish. What's the right approach?",
            choices: [
              {
                id: "c1",
                text: "Work through your pre-decided priority list - go bags, documents, windows - fastest, most critical items first",
                isBestChoice: true,
                consequenceText:
                  "This is exactly why preparation and prioritisation happen in advance - under real time " +
                  "pressure, you execute a known plan rather than deciding priorities from scratch.",
              },
              {
                id: "c2",
                text: "Try to do everything at once, in no particular order",
                isBestChoice: false,
                consequenceText:
                  "Without a clear priority order, critical tasks (like securing medication or documents) " +
                  "can get missed in the rush to do everything simultaneously.",
              },
            ],
          },
        },
        {
          id: "L6.20",
          type: "scenario",
          title: "Full Simulation: The Evacuation",
          xpReward: 100,
          content: {
            situationText:
              "An evacuation order is issued. Your family is in different locations, communication is " +
              "patchy, and your primary route shows early flooding. What's the right response?",
            choices: [
              {
                id: "c1",
                text: "Each person follows their pre-agreed role and route, using the backup route for flooding, and the family reconnects at the agreed meeting point",
                isBestChoice: true,
                consequenceText:
                  "This is every piece of the mission working together - family roles, a backup route, " +
                  "and a meeting point, all decided in advance rather than improvised now.",
              },
              {
                id: "c2",
                text: "Wait at home until everyone can travel together",
                isBestChoice: false,
                consequenceText:
                  "Waiting to regroup before moving, once an evacuation order is active, risks running out " +
                  "of safe time to leave at all.",
              },
            ],
          },
        },
        {
          id: "L6.21",
          type: "scenario",
          title: "Full Simulation: After the Eye",
          xpReward: 100,
          content: {
            situationText:
              "You're at the shelter. The winds went calm - likely the eye - and have now picked back " +
              "up violently from a different direction, exactly as expected. What do you do?",
            choices: [
              {
                id: "c1",
                text: "Stay sheltered, having expected this, and continue waiting it out safely",
                isBestChoice: true,
                consequenceText:
                  "Correct - recognising the eye for what it is, rather than being caught off guard by " +
                  "it, is exactly what Level 5's training was for.",
              },
              {
                id: "c2",
                text: "Panic and try to find a different, 'safer' spot",
                isBestChoice: false,
                consequenceText:
                  "Moving unnecessarily once winds resume is more dangerous than staying in your already-" +
                  "established safe spot.",
              },
            ],
          },
        },
      ],
    },

    recover: {
      activities: [
        {
          id: "L6.22",
          type: "checklist",
          title: "Road to Recovery",
          xpReward: 150,
          content: {
            prompt: "A complete recovery process covers which of these steps, in roughly this order?",
            items: [
              { id: "i1", label: "Confirm immediate safety of everyone in your household", isCorrect: true },
              { id: "i2", label: "Wait for the official All Clear before travelling", isCorrect: true },
              { id: "i3", label: "Check for hazards before entering your home (power lines, structural damage, floodwater)", isCorrect: true },
              { id: "i4", label: "Re-establish communication with family and your out-of-community contact", isCorrect: true },
              { id: "i5", label: "Assess property damage and document it for insurance", isCorrect: true },
              { id: "i6", label: "Check on neighbours, especially vulnerable ones, where it's safe to do so", isCorrect: true },
              { id: "i7", label: "Boil water until it's confirmed safe by health authorities", isCorrect: true },
              { id: "i8", label: "Immediately resume every normal activity with no checks at all", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
};