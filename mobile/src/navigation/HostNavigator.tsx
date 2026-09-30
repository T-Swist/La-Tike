import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HostEventsScreen from '../screens/host/HostEventsScreen';
import HostScannerScreen from '../screens/host/HostScannerScreen';
import HostAnalyticsScreen from '../screens/host/HostAnalyticsScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import { useTheme } from '../theme';

export type HostTabParamList = {
  MyEvents: undefined;
  Scanner: { eventId?: string; eventTitle?: string } | undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HostTabParamList>();

export default function HostNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'MyEvents') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.success,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      })}
    >
      <Tab.Screen
        name="MyEvents"
        component={HostEventsScreen}
        options={{ tabBarLabel: 'My Events' }}
      />
      <Tab.Screen
        name="Scanner"
        component={HostScannerScreen}
        options={{ tabBarLabel: 'Scan Tickets' }}
      />
      <Tab.Screen
        name="Analytics"
        component={HostAnalyticsScreen}
        options={{ tabBarLabel: 'Analytics' }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
