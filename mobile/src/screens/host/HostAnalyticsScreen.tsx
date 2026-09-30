import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../theme';
import { useGetMyEventsQuery } from '../../store/api/host/hostApi';
import { formatPrice } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

export default function HostAnalyticsScreen() {
  const { theme } = useTheme();
  const { data: events = [], isLoading, isFetching, error, refetch } = useGetMyEventsQuery();

  const styles = createStyles(theme);

  const analytics = useMemo(() => {
    const now = new Date();
    const totals = events.reduce(
      (acc, event) => ({
        revenue: acc.revenue + event.stats.revenue,
        fees: acc.fees + event.stats.feesCollected,
        sold: acc.sold + event.stats.ticketsSold,
        checkedIn: acc.checkedIn + event.stats.checkedIn,
      }),
      { revenue: 0, fees: 0, sold: 0, checkedIn: 0 }
    );
    const activeEvents = events.filter(
      (e) => e.status === 'PUBLISHED' && new Date(e.endDate) >= now
    ).length;

    return {
      ...totals,
      totalEvents: events.length,
      activeEvents,
      attendanceRate: percent(totals.checkedIn, totals.sold),
      avgTicketPrice: totals.sold ? totals.revenue / totals.sold : 0,
    };
  }, [events]);

  const eventPerformance = useMemo(
    () => [...events].filter((e) => e.status !== 'DRAFT').sort((a, b) => b.stats.revenue - a.stats.revenue),
    [events]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>
            {error ? getErrorMessage(error) : 'Track your event performance (all time)'}
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Ticket Revenue</Text>
            </View>
            <Text style={styles.metricValue}>{formatPrice(analytics.revenue)}</Text>
            <Text style={styles.metricSubtext}>From {analytics.sold} tickets sold</Text>
          </View>

          <View style={styles.metricRow}>
            <View style={[styles.metricCard, styles.metricCardSmall]}>
              <Text style={styles.metricLabel}>Checked In</Text>
              <Text style={styles.metricValue}>{analytics.checkedIn}</Text>
              <Text style={styles.metricSubtext}>{analytics.attendanceRate}% attendance</Text>
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

          {eventPerformance.length === 0 && (
            <Text style={styles.metricSubtext}>Sales will appear here once your events are published.</Text>
          )}

          {eventPerformance.map(event => {
            const progress = percent(event.stats.ticketsSold, event.stats.totalTickets);

            return (
              <View key={event.id} style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.performanceRevenue}>
                    {formatPrice(event.stats.revenue)}
                  </Text>
                </View>

                <View style={styles.performanceStats}>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatValue}>
                      {event.stats.ticketsSold}/{event.stats.totalTickets}
                    </Text>
                    <Text style={styles.performanceStatLabel}>Tickets</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatValue}>{progress}%</Text>
                    <Text style={styles.performanceStatLabel}>Sold</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatValue}>
                      {percent(event.stats.checkedIn, event.stats.ticketsSold)}%
                    </Text>
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
              <Text style={styles.breakdownLabel}>Paid by buyers</Text>
              <Text style={styles.breakdownValue}>{formatPrice(analytics.revenue + analytics.fees)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Service & platform fees</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValueNegative]}>
                -{formatPrice(analytics.fees)}
              </Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownRowTotal]}>
              <Text style={styles.breakdownLabelTotal}>Your ticket revenue</Text>
              <Text style={styles.breakdownValueTotal}>{formatPrice(analytics.revenue)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>

          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>📊</Text>
              <Text style={styles.quickStatValue}>{analytics.attendanceRate}%</Text>
              <Text style={styles.quickStatLabel}>Avg. Attendance</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>💰</Text>
              <Text style={styles.quickStatValue}>{formatPrice(analytics.avgTicketPrice)}</Text>
              <Text style={styles.quickStatLabel}>Avg. Ticket Price</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>🎫</Text>
              <Text style={styles.quickStatValue}>{analytics.sold}</Text>
              <Text style={styles.quickStatLabel}>Tickets Sold</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatIcon}>🎉</Text>
              <Text style={styles.quickStatValue}>{analytics.totalEvents}</Text>
              <Text style={styles.quickStatLabel}>Events Hosted</Text>
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