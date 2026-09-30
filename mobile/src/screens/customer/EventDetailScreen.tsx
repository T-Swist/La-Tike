import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import {
  useConfirmPaymentMutation,
  useGetEventByIdQuery,
  usePurchaseTicketMutation,
} from '../../store/api/customer/customerApi';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { formatDate, formatPrice, formatTime } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

// Must match SERVICE_FEE_RATE + PLATFORM_FEE_RATE in server/src/services/ticket.service.ts
const FEE_RATE = 0.08;

export default function EventDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const { params } = useRoute<RouteProp<CustomerStackParamList, 'EventDetail'>>();
  const { data: event, isLoading, error, refetch } = useGetEventByIdQuery(params.eventId);
  const [purchaseTicket, { isLoading: isPurchasing }] = usePurchaseTicketMutation();
  const [confirmPayment, { isLoading: isConfirming }] = useConfirmPaymentMutation();

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const styles = createStyles(theme);

  const ticketTypes = event?.ticketTypes ?? [];
  const selectedType = ticketTypes.find((t) => t.id === selectedTypeId);
  const remaining = selectedType ? selectedType.quantity - selectedType.sold : 0;
  const maxQuantity = selectedType ? Math.min(selectedType.maxPerOrder, remaining) : 0;
  const minQuantity = selectedType?.minPerOrder ?? 1;

  // Preselect the first ticket type that still has stock.
  useEffect(() => {
    if (!selectedTypeId && ticketTypes.length) {
      const firstAvailable = ticketTypes.find((t) => t.quantity > t.sold) ?? ticketTypes[0];
      setSelectedTypeId(firstAvailable.id);
      setTicketQuantity(firstAvailable.minPerOrder);
    }
  }, [ticketTypes, selectedTypeId]);

  const totals = useMemo(() => {
    const totalTickets = ticketTypes.reduce((sum, t) => sum + t.quantity, 0);
    const soldTickets = ticketTypes.reduce((sum, t) => sum + t.sold, 0);
    return {
      totalTickets,
      availableTickets: totalTickets - soldTickets,
      soldPercentage: totalTickets ? Math.round((soldTickets / totalTickets) * 100) : 0,
    };
  }, [ticketTypes]);

  if (isLoading || (!event && !error)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{getErrorMessage(error, 'Event not found')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasEnded = new Date(event.endDate) < new Date();
  const canBuy = event.status === 'PUBLISHED' && !hasEnded && !!selectedType && remaining >= minQuantity;
  const subtotal = selectedType ? selectedType.price * ticketQuantity : 0;
  const estimatedTotal = Math.round(subtotal * (1 + FEE_RATE) * 100) / 100;
  const isBusy = isPurchasing || isConfirming;

  const showSuccess = (count: number) => {
    Alert.alert('You are going! 🎉', `${count} ticket(s) added to My Tickets.`, [
      { text: 'Keep browsing', style: 'cancel', onPress: () => navigation.goBack() },
      { text: 'View tickets', onPress: () => navigation.navigate('Tabs', { screen: 'MyTickets' } as never) },
    ]);
  };

  const completePurchase = async () => {
    if (!selectedType) return;
    try {
      const order = await purchaseTicket({
        eventId: event.id,
        tickets: [{ ticketTypeId: selectedType.id, quantity: ticketQuantity }],
      }).unwrap();

      if (!order.requiresPayment) {
        showSuccess(order.tickets?.length ?? ticketQuantity);
        return;
      }

      if (order.paymentMode === 'mock' && order.paymentIntentId) {
        const result = await confirmPayment({ paymentIntentId: order.paymentIntentId }).unwrap();
        if (result.success) {
          showSuccess(result.tickets?.length ?? ticketQuantity);
          return;
        }
      }

      Alert.alert('Payment required', 'Card payments are not available in the app yet.');
    } catch (err) {
      Alert.alert('Purchase failed', getErrorMessage(err, 'Could not complete your order'));
      refetch();
    }
  };

  const handlePurchase = () => {
    if (!selectedType) return;
    const message =
      subtotal === 0
        ? `Get ${ticketQuantity} free ${selectedType.name} ticket(s)?`
        : `Buy ${ticketQuantity} × ${selectedType.name} for ${formatPrice(estimatedTotal)} (incl. fees)?`;

    Alert.alert('Confirm order', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: completePurchase },
    ]);
  };

  const selectType = (id: string, min: number) => {
    setSelectedTypeId(id);
    setTicketQuantity(min);
  };

  const incrementQuantity = () => {
    if (ticketQuantity < maxQuantity) {
      setTicketQuantity(ticketQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (ticketQuantity > minQuantity) {
      setTicketQuantity(ticketQuantity - 1);
    }
  };

  const hostName = event.host ? `${event.host.firstName} ${event.host.lastName}` : 'La-Tike';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.coverImage ? (
            <Image source={{ uri: event.coverImage }} style={styles.imagePlaceholder} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>🎉</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{event.category}</Text>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Host Info */}
          <View style={styles.hostInfo}>
            <View style={styles.hostAvatar}>
              <Text style={styles.hostAvatarText}>{hostName[0]}</Text>
            </View>
            <View style={styles.hostDetails}>
              <Text style={styles.hostName}>{hostName}</Text>
              <Text style={styles.hostRatingText}>Host</Text>
            </View>
          </View>

          {/* Date & Location */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📅</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {formatDate(event.startDate, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.detailValue}>
                  {formatTime(event.startDate)} – {formatTime(event.endDate)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📍</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>
                  {[event.venue, event.address || event.location].filter(Boolean).join(', ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Tags */}
          {event.tags.length > 0 && (
            <View style={styles.section}>
              <View style={styles.amenitiesGrid}>
                {event.tags.map((tag) => (
                  <View key={tag} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Ticket Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tickets</Text>
            {ticketTypes.map((type) => {
              const left = type.quantity - type.sold;
              const isSelected = type.id === selectedTypeId;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.ticketTypeCard, isSelected && styles.ticketTypeCardActive]}
                  onPress={() => selectType(type.id, type.minPerOrder)}
                  disabled={left <= 0}
                >
                  <View style={styles.ticketTypeHeader}>
                    <Text style={styles.ticketTypeName}>{type.name}</Text>
                    <Text style={styles.ticketTypePrice}>{formatPrice(type.price)}</Text>
                  </View>
                  {!!type.description && (
                    <Text style={styles.ticketTypeDescription}>{type.description}</Text>
                  )}
                  <Text style={[styles.ticketTypeMeta, left <= 0 && { color: theme.error }]}>
                    {left <= 0 ? 'Sold out' : `${left} left`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ticket Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Availability</Text>
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityRow}>
                <Text style={styles.availabilityLabel}>Available</Text>
                <Text style={styles.availabilityValue}>
                  {totals.availableTickets} / {totals.totalTickets}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${totals.soldPercentage}%` }]} />
                </View>
              </View>
              <Text style={styles.availabilitySubtext}>{totals.soldPercentage}% sold</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Purchase Bar */}
      <View style={styles.bottomBar}>
        {canBuy ? (
          <>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>{selectedType!.name} · per ticket</Text>
              <Text style={styles.priceValue}>{formatPrice(selectedType!.price)}</Text>
            </View>

            <View style={styles.quantitySection}>
              <TouchableOpacity
                style={[styles.quantityButton, ticketQuantity <= minQuantity && styles.quantityButtonDisabled]}
                onPress={decrementQuantity}
                disabled={ticketQuantity <= minQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{ticketQuantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, ticketQuantity >= maxQuantity && styles.quantityButtonDisabled]}
                onPress={incrementQuantity}
                disabled={ticketQuantity >= maxQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.purchaseButton, isBusy && { opacity: 0.6 }]}
              onPress={handlePurchase}
              disabled={isBusy}
            >
              {isBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  {subtotal === 0 ? 'Get free tickets' : `Buy for ${formatPrice(estimatedTotal)}`}
                </Text>
              )}
            </TouchableOpacity>
            {subtotal > 0 && <Text style={styles.feeNote}>Includes 8% service fees</Text>}
          </>
        ) : (
          <Text style={styles.unavailableText}>
            {hasEnded || event.status === 'COMPLETED'
              ? 'This event has ended'
              : event.status === 'CANCELLED'
                ? 'This event was cancelled'
                : 'Tickets are sold out'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: theme.primary,
    fontSize: 14,
  },
  ticketTypeCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.border,
  },
  ticketTypeCardActive: {
    borderColor: theme.primary,
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTypeName: {
    fontSize: 16,
    color: theme.text,
    flex: 1,
    marginRight: 8,
  },
  ticketTypePrice: {
    fontSize: 16,
    color: theme.primary,
  },
  ticketTypeDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  ticketTypeMeta: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 8,
  },
  feeNote: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  unavailableText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.text,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    fontSize: 20,
    color: theme.text,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 80,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: theme.text,
    marginBottom: 16,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hostAvatarText: {
    fontSize: 20,
    color: '#ffffff',
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostRatingText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIconText: {
    fontSize: 24,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: theme.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    backgroundColor: theme.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  amenityText: {
    fontSize: 14,
    color: theme.text,
  },
  availabilityCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  availabilityLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  availabilityValue: {
    fontSize: 16,
    color: theme.text,
  },
  progressBarContainer: {
    marginBottom: 8,
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
  availabilitySubtext: {
    fontSize: 12,
    color: theme.textMuted,
  },
  bottomBar: {
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    padding: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    color: theme.primary,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  quantityButtonDisabled: {
    opacity: 0.3,
  },
  quantityButtonText: {
    fontSize: 20,
    color: theme.text,
  },
  quantityValue: {
    fontSize: 20,
    color: theme.text,
    marginHorizontal: 24,
    minWidth: 30,
    textAlign: 'center',
  },
  purchaseButton: {
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
  purchaseButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
