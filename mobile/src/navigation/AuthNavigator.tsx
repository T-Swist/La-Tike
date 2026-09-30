import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import InterestSelectionScreen from '../screens/onboarding/InterestSelectionScreen';
import type { AuthPayload } from '../types/api';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  // The new account's session is held here until onboarding finishes,
  // because signing in immediately would unmount this stack.
  InterestSelection: { session: AuthPayload };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="InterestSelection" component={InterestSelectionScreen} />
    </Stack.Navigator>
  );
}
