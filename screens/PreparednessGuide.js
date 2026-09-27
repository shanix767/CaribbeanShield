// screens/PreparednessGuide.js
//
// A leaflet-style reading view of the Hurricane Ready guidance, opened from
// the Resource Hub. It shows the same ODM-sourced lesson content the
// missions teach, but as plain reference material: no XP, no quizzes, no
// locked levels. Anyone can read all of it at any time, including people
// who never play the missions.
//
// The content is NOT duplicated here - it's pulled straight from the
// mission's lesson activities (missionContent/hurricane/), so if a lesson
// is corrected, the guide updates with it. Everything is bundled with the
// app, so the guide works fully offline.

import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HURRICANE_MISSION_CONTENT } from '../missionContent/hurricane';
import { COLORS } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const STAGE_ORDER = ['learn', 'plan', 'prepare', 'prove', 'respond', 'recover'];

// One section per mission level, each holding that level's lessons in the
// order the mission teaches them.
function buildGuideSections(mission) {
  return Object.keys(mission.levels)
    .map(Number)
    .sort((a, b) => a - b)
    .map((levelNumber) => {
      const level = mission.levels[levelNumber];
      const lessons = [];
      STAGE_ORDER.forEach((stageKey) => {
        const stage = level.stages[stageKey];
        if (!stage) return;
        stage.activities.forEach((activity) => {
          if (activity.type === 'lesson' && activity.content) {
            lessons.push(activity);
          }
        });
      });
      return { levelNumber, title: level.title, lessons };
    })
    .filter((section) => section.lessons.length > 0);
}

export default function PreparednessGuideScreen() {
  const navigation = useNavigation();
  const sections = useMemo(() => buildGuideSections(HURRICANE_MISSION_CONTENT), []);

  // Lesson ids currently expanded. Starts collapsed so the guide reads like
  // a table of contents; tap a topic to open it.
  const [openLessonIds, setOpenLessonIds] = useState([]);
  const allLessonIds = sections.flatMap((section) => section.lessons.map((lesson) => lesson.id));
  const allOpen = openLessonIds.length === allLessonIds.length;

  function toggleLesson(lessonId) {
    setOpenLessonIds((current) =>
      current.includes(lessonId) ? current.filter((id) => id !== lessonId) : [...current, lessonId]
    );
  }

  function toggleAll() {
    setOpenLessonIds(allOpen ? [] : allLessonIds);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenHeader
        title="Preparedness Guide"
        onBack={() => navigation.goBack()}
        backLabel="Resource Hub"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.coverCard}>
          <Text style={styles.coverIcon}>📖</Text>
          <Text style={styles.coverTitle}>Hurricane Preparedness Guide</Text>
          <Text style={styles.coverText}>
            Everything the Hurricane Ready mission teaches, in one place. Based on guidance from
            Dominica's Office of Disaster Management (ODM). Available offline.
          </Text>
        </View>

        <TouchableOpacity style={styles.expandAllButton} onPress={toggleAll}>
          <Text style={styles.expandAllText}>{allOpen ? 'Collapse all' : 'Expand all'}</Text>
        </TouchableOpacity>

        {sections.map((section) => (
          <View key={section.levelNumber} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {section.levelNumber}. {section.title}
            </Text>

            {section.lessons.map((lesson) => {
              const isOpen = openLessonIds.includes(lesson.id);
              const bullets = lesson.content.bullets || [];
              return (
                <View key={lesson.id} style={styles.topicCard}>
                  <TouchableOpacity style={styles.topicHeader} onPress={() => toggleLesson(lesson.id)}>
                    <Text style={styles.topicTitle}>{lesson.title}</Text>
                    <Text style={styles.topicChevron}>{isOpen ? '−' : '+'}</Text>
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.topicBody}>
                      {!!lesson.content.body && <Text style={styles.bodyText}>{lesson.content.body}</Text>}
                      {bullets.map((bulletText, index) => (
                        <View key={index} style={styles.bulletRow}>
                          <Text style={styles.bulletMarker}>•</Text>
                          <Text style={styles.bulletText}>{bulletText}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        <Text style={styles.footerText}>
          This guide supports, and does not replace, official ODM warnings and instructions. In an
          emergency, call 911.
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
    paddingBottom: 32,
  },
  backLink: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coverCard: {
    backgroundColor: COLORS.backgroundGreen,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  coverIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  coverTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: 6,
  },
  coverText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textWhite,
  },
  expandAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.backgroundGreenD,
    marginBottom: 12,
  },
  expandAllText: {
    color: COLORS.textGreen,
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginBottom: 8,
  },
  topicCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  topicTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  topicChevron: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textGreen,
    marginLeft: 8,
  },
  topicBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCream,
    paddingTop: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textDark,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletMarker: {
    fontSize: 14,
    color: COLORS.backgroundGreenD,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textDark,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 8,
  },
});