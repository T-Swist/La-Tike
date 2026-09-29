import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';

interface City {
  id: string;
  name: string;
  eventsCount: number;
  image: string;
}

const POPULAR_CITIES: City[] = [
  { id: '1', name: 'Warsaw', eventsCount: 250, image: '' },
  { id: '2', name: 'Krakow', eventsCount: 180, image: '' },
  { id: '3', name: 'Gdansk', eventsCount: 120, image: '' },
  { id: '4', name: 'Wroclaw', eventsCount: 95, image: '' },
  { id: '5', name: 'Poznan', eventsCount: 85, image: '' },
  { id: '6', name: 'Lodz', eventsCount: 70, image: '' },
];

export default function LocationPermissionScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const styles = createStyles(theme);

  const handleUseCurrentLocation = async () => {
    // TODO: Request location permission using expo-location
    Alert.alert(
      'Location Permission',
      'Allow La-Tike to access your location?',
      [
        { text: 'Don\'t Allow', style: 'cancel' },
        {
          text: 'Allow',
          onPress: () => {
            Alert.alert('Success', 'Location access granted!');
            // Navigate to main app
          },
        },
      ]
    );
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
  };

  const handleContinue = () => {
    if (selectedCity) {
      // Save selected city and navigate to main app
      Alert.alert('Success', 'City selected!');
    }
  };

  const handleBrowseAll = () => {
    // Navigate to all locations screen
    Alert.alert('Browse All', 'Show all available locations');
  };

  const renderCityCard = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={[
        styles.cityCard,
        selectedCity === item.id && styles.cityCardSelected,
      ]}
      onPress={() => handleCitySelect(item.id)}
    >
      <View style={styles.cityImagePlaceholder}>
        <Text style={styles.cityImageIcon}>🏙️</Text>
      </View>
      <View style={styles.cityInfo}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.cityEvents}>{item.eventsCount} events this week</Text>
      </View>
      <Text style={styles.cityArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={styles.stepBar}>
            <View style={[styles.stepProgress, { width: '66%' }]} />
          </View>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📍</Text>
          </View>
        </View>

        <Text style={styles.title}>See what's on near you</Text>
        <Text style={styles.subtitle}>Top picks</Text>

        <FlatList
          data={POPULAR_CITIES}
          renderItem={renderCityCard}
          keyExtractor={item => item.id}
          style={styles.citiesList}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.browseButton} onPress={handleBrowseAll}>
          <Text style={styles.browseIcon}>🔍</Text>
          <Text style={styles.browseText}>Browse all locations</Text>
        </TouchableOpacity>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Your location helps us show you nearby events. We respect your privacy.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.locationButtonIcon}>📍</Text>
          <Text style={styles.locationButtonText}>Use current location</Text>
        </TouchableOpacity>

        {selectedCity && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
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
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  citiesList: {
    flex: 1,
    marginBottom: 16,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cityCardSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.surface,
  },
  cityImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cityImageIcon: {
    fontSize: 28,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 4,
  },
  cityEvents: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  cityArrow: {
    fontSize: 24,
    color: theme.textMuted,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  },
  browseIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  browseText: {
    fontSize: 16,
    color: theme.text,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.surface,
    borderRadius: 8,
    marginBottom: 16,
  },
  privacyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: theme.textMuted,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  locationButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  continueButtonText: {
    color: theme.text,
    fontSize: 16,
  },
});
