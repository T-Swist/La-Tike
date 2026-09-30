import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../theme';
import { useGetMyTicketsQuery } from '../../store/api/customer/customerApi';
import type { Ticket } from '../../types/api';
import { formatDate, formatTime } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

const isUpcoming = (ticket: Ticket) =>
  ticket.status === 'VALID' && new Date(ticket.event.endDate) >= new Date();

export default function CustomerTicketsScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  const { data: allTickets = [], isLoading, isFetching, error, refetch } = useGetMyTicketsQuery();

  const styles = createStyles(theme);

  const upcomingTickets = useMemo(() => allTickets.filter(isUpcoming), [allTickets]);
  const pastTickets = useMemo(
    () => allTickets.filter((ticket) => !isUpcoming(ticket)).reverse(),
    [allTickets]
  );

  const displayedTickets = selectedTab === 'upcoming' ? upcomingTickets : pastTickets;

  const getStatusColor = (ticket: Ticket) => {
    if (isUpcoming(ticket)) return theme.success;
    if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') return theme.error;
    return theme.textMuted;
  };

  const getStatusText = (ticket: Ticket) => {
    switch (ticket.status) {
      case 'VALID':
        return isUpcoming(ticket) ? 'Valid' : 'Expired';
      case 'USED':
        return 'Used';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REFUNDED':
        return 'Refunded';
      default:
        return ticket.status;
    }
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => isUpcoming(item) && setOpenTicket(item)}
      activeOpacity={isUpcoming(item) ? 0.7 : 1}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketTitle} numberOfLines={2}>
            {item.event.title}
          </Text>
          <Text style={styles.ticketType}>{item.ticketType.name} Ticket</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
          <Text style={styles.statusText}>{getStatusText(item)}</Text>
        </View>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {formatDate(item.event.startDate)} · {formatTime(item.event.startDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{item.event.venue || item.event.location}</Text>
        </View>
      </View>

      {isUpcoming(item) && (
        <View style={styles.qrCodeContainer}>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrCodeText}>📱</Text>
            <Text style={styles.qrCodeLabel}>Tap to show QR code</Text>
          </View>
        </View>
      )}

      <View style={styles.ticketFooter}>
        <Text style={styles.ticketId}>Ticket #{item.id.slice(0, 8).toUpperCase()}</Text>
        <Text style={styles.purchaseDate}>
          Purchased {new Date(item.createdAt).toLocaleDateString()}
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
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎫</Text>
              <Text style={styles.emptyStateText}>
                {error
                  ? 'Could not load tickets'
                  : selectedTab === 'upcoming'
                    ? 'No upcoming tickets'
                    : 'No past tickets'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {error
                  ? getErrorMessage(error)
                  : selectedTab === 'upcoming'
                    ? 'Browse events and get your tickets!'
                    : 'Your past tickets will appear here'}
              </Text>
            </View>
          )
        }
      />

      {/* Full-screen QR code to show at the entrance */}
      <Modal
        visible={!!openTicket}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenTicket(null)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpenTicket(null)}>
          {openTicket && (
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{openTicket.event.title}</Text>
              <Text style={styles.modalSubtitle}>
                {openTicket.ticketType.name} · {formatDate(openTicket.event.startDate)}
              </Text>
              <Image source={{ uri: openTicket.qrImage }} style={styles.modalQr} resizeMode="contain" />
              {!!openTicket.holderName && <Text style={styles.modalHolder}>{openTicket.holderName}</Text>}
              <Text style={styles.modalHint}>Show this code at the entrance. Tap anywhere to close.</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalQr: {
    width: 260,
    height: 260,
  },
  modalHolder: {
    fontSize: 16,
    color: '#000000',
    marginTop: 12,
  },
  modalHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
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