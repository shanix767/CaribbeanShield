// missionContent/hurricane/level3.js
//
// Hurricane Ready - Level 3: "Family Preparedness". L3.6"s communication
// plan draws directly from ODM"s Family Communication Plan template
// structure (parents/siblings/neighbours/off-island contact/meeting
// places) - the real fields their own form asks for, not a generic list.
//
// XP: Learn 60, Plan 120, Prepare 120, Prove 100, Respond 120, Recover 80
// = 600 for the level, +60 completion bonus.

export const HURRICANE_LEVEL_3 = {
  levelNumber: 3,
  title: "Family Preparedness",
  badgeId: "familyPreparedness",
  badgeName: "Family Preparedness",
  completionBonusXp: 60,
  stages: {
    learn: {
      activities: [
        {
          id: "L3.1",
          type: "lesson",
          title: "Why Families Need an Emergency Plan",
          xpReward: 15,
          content: {
            body:
              "Personal preparedness (Level 2) covers you. A family plan covers everyone - because " +
              "during a real hurricane, family members are often in different places: work, school, " +
              "elsewhere in the community.",
            bullets: [
              "A plan answers: who contacts whom, where do we meet, who's responsible for what",
              "Without one, a hurricane forces these decisions under pressure, with no time to think",
              "Every household member should know the plan, not just one person",
            ],
          },
        },
        {
          id: "L3.2",
          type: "lesson",
          title: "Family Communication",
          xpReward: 15,
          content: {
            body:
              "Phone networks often get overloaded or damaged during and after a hurricane - the plan " +
              "has to account for that, not assume calls will just go through.",
            bullets: [
              "An out-of-community or off-island contact can be easier to reach than local numbers",
              "Text messages sometimes get through when calls don't - try both",
              "Agree on a check-in time if separated, not just a one-off message",
            ],
          },
        },
        {
          id: "L3.3",
          type: "lesson",
          title: "Children During Emergencies",
          xpReward: 10,
          content: {
            body:
              "Children need the plan explained in age-appropriate terms, and practice, not just a " +
              "plan the adults know.",
            bullets: [
              "Teach children your home address and a parent's phone number by memory",
              "Practice what to do if separated from an adult during an evacuation",
              "Reassurance matters - a calm explanation reduces panic during the real event",
            ],
          },
        },
        {
          id: "L3.4",
          type: "lesson",
          title: "Elderly & Vulnerable Household Members",
          xpReward: 10,
          content: {
            body:
              "Mobility, medication, and medical equipment needs must be planned for specifically - " +
              "a generic family plan can miss what a vulnerable member actually needs.",
            bullets: [
              "Confirm medication supply covers at least a month, with a written list of dosages",
              "Plan transport in advance if evacuation requires mobility assistance",
              "Identify who is responsible for checking on this person specifically during the event",
            ],
          },
        },
        {
          id: "L3.5",
          type: "lesson",
          title: "Pets During Hurricanes",
          xpReward: 10,
          content: {
            body:
              "Most emergency shelters do not allow pets inside the main shelter area - this needs " +
              "planning ahead, not discovering it at the shelter door.",
            bullets: [
              "Research pet-friendly shelter options or a trusted contact who can take your pet in",
              "Pack a small pet supply kit alongside your own go bag - food, water, leash, carrier",
              "If pets must be left at home, leave them unrestrained with ample food and water",
            ],
          },
        },
      ],
    },

    plan: {
      activities: [
        {
          id: "L3.6",
          type: "lesson",
          title: "Build Your Family Communication Plan",
          xpReward: 40,
          content: {
            body:
              "This mirrors ODM's own Family Communication Plan template - the same fields their " +
              "printed form asks every household to fill in.",
            bullets: [
              "Every adult: home, cell, and work numbers",
              "Every child: cell, school, and an emergency pick-up contact",
              "A neighbour's home and cell number",
              "An out-of-community contact, and an off-island relative or friend if you have one",
              "Police, Fire & Ambulance, and your nearest health centre",
            ],
          },
        },
        {
          id: "L3.7",
          type: "checklist",
          title: "Family Meeting Places",
          xpReward: 25,
          content: {
            prompt: "A good family meeting place plan should include which of these?",
            items: [
              { id: "i1", label: "A spot near home, like a neighbour's house or a landmark tree", isCorrect: true },
              { id: "i2", label: "A spot outside the neighbourhood, like a library or place of worship", isCorrect: true },
              { id: "i3", label: "Only one location, since that's simpler", isCorrect: false },
              { id: "i4", label: "A plan that only the parents know about", isCorrect: false },
            ],
          },
        },
        {
          id: "L3.8",
          type: "lesson",
          title: "Family Evacuation Plan",
          xpReward: 30,
          content: {
            body:
              "Same idea as your personal evacuation route (Level 2), scaled up to account for everyone " +
              "in the household - including anyone who needs extra time or assistance to move.",
            bullets: [
              "Primary route AND a backup, in case the first is blocked or flooded",
              "Account for the slowest-moving household member when estimating time needed",
              "Confirm everyone knows the route, not just whoever usually drives",
            ],
          },
        },
        {
          id: "L3.9",
          type: "matching",
          title: "Assign Family Roles",
          xpReward: 25,
          content: {
            prompt: "Match each role to what it's responsible for during an evacuation.",
            pairs: [
              { id: "p1", left: "👩 Documents Lead", right: "Grabs the waterproof document container" },
              { id: "p2", left: "👨 Kit Lead", right: "Grabs the household emergency kit" },
              { id: "p3", left: "👧 Personal Bag", right: "Each child carries their own small bag" },
              { id: "p4", left: "🐶 Pet Lead", right: "Handles pet carrier, leash, and pet supplies" },
            ],
          },
        },
      ],
    },

    prepare: {
      activities: [
        {
          id: "L3.10",
          type: "checklist",
          title: "Pack the Family Go Bags",
          xpReward: 40,
          content: {
            prompt: "Different household members need different additions to the standard go bag - select what applies.",
            items: [
              { id: "i1", label: "Formula and diapers for a baby in the household", isCorrect: true },
              { id: "i2", label: "A comfort item or small toy for young children", isCorrect: true },
              { id: "i3", label: "Extra mobility aid batteries for an elderly member", isCorrect: true },
              { id: "i4", label: "Pet food and a leash", isCorrect: true },
              { id: "i5", label: "Identical bags for every household member regardless of need", isCorrect: false },
            ],
          },
        },
        {
          id: "L3.11",
          type: "checklist",
          title: "Prepare Household Food & Water",
          xpReward: 30,
          content: {
            prompt: "For a household of several people, which of these matters for food/water planning?",
            items: [
              { id: "i1", label: "Water calculated per person, per day - not one blanket amount", isCorrect: true },
              { id: "i2", label: "Any dietary needs (baby formula, medical diets) planned for specifically", isCorrect: true },
              { id: "i3", label: "A manual can opener, since power may be out", isCorrect: true },
              { id: "i4", label: "Assuming everyone eats the same amount as one adult", isCorrect: false },
            ],
          },
        },
        {
          id: "L3.12",
          type: "lesson",
          title: "Prepare Family Documents",
          xpReward: 20,
          content: {
            body:
              "Beyond your own personal documents (Level 2), a family kit needs documents covering " +
              "every household member.",
            bullets: [
              "Birth certificates and IDs for every family member, including children",
              "Custody or guardianship documents if relevant to your household",
              "A family photo, useful for identification if separated",
            ],
          },
        },
        {
          id: "L3.13",
          type: "lesson",
          title: "Prepare Pet Supplies",
          xpReward: 20,
          content: {
            body:
              "A pet's go-bag equivalent - packed the same way and for the same reason as yours.",
            bullets: [
              "At least 3 days of food and water, plus bowls",
              "A leash or carrier appropriate to the animal",
              "Vaccination records - some shelters or boarding options require proof",
            ],
          },
        },
        {
          id: "L3.14",
          type: "lesson",
          title: "Prepare Emergency Contacts",
          xpReward: 10,
          content: {
            body:
              "Make sure your Level 3.6 communication plan is actually usable in the moment, not just " +
              "written down somewhere.",
            bullets: [
              "A physical copy in every go bag, not just saved on a phone that might lose power",
              "Shared with every family member old enough to read it",
              "Reviewed and updated whenever a phone number changes",
            ],
          },
        },
      ],
    },

    prove: {
      activities: [
        {
          id: "L3.15",
          type: "scenario",
          title: "Family Plan Test",
          xpReward: 40,
          content: {
            situationText:
              "Mom is at work. Dad is home. Their child is at school. A hurricane warning has just been " +
              "issued. What should happen next, according to a good family plan?",
            choices: [
              {
                id: "c1",
                text: "Everyone follows the pre-agreed plan: contact each other, head to the agreed meeting point",
                isBestChoice: true,
                consequenceText:
                  "This is exactly what a family communication plan is for - no one has to improvise " +
                  "decisions under pressure.",
              },
              {
                id: "c2",
                text: "Everyone tries to get home first, then figures out next steps",
                isBestChoice: false,
                consequenceText:
                  "Without a plan, everyone converging on one point with no coordination can waste " +
                  "critical time and cause confusion about who's where.",
              },
            ],
          },
        },
        {
          id: "L3.16",
          type: "quiz",
          title: "Communication Challenge",
          xpReward: 30,
          content: {
            questions: [
              {
                id: "q1",
                prompt: "Why might a text message get through when a phone call doesn't?",
                options: [
                  "Texts use less network capacity than a live call",
                  "Texts are always free",
                  "There's no real difference",
                  "Calls are blocked during hurricanes by law",
                ],
                correctOptionIndex: 0,
                explanation:
                  "Texts need far less network bandwidth than a voice call, so they can often get " +
                  "through even when networks are congested.",
              },
              {
                id: "q2",
                prompt: "Why is an out-of-community contact useful in a family plan?",
                options: [
                  "They can relay messages if local lines are overloaded",
                  "They're required by ODM",
                  "They have no real purpose",
                  "They replace the need for local contacts",
                ],
                correctOptionIndex: 0,
                explanation:
                  "A contact outside the affected area often has working phone lines when local ones " +
                  "are jammed - useful as a relay point for the whole family.",
              },
            ],
          },
        },
        {
          id: "L3.17",
          type: "checklist",
          title: "Family Kit Inspection",
          xpReward: 30,
          content: {
            prompt: "Inspecting a family's preparedness - select what a complete setup actually includes.",
            items: [
              { id: "i1", label: "Go bags for every household member, sized to their needs", isCorrect: true },
              { id: "i2", label: "A written, shared communication plan", isCorrect: true },
              { id: "i3", label: "Pet supplies, if applicable", isCorrect: true },
              { id: "i4", label: "Only one adult's bag, since they'll carry everything", isCorrect: false },
            ],
          },
        },
      ],
    },

    respond: {
      activities: [
        {
          id: "L3.18",
          type: "scenario",
          title: "Family Emergency Simulation",
          xpReward: 120,
          content: {
            situationText:
              "The hurricane has arrived. Family members are scattered: one at work, one at home, one " +
              "at school, and the family pet is at home alone. Communication is spotty. What's the " +
              "right overall approach?",
            choices: [
              {
                id: "c1",
                text: "Each person follows the pre-agreed plan for their role, and the family regroups at the agreed meeting point once safe to move",
                isBestChoice: true,
                consequenceText:
                  "This is the entire point of Level 3's planning - a pre-agreed plan means no one " +
                  "has to make high-stakes decisions alone, under pressure, with incomplete information.",
              },
              {
                id: "c2",
                text: "Everyone tries to reach everyone else constantly until they get through",
                isBestChoice: false,
                consequenceText:
                  "Constant redial attempts waste time and battery without a clear plan - a scheduled " +
                  "check-in and a known meeting point matter more than repeated contact attempts.",
              },
              {
                id: "c3",
                text: "Whoever is closest to home goes to get the pet immediately, regardless of storm conditions",
                isBestChoice: false,
                consequenceText:
                  "Risking a trip out during active hurricane conditions - even for a pet - is not worth " +
                  "it. A pet left with food and water can generally wait until conditions are safe.",
              },
            ],
          },
        },
      ],
    },

    recover: {
      activities: [
        {
          id: "L3.19",
          type: "checklist",
          title: "Family Check-In",
          xpReward: 80,
          content: {
            prompt: "After the storm passes, what should a family check-in cover?",
            items: [
              { id: "i1", label: "Account for every family member's safety", isCorrect: true },
              { id: "i2", label: "Check for injuries needing medical attention", isCorrect: true },
              { id: "i3", label: "Check on neighbours where it's safe to do so", isCorrect: true },
              { id: "i4", label: "Contact the out-of-community/off-island contact to confirm everyone's safe", isCorrect: true },
              { id: "i5", label: "Immediately resume normal routines with no checks at all", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
};