// missionContent/hurricane/level4.js
//
// Hurricane Ready - Level 4: "Home & Community Protection". Window/roof
// protection specs (L4.2, L4.12, L4.14) draw from ODM"s own Hurricane
// Preparedness guidance - the 1/2 inch marine plywood spec, pre-drilling
// holes, sealing roof-to-support gaps - real construction detail, not
// generic advice.
//
// XP: Learn 75, Plan 120, Prepare 160, Prove 145, Respond 150, Recover 100
// = 750 for the level, +75 completion bonus.

export const HURRICANE_LEVEL_4 = {
  levelNumber: 4,
  title: "Home & Community Protection",
  badgeId: "homeAndCommunity",
  badgeName: "Home & Community",
  completionBonusXp: 75,
  stages: {
    learn: {
      activities: [
        {
          id: "L4.1",
          type: "lesson",
          title: "How Hurricanes Damage Homes",
          xpReward: 15,
          content: {
            body:
              "Most hurricane home damage comes from a small set of predictable failure points - " +
              "knowing them is the first step to preventing them.",
            bullets: [
              "Wind finds any gap - a broken window lets pressure build inside, which can lift a roof",
              "Wood-ant (termite) damaged structures often collapse in high winds, even if they look fine",
              "Water damage from a compromised roof can be as costly as the wind damage itself",
            ],
          },
        },
        {
          id: "L4.2",
          type: "lesson",
          title: "Roof & Window Safety",
          xpReward: 15,
          content: {
            body:
              "A roof failing is one of the most dangerous and expensive things that can happen to a " +
              "home in a hurricane - and one of the most preventable with the right preparation.",
            bullets: [
              "Roof sheeting should be fixed to supports with long screws, not just nails",
              "Seal any gap between the roof and its supports - wind that gets into that gap can lift the roof entirely",
              "Reinforce windows with shutters where possible, or ½ inch (marine) plywood, pre-drilled for screws well ahead of the storm",
            ],
          },
        },
        {
          id: "L4.3",
          type: "lesson",
          title: "Flooding & Drainage",
          xpReward: 15,
          content: {
            body:
              "Blocked drainage turns ordinary hurricane rainfall into flooding around a home that " +
              "otherwise would have been fine.",
            bullets: [
              "Clear drains, gullies, and ravines near your home before hurricane season, not during a Warning",
              "Water pooling near a foundation over time can weaken it, even without a hurricane",
              "Know whether your specific property has a history of flooding - that changes your plan",
            ],
          },
        },
        {
          id: "L4.4",
          type: "lesson",
          title: "Trees & Flying Debris",
          xpReward: 10,
          content: {
            body:
              "Almost anything loose outside becomes a projectile in hurricane-force wind.",
            bullets: [
              "Trim branches that hang over the house or could fall on it well before the season starts",
              "Garbage cans, garden tools, and porch furniture should be anchored or stored indoors",
              "A tree that 'looks fine' but is dead or weak inside is still a real risk - inspect, don't just glance",
            ],
          },
        },
        {
          id: "L4.5",
          type: "lesson",
          title: "Electrical Hazards",
          xpReward: 10,
          content: {
            body:
              "Electrical risk doesn't end when the storm does - it often increases right after.",
            bullets: [
              "Downed power lines after a storm should always be treated as live, even if they look inactive",
              "Flooding and electricity are a dangerous combination - never enter floodwater near electrical equipment",
              "Know where your home's main electrical shutoff is, in case it needs to be cut quickly",
            ],
          },
        },
        {
          id: "L4.6",
          type: "lesson",
          title: "Landslide Risk",
          xpReward: 10,
          content: {
            body:
              "Dominica's steep, volcanic terrain makes landslides a real secondary hazard during heavy " +
              "hurricane rainfall - not a rare, freak event.",
            bullets: [
              "Homes on or below steep slopes carry elevated landslide risk during heavy rain",
              "Warning signs include new cracks in ground or walls, and doors/windows that stick suddenly",
              "If you're in a known landslide-risk area, your evacuation plan should account for it separately",
            ],
          },
        },
      ],
    },

    plan: {
      activities: [
        {
          id: "L4.7",
          type: "checklist",
          title: "Home Risk Assessment",
          xpReward: 35,
          content: {
            prompt: "A proper home risk assessment should cover which of these areas?",
            items: [
              { id: "i1", label: "Roof condition and fastening", isCorrect: true },
              { id: "i2", label: "Window and door protection", isCorrect: true },
              { id: "i3", label: "Drainage around the property", isCorrect: true },
              { id: "i4", label: "Nearby trees that could fall on the home", isCorrect: true },
              { id: "i5", label: "Access roads to the property", isCorrect: true },
              { id: "i6", label: "The colour of the front door", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.8",
          type: "lesson",
          title: "Home Evacuation Plan",
          xpReward: 25,
          content: {
            body:
              "Different from the family evacuation route in Level 3 - this is specifically about " +
              "exiting your own property safely if it becomes unsafe to stay.",
            bullets: [
              "Know two ways out of the property itself, not just the neighbourhood",
              "Identify the safest interior room in case leaving isn't possible at all",
              "Make sure this plan is consistent with your family's broader evacuation route",
            ],
          },
        },
        {
          id: "L4.9",
          type: "checklist",
          title: "Property Protection Plan",
          xpReward: 30,
          content: {
            prompt: "Which of these should be part of a property protection plan?",
            items: [
              { id: "i1", label: "What to secure or bring indoors before the storm", isCorrect: true },
              { id: "i2", label: "Which windows need shutters or plywood", isCorrect: true },
              { id: "i3", label: "A timeline for when preparation tasks need to be done by", isCorrect: true },
              { id: "i4", label: "Doing everything at the last minute during the Warning", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.10",
          type: "checklist",
          title: "Community Hazard Map",
          xpReward: 30,
          content: {
            prompt: "What should a useful community hazard map identify?",
            items: [
              { id: "i1", label: "Areas prone to flooding", isCorrect: true },
              { id: "i2", label: "Landslide-risk slopes", isCorrect: true },
              { id: "i3", label: "Roads that commonly become impassable", isCorrect: true },
              { id: "i4", label: "The nearest designated shelter", isCorrect: true },
              { id: "i5", label: "Popular restaurants", isCorrect: false },
            ],
          },
        },
      ],
    },

    prepare: {
      activities: [
        {
          id: "L4.11",
          type: "checklist",
          title: "Secure the Yard",
          xpReward: 30,
          content: {
            prompt: "Select everything that needs to be secured or stored before a hurricane.",
            items: [
              { id: "i1", label: "Outdoor furniture", isCorrect: true },
              { id: "i2", label: "Garbage bins", isCorrect: true },
              { id: "i3", label: "Loose tools", isCorrect: true },
              { id: "i4", label: "Anything else loose that could become airborne", isCorrect: true },
              { id: "i5", label: "The house itself", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.12",
          type: "lesson",
          title: "Protect Windows",
          xpReward: 30,
          content: {
            body:
              "Follow ODM's own specification if you're boarding windows rather than using shutters.",
            bullets: [
              "Use ½ inch plywood - marine plywood is best",
              "Cut a panel to fit each window individually and mark which board fits which window",
              "Pre-drill holes for screws every 18 inches - and do this well before the storm, not during the Warning",
            ],
          },
        },
        {
          id: "L4.13",
          type: "checklist",
          title: "Clear Drainage",
          xpReward: 30,
          content: {
            prompt: "Which of these should be cleared before hurricane season, to reduce flood risk?",
            items: [
              { id: "i1", label: "Drains near the property", isCorrect: true },
              { id: "i2", label: "Gullies and ravines that carry rainwater away", isCorrect: true },
              { id: "i3", label: "Gutters clogged with leaves and debris", isCorrect: true },
              { id: "i4", label: "The driveway, for aesthetic reasons only", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.14",
          type: "lesson",
          title: "Inspect Roof",
          xpReward: 30,
          content: {
            body:
              "A roof inspection before hurricane season is one of the highest-value things a " +
              "homeowner can do.",
            bullets: [
              "Check that roof sheeting is properly fixed to supports, ideally with long screws",
              "Seal any space between the roof and its supports - this is the exact gap that lets wind lift a roof",
              "If you're unsure, a professional inspection before the season starts is worth the cost",
            ],
          },
        },
        {
          id: "L4.15",
          type: "checklist",
          title: "Trim & Identify Hazardous Trees",
          xpReward: 20,
          content: {
            prompt: "Which trees are worth addressing before hurricane season?",
            items: [
              { id: "i1", label: "Branches overhanging the house", isCorrect: true },
              { id: "i2", label: "Dead or visibly weak branches, anywhere on the property", isCorrect: true },
              { id: "i3", label: "Trees close enough to fall on the home if uprooted", isCorrect: true },
              { id: "i4", label: "Every tree on the property regardless of risk", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.16",
          type: "checklist",
          title: "Secure Important Property",
          xpReward: 20,
          content: {
            prompt: "Which of these are worth moving to a safer spot before the storm?",
            items: [
              { id: "i1", label: "Vehicles, if flooding is a risk at your property", isCorrect: true },
              { id: "i2", label: "Valuable equipment or tools kept outdoors", isCorrect: true },
              { id: "i3", label: "Anything irreplaceable, like important keepsakes", isCorrect: true },
              { id: "i4", label: "Nothing - leave everything exactly where it is", isCorrect: false },
            ],
          },
        },
      ],
    },

    prove: {
      activities: [
        {
          id: "L4.17",
          type: "checklist",
          title: "Virtual Home Inspection",
          xpReward: 60,
          content: {
            prompt: "Walking through a virtual home - select everything that's a real hurricane hazard here.",
            items: [
              { id: "i1", label: "A tree branch resting directly on the roof", isCorrect: true },
              { id: "i2", label: "Loose roof tiles near the edge", isCorrect: true },
              { id: "i3", label: "An unsecured gas cylinder near the back door", isCorrect: true },
              { id: "i4", label: "A blocked gutter overflowing near the foundation", isCorrect: true },
              { id: "i5", label: "A well-secured garden shed", isCorrect: false },
              { id: "i6", label: "A car parked inside a closed garage", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.18",
          type: "checklist",
          title: "Before/After Challenge",
          xpReward: 50,
          content: {
            prompt: "This house isn't hurricane-ready yet. Select every fix it actually needs.",
            items: [
              { id: "i1", label: "Board or shutter the windows", isCorrect: true },
              { id: "i2", label: "Secure loose roof sheeting", isCorrect: true },
              { id: "i3", label: "Clear the blocked drain by the driveway", isCorrect: true },
              { id: "i4", label: "Trim the branch overhanging the roof", isCorrect: true },
              { id: "i5", label: "Repaint the exterior for a fresh look", isCorrect: false },
            ],
          },
        },
        {
          id: "L4.19",
          type: "quiz",
          title: "Community Hazard Quiz",
          xpReward: 35,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "Why does Dominica's terrain make landslides a particular concern?",
                options: [
                  "It doesn't - landslides are rare here",
                  "Steep, volcanic terrain is especially prone to landslides during heavy rain",
                  "Only flat areas are at risk",
                  "Landslides only happen during earthquakes",
                ],
                correctOptionIndex: 1,
                explanation:
                  "Dominica's steep, volcanic terrain makes landslides a genuine secondary hazard during " +
                  "heavy hurricane rainfall.",
              },
              {
                id: "q2",
                prompt: "What should you assume about a downed power line after a storm?",
                options: [
                  "It's safe if it's not sparking",
                  "Always treat it as live, regardless of appearance",
                  "Only live if it's raining",
                  "Safe to move if wearing gloves",
                ],
                correctOptionIndex: 1,
                explanation: "Always treat a downed line as live - appearance tells you nothing reliable about whether it's energised.",
              },
            ],
          },
        },
      ],
    },

    respond: {
      activities: [
        {
          id: "L4.20",
          type: "scenario",
          title: "Storm Hits",
          xpReward: 150,
          content: {
            situationText:
              "The hurricane is now at full force. You hear water entering near a window, the power " +
              "has just gone out, and you can hear what sounds like a tree branch hitting the roof. " +
              "What's the right response?",
            choices: [
              {
                id: "c1",
                text: "Stay in your safe interior room, away from windows, and wait it out - address damage once it's safe",
                isBestChoice: true,
                consequenceText:
                  "Correct. Investigating noises or leaks mid-storm means exposing yourself to flying " +
                  "debris and structural risk for no real benefit - damage can be assessed once it's " +
                  "actually safe to move around.",
              },
              {
                id: "c2",
                text: "Go check the window and roof immediately to assess the damage",
                isBestChoice: false,
                consequenceText:
                  "Moving through the house during peak wind, near windows and under a roof that may be " +
                  "compromised, is exactly when injuries happen. This can wait.",
              },
              {
                id: "c3",
                text: "Go outside to see how bad the tree damage is",
                isBestChoice: false,
                consequenceText:
                  "Going outside during active hurricane winds is one of the most dangerous things you " +
                  "can do - flying debris causes serious injuries even in what feels like a lull.",
              },
            ],
          },
        },
      ],
    },

    recover: {
      activities: [
        {
          id: "L4.21",
          type: "checklist",
          title: "Post-Storm Property Assessment",
          xpReward: 100,
          content: {
            prompt: "After the storm, before resuming normal activity around the property, check for:",
            items: [
              { id: "i1", label: "Downed power lines - treat all as live", isCorrect: true },
              { id: "i2", label: "Structural damage that makes an area unsafe to enter", isCorrect: true },
              { id: "i3", label: "Standing floodwater, which may be contaminated or electrically live", isCorrect: true },
              { id: "i4", label: "Damaged trees that could still fall", isCorrect: true },
              { id: "i5", label: "Whether the garden needs weeding", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
};