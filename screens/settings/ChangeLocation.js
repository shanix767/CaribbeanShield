// screens/settings/ChangeLocation.js
//
// Lets a user update their parish/community after onboarding. Copy here
// is deliberately more conservative than a typical mockup might claim -
// parish currently drives the Leaderboard's "by parish" ranking; it does
// NOT change hazard alerts (island-wide National Hurricane Center/USGS/
// GVP/GDACS data, same for everyone) or the Resource Hub's nearest
// shelters (based on live GPS, not this stored value). Saying otherwise
// would be inaccurate about what the app actually does right now.

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameContext } from '../../context/GameContext';
import { updateUserParishInFirestore } from '../../services/firestoreUsers';
import { COLORS } from '../../theme/colors';
import ScreenHeader, { HeaderButton } from '../../components/ScreenHeader';

const PARISHES = [
  'Saint Andrew',
  'Saint David',
  'Saint George',
  'Saint John',
  'Saint Joseph',
  'Saint Luke',
  'Saint Mark',
  'Saint Patrick',
  'Saint Paul',
  'Saint Peter',
];

export default function ChangeLocationScreen() {
  const navigation = useNavigation();
  // The picker sheet slides up from the bottom edge, so it needs the
  // phone's bottom inset to keep the last parish clear of the nav bar.
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useGameContext();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pendingParish, setPendingParish] = useState(state.parish);
  const [pendingCommunity, setPendingCommunity] = useState(state.community || '');

  const hasChanges = pendingParish !== state.parish || pendingCommunity !== (state.community || '');

  function handleSelectParish(parishName) {
    setPendingParish(parishName);
    setIsPickerOpen(false);
  }

  function handleSave() {
    dispatch({ type: 'SET_PARISH', parish: pendingParish });
    const trimmedCommunity = pendingCommunity.trim();
    dispatch({ type: 'SET_COMMUNITY', community: trimmedCommunity || null });
    if (state.userId && pendingParish !== state.parish) {
      updateUserParishInFirestore(state.userId, pendingParish);
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScreenHeader
        title="Change Location"
        onBack={() => navigation.goBack()}
        backLabel="Settings"
        right={hasChanges ? <HeaderButton label="Save" onPress={handleSave} /> : null}
      />
      <View style={styles.container}>

      <Text style={styles.description}>
        This updates your parish, used for the Island leaderboard's parish rankings. Hazard
        alerts cover the whole island and don't change by parish; your nearest shelters are
        based on your live location, not this setting.
      </Text>

      <Text style={styles.fieldLabel}>Parish</Text>
      <TouchableOpacity style={styles.dropdownField} onPress={() => setIsPickerOpen(true)}>
        <Text style={styles.dropdownValueText}>{pendingParish}</Text>
        <Text style={styles.dropdownChevron}>▾</Text>
      </TouchableOpacity>

      <Text style={styles.fieldLabel}>Community (optional)</Text>
      <TextInput
        style={styles.textInput}
        value={pendingCommunity}
        onChangeText={setPendingCommunity}
        placeholder="e.g. Goodwill, Portsmouth..."
        placeholderTextColor={COLORS.textGray}
      />

      {hasChanges && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save new location</Text>
        </TouchableOpacity>
      )}

      <Modal visible={isPickerOpen} transparent animationType="slide" onRequestClose={() => setIsPickerOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsPickerOpen(false)}
        >
          <View style={[styles.modalSheet, { paddingBottom: 16 + insets.bottom }]}>
            <Text style={styles.modalTitle}>Select your parish</Text>
            <FlatList
              data={PARISHES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === pendingParish;
                return (
                  <TouchableOpacity
                    style={isSelected ? styles.modalRowSelected : styles.modalRow}
                    onPress={() => handleSelectParish(item)}
                  >
                    <Text style={styles.modalRowText}>{item}</Text>
                    {isSelected && <Text style={styles.modalCheckmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
  },
  saveLink: {
    color: COLORS.backgroundGreenD,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 19,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  dropdownValueText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  dropdownChevron: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  textInput: {
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 1,
    borderColor: COLORS.borderCream,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCream,
  },
  modalRowSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCream,
  },
  modalRowText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  modalCheckmark: {
    fontSize: 16,
    color: COLORS.backgroundGreenD,
    fontWeight: 'bold',
  },
});