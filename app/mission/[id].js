import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors } from '../../constants/colors';
import { useGame } from '../../context/GameContext';

//Hurricane Ready for prototype.

const MISSIONS = {
  hurricane: {
    icon: '🌀',
    title: 'Hurricane Ready',
    xp: 150,
    badge: 'Storm Watcher',

    //Phase 1 - Learning cards.. content to be updated using formal guidelines
    learn: [
      {
        icon: '📡',
        heading: 'Watch vs Warning',
        body: 'A Hurricane Watch means conditions are possible within 48 hours. A Warning means they are expected within 36 hours. Act on the Watch - not the Warning.',
      },
      {
        icon: '🏠',
        heading: 'Secure your home',
        body: 'Board or shutter windows, bring in outdoor furniture, clear drains and gutters. Reinforce doors where possible.',
      },
      {
        icon: '💧',
        heading: 'Water & supplies',
        body: 'Store at least 1 gallon of water per person per day for 3 days. Include non-perishable food, medications, torch, and batteries.',
      },
      {
        icon: '📋',
        heading: 'Know your evacuation zone',
        body: 'Check with CDM Dominica for your zone designation. Know your nearest official shelter before a storm is named.',
      },
    ],

    //Phase 2 - Quiz questions
    quiz: [
      {
        q: 'A Hurricane Watch means conditions are expected within how many hours?',
        options: ['24 hours', '36 hours', '48 hours', '72 hours'],
        answer: 2,
      },
      {
        q: 'How much water should you store per person per day?',
        options: ['Half a litre', '1 litre', '1 gallon', '2 gallons'],
        answer: 2,
      },
      {
        q: 'Which agency issues official hurricane guidance for Dominica?',
        options: ['FEMA', 'CDM', 'Red Cross', 'UN'],
        answer: 2,
      },
      {
        q: 'When should you begin preparing - on a Watch or a Warning?',
        options: [
          'Warning - it is more serious',
          'Watch - act early before conditions worsen',
          'Only when the storm makes landfall',
          'When the government announces evacuation',
        ],
        answer: 2,
      },
    ],

    //Phase 3 - Checklist
    checklist: [
      'Board or shutter all windows',
      'Bring outdoor furniture inside',
      'Store 3-day water supply (1 gal/person/day)',
      'Pack non-perishable food for 3 days',
      'Charge all devices and power banks',
      'Locate your nearest official shelter',
      'Prepare medication and first-aid kit',
      'Clear drains and gutters around home',
    ],
  },
};

export default function MissionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const mission = MISSIONS[id];

  //Read completion state from context
  const { completeMission, completedMissions } = useGame();
  const alreadyComplete = completedMissions.includes(id);

  //Phase tracking: 0 = Learn, 1 = Quiz, 2 = Checklist
  const [phase, setPhase] = useState(0);

  //Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  //Checklist state - tracks which items have been ticked
  const [checked, setChecked] = useState([]);

  //Claim state - prevents double claiming
  const [claimed, setClaimed] = useState(alreadyComplete);


  //Guard - mission not found in MISSIONS
  if (!mission) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Mission not available yet.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>🔙 Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  //Toggle a checklist item on/off
  function toggleCheck(i) {
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  //Handle a quiz answer selection
  function handleAnswer(i) {
    if (selected !== null) return; //already answered
    setSelected(i);
    if (i === mission.quiz[quizIndex].answer) {
      setQuizScore((s) => s + 1);
    }
  }

  //Advance to next question or show results
  function nextQuestion() {
    if (quizIndex + 1 < mission.quiz.length) {
      setQuizIndex((i) => i + 1);
      setSelected(null);
    } else {
      setQuizDone(true);
    }
  }

  //Claim XP
  function handleClaim() {
    completeMission(id, mission.xp);
    setClaimed(true);
    Alert.alert(
      '🏅 Mission Complete!',
      `You earned ${mission.xp} XP and the ${mission.badge} badge.`,
      [{ text: 'Continue', onPress: () => router.back() }]
    );
  }

  const allChecked = checked.length === mission.checklist.length;

  //Render
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.xpPill}>
          <Text style={styles.xpPillText}>+{mission.xp} XP</Text>
        </View>
      </View>

      {/* Mission header */}
      <View style={styles.missionHeader}>
        <View style={styles.missionIconWrap}>
          <Text style={styles.missionIconText}>{mission.icon}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.missionTitle}>{mission.title}</Text>
          <Text style={styles.missionBadge}>🏅 {mission.badge}</Text>
        </View>
        {/* Show completed pill if mission already done */}
        {alreadyComplete && (
          <View style={styles.completedPill}>
            <Text style={styles.completedPillText}>✓ Done</Text>
          </View>
        )}
      </View>

      {/* Already complete notice */}
      {alreadyComplete && (
        <View style={styles.doneBanner}>
          <Text style={styles.doneBannerText}>
            You've completed this mission and earned the {mission.badge} badge.
          </Text>
        </View>
      )}

      {/* Phase tabs */}
      <View style={styles.phaseTabs}>
        {['Learn', 'Quiz', 'Checklist'].map((p, i) => (
          <TouchableOpacity
            key={p}
            style={[styles.phaseTab, phase === i && styles.phaseTabActive]}
            onPress={() => setPhase(i)}
          >
            <Text style={[
              styles.phaseTabText,
              phase === i && styles.phaseTabTextActive,
            ]}>
              {/* Show tick prefix for completed phases */}
              {i < phase ? '✓ ' : ''}{p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* learining */}
        {phase === 0 && (
          <>
            {mission.learn.map((c) => (
              <View key={c.heading} style={styles.learnCard}>
                {/* Icon circle */}
                <View style={styles.learnIconWrap}>
                  <Text style={styles.learnIconText}>{c.icon}</Text>
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>{c.heading}</Text>
                  <Text style={styles.cardBody}>{c.body}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => setPhase(1)}
            >
              <Text style={styles.btnPrimaryText}>Take the Quiz →</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Quiz */}
        {phase === 1 && !quizDone && (
          <>
            <Text style={styles.muted}>
              Question {quizIndex + 1} of {mission.quiz.length}
            </Text>

            {/* Quiz progress bar */}
            <View style={styles.trackBg}>
              <View style={[
                styles.trackFill,
                { width: `${(quizIndex / mission.quiz.length) * 100}%` },
              ]} />
            </View>

            {/* Question card */}
            <View style={[styles.card, { marginTop: 10 }]}>
              <Text style={styles.questionText}>
                {mission.quiz[quizIndex].q}
              </Text>
            </View>

            {/* Answer options */}
            {mission.quiz[quizIndex].options.map((opt, i) => {
              const isCorrect = i === mission.quiz[quizIndex].answer;
              const isSelected = selected === i;

              //Colour feedback after answer is selected
              let borderColor = Colors.border;
              let bgColor = Colors.card;
              if (selected !== null) {
                if (isCorrect) {
                  borderColor = Colors.green;
                  bgColor = '#E6F0E4';
                }
                if (isSelected && !isCorrect) {
                  borderColor = Colors.terra;
                  bgColor = '#FAEDE8';
                }
              }

              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBtn, { borderColor, backgroundColor: bgColor }]}
                  onPress={() => handleAnswer(i)}
                  disabled={selected !== null}
                >
                  <Text style={[
                    styles.optionText,
                    selected !== null && isCorrect && { color: Colors.green, fontWeight: '700' },
                    isSelected && !isCorrect && { color: Colors.terra, fontWeight: '700' },
                  ]}>
                    {opt}
                  </Text>
                  {/* Tick/cross feedback icons */}
                  {selected !== null && isCorrect && (
                    <Text style={{ color: Colors.green, fontWeight: '700' }}>✓</Text>
                  )}
                  {isSelected && !isCorrect && (
                    <Text style={{ color: Colors.terra, fontWeight: '700' }}>✗</Text>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Next button appears after answering */}
            {selected !== null && (
              <TouchableOpacity style={styles.btnPrimary} onPress={nextQuestion}>
                <Text style={styles.btnPrimaryText}>
                  {quizIndex + 1 < mission.quiz.length
                    ? 'Next Question →'
                    : 'See Results →'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Results */}
        {phase === 1 && quizDone && (
          <>
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
              <Text style={{ fontSize: 44, marginBottom: 8 }}>
                {quizScore === mission.quiz.length ? '🎉' : '📖'}
              </Text>
              <Text style={styles.bigNum}>
                {quizScore}/{mission.quiz.length}
              </Text>
              <Text style={[styles.cardBody, { textAlign: 'center', marginTop: 8 }]}>
                {quizScore === mission.quiz.length
                  ? 'Perfect score! Head to the checklist.'
                  : 'Good effort - review the Learn section and try again.'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => setPhase(2)}
            >
              <Text style={styles.btnPrimaryText}>Continue to Checklist →</Text>
            </TouchableOpacity>

            {/* Retry option */}
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => {
                setQuizIndex(0);
                setSelected(null);
                setQuizScore(0);
                setQuizDone(false);
              }}
            >
              <Text style={styles.btnOutlineText}>Retry Quiz</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Checklist */}
        {phase === 2 && (
          <>
            <Text style={styles.muted}>
              {checked.length} of {mission.checklist.length} completed
            </Text>

            {/* Checklist progress bar */}
            <View style={styles.trackBg}>
              <View style={[
                styles.trackFill,
                { width: `${(checked.length / mission.checklist.length) * 100}%` },
              ]} />
            </View>

            {/* Checklist items */}
            <View style={[styles.card, { paddingHorizontal: 14, paddingVertical: 4, marginTop: 10 }]}>
              {mission.checklist.map((item, i) => {
                const done = checked.includes(i);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.checkRow,
                      i < mission.checklist.length - 1 && styles.checkBorder,
                    ]}
                    onPress={() => toggleCheck(i)}
                  >
                    {/* Checkbox */}
                    <View style={[styles.checkbox, done && styles.checkboxDone]}>
                      {done && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[styles.checkText, done && styles.checkTextDone]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Completion banner - shows when all items ticked */}
            {allChecked && !claimed && (
              <View style={styles.completeBanner}>
                <Text style={styles.completeBannerText}>
                  🏅 All done! Claim your {mission.xp} XP and {mission.badge} badge.
                </Text>
              </View>
            )}

            {/* Claim button - disabled until all items ticked */}
            {claimed ? (
              <View style={styles.claimedBox}>
                <Text style={styles.claimedText}>
                  ✓ {mission.xp} XP claimed - {mission.badge} earned
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.btnPrimary, !allChecked && styles.btnDisabled]}
                disabled={!allChecked}
                onPress={handleClaim}
              >
                <Text style={[
                  styles.btnPrimaryText,
                  !allChecked && { color: Colors.muted },
                ]}>
                  Claim {mission.xp} XP →
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },

  //Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  link: { fontSize: 13, color: Colors.green, fontWeight: '600' },
  xpPill: {
    backgroundColor: '#FFF3DC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  xpPillText: { fontSize: 12, fontWeight: '700', color: Colors.amber },

  //Mission header
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  missionIconWrap: {
    width: 46,
    height: 46,
    backgroundColor: '#E6F0E4',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionIconText: { fontSize: 22 },
  missionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  missionBadge: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  flex1: { flex: 1 },
  completedPill: {
    backgroundColor: '#E6F0E4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  completedPillText: { fontSize: 11, color: Colors.green, fontWeight: '700' },

  //Already done banner
  doneBanner: {
    backgroundColor: '#E6F0E4',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  doneBannerText: { fontSize: 12, color: Colors.green, lineHeight: 18 },

  //Phase tabs
  phaseTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  phaseTabActive: {
    backgroundColor: Colors.card,
  },
  phaseTabText: { fontSize: 12, fontWeight: '600', color: Colors.muted },
  phaseTabTextActive: { color: Colors.green },

  //Generic card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  cardBody: { fontSize: 12, color: Colors.muted, marginTop: 4, lineHeight: 18 },
  muted: { fontSize: 12, color: Colors.muted, marginBottom: 6 },
  bigNum: { fontSize: 34, fontWeight: '800', color: Colors.amber },

  //Progress bar
  trackBg: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    marginBottom: 6,
    overflow: 'hidden',
  },
  trackFill: { height: 8, backgroundColor: Colors.green, borderRadius: 6 },

  //Learn cards
  learnCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  learnIconWrap: {
    width: 36,
    height: 36,
    backgroundColor: '#E6F0E4',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  learnIconText: { fontSize: 18 },

  //Quiz
  questionText: { fontSize: 14, fontWeight: '600', color: Colors.text, lineHeight: 21 },
  optionBtn: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: { fontSize: 13, color: Colors.text, flex: 1 },

  //Checklist
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  checkBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDone: { backgroundColor: Colors.green, borderColor: Colors.green },
  checkmark: { fontSize: 12, color: '#fff', fontWeight: '700' },
  checkText: { fontSize: 13, color: Colors.text, flex: 1, lineHeight: 19 },
  checkTextDone: { color: Colors.muted, textDecorationLine: 'line-through' },

  //Completion
  completeBanner: {
    backgroundColor: '#E6F0E4',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  completeBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.green,
    textAlign: 'center',
  },
  claimedBox: {
    backgroundColor: '#E6F0E4',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  claimedText: { fontSize: 13, fontWeight: '700', color: Colors.green },

  //Buttons
  btnPrimary: {
    backgroundColor: Colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  btnOutlineText: { color: Colors.muted, fontSize: 14 },
  btnDisabled: { backgroundColor: Colors.surface },
});