import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import CustomerNavigator from './CustomerNavigator';
import HostNavigator from './HostNavigator';

export default function MainNavigator() {
  const { userMode } = useSelector((state: RootState) => state.auth);

  // Switch between customer and host navigation based on mode
  return userMode === 'customer' ? <CustomerNavigator /> : <HostNavigator />;
}