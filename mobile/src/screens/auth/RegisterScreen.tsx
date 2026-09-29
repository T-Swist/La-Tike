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
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../store/api/baseApi';
import { setCredentials } from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useTheme } from '../../theme';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'HOST',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData).unwrap();
      
      const { user, accessToken, refreshToken } = result.data;

      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch(setCredentials({ user, accessToken, refreshToken }));

      // Navigate to interest selection
      navigation.navigate('InterestSelection');

    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error?.data?.message || 'Could not create account'
      );
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join La-Tike today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#9ca3af"
              value={formData.firstName}
              onChangeText={(value) => updateField('firstName', value)}
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#9ca3af"
              value={formData.lastName}
              onChangeText={(value) => updateField('lastName', value)}
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9ca3af"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry
              editable={!isLoading}
            />

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>I want to:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'CUSTOMER' && styles.roleButtonActive,
                  ]}
                  onPress={() => updateField('role', 'CUSTOMER')}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === 'CUSTOMER' && styles.roleButtonTextActive,
                    ]}
                  >
                    Buy Tickets
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'HOST' && styles.roleButtonActive,
                  ]}
                  onPress={() => updateField('role', 'HOST')}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === 'HOST' && styles.roleButtonTextActive,
                    ]}
                  >
                    Host Events
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
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
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    backgroundColor: theme.input,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.inputBorder,
    marginHorizontal: 6,
  },
  roleButtonActive: {
    backgroundColor: theme.themeMode === 'dark' ? '#2a1810' : '#fff7ed',
    borderColor: theme.primary,
  },
  roleButtonText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  roleButtonTextActive: {
    color: theme.primary,
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