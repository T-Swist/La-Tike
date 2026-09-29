import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';

interface ScanResult {
  id: string;
  ticketCode: string;
  eventTitle: string;
  attendeeName: string;
  timestamp: string;
  status: 'valid' | 'invalid' | 'already_used';
}

const MOCK_SCAN_HISTORY: ScanResult[] = [
  {
    id: '1',
    ticketCode: 'QR-12345',
    eventTitle: 'Summer Music Festival',
    attendeeName: 'John Doe',
    timestamp: new Date().toISOString(),
    status: 'valid',
  },
  {
    id: '2',
    ticketCode: 'QR-67890',
    eventTitle: 'Summer Music Festival',
    attendeeName: 'Jane Smith',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'valid',
  },
  {
    id: '3',
    ticketCode: 'QR-11111',
    eventTitle: 'Summer Music Festival',
    attendeeName: 'Bob Johnson',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: 'already_used',
  },
];

export default function HostScannerScreen() {
  const { theme } = useTheme();
  const [manualCode, setManualCode] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(MOCK_SCAN_HISTORY);
  const [isScannerActive, setIsScannerActive] = useState(false);

  const styles = createStyles(theme);

  const handleScan = (code: string) => {
    // TODO: Implement actual QR scanning with expo-barcode-scanner
    // For now, simulate a scan
    Alert.alert('Ticket Scanned', `Code: ${code}`, [
      { text: 'OK', onPress: () => console.log('Scan confirmed') },
    ]);
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a ticket code');
      return;
    }
    handleScan(manualCode);
    setManualCode('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return theme.success;
      case 'invalid':
        return theme.error;
      case 'already_used':
        return theme.warning;
      default:
        return theme.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valid ✓';
      case 'invalid':
        return 'Invalid ✗';
      case 'already_used':
        return 'Already Used';
      default:
        return status;
    }
  };

  const renderScanResult = ({ item }: { item: ScanResult }) => (
    <View style={styles.scanResultCard}>
      <View style={styles.scanResultHeader}>
        <View style={styles.scanResultInfo}>
          <Text style={styles.scanResultName}>{item.attendeeName}</Text>
          <Text style={styles.scanResultCode}>{item.ticketCode}</Text>
        </View>
        <View style={[styles.scanStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.scanStatusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.scanResultEvent}>{item.eventTitle}</Text>
      <Text style={styles.scanResultTime}>
        {new Date(item.timestamp).toLocaleTimeString()} • {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ticket Scanner</Text>
        <Text style={styles.headerSubtitle}>Scan or enter ticket codes</Text>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerFrame}>
          <View style={styles.scannerPlaceholder}>
            <Text style={styles.scannerIcon}>📷</Text>
            <Text style={styles.scannerText}>
              {isScannerActive ? 'Point camera at QR code' : 'Tap to activate scanner'}
            </Text>
          </View>
          
          {/* Scanner corners */}
          <View style={[styles.scannerCorner, styles.scannerCornerTL]} />
          <View style={[styles.scannerCorner, styles.scannerCornerTR]} />
          <View style={[styles.scannerCorner, styles.scannerCornerBL]} />
          <View style={[styles.scannerCorner, styles.scannerCornerBR]} />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setIsScannerActive(!isScannerActive)}
        >
          <Text style={styles.scanButtonText}>
            {isScannerActive ? 'Stop Scanner' : 'Start Scanner'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Manual Entry */}
      <View style={styles.manualEntryContainer}>
        <Text style={styles.manualEntryLabel}>Or enter code manually</Text>
        <View style={styles.manualEntryRow}>
          <TextInput
            style={styles.manualEntryInput}
            placeholder="Enter ticket code..."
            placeholderTextColor={theme.placeholder}
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.manualEntryButton} onPress={handleManualEntry}>
            <Text style={styles.manualEntryButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scan History */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Scans</Text>
          <Text style={styles.historyCount}>{scanHistory.length} scans today</Text>
        </View>

        <FlatList
          data={scanHistory}
          renderItem={renderScanResult}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No scans yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Scanned tickets will appear here
              </Text>
            </View>
          }
        />
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
  scannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scannerFrame: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: theme.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scannerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.card,
  },
  scannerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  scannerText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  scannerCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: theme.primary,
    borderWidth: 4,
  },
  scannerCornerTL: {
    top: 20,
    left: 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  scannerCornerTR: {
    top: 20,
    right: 20,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  scannerCornerBL: {
    bottom: 20,
    left: 20,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  scannerCornerBR: {
    bottom: 20,
    right: 20,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  manualEntryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  manualEntryLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  manualEntryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  manualEntryInput: {
    flex: 1,
    backgroundColor: theme.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    color: theme.text,
  },
  manualEntryButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  manualEntryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    color: theme.text,
  },
  historyCount: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  scanResultCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  scanResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scanResultInfo: {
    flex: 1,
    marginRight: 12,
  },
  scanResultName: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  scanResultCode: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  scanStatusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scanStatusText: {
    color: '#ffffff',
    fontSize: 12,
  },
  scanResultEvent: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  scanResultTime: {
    fontSize: 12,
    color: theme.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});