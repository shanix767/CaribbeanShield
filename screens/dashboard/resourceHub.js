// screens/dashboard/resourceHub.js
//
// Two tabs:
//   Resources - emergency contacts (tap-to-call), shelter information, and
//               links to the leaflet-style Hurricane Preparedness Guide
//               (screens/PreparednessGuide.js) and the player's own Family
//               Communication Plan (screens/CommunicationPlan.js).
//   Respond   - "What to do if..." steps for each hazard
//               (components/ResponseGuide.js).
// Other screens can open the Respond tab on a given hazard with
// navigation.navigate('Hub', { hazard: 'flood' }).
//
// Contact
// numbers sourced from ODM's own emergency contact list; shelter rules
// condensed from ODM's shelter regulations document - paraphrased for an
// app reading experience, not pasted as legal text, but the substance
// (what's enforced, what to bring, what's not allowed) is kept accurate.

import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCurrentUserLocation, findNearestShelters } from '../../services/locationApi';
import ResponseGuide from '../../components/ResponseGuide';
import { COLORS } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

const HUB_TABS = [
  { id: 'resources', label: '📋 Resources' },
  { id: 'respond', label: '🚨 Respond' },
];

const EMERGENCY_CONTACTS = [
  { name: 'Police, Fire & Ambulance', number: '911', note: 'General emergencies' },
  { name: 'Office of Disaster Management (ODM)', number: '2664411', note: '(767) 266-4411' },
  { name: 'Fire & Ambulance Services Division', number: '2664400', note: '(767) 266-4400' },
  { name: 'Police Headquarters', number: '2665100', note: '(767) 266-5100' },
  { name: 'Dominica Red Cross Society', number: '4488280', note: '(767) 448-8280' },
  { name: 'DOWASCO (water faults)', number: '4484811', note: '(767) 448-4811' },
  { name: 'DOMLEC (electricity faults)', number: '811', note: 'Fault reports' },
];

const HOSPITALS = [
  { name: 'Dominica China Friendship Hospital', location: 'Goodwill', number: '2662000' },
  { name: 'Marigot Hospital', location: 'Marigot', number: '2662800' },
  { name: 'Grand Bay Hospital', location: 'Grand Bay', number: '4463706' },
  { name: 'Portsmouth Hospital', location: 'Portsmouth', number: '4455360' },
];

const SHELTER_RULES = [
  {
    heading: 'What to bring',
    body: 'Food for at least the first day, personal medication, a mask, and hand sanitizer or rubbing alcohol if you have it. Shelters may not be able to supply everyone\u2019s personal needs.',
  },
  {
    heading: 'Health & sanitation',
    body: 'Anyone with a contagious illness is isolated separately. Personal hygiene, clean sleeping areas, and frequent handwashing are expected and enforced by shelter staff.',
  },
  {
    heading: 'Safety',
    body: 'No weapons, hazardous materials, smoking, or alcohol are permitted inside a shelter. Report any fire hazard to shelter staff immediately.',
  },
  {
    heading: 'Law & order',
    body: 'Normal laws of Dominica apply inside shelters. The shelter manager and their team handle conflicts and enforce rules; serious violations are referred directly to police.',
  },
  {
    heading: 'Pets',
    body: 'Pets are generally not allowed inside the main shelter area - check with ODM or your shelter manager ahead of time about arrangements for animals.',
  },
];

export default function ResourceHubScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [selectedHazardId, setSelectedHazardId] = useState('hurricane');
  const [nearestShelters, setNearestShelters] = useState([]);
  const [shelterLoadState, setShelterLoadState] = useState('loading'); // 'loading' | 'ready' | 'denied' | 'error'

  useEffect(() => {
    async function loadNearestShelters() {
      try {
        const location = await getCurrentUserLocation();
        const nearest = findNearestShelters(location.latitude, location.longitude, 5);
        setNearestShelters(nearest);
        setShelterLoadState('ready');
      } catch (error) {
        setShelterLoadState(error.message?.includes('permission') ? 'denied' : 'error');
      }
    }
    loadNearestShelters();
  }, []);

  // Opened with a hazard, e.g. from Hazard Watch: jump straight to its steps.
  const requestedHazard = route.params?.hazard;
  useEffect(() => {
    if (requestedHazard) {
      setSelectedHazardId(requestedHazard);
      setActiveTab('respond');
    }
  }, [requestedHazard]);

  function switchTab(tabId) {
    setActiveTab(tabId);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }

  function handleCall(number) {
    Linking.openURL(`tel:${number}`);
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Resource Hub"
        subtitle="Contacts, shelters and what to do in an emergency"
      />
      <ScrollView ref={scrollViewRef} style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

        <View style={styles.tabBar}>
          {HUB_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => switchTab(tab.id)}
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'respond' && (
          <ResponseGuide
            selectedHazardId={selectedHazardId}
            onSelectHazard={setSelectedHazardId}
          />
        )}

        {activeTab === 'resources' && (
          <>
          <TouchableOpacity
            style={styles.shelterLinkCard}
            onPress={() => navigation.navigate('Shelter')}
          >
            <Text style={styles.shelterLinkText}>📍 View shelter map & route →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guideLinkCard}
            onPress={() => navigation.navigate('PreparednessGuide')}
          >
            <Text style={styles.guideLinkTitle}>📖 Hurricane Preparedness Guide →</Text>
            <Text style={styles.guideLinkSubtitle}>
              All the mission guidance in one place, like a leaflet. Works offline.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guideLinkCard}
            onPress={() => navigation.navigate('CommunicationPlan')}
          >
            <Text style={styles.guideLinkTitle}>📇 My Family Communication Plan →</Text>
            <Text style={styles.guideLinkSubtitle}>
              Your household contacts and meeting places. Stored on this phone; works offline.
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Nearest Shelters</Text>

          {shelterLoadState === 'loading' && (
            <View style={styles.shelterStatusBox}>
              <ActivityIndicator color={COLORS.backgroundGreenD} />
            </View>
          )}

          {shelterLoadState === 'denied' && (
            <View style={styles.shelterStatusBox}>
              <Text style={styles.shelterStatusText}>
                Enable location access to see your nearest shelters.
              </Text>
            </View>
          )}

          {shelterLoadState === 'error' && (
            <View style={styles.shelterStatusBox}>
              <Text style={styles.shelterStatusText}>
                Couldn't determine your location right now. Try again shortly.
              </Text>
            </View>
          )}

          {shelterLoadState === 'ready' &&
            nearestShelters.map(({ shelter, straightLineDistanceKm }) => (
              <TouchableOpacity
                key={`${shelter.name}-${shelter.community}`}
                style={styles.shelterCard}
                onPress={() =>
                  navigation.navigate('ShelterDetail', { shelter, distanceKm: straightLineDistanceKm })
                }
              >
                <View style={styles.shelterCardHeader}>
                  <Text style={styles.shelterCardName}>{shelter.name}</Text>
                </View>
                <Text style={styles.shelterCardSubtitle}>{shelter.type} · {shelter.community}</Text>

                <View style={styles.shelterCardRow}>
                  <Text style={styles.shelterCardDetail}>👥 {shelter.capacity} capacity</Text>
                  <Text style={styles.shelterCardDetail}>📍 {straightLineDistanceKm} km</Text>
                </View>

                {shelter.shelterManager && (
                  <Text style={styles.shelterCardManager}>
                    Shelter Manager: {shelter.shelterManager}
                  </Text>
                )}
              </TouchableOpacity>
            ))}

          {shelterLoadState === 'ready' && (
            <Text style={styles.capacityDisclaimer}>
              Capacity figures are as published by ODM and may not reflect current conditions.
              Shelter Manager names are from ODM's 2023 list and may have changed since.
            </Text>
          )}

          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {EMERGENCY_CONTACTS.map((contact) => (
            <TouchableOpacity
              key={contact.name}
              style={styles.contactRow}
              onPress={() => handleCall(contact.number)}
            >
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNote}>{contact.note}</Text>
              </View>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Hospitals</Text>
          {HOSPITALS.map((hospital) => (
            <TouchableOpacity
              key={hospital.name}
              style={styles.contactRow}
              onPress={() => handleCall(hospital.number)}
            >
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{hospital.name}</Text>
                <Text style={styles.contactNote}>{hospital.location}</Text>
              </View>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>What to Expect at a Shelter</Text>
          {SHELTER_RULES.map((rule) => (
            <View key={rule.heading} style={styles.ruleCard}>
              <Text style={styles.ruleHeading}>{rule.heading}</Text>
              <Text style={styles.ruleBody}>{rule.body}</Text>
            </View>
          ))}

          <Text style={styles.sourceNote}>
            Contact and shelter information sourced from Dominica's Office of Disaster Management (ODM).
          </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.backgroundGreenD,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textGreen,
  },
  tabButtonTextActive: {
    color: COLORS.textWhite,
  },
  guideLinkCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  guideLinkTitle: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    fontSize: 15,
  },
  guideLinkSubtitle: {
    color: COLORS.textGray,
    fontSize: 12,
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 16,
  },
  shelterLinkCard: {
    backgroundColor: COLORS.backgroundGreenD,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  shelterLinkText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  shelterStatusBox: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  shelterStatusText: {
    color: COLORS.textGray,
    fontSize: 13,
    textAlign: 'center',
  },
  shelterCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  shelterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shelterCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  shelterCardSubtitle: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  shelterCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  shelterCardDetail: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  shelterCardManager: {
    fontSize: 12,
    color: COLORS.textGreen,
    marginTop: 8,
    fontWeight: 'bold',
  },
  capacityDisclaimer: {
    fontSize: 11,
    color: COLORS.textGray,
    lineHeight: 16,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 8,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  contactNote: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  callIcon: {
    fontSize: 20,
  },
  ruleCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  ruleHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  ruleBody: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textDark,
  },
  sourceNote: {
    fontSize: 11,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
});