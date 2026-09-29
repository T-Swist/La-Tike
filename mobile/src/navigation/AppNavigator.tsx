import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Check for stored tokens on app launch
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedRefreshToken && storedUser) {
          dispatch(
            setCredentials({
              user: JSON.parse(storedUser),
              accessToken: storedToken,
              refreshToken: storedRefreshToken,
            })
          );
        }
      } catch (error) {
        console.log('Error loading stored auth:', error);
      }
    };

    loadStoredAuth();
  }, [dispatch]);

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