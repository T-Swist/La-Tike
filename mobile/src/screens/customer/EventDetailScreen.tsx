import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useRoute, useNavigation } from '@react-navigation/native';

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  hostName: string;
  hostRating: number;
  images: string[];
  amenities: string[];
}

const MOCK_EVENT: EventDetail = {
  id: '1',
  title: 'Summer Music Festival',
  description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Experience amazing performances, great food, and an electric atmosphere under the stars.',
  date: '2024-06-15',
  time: '18:00',
  location: 'Warsaw',
  address: 'National Stadium, Warsaw, Poland',
  category: 'Music',
  price: 150,
  totalTickets: 1200,
  availableTickets: 350,
  hostName: 'EventPro Poland',
  hostRating: 4.8,
  images: [],
  amenities: ['Parking', 'Food & Drinks', 'Wheelchair Access', 'Coat Check'],
};

export default function EventDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const styles = createStyles(theme);
  const event = MOCK_EVENT;

  const soldPercentage = Math.round(
    ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100
  );

  const handlePurchase = () => {
    Alert.alert(
      'Purchase Tickets',
      `Buy ${ticketQuantity} ticket(s) for ${ticketQuantity * event.price} PLN?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Tickets purchased successfully!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const incrementQuantity = () => {
    if (ticketQuantity < Math.min(10, event.availableTickets)) {
      setTicketQuantity(ticketQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* Event Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageIcon}>🎉</Text>
          </View>
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
              <Text style={styles.hostAvatarText}>{event.hostName[0]}</Text>
            </View>
            <View style={styles.hostDetails}>
              <Text style={styles.hostName}>{event.hostName}</Text>
              <View style={styles.hostRating}>
                <Text style={styles.hostRatingText}>⭐ {event.hostRating}</Text>
              </View>
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
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.detailValue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📍</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{event.address}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {event.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>✓ {amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Ticket Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Availability</Text>
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityRow}>
                <Text style={styles.availabilityLabel}>Available</Text>
                <Text style={styles.availabilityValue}>
                  {event.availableTickets} / {event.totalTickets}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${soldPercentage}%` }]} />
                </View>
              </View>
              <Text style={styles.availabilitySubtext}>{soldPercentage}% sold</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Purchase Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price per ticket</Text>
          <Text style={styles.priceValue}>{event.price} PLN</Text>
        </View>

        <View style={styles.quantitySection}>
          <TouchableOpacity
            style={[styles.quantityButton, ticketQuantity === 1 && styles.quantityButtonDisabled]}
            onPress={decrementQuantity}
            disabled={ticketQuantity === 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{ticketQuantity}</Text>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              ticketQuantity >= Math.min(10, event.availableTickets) &&
                styles.quantityButtonDisabled,
            ]}
            onPress={incrementQuantity}
            disabled={ticketQuantity >= Math.min(10, event.availableTickets)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseButtonText}>
            Buy for {ticketQuantity * event.price} PLN
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
