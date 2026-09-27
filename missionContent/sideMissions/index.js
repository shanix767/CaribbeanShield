// missionContent/sideMissions/index.js
//
// Side missions are standalone practical tasks, outside the main 6-level
// mission structure.
//
// "Build Emergency Bag" reuses the real ODM 72-hour checklist content
// already used in Hurricane Ready Level 2. "Find Your Nearest Shelter" is
// a self-report checklist confirming the player has actually used the
// Shelter tab and knows their plan. Both play through SideMissionPlayer,
// which reuses components/activities/Checklist.js.
//
// "Family Communication Plan" is different: instead of a self-report, the
// player fills in their own plan (screens/CommunicationPlan.js), using the
// fields of ODM's Family Communication Plan template. A side mission with
// a `screen` field opens that screen instead of SideMissionPlayer.
//
// Each object's key matches its `id`, because Home navigates with the id
// and the player screens look the side mission up by it.

export const SIDE_MISSIONS = {
  buildEmergencyBag: {
    id: "buildEmergencyBag",
    title: "Build Emergency Bag",
    icon: "🎒",
    badgeId: "bagBuilder",
    badgeName: "Bag Builder",
    xpReward: 200,
    content: {
      prompt: "Confirm which of these you actually have ready in your emergency kit right now.",
      items: [
        { id: "i1", label: "Water - at least a gallon per person, per day", isCorrect: true },
        { id: "i2", label: "Non-perishable and canned food", isCorrect: true },
        { id: "i3", label: "First aid kit", isCorrect: true },
        { id: "i4", label: "Cash", isCorrect: true },
        { id: "i5", label: "Prescription medicines", isCorrect: true },
        { id: "i6", label: "Flashlight and extra batteries", isCorrect: true },
        { id: "i7", label: "Battery-powered or hand-cranked radio", isCorrect: true },
        { id: "i8", label: "Whistle to signal for help", isCorrect: true },
        { id: "i9", label: "Manual can opener", isCorrect: true },
        { id: "i10", label: "Change of clothes", isCorrect: true },
      ],
    },
  },
  findNearestShelter: {
    id: "findNearestShelter",
    title: "Find Your Nearest Shelter",
    icon: "📍",
    badgeId: "wayFinder",
    badgeName: "Way Finder",
    xpReward: 150,
    content: {
      prompt: "Use the Shelter tab to find your nearest shelter, then confirm the following.",
      items: [
        { id: "i1", label: "I know the name and location of my nearest shelter", isCorrect: true },
        { id: "i2", label: "I know the route there, including a backup if the main road is blocked", isCorrect: true },
        { id: "i3", label: "I know roughly how long it takes to get there", isCorrect: true },
        { id: "i4", label: "I've shared this information with my household", isCorrect: true },
      ],
    },
  },
  communicationPlan: {
    id: "communicationPlan",
    title: "Family Communication Plan",
    icon: "📇",
    badgeId: "connector",
    badgeName: "Connector",
    xpReward: 150,
    screen: "CommunicationPlan",
    content: {
      intro:
        "Fill in your household's plan, using the same fields as ODM's Family Communication " +
        "Plan template. Once it's saved you can open it any time from the Hub, even offline, " +
        "and share it with your household.",
      privacyNote:
        "Your plan is stored only on this phone. It is never uploaded.",
      paperCopyNote:
        "ODM advises that your plan shouldn't depend on your phone working. Share it, and keep " +
        "a written copy somewhere everyone knows.",

      // Each section is one part of the plan. `type` decides how it is
      // filled in:
      //   people  - a list of people, each with name, phone and a note
      //   contact - one person with name and phone
      //   place   - a short description of a place
      // `scored` sections count towards XP (xpReward x completed / total).
      // `required` sections must all be complete to earn the badge.
      sections: [
        {
          key: "household",
          type: "people",
          title: "Household members",
          hint:
            "Everyone who lives with you. For adults, add work details in the note; for " +
            "children, their school and who can collect them.",
          notePlaceholder: "Work, school or pick-up contact (optional)",
          scored: true,
          required: true,
        },
        {
          key: "neighbour",
          type: "contact",
          title: "A neighbour",
          hint: "Someone nearby who can help fast or check on your home.",
          scored: true,
          required: false,
        },
        {
          key: "outOfCommunity",
          type: "contact",
          title: "Out-of-community contact",
          hint:
            "Someone outside your area. They're often easier to reach than local lines during " +
            "a disaster, so everyone can check in with them.",
          scored: true,
          required: true,
        },
        {
          key: "offIsland",
          type: "contact",
          title: "Off-island relative or friend (optional)",
          hint: "If you have one, add them too. Overseas lines may work when local ones don't.",
          scored: false,
          required: false,
        },
        {
          key: "meetNearHome",
          type: "place",
          title: "Meeting place near home",
          hint: "For example a neighbour's house or a landmark tree, in case you can't get inside.",
          placeholder: "e.g. Mrs Joseph's porch, across the road",
          scored: true,
          required: true,
        },
        {
          key: "meetOutsideArea",
          type: "place",
          title: "Meeting place outside the neighbourhood",
          hint: "For example a church, school or relative's house, in case you can't get home.",
          placeholder: "e.g. the church in the next village",
          scored: true,
          required: true,
        },
        {
          key: "healthCentre",
          type: "contact",
          title: "Nearest health centre",
          hint: "The health centre or clinic you would go to.",
          namePlaceholder: "Health centre name",
          scored: true,
          required: false,
        },
      ],

      // Filled in for everyone and not editable, matching the Hub's
      // Emergency Contacts.
      emergencyNumbers: [
        { name: "Police, Fire & Ambulance", number: "911" },
        { name: "Office of Disaster Management (ODM)", number: "7672664411", display: "(767) 266-4411" },
      ],
    },
  },
};

export function getAllSideMissions() {
  return Object.values(SIDE_MISSIONS);
}
