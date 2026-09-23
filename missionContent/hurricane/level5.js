// missionContent/hurricane/level5.js
//
// Hurricane Ready - Level 5: "Hurricane Response". The design doc"s
// Respond stage was envisioned as one continuous multi-event simulation
// (Watch -> Warning -> Evacuation -> Power Failure -> Flooding ->
// Communication Failure -> Eye -> Storm Resumes) with a decision at each
// stage. Since the Scenario component handles one decision point per
// activity, that"s built here as FOUR chained scenario activities
// (L5.17-L5.20) covering the real decision moments, rather than one
// mega-scenario - this keeps each decision genuinely meaningful instead
// of compressing eight events into a single choice.
//
// XP: Learn 70, Plan 130, Prepare 110, Prove 170, Respond 270, Recover 150
// = 900 for the level, +100 completion bonus.

export const HURRICANE_LEVEL_5 = {
  levelNumber: 5,
  title: "Hurricane Response",
  badgeId: "hurricaneResponse",
  badgeName: "Hurricane Responder",
  completionBonusXp: 100,
  stages: {
    learn: {
      activities: [
        {
          id: "L5.1",
          type: "lesson",
          title: "During-Hurricane Safety",
          xpReward: 15,
          content: {
            body:
              "Once a hurricane actually arrives, the goal shifts from preparing to simply staying safe " +
              "until it passes.",
            bullets: [
              "Stay in your safe interior room - don't move around the house to check on things",
              "Local authorities issue real-time advisories during the storm - listen if you're able to",
              "Travel during active hurricane winds is extremely dangerous - don't attempt it",
            ],
          },
        },
        {
          id: "L5.2",
          type: "lesson",
          title: "Evacuation Orders",
          xpReward: 15,
          content: {
            body:
              "When authorities issue an evacuation order, the calculus changes - staying is no longer " +
              "the safer option, moving is.",
            bullets: [
              "Evacuate early, once an order is given - don't wait to see how bad it gets first",
              "Early evacuation also means better shelter management for everyone",
              "Once you've evacuated, remain indoors at the shelter through the storm",
            ],
          },
        },
        {
          id: "L5.3",
          type: "lesson",
          title: "The Eye of the Storm",
          xpReward: 15,
          content: {
            body:
              "The eye is the single most misunderstood part of a hurricane - and misunderstanding it " +
              "has genuinely gotten people killed.",
            bullets: [
              "A lull of a few minutes to half an hour doesn't mean the storm is over",
              "Stay in your safe location unless emergency repairs are truly unavoidable",
              "Winds return rapidly on the other side of the eye - often from the opposite direction",
            ],
          },
        },
        {
          id: "L5.4",
          type: "lesson",
          title: "Flood & Electrical Safety",
          xpReward: 15,
          content: {
            body:
              "Flooding and electricity together are one of the most dangerous combinations in a " +
              "hurricane's aftermath.",
            bullets: [
              "Never enter floodwater that could be in contact with electrical equipment",
              "Assume any floodwater may be contaminated - avoid contact where possible",
              "Boil drinking water until health authorities confirm the supply is safe",
            ],
          },
        },
        {
          id: "L5.5",
          type: "lesson",
          title: "Emergency Communication",
          xpReward: 10,
          content: {
            body:
              "Communication often becomes the hardest part of an active hurricane - plan for it to fail, " +
              "not just for it to work.",
            bullets: [
              "A battery or hand-crank radio may be your only working source of information",
              "Text messages often succeed when calls fail - try both if attempting to reach someone",
              "Your family communication plan (Level 3) is what carries you through this moment",
            ],
          },
        },
      ],
    },

    plan: {
      activities: [
        {
          id: "L5.6",
          type: "lesson",
          title: "Emergency Decision Tree",
          xpReward: 30,
          content: {
            body:
              "A decision tree means deciding your response BEFORE the moment arrives - 'if X happens, " +
              "I do Y' - rather than improvising under pressure.",
            bullets: [
              "If an evacuation order is given → go immediately, using your planned route",
              "If a window breaks → move to your safe interior room immediately",
              "If separated from family → go to the pre-agreed meeting point",
            ],
          },
        },
        {
          id: "L5.7",
          type: "lesson",
          title: "Evacuation Decision Plan",
          xpReward: 30,
          content: {
            body:
              "Decide now what would trigger you to evacuate even WITHOUT an official order - waiting " +
              "for an order isn't always fast enough in a genuinely dangerous situation.",
            bullets: [
              "Water entering your home is a clear trigger to leave, order or not",
              "Structural damage that compromises your safe room is a trigger to leave",
              "If in doubt, moving early is safer than moving late",
            ],
          },
        },
        {
          id: "L5.8",
          type: "lesson",
          title: "Communication Failure Plan",
          xpReward: 25,
          content: {
            body:
              "What happens if your phone simply doesn't work? This needs an actual answer, decided " +
              "in advance.",
            bullets: [
              "Fall back to the pre-agreed meeting point and check-in time, no phone required",
              "A battery radio can still receive official updates even with no cell signal",
              "Written contact information (not just saved in a phone) matters here",
            ],
          },
        },
        {
          id: "L5.9",
          type: "lesson",
          title: "Power Outage Plan",
          xpReward: 25,
          content: {
            body:
              "Assume the power will go out - plan for days, not hours.",
            bullets: [
              "Confirm flashlights, batteries, and a charged power bank are ready before the storm",
              "Know your home's main electrical shutoff location, in case it needs to be cut",
              "Keep perishable food consumption in mind - plan meals around what will spoil first",
            ],
          },
        },
        {
          id: "L5.10",
          type: "lesson",
          title: "Transportation Plan",
          xpReward: 20,
          content: {
            body:
              "Fuel and vehicle access become genuinely scarce right around a hurricane - plan for that " +
              "scarcity in advance.",
            bullets: [
              "Keep your vehicle's fuel tank topped up once a Watch is issued - stations may close for days after",
              "Know an alternative way to reach your evacuation point if your usual vehicle isn't available",
              "Roads may be undermined or debris-filled after the storm - factor that into any post-storm travel",
            ],
          },
        },
      ],
    },

    prepare: {
      activities: [
        {
          id: "L5.11",
          type: "checklist",
          title: "Final Readiness Check",
          xpReward: 40,
          content: {
            prompt: "With limited time before the storm arrives, which of these are genuinely critical to confirm?",
            items: [
              { id: "i1", label: "Go bags are packed and by the door", isCorrect: true },
              { id: "i2", label: "Phones and power banks are fully charged", isCorrect: true },
              { id: "i3", label: "Windows are boarded or shuttered", isCorrect: true },
              { id: "i4", label: "Family communication plan is in every go bag", isCorrect: true },
              { id: "i5", label: "The house has been fully cleaned", isCorrect: false },
            ],
          },
        },
        {
          id: "L5.12",
          type: "checklist",
          title: "Prioritize Your Supplies",
          xpReward: 40,
          content: {
            prompt: "Your go bag has limited space. Select the items that should take priority.",
            items: [
              { id: "i1", label: "Medication", isCorrect: true },
              { id: "i2", label: "Water and non-perishable food", isCorrect: true },
              { id: "i3", label: "Important documents", isCorrect: true },
              { id: "i4", label: "First aid kit", isCorrect: true },
              { id: "i5", label: "A full board game collection", isCorrect: false },
            ],
          },
        },
        {
          id: "L5.13",
          type: "lesson",
          title: "Prepare for Communication Failure",
          xpReward: 30,
          content: {
            body:
              "Prepare the FALLBACK, not just the primary plan.",
            bullets: [
              "A charged battery radio is your fallback for information if networks go down",
              "A written, physical contact list is your fallback if your phone dies or is lost",
              "Your meeting point plan is your fallback if you can't reach anyone at all",
            ],
          },
        },
      ],
    },

    prove: {
      activities: [
        {
          id: "L5.14",
          type: "scenario",
          title: "Hurricane Decision Challenge",
          xpReward: 70,
          content: {
            situationText:
              "Winds are picking up fast and conditions are deteriorating faster than forecast. You " +
              "haven't received an official evacuation order yet, but water has started entering " +
              "through a damaged window. What do you do?",
            choices: [
              {
                id: "c1",
                text: "Evacuate immediately using your planned route, even without an official order",
                isBestChoice: true,
                consequenceText:
                  "Correct - this is exactly the kind of trigger your Level 5.7 evacuation decision plan " +
                  "should account for. Waiting for an official order when your home is already unsafe " +
                  "costs time you don't have.",
              },
              {
                id: "c2",
                text: "Wait for an official evacuation order before doing anything",
                isBestChoice: false,
                consequenceText:
                  "Official orders can lag behind fast-moving local conditions. A pre-decided personal " +
                  "trigger - like water entering your home - should override waiting for an order.",
              },
            ],
          },
        },
        {
          id: "L5.15",
          type: "quiz",
          title: "Timed Evacuation Challenge",
          xpReward: 60,
          content: {
            timeLimitSeconds: 15,
            questions: [
              {
                id: "q1",
                prompt: "You have 15 minutes before roads become unsafe. What's your first move?",
                options: [
                  "Grab your already-packed go bag and leave",
                  "Start packing a bag from scratch",
                  "Wait to see if conditions improve",
                  "Call around to ask neighbours what they're doing",
                ],
                correctOptionIndex: 0,
                explanation:
                  "A pre-packed go bag exists exactly for this moment - grabbing it and moving is the " +
                  "only option that doesn't waste your limited time.",
              },
              {
                id: "q2",
                prompt: "Which route do you take if your primary road is already flooding?",
                options: [
                  "Drive through the flooding - it's probably shallow",
                  "Your pre-planned backup route",
                  "Whichever road looks emptiest",
                  "Stay put and hope it clears",
                ],
                correctOptionIndex: 1,
                explanation:
                  "This is exactly why Level 3's planning insisted on a backup route - driving through " +
                  "floodwater of unknown depth is a leading cause of hurricane deaths.",
              },
            ],
          },
        },
        {
          id: "L5.16",
          type: "checklist",
          title: "Hazard Recognition Challenge",
          xpReward: 40,
          content: {
            prompt: "Which of these are genuine hazards during an active hurricane response?",
            items: [
              { id: "i1", label: "Downed power lines on an evacuation route", isCorrect: true },
              { id: "i2", label: "A calm period that might be the eye of the storm", isCorrect: true },
              { id: "i3", label: "Rapidly rising floodwater on a road", isCorrect: true },
              { id: "i4", label: "A radio broadcasting an official ODM update", isCorrect: false },
            ],
          },
        },
      ],
    },

    respond: {
      activities: [
        {
          id: "L5.17",
          type: "scenario",
          title: "Evacuation Order Issued",
          xpReward: 70,
          content: {
            situationText:
              "EVENT: Hurricane Warning has just escalated to an official Evacuation Order for your " +
              "area. You're at home with your go bag ready. What now?",
            choices: [
              {
                id: "c1",
                text: "Leave immediately via your planned route to the shelter",
                isBestChoice: true,
                consequenceText:
                  "Correct - an official order means it's time to move, not time to finish last-minute tasks.",
              },
              {
                id: "c2",
                text: "Finish a few more preparations before leaving",
                isBestChoice: false,
                consequenceText:
                  "Once an order is issued, every extra minute at home is extra risk on the road later. " +
                  "Preparations should already be done by this point.",
              },
            ],
          },
        },
        {
          id: "L5.18",
          type: "scenario",
          title: "Power Failure Strikes",
          xpReward: 70,
          content: {
            situationText:
              "EVENT: You're now at the shelter and the power has just failed across the area. It's " +
              "getting dark. What's the right response?",
            choices: [
              {
                id: "c1",
                text: "Use your flashlight, stay calm, and follow shelter staff instructions",
                isBestChoice: true,
                consequenceText:
                  "Exactly right - this is precisely why a flashlight was part of your go bag. Staying " +
                  "calm and following shelter guidance matters more than the darkness itself.",
              },
              {
                id: "c2",
                text: "Light a candle for visibility",
                isBestChoice: false,
                consequenceText:
                  "Open flames are a real fire risk in a crowded shelter, especially if there's any " +
                  "chance of a gas leak nearby. A flashlight is the safer choice.",
              },
            ],
          },
        },
        {
          id: "L5.19",
          type: "scenario",
          title: "Flooding Begins",
          xpReward: 70,
          content: {
            situationText:
              "EVENT: Word reaches the shelter that floodwater is rising near the route you evacuated " +
              "on. A few people are talking about heading back to check on their homes. What do you do?",
            choices: [
              {
                id: "c1",
                text: "Stay at the shelter - checking on property can wait until it's officially safe",
                isBestChoice: true,
                consequenceText:
                  "Correct. Property can be assessed and repaired later - travelling back into an area " +
                  "with rising floodwater risks your life for something that can wait.",
              },
              {
                id: "c2",
                text: "Head back now, before the water gets any higher",
                isBestChoice: false,
                consequenceText:
                  "This is exactly the decision that gets people caught in rising water - 'before it gets " +
                  "worse' often turns out to already be too late.",
              },
            ],
          },
        },
        {
          id: "L5.20",
          type: "scenario",
          title: "The Eye Passes",
          xpReward: 60,
          content: {
            situationText:
              "EVENT: Everything has gone suddenly calm. Someone near you says the storm must be over " +
              "and starts heading for the door. What do you do?",
            choices: [
              {
                id: "c1",
                text: "Stay put - this is likely the eye, not the end, and warn others too",
                isBestChoice: true,
                consequenceText:
                  "Correct, and this is one of the most important lessons in this whole mission. Winds " +
                  "return suddenly once the eye passes, often from the opposite direction.",
              },
              {
                id: "c2",
                text: "Go outside - it does seem to be over",
                isBestChoice: false,
                consequenceText:
                  "This is the exact mistake that has genuinely cost lives - the eye is a temporary calm, " +
                  "not the storm ending.",
              },
            ],
          },
        },
      ],
    },

    recover: {
      activities: [
        {
          id: "L5.21",
          type: "checklist",
          title: "First 24 Hours",
          xpReward: 80,
          content: {
            prompt: "In roughly what priority order should the first 24 hours after the storm focus on? Select everything that belongs in this list.",
            items: [
              { id: "i1", label: "Personal and family safety first", isCorrect: true },
              { id: "i2", label: "Checking for hazards before moving around", isCorrect: true },
              { id: "i3", label: "Re-establishing communication with family", isCorrect: true },
              { id: "i4", label: "Assessing what supplies remain", isCorrect: true },
              { id: "i5", label: "Offering or seeking assistance where needed", isCorrect: true },
              { id: "i6", label: "Immediately returning to full daily routine", isCorrect: false },
            ],
          },
        },
        {
          id: "L5.22",
          type: "scenario",
          title: "Recovery Decision Challenge",
          xpReward: 70,
          content: {
            situationText:
              "The storm has passed and ODM hasn't yet given an official All Clear. You're anxious to " +
              "get home and check on things. What's the right move?",
            choices: [
              {
                id: "c1",
                text: "Wait for the official All Clear before travelling",
                isBestChoice: true,
                consequenceText:
                  "Correct - conditions can still be genuinely dangerous even once the wind dies down. " +
                  "The All Clear means authorities have actually assessed road and hazard conditions.",
              },
              {
                id: "c2",
                text: "Head out now - the worst part is clearly over",
                isBestChoice: false,
                consequenceText:
                  "Downed lines, weakened structures, and flooded roads are often at their most dangerous " +
                  "right after a storm passes, before any assessment has happened.",
              },
            ],
          },
        },
      ],
    },
  },
};