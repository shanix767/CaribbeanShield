import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    TouchableOpacity 
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function LessonActivity({ activity, onComplete }) {
  const { body, bullets } = activity.content;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.body}>{body}</Text>

        {bullets.map((bulletText, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletMarker}>•</Text>
            <Text style={styles.bulletText}>{bulletText}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
        <Text style={styles.continueButtonText}>Continue (+{activity.xpReward} XP)</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletMarker: {
    fontSize: 15,
    color: COLORS.backgroundGreenD,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.textDark,
  },
  continueButton: {
    backgroundColor: COLORS.backgroundGreenD,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});