import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// We'll create these screens next
import HostEventsScreen from '../screens/host/HostEventsScreen';
import HostScannerScreen from '../screens/host/HostScannerScreen';
import HostAnalyticsScreen from '../screens/host/HostAnalyticsScreen';

export type HostTabParamList = {
  MyEvents: undefined;
  Scanner: undefined;
  Analytics: undefined;
};

const Tab = createBottomTabNavigator<HostTabParamList>();

export default function HostNavigator() {
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
          } else {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
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
    </Tab.Navigator>
  );
}