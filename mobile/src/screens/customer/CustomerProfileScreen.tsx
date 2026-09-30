import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, switchMode } from '../../store/slices/authSlice';
import { useLogoutMutation } from '../../store/api/baseApi';
import { RootState } from '../../store';
import { useTheme } from '../../theme';

export default function CustomerProfileScreen() {
  const dispatch = useDispatch();
  const { user, userMode } = useSelector((state: RootState) => state.auth);
  const [logoutRequest] = useLogoutMutation();
  const { theme, themeMode, toggleTheme } = useTheme();
  const canHost = user?.role === 'HOST' || user?.role === 'ADMIN';

  const styles = createStyles(theme);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Revoke the refresh token on the server; log out locally even if offline.
            await logoutRequest().unwrap().catch(() => {});
            dispatch(logout());
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              {themeMode === 'dark' ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {canHost && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => dispatch(switchMode(userMode === 'host' ? 'customer' : 'host'))}
          >
            <Text style={styles.menuText}>
              {userMode === 'host' ? 'Switch to Customer Mode' : 'Switch to Host Mode'}
            </Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Interests</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help Center</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>La-Tike v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: '#ffffff',
  },
  name: {
    fontSize: 24,
    color: theme.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitle: {
    fontSize: 12,
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  menuText: {
    fontSize: 16,
    color: theme.text,
  },
  menuArrow: {
    fontSize: 24,
    color: theme.textMuted,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: theme.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 12,
    color: theme.textMuted,
  },
});