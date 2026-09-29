import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme';
import { useGetMyTicketsQuery } from '../../store/api/customer/customerApi';

interface Ticket {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  qrCode: string;
  status: 'valid' | 'used' | 'expired';
  purchaseDate: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    eventTitle: 'Summer Music Festival',
    eventDate: '2024-06-15',
    eventLocation: 'Warsaw',
    ticketType: 'VIP',
    qrCode: 'QR-12345',
    status: 'valid',
    purchaseDate: '2024-05-01',
  },
  {
    id: '2',
    eventTitle: 'Art Gallery Opening',
    eventDate: '2024-06-20',
    eventLocation: 'Krakow',
    ticketType: 'General',
    qrCode: 'QR-67890',
    status: 'valid',
    purchaseDate: '2024-05-10',
  },
  {
    id: '3',
    eventTitle: 'Food & Wine Tasting',
    eventDate: '2024-05-10',
    eventLocation: 'Gdansk',
    ticketType: 'Premium',
    qrCode: 'QR-11111',
    status: 'used',
    purchaseDate: '2024-04-20',
  },
];

export default function CustomerTicketsScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // TODO: Replace with real API call when backend is ready
  // const { data: tickets, isLoading } = useGetMyTicketsQuery();
  const allTickets = MOCK_TICKETS;

  const styles = createStyles(theme);

  const upcomingTickets = allTickets.filter(
    ticket => ticket.status === 'valid' && new Date(ticket.eventDate) >= new Date()
  );
  
  const pastTickets = allTickets.filter(
    ticket => ticket.status === 'used' || new Date(ticket.eventDate) < new Date()
  );

  const displayedTickets = selectedTab === 'upcoming' ? upcomingTickets : pastTickets;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return theme.success;
      case 'used':
        return theme.textMuted;
      case 'expired':
        return theme.error;
      default:
        return theme.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valid';
      case 'used':
        return 'Used';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketTitle} numberOfLines={2}>
            {item.eventTitle}
          </Text>
          <Text style={styles.ticketType}>{item.ticketType} Ticket</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {new Date(item.eventDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{item.eventLocation}</Text>
        </View>
      </View>

      {item.status === 'valid' && (
        <View style={styles.qrCodeContainer}>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrCodeText}>📱</Text>
            <Text style={styles.qrCodeLabel}>Tap to show QR code</Text>
          </View>
        </View>
      )}

      <View style={styles.ticketFooter}>
        <Text style={styles.ticketId}>Ticket #{item.qrCode}</Text>
        <Text style={styles.purchaseDate}>
          Purchased {new Date(item.purchaseDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.tabActive]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcomingTickets.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.tabActive]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.tabTextActive]}>
            Past ({pastTickets.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedTickets}
        renderItem={renderTicket}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ticketsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎫</Text>
            <Text style={styles.emptyStateText}>
              {selectedTab === 'upcoming' ? 'No upcoming tickets' : 'No past tickets'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedTab === 'upcoming'
                ? 'Browse events and get your tickets!'
                : 'Your past tickets will appear here'}
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
  ticketsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
    marginRight: 12,
  },
  ticketTitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 4,
  },
  ticketType: {
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
  ticketDetails: {
    marginBottom: 12,
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
  qrCodeContainer: {
    marginVertical: 12,
  },
  qrCodePlaceholder: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  qrCodeText: {
    fontSize: 48,
    marginBottom: 8,
  },
  qrCodeLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  ticketId: {
    fontSize: 12,
    color: theme.textMuted,
  },
  purchaseDate: {
    fontSize: 12,
    color: theme.textMuted,
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
  },
});