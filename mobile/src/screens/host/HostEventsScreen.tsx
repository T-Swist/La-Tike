import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme';
import { useGetMyEventsQuery, useUpdateEventMutation } from '../../store/api/host/hostApi';
import { HostTabParamList } from '../../navigation/HostNavigator';
import type { HostEvent } from '../../types/api';
import { formatDate, formatPrice } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

type DisplayStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const displayStatus = (event: HostEvent): DisplayStatus => {
  const now = new Date();
  if (event.status === 'DRAFT') return 'draft';
  if (event.status === 'CANCELLED') return 'cancelled';
  if (event.status === 'COMPLETED' || new Date(event.endDate) < now) return 'completed';
  return new Date(event.startDate) <= now ? 'ongoing' : 'upcoming';
};

export default function HostEventsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<HostTabParamList>>();
  const [selectedTab, setSelectedTab] = useState<'active' | 'past'>('active');

  const { data: allEvents = [], isLoading, isFetching, error, refetch } = useGetMyEventsQuery();
  const [updateEvent] = useUpdateEventMutation();

  const styles = createStyles(theme);

  const activeEvents = useMemo(
    () => allEvents.filter(event => ['draft', 'upcoming', 'ongoing'].includes(displayStatus(event))).reverse(),
    [allEvents]
  );

  const pastEvents = useMemo(
    () => allEvents.filter(event => ['completed', 'cancelled'].includes(displayStatus(event))),
    [allEvents]
  );

  const displayedEvents = selectedTab === 'active' ? activeEvents : pastEvents;

  const getStatusColor = (status: DisplayStatus) => {
    switch (status) {
      case 'draft':
        return theme.warning;
      case 'upcoming':
        return theme.primary;
      case 'ongoing':
        return theme.success;
      case 'completed':
        return theme.textMuted;
      case 'cancelled':
        return theme.error;
      default:
        return theme.textMuted;
    }
  };

  const getStatusText = (status: DisplayStatus) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Live';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const changeStatus = (event: HostEvent, status: 'PUBLISHED' | 'CANCELLED') => {
    const verb = status === 'PUBLISHED' ? 'Publish' : 'Cancel';
    Alert.alert(
      `${verb} event?`,
      status === 'PUBLISHED'
        ? `"${event.title}" will become visible and tickets go on sale.`
        : `"${event.title}" will be marked as cancelled. Ticket holders are not refunded automatically.`,
      [
        { text: 'Back', style: 'cancel' },
        {
          text: verb,
          style: status === 'CANCELLED' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await updateEvent({ id: event.id, status }).unwrap();
            } catch (err) {
              Alert.alert('Update failed', getErrorMessage(err));
            }
          },
        },
      ]
    );
  };

  const calculateProgress = (sold: number, total: number) => {
    return total ? Math.round((sold / total) * 100) : 0;
  };

  const renderEventCard = ({ item }: { item: HostEvent }) => {
    const status = displayStatus(item);
    const progress = calculateProgress(item.stats.ticketsSold, item.stats.totalTickets);

    return (
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.eventCategory}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{formatDate(item.startDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText}>{item.city || item.location}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.ticketsSold}/{item.stats.totalTickets}</Text>
            <Text style={styles.statLabel}>Tickets Sold</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.checkedIn}</Text>
            <Text style={styles.statLabel}>Checked In</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatPrice(item.stats.revenue)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {(status === 'draft' || status === 'upcoming' || status === 'ongoing') && (
          <View style={styles.eventActions}>
            {status === 'draft' ? (
              <TouchableOpacity style={styles.actionButton} onPress={() => changeStatus(item, 'PUBLISHED')}>
                <Text style={styles.actionButtonText}>Publish</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Scanner', { eventId: item.id, eventTitle: item.title })}
              >
                <Text style={styles.actionButtonText}>Scan Tickets</Text>
              </TouchableOpacity>
            )}
            {status !== 'draft' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => changeStatus(item, 'CANCELLED')}
              >
                <Text style={styles.actionButtonTextSecondary}>Cancel Event</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Events</Text>
          <Text style={styles.headerSubtitle}>Manage your hosted events</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => Alert.alert('Coming soon', 'Creating events from the app is not available yet.')}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
            Active ({activeEvents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.tabActive]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.tabTextActive]}>
            Past ({pastEvents.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedEvents}
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
              <Text style={styles.emptyStateText}>
                {error ? 'Could not load your events' : selectedTab === 'active' ? 'No active events' : 'No past events'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {error ? getErrorMessage(error) : 'Events you host will appear here'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  tabTextActive: {
    color: theme.primary,
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 4,
  },
  eventCategory: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textMuted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.border,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionButtonTextSecondary: {
    color: theme.text,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});