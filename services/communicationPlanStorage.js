// services/communicationPlanStorage.js
//
// Saves and loads the player's Family Communication Plan, and works out
// how complete it is.
//
// The plan holds other people's names and phone numbers, so it is kept
// apart from the game state on purpose:
//   - It has its own AsyncStorage key, so it is never part of the game
//     state object and can't be synced to Firestore by accident.
//   - It is stored only on this device. Firestore only ever receives the
//     XP and badge totals that come from completing the side mission.
//   - It is cleared whenever RESET_PROGRESS runs (see GameContext), so
//     the next evaluation participant on a shared test phone never sees
//     the previous participant's contacts.

import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMUNICATION_PLAN_STORAGE_KEY = 'caribbeanShield:communicationPlan';

// Longest household list the form allows. Plenty for a real household,
// and keeps the plan short enough to share as one message.
export const MAX_HOUSEHOLD_MEMBERS = 10;

export function createEmptyPerson() {
  return { name: '', phone: '', note: '' };
}

export function createEmptyPlan() {
  return {
    household: [createEmptyPerson()],
    neighbour: { name: '', phone: '' },
    outOfCommunity: { name: '', phone: '' },
    offIsland: { name: '', phone: '' },
    meetNearHome: '',
    meetOutsideArea: '',
    healthCentre: { name: '', phone: '' },
    updatedAt: null,
  };
}

// Returns the saved plan, or null if there isn't one (or it can't be
// read). Missing fields from an older save are filled in from the empty
// plan so the screen never reads an undefined section.
export async function loadCommunicationPlan() {
  try {
    const savedJson = await AsyncStorage.getItem(COMMUNICATION_PLAN_STORAGE_KEY);
    if (!savedJson) return null;
    const savedPlan = JSON.parse(savedJson);
    const plan = { ...createEmptyPlan(), ...savedPlan };
    if (!Array.isArray(plan.household) || plan.household.length === 0) {
      plan.household = [createEmptyPerson()];
    }
    return plan;
  } catch {
    return null;
  }
}

export async function saveCommunicationPlan(plan) {
  const planToSave = { ...plan, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(COMMUNICATION_PLAN_STORAGE_KEY, JSON.stringify(planToSave));
  return planToSave;
}

export async function clearCommunicationPlan() {
  try {
    await AsyncStorage.removeItem(COMMUNICATION_PLAN_STORAGE_KEY);
  } catch {
    // Nothing useful to do if this fails; the next save overwrites it.
  }
}

// --- Completeness ---

// A number counts once it has at least 7 digits, which is a local
// Dominican number (e.g. 2664411). Spaces, brackets, dashes and a leading
// + are allowed, so "(767) 266-4411" and "+1 767 266 4411" both count.
export function isPhoneNumberFilled(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length >= 7;
}

function isContactComplete(contact) {
  return !!contact && contact.name.trim().length > 0 && isPhoneNumberFilled(contact.phone);
}

export function isSectionComplete(section, plan) {
  const value = plan[section.key];
  if (section.type === 'people') {
    return Array.isArray(value) && value.some(isContactComplete);
  }
  if (section.type === 'contact') {
    return isContactComplete(value);
  }
  if (section.type === 'place') {
    return typeof value === 'string' && value.trim().length >= 2;
  }
  return false;
}

// XP follows the same rule as every other activity: proportional to how
// much is done. The badge needs every `required` section; the optional
// ones only add XP.
export function scoreCommunicationPlan(plan, sideMission) {
  const sections = sideMission.content.sections;
  const scoredSections = sections.filter((section) => section.scored);
  const completedScoredCount = scoredSections.filter((section) =>
    isSectionComplete(section, plan)
  ).length;
  const missingRequiredSections = sections.filter(
    (section) => section.required && !isSectionComplete(section, plan)
  );

  return {
    completedScoredCount,
    totalScoredCount: scoredSections.length,
    earnedXp: Math.round(
      sideMission.xpReward * (completedScoredCount / scoredSections.length)
    ),
    meetsBadgeMinimum: missingRequiredSections.length === 0,
    missingRequiredTitles: missingRequiredSections.map((section) => section.title),
  };
}

// --- Sharing ---

// Plain text, so it reads the same in WhatsApp, SMS or email, and can be
// copied onto paper.
export function formatPlanForSharing(plan, sideMission) {
  const lines = ['OUR FAMILY COMMUNICATION PLAN', ''];

  function contactLine(label, contact) {
    if (!contact || (!contact.name.trim() && !contact.phone.trim())) return;
    lines.push(`${label}: ${contact.name.trim()}${contact.phone.trim() ? `, ${contact.phone.trim()}` : ''}`);
  }

  const householdMembers = plan.household.filter(
    (person) => person.name.trim() || person.phone.trim()
  );
  if (householdMembers.length > 0) {
    lines.push('Household');
    householdMembers.forEach((person) => {
      const note = person.note.trim() ? ` (${person.note.trim()})` : '';
      const phone = person.phone.trim() ? `: ${person.phone.trim()}` : '';
      lines.push(`- ${person.name.trim()}${note}${phone}`);
    });
    lines.push('');
  }

  contactLine('Neighbour', plan.neighbour);
  contactLine('Out-of-community contact', plan.outOfCommunity);
  contactLine('Off-island contact', plan.offIsland);
  if (plan.meetNearHome.trim()) lines.push(`Meeting place near home: ${plan.meetNearHome.trim()}`);
  if (plan.meetOutsideArea.trim()) {
    lines.push(`Meeting place outside the neighbourhood: ${plan.meetOutsideArea.trim()}`);
  }
  contactLine('Nearest health centre', plan.healthCentre);

  lines.push('', 'Emergency numbers');
  sideMission.content.emergencyNumbers.forEach((entry) => {
    lines.push(`${entry.name}: ${entry.display || entry.number}`);
  });

  return lines.join('\n');
}
