import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useScanTicketMutation } from '../../store/api/host/hostApi';
import { HostTabParamList } from '../../navigation/HostNavigator';
import type { ScanResponse, ScanResultCode } from '../../types/api';
import { getErrorMessage } from '../../utils/errors';

interface ScanResult {
  id: string;
  ticketCode: string;
  eventTitle: string;
  attendeeName: string;
  ticketType: string;
  timestamp: string;
  status: ScanResultCode;
  message: string;
}

// Ignore repeated reads of the same code while the result is on screen.
const RESCAN_DELAY_MS = 2500;

export default function HostScannerScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HostTabParamList, 'Scanner'>>();
  const eventId = route.params?.eventId;
  const eventTitle = route.params?.eventTitle;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanTicket, { isLoading }] = useScanTicketMutation();
  const [manualCode, setManualCode] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const isProcessing = useRef(false);

  const styles = createStyles(theme);

  // Turn the camera off when leaving the tab.
  useFocusEffect(
    useCallback(() => () => setIsScannerActive(false), [])
  );

  const handleScan = async (code: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const response: ScanResponse = await scanTicket({
        qrCode: code.trim(),
        eventId,
        deviceInfo: `${Platform.OS} ${Platform.Version}`,
      }).unwrap();

      const result: ScanResult = {
        id: `${Date.now()}`,
        ticketCode: response.ticket?.id.slice(0, 8).toUpperCase() ?? '—',
        eventTitle: response.ticket?.eventTitle ?? '',
        attendeeName: response.ticket?.attendeeName ?? 'Unknown ticket',
        ticketType: response.ticket?.ticketType ?? '',
        timestamp: new Date().toISOString(),
        status: response.result,
        message: response.message,
      };

      Vibration.vibrate(response.valid ? 100 : [0, 150, 100, 150]);
      setLastResult(result);
      setScanHistory((history) => [result, ...history].slice(0, 50));
    } catch (error) {
      Alert.alert('Scan failed', getErrorMessage(error));
    } finally {
      setTimeout(() => {
        isProcessing.current = false;
      }, RESCAN_DELAY_MS);
    }
  };

  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    handleScan(data);
  };

  const toggleScanner = async () => {
    if (isScannerActive) {
      setIsScannerActive(false);
      return;
    }
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert('Camera access needed', 'Allow camera access in Settings to scan tickets.');
        return;
      }
    }
    setLastResult(null);
    setIsScannerActive(true);
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a ticket code');
      return;
    }
    isProcessing.current = false;
    handleScan(manualCode);
    setManualCode('');
  };

  const getStatusColor = (status: ScanResultCode) => {
    switch (status) {
      case 'VALID':
        return theme.success;
      case 'ALREADY_USED':
        return theme.warning;
      default:
        return theme.error;
    }
  };

  const getStatusText = (status: ScanResultCode) => {
    switch (status) {
      case 'VALID':
        return 'Valid ✓';
      case 'ALREADY_USED':
        return 'Already Used';
      case 'NOT_YOUR_EVENT':
      case 'WRONG_EVENT':
        return 'Wrong Event';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REFUNDED':
        return 'Refunded';
      default:
        return 'Invalid ✗';
    }
  };

  const renderScanResult = ({ item }: { item: ScanResult }) => (
    <View style={styles.scanResultCard}>
      <View style={styles.scanResultHeader}>
        <View style={styles.scanResultInfo}>
          <Text style={styles.scanResultName}>{item.attendeeName}</Text>
          <Text style={styles.scanResultCode}>
            {item.ticketType ? `${item.ticketType} · ` : ''}#{item.ticketCode}
          </Text>
        </View>
        <View style={[styles.scanStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.scanStatusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.scanResultEvent}>{item.eventTitle || item.message}</Text>
      <Text style={styles.scanResultTime}>
        {new Date(item.timestamp).toLocaleTimeString()} • {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  const admittedCount = scanHistory.filter((scan) => scan.status === 'VALID').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ticket Scanner</Text>
        <Text style={styles.headerSubtitle}>
          {eventTitle ? `Scanning for ${eventTitle}` : 'Scanning for all your events'}
        </Text>
        {eventId && (
          <TouchableOpacity onPress={() => navigation.setParams({ eventId: undefined, eventTitle: undefined } as never)}>
            <Text style={styles.clearFilterText}>Scan all events instead</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerFrame}>
          {isScannerActive ? (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={onBarcodeScanned}
            />
          ) : (
            <View style={styles.scannerPlaceholder}>
              <Text style={styles.scannerIcon}>📷</Text>
              <Text style={styles.scannerText}>Tap Start Scanner to scan a ticket</Text>
            </View>
          )}

          {lastResult && (
            <View style={[styles.resultBanner, { backgroundColor: getStatusColor(lastResult.status) }]}>
              <Text style={styles.resultBannerTitle}>{getStatusText(lastResult.status)}</Text>
              <Text style={styles.resultBannerText} numberOfLines={2}>
                {lastResult.status === 'VALID' ? lastResult.attendeeName : lastResult.message}
              </Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {/* Scanner corners */}
          <View style={[styles.scannerCorner, styles.scannerCornerTL]} />
          <View style={[styles.scannerCorner, styles.scannerCornerTR]} />
          <View style={[styles.scannerCorner, styles.scannerCornerBL]} />
          <View style={[styles.scannerCorner, styles.scannerCornerBR]} />
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={toggleScanner}>
          <Text style={styles.scanButtonText}>
            {isScannerActive ? 'Stop Scanner' : 'Start Scanner'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Manual Entry */}
      <View style={styles.manualEntryContainer}>
        <Text style={styles.manualEntryLabel}>Or paste the ticket code</Text>
        <View style={styles.manualEntryRow}>
          <TextInput
            style={styles.manualEntryInput}
            placeholder="LT1.…"
            placeholderTextColor={theme.placeholder}
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="none"
            autoCorrect={false}
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
          <Text style={styles.historyCount}>{admittedCount} admitted this session</Text>
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
  clearFilterText: {
    fontSize: 13,
    color: theme.primary,
    marginTop: 6,
  },
  resultBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  resultBannerTitle: {
    fontSize: 18,
    color: '#fff',
  },
  resultBannerText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
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