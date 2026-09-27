// screens/ShelterDetail.js
//
// Full detail view for one shelter, reached by tapping a card in the
// Resource Hub's Nearest Shelters section. "Get Directions" navigates to
// the Shelter tab's own map/route screen, pre-selecting this specific
// shelter - reuses the existing in-app OSRM route drawing rather than
// bouncing out to an external Maps app.

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const ODM_GENERAL_NUMBER = '2664411';

export default function ShelterDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shelter, distanceKm } = route.params;

  function handleCallODM() {
    Linking.openURL(`tel:${ODM_GENERAL_NUMBER}`);
  }

  function handleGetDirections() {
    navigation.navigate('Shelter', {
      focusShelterName: shelter.name,
      focusShelterCommunity: shelter.community,
    });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScreenHeader
        title={shelter.name}
        subtitle={`${shelter.type} · ${shelter.community}`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Capacity</Text>
            <Text style={styles.detailValue}>{shelter.capacity} people</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{distanceKm} km (straight-line)</Text>
          </View>
          {shelter.shelterManager && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shelter Manager</Text>
              <Text style={styles.detailValue}>{shelter.shelterManager}</Text>
            </View>
          )}
          {shelter.assistantManager && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assistant Manager</Text>
              <Text style={styles.detailValue}>{shelter.assistantManager}</Text>
            </View>
          )}
        </View>

        <Text style={styles.disclaimer}>
          Capacity as published by ODM and may not reflect current conditions. Shelter Manager
          names are from ODM's 2023 list and may have changed since. No live open/closed status
          is available - contact ODM to confirm activation before travelling during an emergency.
        </Text>

        <TouchableOpacity style={styles.callButton} onPress={handleCallODM}>
          <Text style={styles.callButtonText}>📞 Call ODM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
          <Text style={styles.directionsButtonText}>Get Directions →</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: 20,
  },
  backLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textGreen,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 4,
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundCream,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textGray,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textGray,
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionsButton: {
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  directionsButtonText: {
    color: COLORS.textGreen,
    fontSize: 16,
    fontWeight: 'bold',
  },
});