import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CUSTOMER' | 'HOST'| 'ADMIN';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  userMode: 'customer' | 'host';
} 

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  userMode: 'customer',
};
 
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      AsyncStorage.setItem('accessToken', action.payload.accessToken);
      AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      AsyncStorage.setItem('accessToken', action.payload);
    },
    switchMode: (state, action: PayloadAction<'customer' | 'host'>) => {
      state.userMode = action.payload;
    },
  },
});
 
export const { setCredentials, logout, updateToken, switchMode } = authSlice.actions;
export default authSlice.reducer;