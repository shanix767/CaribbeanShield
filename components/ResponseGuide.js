// components/ResponseGuide.js
//
// The "Respond" tab of the Resource Hub. The user picks a hazard and sees
// what to do: one key action at the top, then numbered steps for the
// warning, during and after phases. Nothing is collapsed, because in an
// emergency the steps need to be readable straight away. All content comes
// from missionContent/responseGuide.js and is bundled with the app, so it
// works offline.
//
// The hazard selection is controlled by the Hub (selectedHazardId /
// onSelectHazard). That lets other screens open the Hub on a specific
// hazard, e.g. navigation.navigate('Hub', { hazard: 'earthquake' }).

import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RESPONSE_GUIDE, RESPONSE_PHASE_STYLES } from '../missionContent/responseGuide';
import { COLORS } from '../theme/colors';

// Header colours per phase: amber for warning, red for during, green for
// after. Each pairs a background with a text colour that passes AA.
const PHASE_COLORS = {
  warning: { background: COLORS.backgroundYellow, text: COLORS.textDark },
  during: { background: COLORS.backgroundRed, text: COLORS.textWhite },
  after: { background: COLORS.backgroundGreen, text: COLORS.textWhite },
};

const ALERT_LEVEL_COLORS = {
  Green: { background: COLORS.backgroundGreen, text: COLORS.textWhite },
  Yellow: { background: COLORS.backgroundYellow, text: COLORS.textDark },
  Orange: { background: COLORS.backgroundYellowAlert, text: COLORS.textDark },
  Red: { background: COLORS.backgroundRed, text: COLORS.textWhite },
};

export default function ResponseGuide({ selectedHazardId, onSelectHazard }) {
  const navigation = useNavigation();
  const hazard =
    RESPONSE_GUIDE.find((item) => item.id === selectedHazardId) || RESPONSE_GUIDE[0];

  return (
    <View>
      <Text style={styles.introText}>What to do if… Pick a hazard to see the steps.</Text>

      <View style={styles.hazardGrid}>
        {RESPONSE_GUIDE.map((item) => {
          const isSelected = item.id === hazard.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.hazardChip, isSelected && styles.hazardChipSelected]}
              onPress={() => onSelectHazard(item.id)}
            >
              <Text style={styles.hazardEmoji}>{item.emoji}</Text>
              <Text style={[styles.hazardName, isSelected && styles.hazardNameSelected]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.keyActionCard}>
        <Text style={styles.keyActionLabel}>
          {hazard.emoji} {hazard.name.toUpperCase()}: KEY ACTION
        </Text>
        <Text style={styles.keyActionText}>{hazard.keyAction}</Text>
      </View>

      <View style={styles.quickActionRow}>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.callButton]}
          onPress={() => Linking.openURL('tel:911')}
        >
          <Text style={styles.quickActionText}>📞 Call 911</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.shelterButton]}
          onPress={() => navigation.navigate('Shelter')}
        >
          <Text style={styles.quickActionText}>📍 Nearest shelter</Text>
        </TouchableOpacity>
      </View>

      {hazard.alertLevels && (
        <View style={styles.alertLevelCard}>
          <Text style={styles.alertLevelTitle}>Volcanic alert levels</Text>
          {hazard.alertLevels.map((alertLevel) => {
            const levelColors = ALERT_LEVEL_COLORS[alertLevel.level];
            return (
              <View key={alertLevel.level} style={styles.alertLevelRow}>
                <View style={[styles.alertLevelPill, { backgroundColor: levelColors.background }]}>
                  <Text style={[styles.alertLevelPillText, { color: levelColors.text }]}>
                    {alertLevel.level}
                  </Text>
                </View>
                <Text style={styles.alertLevelMeaning}>{alertLevel.meaning}</Text>
              </View>
            );
          })}
        </View>
      )}

      {hazard.phases.map((phase) => {
        const phaseColors = PHASE_COLORS[phase.type];
        const phaseStyle = RESPONSE_PHASE_STYLES[phase.type];
        return (
          <View key={phase.type} style={styles.phaseCard}>
            <View style={[styles.phaseHeader, { backgroundColor: phaseColors.background }]}>
              <Text style={[styles.phaseHeaderText, { color: phaseColors.text }]}>
                {phaseStyle.emoji} {phase.title}
              </Text>
            </View>
            <View style={styles.phaseBody}>
              {phase.steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      <Text style={styles.sourceText}>Source: {hazard.source}</Text>
      <Text style={styles.disclaimerText}>
        This guide supports, and does not replace, official warnings and instructions from ODM.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  introText: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 12,
  },
  hazardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hazardChip: {
    width: '31.5%',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 2,
    borderColor: COLORS.borderCream,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  hazardChipSelected: {
    backgroundColor: COLORS.backgroundGreenD,
    borderColor: COLORS.borderYellow,
  },
  hazardEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  hazardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 2,
  },
  hazardNameSelected: {
    color: COLORS.textWhite,
  },
  keyActionCard: {
    backgroundColor: COLORS.backgroundRed,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  keyActionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  keyActionText: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  quickActionButton: {
    width: '48.5%',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: COLORS.backgroundRed,
  },
  shelterButton: {
    backgroundColor: COLORS.backgroundGreenD,
  },
  quickActionText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  alertLevelCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  alertLevelTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  alertLevelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertLevelPill: {
    width: 64,
    borderRadius: 8,
    paddingVertical: 3,
    alignItems: 'center',
    marginRight: 10,
  },
  alertLevelPillText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertLevelMeaning: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textDark,
  },
  phaseCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  phaseHeader: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  phaseHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  phaseBody: {
    padding: 14,
    paddingBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.backgroundGreenL,
    color: COLORS.textGreenD,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
    marginRight: 10,
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textDark,
  },
  sourceText: {
    fontSize: 11,
    color: COLORS.textGray,
    fontStyle: 'italic',
    marginTop: 2,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textGray,
    marginTop: 6,
    marginBottom: 24,
  },
});