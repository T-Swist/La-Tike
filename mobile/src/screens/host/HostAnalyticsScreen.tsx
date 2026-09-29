import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme';

interface AnalyticsData {
  totalRevenue: number;
  totalTicketsSold: number;
  totalEvents: number;
  activeEvents: number;
  revenueGrowth: number;
  ticketGrowth: number;
}

interface EventPerformance {
  id: string;
  title: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  attendanceRate: number;
}

const MOCK_ANALYTICS: AnalyticsData = {
  totalRevenue: 143500,
  totalTicketsSold: 1050,
  totalEvents: 3,
  activeEvents: 2,
  revenueGrowth: 23.5,
  ticketGrowth: 18.2,
};

const MOCK_EVENT_PERFORMANCE: EventPerformance[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    ticketsSold: 850,
    totalTickets: 1200,
    revenue: 127500,
    attendanceRate: 71,
  },
  {
    id: '2',
    title: 'Art Gallery Opening',
    ticketsSold: 120,
    totalTickets: 350,
    revenue: 0,
    attendanceRate: 34,
  },
  {
    id: '3',
    title: 'Food & Wine Tasting',
    ticketsSold: 80,
    totalTickets: 80,
    revenue: 16000,
    attendanceRate: 100,
  },
];

export default function HostAnalyticsScreen() {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const styles = createStyles(theme);

  const analytics = MOCK_ANALYTICS;
  const eventPerformance = MOCK_EVENT_PERFORMANCE;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your event performance</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Revenue</Text>
              <View style={[styles.growthBadge, styles.growthBadgePositive]}>
                <Text style={styles.growthText}>+{analytics.revenueGrowth}%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{analytics.totalRevenue.toLocaleString()} PLN</Text>
            <Text style={styles.metricSubtext}>From {analytics.totalTicketsSold} tickets sold</Text>
          </View>

          <View style={styles.metricRow}>
            <View style={[styles.metricCard, styles.metricCardSmall]}>
              <Text style={styles.metricLabel}>Tickets Sold</Text>
              <Text style={styles.metricValue}>{analytics.totalTicketsSold}</Text>
              <View style={[styles.growthBadge, styles.growthBadgePositive]}>
                <Text style={styles.growthText}>+{analytics.ticketGrowth}%</Text>
              </View>
            </View>

            <View style={[styles.metricCard, styles.metricCardSmall]}>
              <Text style={styles.metricLabel}>Active Events</Text>
              <Text style={styles.metricValue}>{analytics.activeEvents}</Text>
              <Text style={styles.metricSubtext}>of {analytics.totalEvents} total</Text>
            </View>
          </View>
        </View>

        {/* Event Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Performance</Text>
          
          {eventPerformance.map(event => {
            const progress = Math.round((event.ticketsSold / event.totalTickets) * 100);
            
            return (
              <View key={event.id} style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.performanceRevenue}>
                    {event.revenue.toLocaleString()} PLN
                  </Text>
                </View>

                <View style={styles.performanceStats}>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatValue}>
                      {event.ticketsSold}/{event.totalTickets}
                    </Text>
                    <Text style={styles.performanceStatLabel}>Tickets</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatValue}>{progress}%</Text>
                    <Text style={styles.performanceStatLabel}>Sold</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatValue}>{event.attendanceRate}%</Text>
                    <Text style={styles.performanceStatLabel}>Attendance</Text>
                  </View>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Revenue Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Ticket Sales</Text>
              <Text style={styles.breakdownValue}>143,500 PLN</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fee (5%)</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValueNegative]}>
                -7,175 PLN
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Payment Processing (2%)</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValueNegative]}>
                -2,870 PLN
              </Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownRowTotal]}>
              <Text style={styles.breakdownLabelTotal}>Net Revenue</Text>
              <Text style={styles.breakdownValueTotal}>133,455 PLN</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>📊</Text>
              <Text style={styles.quickStatValue}>71%</Text>
              <Text style={styles.quickStatLabel}>Avg. Attendance</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>💰</Text>
              <Text style={styles.quickStatValue}>137 PLN</Text>
              <Text style={styles.quickStatLabel}>Avg. Ticket Price</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>👥</Text>
              <Text style={styles.quickStatValue}>350</Text>
              <Text style={styles.quickStatLabel}>Avg. Attendees</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>⭐</Text>
              <Text style={styles.quickStatValue}>4.8</Text>
              <Text style={styles.quickStatLabel}>Avg. Rating</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.input,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.inputBorder,
  },
  periodButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricCardSmall: {
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 32,
    color: theme.text,
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: theme.textMuted,
  },
  growthBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  growthBadgePositive: {
    backgroundColor: theme.success,
  },
  growthText: {
    color: '#ffffff',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
  },
  performanceCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 16,
    color: theme.text,
    flex: 1,
    marginRight: 12,
  },
  performanceRevenue: {
    fontSize: 16,
    color: theme.primary,
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceStatValue: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  performanceStatLabel: {
    fontSize: 12,
    color: theme.textMuted,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  breakdownCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  breakdownRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: theme.border,
  },
  breakdownLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    color: theme.text,
  },
  breakdownValueNegative: {
    color: theme.error,
  },
  breakdownLabelTotal: {
    fontSize: 16,
    color: theme.text,
  },
  breakdownValueTotal: {
    fontSize: 16,
    color: theme.primary,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  quickStatIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 24,
    color: theme.text,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});