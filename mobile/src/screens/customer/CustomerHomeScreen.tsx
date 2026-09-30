import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { useGetEventsQuery } from '../../store/api/customer/customerApi';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import type { Event } from '../../types/api';
import { formatDate, formatPrice } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

const CATEGORIES = ['All', 'Music', 'Arts', 'Food', 'Wellness', 'Technology', 'Sports'];

const lowestPrice = (event: Event) =>
  event.ticketTypes.length ? Math.min(...event.ticketTypes.map((t) => t.price)) : 0;

const ticketsSold = (event: Event) => event.ticketTypes.reduce((sum, t) => sum + t.sold, 0);

export default function CustomerHomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: events = [], isLoading, isFetching, error, refetch } = useGetEventsQuery();

  const styles = createStyles(theme);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return events.filter(event => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === 'All' || event.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={styles.eventImageContainer}>
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.eventImagePlaceholder} />
        ) : (
          <View style={styles.eventImagePlaceholder}>
            <Text style={styles.eventImageText}>🎉</Text>
          </View>
        )}
        <View style={styles.eventBadge}>
          <Text style={styles.eventBadgeText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.eventMeta}>
          <Text style={styles.eventMetaText}>📅 {formatDate(item.startDate)}</Text>
          <Text style={styles.eventMetaText}>📍 {item.city || item.location}</Text>
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.eventAttendees}>
            <Text style={styles.eventAttendeesText}>
              👥 {ticketsSold(item)} going
            </Text>
          </View>
          <View style={styles.eventPrice}>
            <Text style={styles.eventPriceText}>
              {lowestPrice(item) === 0 ? 'Free' : `from ${formatPrice(lowestPrice(item))}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Events</Text>
        <Text style={styles.headerSubtitle}>Find amazing experiences near you</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{error ? "Could not load events" : "No events found"}</Text>
              <Text style={styles.emptyStateSubtext}>
                {error ? getErrorMessage(error) : "Try adjusting your search or filters"}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: theme.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.inputBorder,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: theme.input,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.inputBorder,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImageContainer: {
    position: 'relative',
    height: 160,
  },
  eventImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImageText: {
    fontSize: 48,
  },
  eventBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  eventBadgeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 8,
  },
  eventMeta: {
    marginBottom: 12,
  },
  eventMetaText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventAttendeesText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  eventPrice: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  eventPriceText: {
    color: '#ffffff',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});