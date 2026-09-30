import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../../types/api';

export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  userMode: '@latike_user_mode',
} as const;

type UserMode = 'customer' | 'host';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  userMode: UserMode;
  // False until the stored session has been read on app launch.
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  userMode: 'customer',
  isHydrated: false,
};

const defaultModeFor = (user: User): UserMode =>
  user.role === 'HOST' || user.role === 'ADMIN' ? 'host' : 'customer';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string; userMode?: UserMode }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userMode =
        user.role === 'CUSTOMER' ? 'customer' : action.payload.userMode ?? defaultModeFor(user);
      state.isHydrated = true;

      AsyncStorage.multiSet([
        [AUTH_STORAGE_KEYS.accessToken, accessToken],
        [AUTH_STORAGE_KEYS.refreshToken, refreshToken],
        [AUTH_STORAGE_KEYS.user, JSON.stringify(user)],
        [AUTH_STORAGE_KEYS.userMode, state.userMode],
      ]);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userMode = 'customer';

      AsyncStorage.multiRemove(Object.values(AUTH_STORAGE_KEYS));
    },
    // The API rotates refresh tokens, so both tokens must be replaced together.
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      AsyncStorage.multiSet([
        [AUTH_STORAGE_KEYS.accessToken, action.payload.accessToken],
        [AUTH_STORAGE_KEYS.refreshToken, action.payload.refreshToken],
      ]);
    },
    switchMode: (state, action: PayloadAction<UserMode>) => {
      if (state.user?.role === 'CUSTOMER') return;
      state.userMode = action.payload;
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.userMode, action.payload);
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, logout, updateTokens, switchMode, setHydrated } = authSlice.actions;
export default authSlice.reducer;
