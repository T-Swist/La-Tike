import React, { useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../../theme';
import { useGetEventsQuery } from '../../store/api/customer/customerApi';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
  category: string;
  attendees: number;
}

const CATEGORIES = ['All', 'Music', 'Arts', 'Food', 'Sports', 'Outdoor'];

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    date: '2024-06-15',
    location: 'Warsaw',
    price: 150,
    image: 'https://via.placeholder.com/400x200',
    category: 'Music',
    attendees: 1200,
  },
  {
    id: '2',
    title: 'Art Gallery Opening',
    date: '2024-06-20',
    location: 'Krakow',
    price: 0,
    image: 'https://via.placeholder.com/400x200',
    category: 'Arts',
    attendees: 350,
  },
  {
    id: '3',
    title: 'Food & Wine Tasting',
    date: '2024-06-22',
    location: 'Gdansk',
    price: 200,
    image: 'https://via.placeholder.com/400x200',
    category: 'Food',
    attendees: 80,
  },
];

export default function CustomerHomeScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // TODO: Replace with real API call when backend is ready
  // const { data: events, isLoading } = useBrowseEventsQuery();
  const events = MOCK_EVENTS;

  const styles = createStyles(theme);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <View style={styles.eventImagePlaceholder}>
          <Text style={styles.eventImageText}>🎉</Text>
        </View>
        <View style={styles.eventBadge}>
          <Text style={styles.eventBadgeText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.eventMeta}>
          <Text style={styles.eventMetaText}>📅 {new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.eventMetaText}>📍 {item.location}</Text>
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.eventAttendees}>
            <Text style={styles.eventAttendeesText}>
              👥 {item.attendees} going
            </Text>
          </View>
          <View style={styles.eventPrice}>
            <Text style={styles.eventPriceText}>
              {item.price === 0 ? 'Free' : `${item.price} PLN`}
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No events found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
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