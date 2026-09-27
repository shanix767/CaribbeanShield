// screens/CommunicationPlan.js
//
// The "Family Communication Plan" side mission. Unlike the other two side
// missions (self-report checklists), the player fills in their own plan,
// using the fields of ODM's Family Communication Plan template.
//
// Two modes:
//   edit - the form. A progress card shows sections done and the XP the
//          plan would earn. Saving a plan that has every required section
//          completes the side mission (COMPLETE_SIDE_MISSION), with XP
//          proportional to how many scored sections are filled in.
//   view - "My Plan": the saved plan as a card, with tap-to-call numbers,
//          a Share button (WhatsApp, SMS, email...) and Edit.
//
// Opened from the Home side-mission list and from the Hub. The plan is
// stored only on this device (services/communicationPlanStorage.js), so
// it works offline and is never uploaded.
//
// The plan doesn't have to be finished in one go. Leaving the screen (the
// Back link, the Android back button or a swipe) saves the draft
// automatically, and "Save progress" does the same explicitly. Reopening
// the screen picks up where the player left off.

import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Share,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameContext } from '../context/GameContext';
import { SIDE_MISSIONS } from '../missionContent/sideMissions';
import {
  MAX_HOUSEHOLD_MEMBERS,
  createEmptyPerson,
  createEmptyPlan,
  loadCommunicationPlan,
  saveCommunicationPlan,
  isSectionComplete,
  isPhoneNumberFilled,
  scoreCommunicationPlan,
  formatPlanForSharing,
} from '../services/communicationPlanStorage';
import { COLORS } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const sideMission = SIDE_MISSIONS.communicationPlan;
const planContent = sideMission.content;

function callNumber(phone) {
  const dialable = (phone || '').replace(/[^\d+]/g, '');
  if (dialable) Linking.openURL(`tel:${dialable}`);
}

export default function CommunicationPlanScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameContext();

  const [mode, setMode] = useState('loading'); // 'loading' | 'edit' | 'view'
  const [savedPlan, setSavedPlan] = useState(null);
  const [draftPlan, setDraftPlan] = useState(createEmptyPlan());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Shown at the top of "My Plan" straight after a save:
  // { kind: 'badge' | 'updated', earnedXp }
  const [completionMessage, setCompletionMessage] = useState(null);

  // The latest draft and whether it has unsaved changes, kept in refs so
  // the "leaving the screen" listener below always sees current values.
  const draftPlanRef = useRef(draftPlan);
  const hasUnsavedChangesRef = useRef(false);
  useEffect(() => {
    draftPlanRef.current = draftPlan;
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [draftPlan, hasUnsavedChanges]);

  // Whenever the screen is left in edit mode with unsaved changes (Back
  // link, Android back button or swipe), save the draft so nothing typed
  // is lost. This only saves the plan; it never completes the side
  // mission - that still needs the required sections and a Save.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (hasUnsavedChangesRef.current) {
        saveCommunicationPlan(draftPlanRef.current).catch(() => {});
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    async function loadPlan() {
      const plan = await loadCommunicationPlan();
      if (plan) {
        setSavedPlan(plan);
        setDraftPlan(plan);
        const { meetsBadgeMinimum } = scoreCommunicationPlan(plan, sideMission);
        setMode(meetsBadgeMinimum ? 'view' : 'edit');
      } else {
        setMode('edit');
      }
    }
    loadPlan();
  }, []);

  const score = scoreCommunicationPlan(draftPlan, sideMission);

  // --- Editing the draft ---

  function updateDraft(updater) {
    setDraftPlan((current) => updater(current));
    setHasUnsavedChanges(true);
  }

  function updatePerson(index, field, value) {
    updateDraft((current) => ({
      ...current,
      household: current.household.map((person, personIndex) =>
        personIndex === index ? { ...person, [field]: value } : person
      ),
    }));
  }

  function addPerson() {
    updateDraft((current) => ({
      ...current,
      household: [...current.household, createEmptyPerson()],
    }));
  }

  function removePerson(index) {
    updateDraft((current) => ({
      ...current,
      household: current.household.filter((_, personIndex) => personIndex !== index),
    }));
  }

  function updateContact(sectionKey, field, value) {
    updateDraft((current) => ({
      ...current,
      [sectionKey]: { ...current[sectionKey], [field]: value },
    }));
  }

  function updatePlace(sectionKey, value) {
    updateDraft((current) => ({ ...current, [sectionKey]: value }));
  }

  // --- Saving ---

  async function handleSave() {
    setIsSaving(true);
    try {
      const planJustSaved = await saveCommunicationPlan(draftPlan);
      setSavedPlan(planJustSaved);
      setHasUnsavedChanges(false);

      const planScore = scoreCommunicationPlan(planJustSaved, sideMission);
      if (planScore.meetsBadgeMinimum) {
        const alreadyCompleted = !!state.sideMissions[sideMission.id]?.completed;
        // Same action the checklist side missions use. Re-saving an
        // edited plan dispatches again, so XP always reflects the latest
        // saved plan, the same way retrying an activity does.
        dispatch({
          type: 'COMPLETE_SIDE_MISSION',
          sideMissionId: sideMission.id,
          xpReward: planScore.earnedXp,
          badgeId: sideMission.badgeId,
        });
        setCompletionMessage({
          kind: alreadyCompleted ? 'updated' : 'badge',
          earnedXp: planScore.earnedXp,
        });
        setMode('view');
      } else {
        Alert.alert(
          'Progress saved',
          'You can come back and finish any time from Home or the Hub.\n\n' +
            `To earn the ${sideMission.badgeName} badge, you still need:\n• ` +
            planScore.missingRequiredTitles.join('\n• '),
          [
            { text: 'Keep editing', style: 'cancel' },
            { text: 'Finish later', onPress: () => navigation.goBack() },
          ]
        );
      }
    } catch {
      Alert.alert('Could not save', 'Your plan could not be saved on this phone. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  // Unsaved changes are saved by the 'beforeRemove' listener above, so
  // going back never loses anything and never asks to discard.
  function handleBack() {
    navigation.goBack();
  }

  function handleCancelEdit() {
    setDraftPlan(savedPlan);
    setHasUnsavedChanges(false);
    setMode('view');
  }

  function handleStartEdit() {
    setDraftPlan(savedPlan);
    setCompletionMessage(null);
    setMode('edit');
  }

  async function handleShare() {
    try {
      await Share.share({
        title: 'Family Communication Plan',
        message: formatPlanForSharing(savedPlan, sideMission),
      });
    } catch {
      Alert.alert('Could not share', 'Sharing is not available right now.');
    }
  }

  // --- Rendering ---

  const savedPlanMeetsMinimum =
    !!savedPlan && scoreCommunicationPlan(savedPlan, sideMission).meetsBadgeMinimum;

  return (
    <View style={styles.wrapper}>
      <ScreenHeader
        title={`${sideMission.icon} ${mode === 'view' ? 'My Communication Plan' : sideMission.title}`}
        onBack={handleBack}
      />

      {mode === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.backgroundGreenD} />
        </View>
      )}

      {mode === 'edit' && (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.introText}>{planContent.intro}</Text>
            <Text style={styles.finishLaterText}>
              No need to finish in one go - your progress is saved when you leave, so you can
              come back any time.
            </Text>

            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {score.completedScoredCount} of {score.totalScoredCount} sections
                </Text>
                <Text style={styles.progressXp}>
                  {score.earnedXp} / {sideMission.xpReward} XP
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(score.completedScoredCount / score.totalScoredCount) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressHint}>
                {score.meetsBadgeMinimum
                  ? `Ready to earn the ${sideMission.badgeName} badge. Save your plan.`
                  : `The ${sideMission.badgeName} badge needs your household, an out-of-community contact and both meeting places.`}
              </Text>
            </View>

            {planContent.sections.map((section) => (
              <PlanSectionForm
                key={section.key}
                section={section}
                plan={draftPlan}
                onPersonChange={updatePerson}
                onAddPerson={addPerson}
                onRemovePerson={removePerson}
                onContactChange={updateContact}
                onPlaceChange={updatePlace}
              />
            ))}

            <EmergencyNumbersCard />

            <Text style={styles.privacyNote}>🔒 {planContent.privacyNote}</Text>
          </ScrollView>

          <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
            {savedPlanMeetsMinimum && (
              <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelEdit}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? 'Saving…' : score.meetsBadgeMinimum ? 'Save plan' : 'Save progress'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}

      {mode === 'view' && savedPlan && (
        <>
          <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
            {completionMessage && (
              <View style={styles.completionBanner}>
                <Text style={styles.completionTitle}>
                  {completionMessage.kind === 'badge'
                    ? `🏅 Badge earned: ${sideMission.badgeName}`
                    : '✅ Plan updated'}
                </Text>
                <Text style={styles.completionText}>
                  +{completionMessage.earnedXp} XP. Now share your plan with everyone in your
                  household.
                </Text>
              </View>
            )}

            <SavedPlanCard plan={savedPlan} />
            <EmergencyNumbersCard />

            <Text style={styles.paperNote}>📝 {planContent.paperCopyNote}</Text>
            <Text style={styles.privacyNote}>🔒 {planContent.privacyNote}</Text>
            {savedPlan.updatedAt && (
              <Text style={styles.updatedText}>
                Last updated {new Date(savedPlan.updatedAt).toLocaleDateString()}
              </Text>
            )}
          </ScrollView>

          <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleStartEdit}>
              <Text style={styles.secondaryButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
              <Text style={styles.primaryButtonText}>📤 Share plan</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

// --- Edit mode: one card per plan section ---

function PlanSectionForm({
  section,
  plan,
  onPersonChange,
  onAddPerson,
  onRemovePerson,
  onContactChange,
  onPlaceChange,
}) {
  const isComplete = isSectionComplete(section, plan);

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {isComplete && <Text style={styles.sectionTick}>✓</Text>}
      </View>
      <Text style={styles.sectionHint}>{section.hint}</Text>

      {section.type === 'people' && (
        <>
          {plan.household.map((person, index) => (
            <View key={index} style={styles.personBlock}>
              <View style={styles.personHeaderRow}>
                <Text style={styles.personLabel}>Person {index + 1}</Text>
                {plan.household.length > 1 && (
                  <TouchableOpacity onPress={() => onRemovePerson(index)}>
                    <Text style={styles.removeLink}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              <PlanInput
                value={person.name}
                onChangeText={(value) => onPersonChange(index, 'name', value)}
                placeholder="Name"
                autoCapitalize="words"
              />
              <PlanInput
                value={person.phone}
                onChangeText={(value) => onPersonChange(index, 'phone', value)}
                placeholder="Phone number"
                keyboardType="phone-pad"
                showPhoneWarning
              />
              <PlanInput
                value={person.note}
                onChangeText={(value) => onPersonChange(index, 'note', value)}
                placeholder={section.notePlaceholder}
              />
            </View>
          ))}
          {plan.household.length < MAX_HOUSEHOLD_MEMBERS && (
            <TouchableOpacity style={styles.addPersonButton} onPress={onAddPerson}>
              <Text style={styles.addPersonText}>+ Add another person</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {section.type === 'contact' && (
        <>
          <PlanInput
            value={plan[section.key].name}
            onChangeText={(value) => onContactChange(section.key, 'name', value)}
            placeholder={section.namePlaceholder || 'Name'}
            autoCapitalize="words"
          />
          <PlanInput
            value={plan[section.key].phone}
            onChangeText={(value) => onContactChange(section.key, 'phone', value)}
            placeholder="Phone number"
            keyboardType="phone-pad"
            showPhoneWarning
          />
        </>
      )}

      {section.type === 'place' && (
        <PlanInput
          value={plan[section.key]}
          onChangeText={(value) => onPlaceChange(section.key, value)}
          placeholder={section.placeholder}
        />
      )}
    </View>
  );
}

function PlanInput({ showPhoneWarning, value, ...inputProps }) {
  const showWarning = showPhoneWarning && value.trim().length > 0 && !isPhoneNumberFilled(value);
  return (
    <>
      <TextInput
        style={styles.input}
        value={value}
        placeholderTextColor={COLORS.textGray}
        {...inputProps}
      />
      {showWarning && (
        <Text style={styles.inputWarning}>A phone number needs at least 7 digits.</Text>
      )}
    </>
  );
}

// --- View mode ---

function SavedPlanCard({ plan }) {
  const householdMembers = plan.household.filter(
    (person) => person.name.trim() || person.phone.trim()
  );

  function renderContactRow(label, contact, key) {
    if (!contact || (!contact.name.trim() && !contact.phone.trim())) return null;
    return (
      <ContactRow key={key} label={label} name={contact.name} phone={contact.phone} />
    );
  }

  return (
    <View style={styles.planCard}>
      <Text style={styles.planCardHeading}>Household</Text>
      {householdMembers.map((person, index) => (
        <ContactRow
          key={`person-${index}`}
          name={person.name}
          note={person.note}
          phone={person.phone}
        />
      ))}

      <Text style={styles.planCardHeading}>Contacts</Text>
      {renderContactRow('Neighbour', plan.neighbour, 'neighbour')}
      {renderContactRow('Out-of-community contact', plan.outOfCommunity, 'outOfCommunity')}
      {renderContactRow('Off-island contact', plan.offIsland, 'offIsland')}
      {renderContactRow('Nearest health centre', plan.healthCentre, 'healthCentre')}

      <Text style={styles.planCardHeading}>Meeting places</Text>
      <PlaceRow label="Near home" value={plan.meetNearHome} />
      <PlaceRow label="Outside the neighbourhood" value={plan.meetOutsideArea} />
    </View>
  );
}

function ContactRow({ label, name, note, phone }) {
  const canCall = isPhoneNumberFilled(phone);
  return (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={() => callNumber(phone)}
      disabled={!canCall}
    >
      <View style={styles.flex}>
        {!!label && <Text style={styles.contactLabel}>{label}</Text>}
        <Text style={styles.contactName}>{name.trim() || 'No name'}</Text>
        {!!note?.trim() && <Text style={styles.contactNote}>{note.trim()}</Text>}
        {!!phone.trim() && <Text style={styles.contactPhone}>{phone.trim()}</Text>}
      </View>
      {canCall && <Text style={styles.callIcon}>📞</Text>}
    </TouchableOpacity>
  );
}

function PlaceRow({ label, value }) {
  return (
    <View style={styles.placeRow}>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactName}>{value.trim() || 'Not set'}</Text>
    </View>
  );
}

function EmergencyNumbersCard() {
  return (
    <View style={styles.emergencyCard}>
      <Text style={styles.emergencyTitle}>Emergency numbers</Text>
      {planContent.emergencyNumbers.map((entry) => (
        <TouchableOpacity
          key={entry.number}
          style={styles.emergencyRow}
          onPress={() => callNumber(entry.number)}
        >
          <View style={styles.flex}>
            <Text style={styles.emergencyName}>{entry.name}</Text>
            <Text style={styles.emergencyNumber}>{entry.display || entry.number}</Text>
          </View>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textDark,
    marginBottom: 6,
  },
  finishLaterText: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textGray,
    fontStyle: 'italic',
    marginBottom: 12,
  },

  // Progress
  progressCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  progressXp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textOrange,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.backgroundGreenL,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.borderYellow,
  },
  progressHint: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textGray,
    marginTop: 8,
  },

  // Section cards (edit mode)
  sectionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  sectionTick: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginLeft: 8,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textGray,
    marginBottom: 10,
  },
  personBlock: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCream,
    paddingTop: 10,
    marginBottom: 4,
  },
  personHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  personLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textGreen,
  },
  removeLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textRed,
  },
  addPersonButton: {
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addPersonText: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    backgroundColor: COLORS.backgroundWhite,
    marginBottom: 8,
  },
  inputWarning: {
    fontSize: 11,
    color: COLORS.textRed,
    marginTop: -4,
    marginBottom: 8,
  },

  // View mode
  completionBanner: {
    backgroundColor: COLORS.backgroundYellow,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  completionText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textDark,
  },
  planCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  planCardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginTop: 6,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCream,
  },
  contactLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    marginBottom: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  contactNote: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 1,
  },
  contactPhone: {
    fontSize: 13,
    color: COLORS.textGreen,
    marginTop: 2,
  },
  placeRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCream,
  },
  callIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  emergencyCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emergencyName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  emergencyNumber: {
    fontSize: 13,
    color: COLORS.textGreen,
  },
  paperNote: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textDark,
    marginBottom: 6,
  },
  privacyNote: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  updatedText: {
    fontSize: 11,
    color: COLORS.textGray,
    fontStyle: 'italic',
  },

  // Bottom buttons
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCream,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: COLORS.backgroundGreenD,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 6,
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 6,
  },
  secondaryButtonText: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});