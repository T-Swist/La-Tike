import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

interface Interest {
  id: string;
  label: string;
  category: string;
}

const INTERESTS: Interest[] = [
  // Live Shows & Music
  { id: 'concerts', label: 'Concerts', category: 'Live Shows & Music' },
  { id: 'dj-sets', label: 'DJ Sets', category: 'Live Shows & Music' },
  { id: 'music-festivals', label: 'Music Festivals', category: 'Live Shows & Music' },
  { id: 'open-mic', label: 'Open Mic', category: 'Live Shows & Music' },
  { id: 'jazz-nights', label: 'Jazz Nights', category: 'Live Shows & Music' },
  
  // Arts & Performances
  { id: 'theatre-plays', label: 'Theatre Plays', category: 'Arts & Performances' },
  { id: 'dance-performances', label: 'Dance Performances', category: 'Arts & Performances' },
  { id: 'stand-up-comedy', label: 'Stand-up Comedy', category: 'Arts & Performances' },
  { id: 'improvisation', label: 'Improvisation', category: 'Arts & Performances' },
  
  // Eat & Meet
  { id: 'wine-tastings', label: 'Wine Tastings', category: 'Eat & Meet' },
  { id: 'coffee-meetups', label: 'Coffee Meetups', category: 'Eat & Meet' },
  { id: 'brunch-parties', label: 'Brunch Parties', category: 'Eat & Meet' },
  { id: 'supper-clubs', label: 'Supper Clubs', category: 'Eat & Meet' },
  
  // Outdoor Workouts
  { id: 'yoga', label: 'Yoga', category: 'Outdoor Workouts' },
  { id: 'running-clubs', label: 'Running Clubs', category: 'Outdoor Workouts' },
  { id: 'cycling', label: 'Cycling', category: 'Outdoor Workouts' },
  { id: 'bootcamp', label: 'Bootcamp', category: 'Outdoor Workouts' },
];

const CATEGORIES = [
  'Live Shows & Music',
  'Arts & Performances',
  'Eat & Meet',
  'Outdoor Workouts',
];

export default function InterestSelectionScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const styles = createStyles(theme);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = () => {
    // TODO: Save interests to user profile
    console.log('Selected interests:', selectedInterests);
    // Navigate to next screen or complete onboarding
  };

  const renderCategory = (category: string) => {
    const categoryInterests = INTERESTS.filter(i => i.category === category);

    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.interestsRow}>
          {categoryInterests.map(interest => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestChip,
                  isSelected && styles.interestChipSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text
                  style={[
                    styles.interestText,
                    isSelected && styles.interestTextSelected,
                  ]}
                >
                  {interest.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={styles.stepBar}>
            <View style={[styles.stepProgress, { width: '100%' }]} />
          </View>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Pick What You're Into</Text>
        <Text style={styles.subtitle}>
          Select topics to personalize your feed with the best events in Poland. You can edit this later in Settings
        </Text>

        {CATEGORIES.map(renderCategory)}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedInterests.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue ({selectedInterests.length})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 24,
    color: theme.text,
    width: 40,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  stepBar: {
    width: 120,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  stepProgress: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  stepText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  skipButton: {
    fontSize: 14,
    color: theme.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: theme.text,
    marginBottom: 12,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 32,
  },
  categoryContainer: {
    marginBottom: 28,
  },
  categoryTitle: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 12,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  interestChip: {
    backgroundColor: theme.input,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
    borderWidth: 1.5,
    borderColor: theme.inputBorder,
  },
  interestChipSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  interestText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  interestTextSelected: {
    color: '#ffffff',
  },
  spacer: {
    height: 100,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  continueButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: theme.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
