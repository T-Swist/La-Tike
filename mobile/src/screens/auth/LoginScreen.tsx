import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/baseApi';
import { setCredentials } from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useTheme } from '../../theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      
      const { user, accessToken, refreshToken } = result.data;

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update Redux state
      dispatch(setCredentials({ user, accessToken, refreshToken }));

      // Navigation happens automatically via AppNavigator
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.data?.message || 'Invalid email or password'
      );
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to La-Tike</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: theme.input,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    color: theme.text,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: theme.textMuted,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: theme.textSecondary,
    fontSize: 14,
    marginRight: 8,
  },
  linkText: {
    color: theme.primary,
    fontSize: 14,
  },
});