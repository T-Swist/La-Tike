import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CustomerTicketsScreen from '../screens/customer/CustomerTicketsScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import EventDetailScreen from '../screens/customer/EventDetailScreen';
import { useTheme } from '../theme';

export type CustomerTabParamList = {
  Home: undefined;
  MyTickets: undefined;
  Profile: undefined;
};

export type CustomerStackParamList = {
  Tabs: undefined;
  EventDetail: { eventId: string };
};

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

function CustomerTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyTickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      })}
    >
      <Tab.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={{ tabBarLabel: 'Events' }}
      />
      <Tab.Screen
        name="MyTickets"
        component={CustomerTicketsScreen}
        options={{ tabBarLabel: 'My Tickets' }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={CustomerTabs} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}
