import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store';
import { AUTH_STORAGE_KEYS, setCredentials, setHydrated } from '../store/slices/authSlice';
import { useTheme } from '../theme';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { accessToken, user, isHydrated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  // Restore the stored session on app launch
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const stored = Object.fromEntries(
          await AsyncStorage.multiGet([
            AUTH_STORAGE_KEYS.accessToken,
            AUTH_STORAGE_KEYS.refreshToken,
            AUTH_STORAGE_KEYS.user,
            AUTH_STORAGE_KEYS.userMode,
          ])
        );

        const storedUser = stored[AUTH_STORAGE_KEYS.user];
        const storedToken = stored[AUTH_STORAGE_KEYS.accessToken];
        const storedRefreshToken = stored[AUTH_STORAGE_KEYS.refreshToken];
        const storedMode = stored[AUTH_STORAGE_KEYS.userMode];

        if (storedToken && storedRefreshToken && storedUser) {
          dispatch(
            setCredentials({
              user: JSON.parse(storedUser),
              accessToken: storedToken,
              refreshToken: storedRefreshToken,
              userMode: storedMode === 'host' || storedMode === 'customer' ? storedMode : undefined,
            })
          );
          return;
        }
      } catch (error) {
        console.log('Error loading stored auth:', error);
      }
      dispatch(setHydrated());
    };

    loadStoredAuth();
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken && user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
