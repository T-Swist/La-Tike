import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// We'll create these screens next
import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CustomerTicketsScreen from '../screens/customer/CustomerTicketsScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';

export type CustomerTabParamList = {
  Home: undefined;
  MyTickets: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export default function CustomerNavigator() {
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
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
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