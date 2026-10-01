import { ConfigContext, ExpoConfig } from 'expo/config';

// Extends app.json with settings that depend on EXPO_PUBLIC_API_URL (from mobile/.env).
export default ({ config }: ConfigContext): ExpoConfig => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';

  // Test builds talk to the API on your computer over plain http (LAN IP),
  // which Android and iOS block by default. Production builds use https only.
  const allowHttp = apiUrl.startsWith('http://');

  const plugins = (config.plugins ?? []).filter(
    (plugin) => plugin !== 'expo-build-properties' && !(Array.isArray(plugin) && plugin[0] === 'expo-build-properties')
  );
  plugins.push(['expo-build-properties', { android: { usesCleartextTraffic: allowHttp } }]);

  return {
    ...config,
    name: config.name ?? 'La Tike',
    slug: config.slug ?? 'la-tike',
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        ...(allowHttp && { NSAppTransportSecurity: { NSAllowsArbitraryLoads: true } }),
      },
    },
    plugins,
  };
};
