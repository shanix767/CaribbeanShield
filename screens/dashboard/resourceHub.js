// screens/dashboard/resourceHub.js
//
// Emergency contacts (tap-to-call) and shelter information. Contact
// numbers sourced from ODM's own emergency contact list; shelter rules
// condensed from ODM's shelter regulations document - paraphrased for an
// app reading experience, not pasted as legal text, but the substance
// (what's enforced, what to bring, what's not allowed) is kept accurate.

import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';

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

  function handleCall(number) {
    Linking.openURL(`tel:${number}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Resource Hub</Text>

        <TouchableOpacity
          style={styles.shelterLinkCard}
          onPress={() => navigation.navigate('Shelter')}
        >
          <Text style={styles.shelterLinkText}>📍 Find your nearest shelter →</Text>
        </TouchableOpacity>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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