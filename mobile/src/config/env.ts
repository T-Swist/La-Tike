import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 5000;

// During development, reuse the IP of the computer running Metro so the app
// can reach the API from a real phone on the same Wi-Fi without extra config.
const devApiUrl = (): string => {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:${API_PORT}/api/v1`;
  }
  // Android emulators reach the host machine through 10.0.2.2
  const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${fallbackHost}:${API_PORT}/api/v1`;
};

// EXPO_PUBLIC_API_URL is inlined at build time (set per profile in eas.json).
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? devApiUrl() : 'https://api.latike.com/api/v1');

export const config = {
  API_URL,
  CURRENCY: process.env.EXPO_PUBLIC_CURRENCY || 'PLN',
  IS_DEV: __DEV__,
};

export default config;
