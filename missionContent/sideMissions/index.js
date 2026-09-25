// missionContent/sideMissions/index.js
//
// Side missions are standalone, single-checklist tasks — simpler than the
// main 6-level mission structure (no stages, no levels, just one
// checklist activity each). "Build Emergency Kit" reuses the real ODM
// 72-hour checklist content already used in Hurricane Ready Level 2;
// "Find Your Nearest Shelter" is a self-report checklist about actually
// knowing your shelter plan, since the Shelter tab already provides the
// live map/route-finding tool itself — this checklist confirms the
// player has actually used it and internalised the plan, not a duplicate
// of that tool.
//
// Reuses components/activities/Checklist.js directly, same pattern as
// the pretest reusing Quiz.js — no new UI component needed.

export const SIDE_MISSIONS = {
  buildEmergencyKit: {
    id: "buildEmergencyBag",
    title: "Build Emergency Bag",
    icon: "🎒",
    badgeId: "bagBuilder",
    badgeName: "Bag Builder",
    xpReward: 200,
    content: {
      prompt: "Confirm which of these you actually have ready in your emergency kit right now.",
      items: [
        { id: "i1", label: "Water — at least a gallon per person, per day", isCorrect: true },
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
};

export function getAllSideMissions() {
  return Object.values(SIDE_MISSIONS);
}