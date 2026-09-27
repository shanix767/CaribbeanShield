// services/firestoreUsers.js
//
// Writes user records (id, name, parish) and pretest/posttest scores to
// Firestore - readable anytime from the Firebase console, independent of
// Reset Progress or any single device. Not anonymised - records include
// the name the user gave during onboarding.
//
// User IDs are sequential (CS-100001, CS-100002, ...), assigned via a
// Firestore transaction against a shared counter document - a plain
// "count existing users" approach would have a real race condition if two
// people ever onboarded at the same moment (both could read the same
// count and claim the same ID); a transaction makes that impossible, each
// claim is atomic.
//
// Every function here is resilient to network failure AND to a hanging
// write/read - same lesson as the hazard API services (fetchWithTimeout):
// without a timeout, an operation with no signal can sit "awaiting"
// forever rather than rejecting. Racing every call against a timeout is
// what stops that from freezing the UI; the underlying operation isn't
// cancelled when the timeout wins, it may still complete in the
// background, this timeout only stops the APP from waiting on it.
//
// Local AsyncStorage (via GameContext) remains the source of truth the
// app actually runs on; these are best-effort syncs on top of that.

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  runTransaction,
} from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';
const COUNTER_DOC_PATH = 'counters/userCounter';
const ID_PREFIX = 'CS-';
const ID_BASE_NUMBER = 100000; // first user becomes CS-100001
const FIRESTORE_TIMEOUT_MS = 10000; // matches the 10s timeout used elsewhere in the app

function formatUserId(count) {
  return `${ID_PREFIX}${ID_BASE_NUMBER + count}`;
}

function raceAgainstTimeout(promise) {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve('TIMED_OUT'), FIRESTORE_TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]);
}

// Read-only look at what the next ID would be, WITHOUT claiming it - used
// to show the ID on screen as soon as it loads, before the user has
// entered their name or tapped Continue. Since this doesn't increment
// anything, it's safe to call as often as needed (e.g. every time this
// screen mounts) with no risk of burning through IDs on abandoned visits.
export async function previewNextUserId() {
  try {
    const db = getFirestore();
    const counterSnap = await raceAgainstTimeout(getDoc(doc(db, COUNTER_DOC_PATH)));
    if (counterSnap === 'TIMED_OUT') return null;
    const currentCount = counterSnap.exists() ? counterSnap.data().count : 0;
    return formatUserId(currentCount + 1);
  } catch {
    return null;
  }
}

// Atomically increments the shared counter and returns the newly claimed
// ID - called once, when the user actually continues past this screen.
export async function claimNextUserId() {
  try {
    const db = getFirestore();
    const result = await raceAgainstTimeout(
      runTransaction(db, async (transaction) => {
        const counterRef = doc(db, COUNTER_DOC_PATH);
        const counterSnap = await transaction.get(counterRef);
        const currentCount = counterSnap.exists() ? counterSnap.data().count : 0;
        const updatedCount = currentCount + 1;
        transaction.set(counterRef, { count: updatedCount });
        return updatedCount;
      })
    );
    if (result === 'TIMED_OUT') return null;
    return formatUserId(result);
  } catch {
    return null;
  }
}

export async function updateUserParishInFirestore(userId, parish) {
  try {
    const db = getFirestore();
    const writePromise = setDoc(
      doc(collection(db, USERS_COLLECTION), userId),
      { parish },
      { merge: true }
    );
    const result = await raceAgainstTimeout(writePromise);
    return result !== 'TIMED_OUT';
  } catch {
    return false;
  }
}

export async function createUserRecord(userId, name, parish) {
  try {
    const db = getFirestore();
    const writePromise = setDoc(doc(collection(db, USERS_COLLECTION), userId), {
      userId,
      name,
      parish,
      createdAt: new Date().toISOString(),
    });
    const result = await raceAgainstTimeout(writePromise);
    return result !== 'TIMED_OUT';
  } catch {
    // No connectivity, or some other Firestore error - local onboarding
    // still proceeds regardless; see the file header for why this is
    // deliberately silent rather than surfaced to the player.
    return false;
  }
}

export async function savePretestScoreToFirestore(userId, score, maxScore) {
  try {
    const db = getFirestore();
    const writePromise = setDoc(
      doc(collection(db, USERS_COLLECTION), userId),
      {
        pretestScore: { score, maxScore, completedAt: new Date().toISOString() },
      },
      { merge: true } // merge, not replace - don't wipe name/parish/createdAt/posttest
    );
    const result = await raceAgainstTimeout(writePromise);
    return result !== 'TIMED_OUT';
  } catch {
    return false;
  }
}

export async function savePosttestScoreToFirestore(userId, score, maxScore) {
  try {
    const db = getFirestore();
    const writePromise = setDoc(
      doc(collection(db, USERS_COLLECTION), userId),
      {
        posttestScore: { score, maxScore, completedAt: new Date().toISOString() },
      },
      { merge: true }
    );
    const result = await raceAgainstTimeout(writePromise);
    return result !== 'TIMED_OUT';
  } catch {
    return false;
  }
}

// Syncs total XP and badge count for the leaderboard - called from
// GameContext whenever those specific numbers change (see the effect
// there), not on every state change, so this doesn't fire on unrelated
// updates like parish selection.
export async function syncUserProgressToFirestore(userId, totalXp, badgeCount) {
  try {
    const db = getFirestore();
    const writePromise = setDoc(
      doc(collection(db, USERS_COLLECTION), userId),
      { totalXp, badgeCount },
      { merge: true }
    );
    const result = await raceAgainstTimeout(writePromise);
    return result !== 'TIMED_OUT';
  } catch {
    return false;
  }
}

// Fetches every user's leaderboard-relevant fields. The evaluation study
// targets a handful of participants (n=5), so fetching the whole
// collection and sorting client-side is simpler than a Firestore
// orderBy() query and avoids needing a composite index.
export async function fetchAllUsersForLeaderboard() {
  try {
    const db = getFirestore();
    const snapshotPromise = getDocs(collection(db, USERS_COLLECTION));
    const snapshot = await raceAgainstTimeout(snapshotPromise);
    if (snapshot === 'TIMED_OUT') return [];

    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        userId: data.userId,
        name: data.name,
        parish: data.parish || null,
        totalXp: data.totalXp || 0,
        badgeCount: data.badgeCount || 0,
      };
    });
  } catch {
    return [];
  }
}